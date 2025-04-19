import { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    Cumulative_Energy_Demand: 0,
    EROI: 0,
    Net_Energy_Output: 0,
    Raw_Material_Consumption: 0,
    Recyclability_Waste_Generation: 0,
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict/",
        {
          Cumulative_Energy_Demand: 1,
          EROI: 2,
          Net_Energy_Output: 3,
          Raw_Material_Consumption: 4,
          Recyclability_Waste_Generation: 6,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(res);
      setResult(res.data?.predicted_efficiency || "No data received");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(`Failed: ${err.response?.data?.detail || err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Power Substation Efficiency Predictor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                step="any"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
          >
            Predict
          </button>
        </form>
        {result !== null && (
          <div className="mt-4 text-lg font-semibold text-green-700">
            Predicted Efficiency: {result}%
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
