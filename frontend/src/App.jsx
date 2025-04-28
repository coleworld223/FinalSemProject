import { useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TextField,
  Button,
  Grid,
  Card,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

function App() {
  const [formData, setFormData] = useState({
    Material_Type: 0, // Unit: Material type (no unit)
    Energy_Manufacturing: 0, // Unit: kWh
    Plant_Size: 0, // Unit: MW
    Capacity_Factor: 0, // Unit: Percentage (%)
    Lifespan: 0, // Unit: Years
  });

  const [selectedModel, setSelectedModel] = useState("carbon_manufacturing");
  const [result, setResult] = useState(null);

  const modelEndpoints = {
    carbon_manufacturing: "predict/carbon_manufacturing/",
    total_lifetime_emissions: "predict/total_lifetime_emissions/",
    transportation_emissions: "predict/transportation_emissions/",
    recycling_benefits: "predict/recycling_benefits/",
    operational_emissions: "predict/operational_emissions/",
  };

  const modelNames = {
    carbon_manufacturing: "Carbon Manufacturing Emissions",
    total_lifetime_emissions: "Total Lifetime Emissions",
    transportation_emissions: "Transportation Emissions",
    recycling_benefits: "Recycling Benefits",
    operational_emissions: "Operational Emissions",
  };

  const COLORS = [
    "#facc15",
    "#ef4444",
    "#fb923c",
    "#a855f7",
    "#3b82f6",
    "#ec4899",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/${modelEndpoints[selectedModel]}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      const predictionKey = Object.keys(res.data)[0];
      setResult(res.data[predictionKey]);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(`Failed: ${err.response?.data?.detail || err.message}`);
    }
  };

  const chartData = [
    ...Object.entries(formData).map(([key, value]) => ({
      name: key.replace(/_/g, " "),
      value,
    })),
    ...(result !== null
      ? [{ name: modelNames[selectedModel], value: parseFloat(result) }]
      : []),
  ];

  const getOutputUnit = (model) => {
    switch (model) {
      case "carbon_manufacturing":
        return "kg CO2/kWh"; // Example: kg of CO2 per kWh of energy produced
      case "total_lifetime_emissions":
        return "tons CO2"; // Example: total emissions over the lifetime
      case "transportation_emissions":
        return "kg CO2"; // Example: emissions from transportation
      case "recycling_benefits":
        return "kg CO2"; // Example: carbon saved by recycling
      case "operational_emissions":
        return "kg CO2/kWh"; // Example: emissions per kWh of energy produced
      default:
        return "";
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #a7f3d0, #60a5fa)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box textAlign="center" py={4} bgcolor="white" boxShadow={3} flexGrow={1}>
        <Typography variant="h4" color="primary">
          Renewable Energy Lifecycle Assessment
        </Typography>
        <Typography variant="body1" color="textSecondary" mt={1}>
          Predict Environmental Impacts
        </Typography>
      </Box>

      <Box mx="auto" mt={4} p={3} maxWidth={600}>
        <Card elevation={4} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Select Output to Predict
          </Typography>
          <TextField
            select
            fullWidth
            value={selectedModel}
            onChange={handleModelChange}
            variant="outlined"
            size="small"
          >
            {Object.entries(modelNames).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Card>
      </Box>

      {result !== null && (
        <Box textAlign="center" mt={4}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => setResult(null)}
            sx={{ borderRadius: 4, px: 4, py: 1.5, fontWeight: 500 }}
          >
            Refresh Prediction
          </Button>
        </Box>
      )}

      {result !== null && (
        <Box mt={6} mx="auto" maxWidth={600}>
          <Typography variant="h6" textAlign="center" mb={3}>
            Result Breakdown (Pie Chart)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}

      <Box flexGrow={1}>
        {result === null ? (
          <Box
            mx="auto"
            mt={6}
            p={4}
            maxWidth={1500}
            component="form"
            onSubmit={handleSubmit}
          >
            <Grid container spacing={3}>
              {Object.keys(formData).map((key) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Card elevation={3} sx={{ p: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      {key.replace(/_/g, " ")}
                    </Typography>
                    <TextField
                      fullWidth
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      variant="outlined"
                      type="number"
                      step="any"
                      required
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2">
                            {key === "Energy_Manufacturing"
                              ? "kWh"
                              : key === "Capacity_Factor"
                              ? "%"
                              : key === "Plant_Size"
                              ? "MW"
                              : key === "Lifespan"
                              ? "Years"
                              : ""}
                          </Typography>
                        ),
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 15 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 6 }}
              >
                Predict
              </Button>
            </Box>
          </Box>
        ) : (
          <Box textAlign="center" mt={6}>
            <Card elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                Predicted {modelNames[selectedModel]}: {result.toFixed(2)}{" "}
                {getOutputUnit(selectedModel)}
              </Typography>
            </Card>
          </Box>
        )}
      </Box>

      <Box py={2} textAlign="center" bgcolor="white" boxShadow={3}>
        <Typography variant="body2" color="textSecondary">
          © 2025 Presented by Aniket and Anuj — All rights reserved.
        </Typography>
      </Box>
    </div>
  );
}

export default App;
