from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
import os
from fastapi.middleware.cors import CORSMiddleware


# Load the model
model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
model = joblib.load(model_path)

app = FastAPI()

# Allow CORS from specific origins (e.g., React app running at localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


# Define input schema
class EfficiencyInput(BaseModel):
    Cumulative_Energy_Demand: float
    EROI: float
    Net_Energy_Output: float
    Raw_Material_Consumption: float
    Recyclability_Waste_Generation: float


@app.get("/")
def read_root():
    return {"message": "Power Efficiency Predictor API is live!"}


# @app.options("/predict/")
# def temp():
#     print("options called")
#     return {"message": "good"}


@app.post("/predict/")
def predict_efficiency(input_data: EfficiencyInput):
    print(input_data)
    features = np.array(
        [
            [
                input_data.Cumulative_Energy_Demand,
                input_data.EROI,
                input_data.Net_Energy_Output,
                input_data.Raw_Material_Consumption,
                input_data.Recyclability_Waste_Generation,
            ]
        ]
    )
    prediction = model.predict(features)[0]
    return {"predicted_efficiency": round(prediction, 2)}
