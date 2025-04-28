import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.svm import SVR
from sklearn.neural_network import MLPRegressor
import joblib
import os

# Set random seed
np.random.seed(42)

# Generate 10,000 samples
num_samples = 10000

# Features
data = {
    "Material_Type": np.random.choice([0, 1, 2], size=num_samples),
    "Energy_Manufacturing": np.random.uniform(500, 5000, size=num_samples).round(2),
    "Plant_Size": np.random.uniform(1, 100, size=num_samples).round(2),
    "Capacity_Factor": np.random.uniform(10, 100, size=num_samples).round(2),
    "Lifespan": np.random.uniform(10, 40, size=num_samples).round(2),
}

df = pd.DataFrame(data)

# Outputs
df["Carbon_Manufacturing"] = (
    50 * df["Material_Type"]
    + 0.5 * df["Energy_Manufacturing"]
    + np.random.normal(0, 50, size=num_samples)
)
df["Total_Lifetime_Emissions"] = (df["Plant_Size"] * 1000 / df["Capacity_Factor"]) * df[
    "Lifespan"
] + np.random.normal(0, 1000, size=num_samples)
df["Transportation_Emissions"] = 0.2 * df["Plant_Size"] * df[
    "Material_Type"
] + np.random.normal(0, 10, size=num_samples)
df["Recycling_Benefits"] = 30 * (1 - df["Material_Type"] * 0.3) * df[
    "Plant_Size"
] + np.random.normal(0, 20, size=num_samples)
df["Operational_Emissions"] = (
    0.1 * df["Plant_Size"] * (1 - df["Capacity_Factor"] / 100)
) * df["Lifespan"] + np.random.normal(0, 5, size=num_samples)

# Save the dataset
df.to_csv("dataset.csv", index=False)

# Features and target
X = df[
    [
        "Material_Type",
        "Energy_Manufacturing",
        "Plant_Size",
        "Capacity_Factor",
        "Lifespan",
    ]
]

# Train separate models for each output
outputs_models = {
    "carbon_model.pkl": ("Carbon_Manufacturing", LinearRegression()),
    "lifetime_emissions_model.pkl": (
        "Total_Lifetime_Emissions",
        RandomForestRegressor(),
    ),
    "transportation_model.pkl": (
        "Transportation_Emissions",
        GradientBoostingRegressor(),
    ),
    "recycling_model.pkl": ("Recycling_Benefits", SVR()),
    "operational_model.pkl": (
        "Operational_Emissions",
        MLPRegressor(hidden_layer_sizes=(50, 30), max_iter=500),
    ),
}

# Directory to save models
os.makedirs("models", exist_ok=True)

# Train and save each model
for filename, (target, model) in outputs_models.items():
    y = df[target]
    model.fit(X, y)
    joblib.dump(model, os.path.join("models", filename))

print("All models trained and saved!")
