import os
import json
import joblib
import joblib
import faiss
import torch
import numpy as np
from transformers import DistilBertForSequenceClassification, DistilBertTokenizer
from sentence_transformers import SentenceTransformer
from django.conf import settings
import logging
from typing import Tuple, Optional, Dict, Any
from .models import FAQ

logger = logging.getLogger(__name__)

class AIService:

    # Core AI service for intent classification and semantic searchSingleton pattern implementation
    
    _instance = None
    _models_loaded = False

    def __new__(cls):
        # Singleton pattern - ensure only one instance exists
        if cls._instance is None:
            cls._instance = super(AIService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        # Initialize the service with empty attributes

        self.intent_model = None
        self.intent_tokenizer = None
        self.qa_model = None
        self.faiss_index = None
        self.qa_questions_combined = None
        self.qa_answers = None
        self.id2label = None
        self.label2id = None
        self.confidence_threshold = 0.60
        self.models_loaded = False
        logger.info("AIService initialized")

    @classmethod
    def get_instance(cls):
        # Get the singleton instance (class method for backward compatibility)
        if cls._instance is None:
            cls._instance = AIService()
        return cls._instance

    def load_models(self) -> bool:
        # Load all AI models and assets into memory
        try:
            if self.models_loaded:
                logger.info("Models already loaded")
                return True

            # Get the base path to model assets
            base_path = os.path.join(
                os.path.dirname(__file__),
                'model_assets', 'ridex_chatbot_models'
            )

            logger.info(f"Loading models from: {base_path}")
            
            if not os.path.exists(base_path):
                logger.error(f"Model assets directory not found: {base_path}")
                return False

            # Check what files exist
            files = os.listdir(base_path)
            logger.info(f"Files in model directory: {files}")

            # Load Intent Classification Model (DistilBERT)
            intent_model_path = os.path.join(base_path, "intent_model")
            if not os.path.exists(intent_model_path):
                logger.error(f"Intent model path not found: {intent_model_path}")
                return False

            logger.info("Loading intent classification model...")
            self.intent_model = DistilBertForSequenceClassification.from_pretrained(intent_model_path)
            self.intent_tokenizer = DistilBertTokenizer.from_pretrained(intent_model_path)
            logger.info("✅ Intent classification model loaded")

            # Load Label Mappings
            label_mappings_path = os.path.join(base_path, "label_mappings.json")
            if not os.path.exists(label_mappings_path):
                logger.error(f"Label mappings not found: {label_mappings_path}")
                return False

            with open(label_mappings_path, 'r') as f:
                label_mappings = json.load(f)
            
            # Convert string keys to integers for id2label
            self.id2label = {int(k): v for k, v in label_mappings["id2label"].items()}
            self.label2id = label_mappings["label2id"]
            logger.info(f"✅ Label mappings loaded: {list(self.id2label.values())}")

            # Load QA Model (Sentence Transformer)
            qa_model_path = os.path.join(base_path, "qa_model")
            if not os.path.exists(qa_model_path):
                logger.error(f"QA model path not found: {qa_model_path}")
                return False

            logger.info("Loading QA sentence transformer model...")
            self.qa_model = SentenceTransformer(qa_model_path)
            logger.info("✅ QA sentence transformer model loaded")

            # Load FAISS Index
            faiss_index_path = os.path.join(base_path, "faiss_index.bin")
            if not os.path.exists(faiss_index_path):
                logger.error(f"FAISS index not found: {faiss_index_path}")
                return False

            logger.info("Loading FAISS index...")
            self.faiss_index = faiss.read_index(faiss_index_path)
            logger.info("✅ FAISS index loaded")

            # Load QA Knowledge Base
            qa_data_path = os.path.join(base_path, "qa_knowledge_base.pkl")
            if not os.path.exists(qa_data_path):
                logger.error(f"QA knowledge base not found: {qa_data_path}")
                return False

            logger.info("Loading QA knowledge base...")
            qa_data = joblib.load(qa_data_path)
            self.qa_questions_combined = qa_data["questions_combined"]
            self.qa_answers = qa_data["answers"]
            self.original_df_length = qa_data.get("original_df_length", 0)
            logger.info(f"✅ QA knowledge base loaded: {len(self.qa_answers)} answers")

            # Load Configuration
            config_path = os.path.join(base_path, "config.json")
            if os.path.exists(config_path):
                with open(config_path, 'r') as f:
                    config = json.load(f)
                self.confidence_threshold = config.get("confidence_threshold", 0.55)
                logger.info(f"Configuration loaded: confidence_threshold = {self.confidence_threshold}")

            # Set models to evaluation mode
            self.intent_model.eval()
            self.models_loaded = True

            logger.info(f"✅ All AI models loaded successfully!")
            logger.info(f"Confidence threshold: {self.confidence_threshold}")

            return True

        except Exception as e:
            logger.error(f"Failed to load AI models: {str(e)}", exc_info=True)
            self.models_loaded = False
            return False

    def predict_intent(self, text: str) -> Tuple[str, float]:
        
        # Predict intent using DistilBERT model & Returns: (intent_name, confidence_score)
        
        if not self.models_loaded:
            logger.warning("Models not loaded, attempting to load...")
            if not self.load_models():
                return "error", 0.0

        try:
            # Tokenize input text
            inputs = self.intent_tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                padding=True,
                max_length=64
            )

            # Get predictions
            with torch.no_grad():
                outputs = self.intent_model(**inputs)
                logits = outputs.logits

            # Get predicted class and confidence
            predicted_class_id = torch.argmax(logits, dim=-1).item()
            probabilities = torch.softmax(logits, dim=-1)
            confidence = probabilities[0][predicted_class_id].item()

            # Map to label
            intent_name = self.id2label.get(predicted_class_id, "out_of_scope")

            logger.debug(f"Intent prediction: '{text}' -> {intent_name} ({confidence:.2%})")
            return intent_name, confidence

        except Exception as e:
            logger.error(f"Intent prediction failed: {str(e)}")
            return "error", 0.0

    def semantic_search(self, query: str, k: int = 1) -> Tuple[Optional[str], float]:
        
        # Perform semantic search using Sentence Transformer + FAISS & Returns: (answer, similarity_score)
        
        if not self.models_loaded:
            logger.warning("Models not loaded, attempting to load...")
            if not self.load_models():
                return None, 0.0

        try:
            # Encode the query
            query_embedding = self.qa_model.encode([query], convert_to_tensor=True)
            query_embedding_np = query_embedding.cpu().numpy().astype('float32')

            # Normalize for cosine similarity
            faiss.normalize_L2(query_embedding_np)

            # Search FAISS index
            distances, indices = self.faiss_index.search(query_embedding_np, k)

            if len(distances) == 0 or len(indices) == 0:
                return None, 0.0

            best_score = distances[0][0]
            best_index = indices[0][0]

            # Map index back to original answer
            # Assuming 2 questions per original row (main + related)
            answer_index = best_index // 2

            if 0 <= answer_index < len(self.qa_answers):
                answer = self.qa_answers[answer_index]
                logger.debug(f"Semantic search: '{query}' -> score: {best_score:.3f}")
                return answer, best_score
            else:
                logger.warning(f"Answer index {answer_index} out of range (0-{len(self.qa_answers)-1})")
                return None, best_score

        except Exception as e:
            logger.error(f"Semantic search failed: {str(e)}")
            return None, 0.0
    

    def get_chat_response(self, user_message: str) -> Dict[str, Any]:
        
        # Main method to get complete chatbot response
        
        if not self.models_loaded:
            logger.warning("Models not loaded, attempting to load...")
            if not self.load_models():
                return {
                    "response": "I'm currently unavailable. Please try again later.",
                    "intent": "error",
                    "confidence": 0.0,
                    "status": "error"
                }

        try:
            goodbye_phrases = ["bye", "goodbye","Exit","Quit","good day", 
                               "see you", "farewell","thank you", 
                               "thanks", "have a nice time"
                               ]
            if any(phrases in user_message.lower() for phrases in goodbye_phrases):
                responses = [
                    "Goodbye! Have a great day!",
                    "See you later! Safe travels!",
                    "Farewell! If you need anything else, just ask!",
                    "Bye! Don’t hesitate to reach out if you need more help.",
                    "Thank you for chatting with us! Have a wonderful day!",
                    "Thanks for using our service! Take care!",
                    "Have a nice time! Looking forward to assisting you again!"
                ]
                import random
                response = random.choice(responses)
                return {
                    "response": response,
                    "intent": "goodbye",
                    "confidence": 1.0,
                    "status": "success"
                }
            
            # Check FAQ database
            faq_answer = self.check_faqs_database(user_message)
            if faq_answer:
                return {
                    "response": faq_answer,
                    "intent": "faq",
                    "confidence": 1.0,
                    "status": "success"
                }

            # Intent Classification with DistilBERT
            intent, intent_confidence = self.predict_intent(user_message)
            
            logger.info(f"User: '{user_message}' -> Intent: {intent} ({intent_confidence:.1%})")

            # Route based on intent
            if intent == "greeting" and intent_confidence >= self.confidence_threshold:
                answer, similarity_score = self.semantic_search(user_message)
                if answer and similarity_score >= self.confidence_threshold:
                    return{
                        "response": answer,
                        "intent": intent,
                        "confidence": similarity_score,
                        "status": "success"
                    }
                else:
                    return {
                        "response": "Hi there! How can I help you with Ride Hailing?",
                        "intent": intent,
                        "confidence": intent_confidence,
                        "status": "success"
                    }
               

            elif intent == "ride_hailing" and intent_confidence >= self.confidence_threshold:
                # Semantic Search with Sentence Transformer + FAISS
                answer, similarity_score = self.semantic_search(user_message)

                if answer and similarity_score >= self.confidence_threshold:
                    return {
                        "response": answer,
                        "intent": intent,
                        "confidence": similarity_score,
                        "status": "success"
                    }
                else:
                    # Low confidence - escalate
                    return {
                        "response": "I want to make sure you get the exact right answer. Let me connect you with a human agent who can help you better.",
                        "intent": "escalation",
                        "confidence": similarity_score if similarity_score else 0.0,
                        "status": "escalation"
                    }
            elif intent == "ride_hailing" and intent_confidence < self.confidence_threshold:
                # Low intent confidence - escalate
                return {
                    "response": "I'm not entirely sure about your request. Let me connect you with a human agent who can assist you better.",
                    "intent": "escalation",
                    "confidence": intent_confidence,
                    "status": "escalation"
                }

            else:
                # Out of scope or error
                return {
                    "response": "I'm sorry, I can only help with ride-hailing related questions. Please ask me about our services, payments, or ride issues.",
                    "intent": "out_of_scope",
                    "confidence": intent_confidence,
                    "status": "out_of_scope"
                }

        except Exception as e:
            logger.error(f"Chat response generation failed: {str(e)}")
            return {
                "response": "I'm experiencing technical difficulties. Please try again in a moment.",
                "intent": "error",
                "confidence": 0.0,
                "status": "error"
            }

    def check_faqs_database(self, user_message: str) -> Optional[str]:
        try:
            faqs = FAQ.objects.all()
            if not faqs.exists():
                return None

            # Get all FAQ questions
            faq_questions = [faq.question for faq in faqs]

            # Encode user message and FAQ questions
            user_embedding = self.qa_model.encode([user_message], convert_to_tensor=True)
            faq_embeddings = self.qa_model.encode(faq_questions, convert_to_tensor=True)

            # Convert to numpy and normalize
            user_embedding_np = user_embedding.cpu().numpy().astype('float32')
            faq_embeddings_np = faq_embeddings.cpu().numpy().astype('float32')

            faiss.normalize_L2(user_embedding_np)
            faiss.normalize_L2(faq_embeddings_np)

            # Compute cosine similarities (dot product since normalized)
            similarities = np.dot(faq_embeddings_np, user_embedding_np.T).flatten()

            # Find the best match
            best_idx = int(np.argmax(similarities))
            best_similarity = similarities[best_idx]

            # Threshold for matching (adjust as needed)
            similarity_threshold = 0.8

            if best_similarity >= similarity_threshold:
                logger.info(f"FAQ match found: '{user_message}' -> '{faq_questions[best_idx]}' (similarity: {best_similarity:.3f})")
                return faqs[best_idx].answer
            else:
                logger.debug(f"No FAQ match: '{user_message}' (best similarity: {best_similarity:.3f})")
                return None

        except Exception as e:
            logger.error(f"FAQ database check failed: {str(e)}")
            return None

    def get_service_status(self) -> Dict[str, Any]:
        # Get the current status of the AI service
        return {
            "models_loaded": self.models_loaded,
            "intent_labels": list(self.id2label.values()) if self.id2label else [],
            "qa_answers_count": len(self.qa_answers) if self.qa_answers else 0,
            "confidence_threshold": self.confidence_threshold
        }


# Create a global instance for easy access
ai_service_instance = AIService()
