# main.py

from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
import os
from fastapi.middleware.cors import CORSMiddleware

# FastAPI app
app = FastAPI()

# Allow CORS for all
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load all models
model_paths = {
    "carbon_model": os.path.join("models", "carbon_model.pkl"),
    "lifetime_emissions_model": os.path.join("models", "lifetime_emissions_model.pkl"),
    "transportation_model": os.path.join("models", "transportation_model.pkl"),
    "recycling_model": os.path.join("models", "recycling_model.pkl"),
    "operational_model": os.path.join("models", "operational_model.pkl"),
}

models = {name: joblib.load(path) for name, path in model_paths.items()}


# Input Schema
class EnergyInput(BaseModel):
    Material_Type: int
    Energy_Manufacturing: float
    Plant_Size: float
    Capacity_Factor: float
    Lifespan: float


# Home Route
@app.get("/")
def read_root():
    return {"message": "Renewable Energy Environmental Impact Predictor is live!"}


# Prediction Routes
@app.post("/predict/carbon_manufacturing/")
def predict_carbon(input_data: EnergyInput):
    features = np.array(
        [
            [
                input_data.Material_Type,
                input_data.Energy_Manufacturing,
                input_data.Plant_Size,
                input_data.Capacity_Factor,
                input_data.Lifespan,
            ]
        ]
    )
    prediction = models["carbon_model"].predict(features)[0]
    return {"predicted_carbon_manufacturing": round(prediction, 2)}


@app.post("/predict/total_lifetime_emissions/")
def predict_lifetime_emissions(input_data: EnergyInput):
    features = np.array(
        [
            [
                input_data.Material_Type,
                input_data.Energy_Manufacturing,
                input_data.Plant_Size,
                input_data.Capacity_Factor,
                input_data.Lifespan,
            ]
        ]
    )
    prediction = models["lifetime_emissions_model"].predict(features)[0]
    return {"predicted_total_lifetime_emissions": round(prediction, 2)}


@app.post("/predict/transportation_emissions/")
def predict_transportation(input_data: EnergyInput):
    features = np.array(
        [
            [
                input_data.Material_Type,
                input_data.Energy_Manufacturing,
                input_data.Plant_Size,
                input_data.Capacity_Factor,
                input_data.Lifespan,
            ]
        ]
    )
    prediction = models["transportation_model"].predict(features)[0]
    return {"predicted_transportation_emissions": round(prediction, 2)}


@app.post("/predict/recycling_benefits/")
def predict_recycling(input_data: EnergyInput):
    features = np.array(
        [
            [
                input_data.Material_Type,
                input_data.Energy_Manufacturing,
                input_data.Plant_Size,
                input_data.Capacity_Factor,
                input_data.Lifespan,
            ]
        ]
    )
    prediction = models["recycling_model"].predict(features)[0]
    return {"predicted_recycling_benefits": round(prediction, 2)}


@app.post("/predict/operational_emissions/")
def predict_operational(input_data: EnergyInput):
    features = np.array(
        [
            [
                input_data.Material_Type,
                input_data.Energy_Manufacturing,
                input_data.Plant_Size,
                input_data.Capacity_Factor,
                input_data.Lifespan,
            ]
        ]
    )
    prediction = models["operational_model"].predict(features)[0]
    return {"predicted_operational_emissions": round(prediction, 2)}
