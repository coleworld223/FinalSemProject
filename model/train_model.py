import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

# Simulate sample training data (replace with your real data later)
data = pd.DataFrame(
    {
        "Cumulative Energy Demand (CED)": [100, 200, 150, 300, 250],
        "Energy Return on Investment (EROI)": [10, 15, 12, 20, 18],
        "Net Energy Output": [50, 70, 65, 90, 85],
        "Raw Material Consumption": [30, 40, 35, 45, 42],
        "Recyclability & Waste Generation": [0.7, 0.8, 0.75, 0.85, 0.82],
        "Overall Efficiency (%)": [70, 85, 78, 90, 88],
    }
)

X = data.drop("Overall Efficiency (%)", axis=1)
y = data["Overall Efficiency (%)"]

model = RandomForestRegressor()
model.fit(X, y)

# Save the model to app/
joblib.dump(model, "app/model.pkl")

print("debug")
