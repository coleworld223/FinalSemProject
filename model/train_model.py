import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import csv

# Set random seed for reproducibility
np.random.seed(42)

# Generate 1000 random samples
num_samples = 1000

data = {
    "Cumulative Energy Demand (CED)": np.random.uniform(80, 350, num_samples).round(2),
    "Energy Return on Investment (EROI)": np.random.uniform(5, 25, num_samples).round(2),
    "Net Energy Output": np.random.uniform(40, 120, num_samples).round(2),
    "Raw Material Consumption": np.random.uniform(20, 60, num_samples).round(2),
    "Recyclability & Waste Generation": np.random.uniform(0.5, 0.95, num_samples).round(3),
    "Overall Efficiency (%)": np.random.uniform(65, 95, num_samples).round(2),
}

# Convert to DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('solar_lca_dataset.csv', index=False)

print("Dataset generated and saved as 'solar_lca_dataset.csv'")
print(df.head())  # Preview first 5 rows

X = df.drop("Overall Efficiency (%)", axis=1)
y = df["Overall Efficiency (%)"]

model = RandomForestRegressor()
model.fit(X, y)

# Save the model to app/
joblib.dump(model, "app/model.pkl")

print("debug")
