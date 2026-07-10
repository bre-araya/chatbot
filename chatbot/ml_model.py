# chatbot/ml_model.py
from .custom_transformers import ColumnSelector
import os
import joblib
import __main__
import pandas as pd

# Trick Python: assign ColumnSelector to __main__ so joblib can find it
__main__.ColumnSelector = ColumnSelector

MODEL_PATH = os.path.join(os.path.dirname(__file__), "chatbot_model.joblib")
model = joblib.load(MODEL_PATH)

def get_chatbot_response(user_message):
    sample = pd.DataFrame([{
        "Question": user_message,
        "Related Questions": user_message,
        "Category": ""
    }])
    response = model.predict(sample)[0]
    return response
