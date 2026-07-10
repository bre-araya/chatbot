from django.apps import AppConfig
import logging
import sys

logger = logging.getLogger(__name__)

class ChatbotConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chatbot'
    
    def ready(self):
        """Pre-load AI models when Django starts"""
        try:
            # Only load in main process, not during migrations or other commands
            is_runserver = 'runserver' in sys.argv
            is_production = any(arg in sys.argv for arg in ['gunicorn', 'uwsgi', 'daphne'])
            
            if is_runserver or is_production:
                from .ai_service import AIService
                # Use the class method for better compatibility
                ai_service = AIService.get_instance()
                success = ai_service.load_models()
                
                if success:
                    logger.info("✅ AI models pre-loaded successfully during Django startup")
                    if hasattr(ai_service, 'id2label') and ai_service.id2label:
                        logger.info(f"Available intents: {list(ai_service.id2label.values())}")
                else:
                    logger.warning("⚠️ AI models could not be pre-loaded")
                    
        except Exception as e:
            logger.warning(f"Could not pre-load AI models: {str(e)}")
            import traceback
            logger.warning(traceback.format_exc())