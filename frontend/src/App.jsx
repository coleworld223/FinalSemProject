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
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

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

  const COLORS = [
    "#facc15",
    "#ef4444",
    "#fb923c",
    "#a855f7",
    "#3b82f6",
    "#ec4899",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict/", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setResult(res.data?.predicted_efficiency || "No data received");
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
      ? [
          {
            name: "Predicted Efficiency",
            value: parseFloat(result),
          },
        ]
      : []),
  ];

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
          Predicting Power Substation Efficiency
        </Typography>
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
            Efficiency Breakdown (Pie Chart)
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
                Predicted Efficiency: {result}%
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
