import React, { useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const App = () => {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone,
      });
      const reply =
        typeof response.data === "string" ? response.data : JSON.stringify(response.data);

      setGeneratedReply(reply);

      // ✅ Success animation when reply is generated
      setSnackbar({ open: true, message: "✨ Reply generated successfully!", type: "success" });
    } catch (error) {
      setError("Failed to generate email reply. Please try again!");
      console.error(error);
      setSnackbar({ open: true, message: "❌ Failed to generate reply", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    // ✅ Animation when copied
    setSnackbar({ open: true, message: "📋 Reply copied to clipboard!", type: "info" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 30%, #1e3c72, transparent 25%), radial-gradient(circle at 80% 70%, #2a5298, transparent 25%), linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#fff",
            mb: 4,
            textShadow: "0px 0px 15px rgba(138, 180, 255, 0.8)",
            letterSpacing: 1.5,
          }}
        >
          Email Reply Generator
        </Typography>

        <Card
          elevation={12}
          sx={{
            borderRadius: 3,
            p: 3,
            background: "rgba(30, 30, 60, 0.85)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            boxShadow: "0px 0px 25px rgba(138, 180, 255, 0.4)",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "600" }}>
              Enter Email Details
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={5}
              variant="outlined"
              label="Original Email Content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiInputBase-root": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#bbb" },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
              }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel sx={{ color: "#bbb" }}>Tone (Optional)</InputLabel>
              <Select
                value={tone || ""}
                label="Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#555",
                  },
                }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Professional">Professional</MenuItem>
                <MenuItem value="Casual">Casual</MenuItem>
                <MenuItem value="Friendly">Friendly</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              sx={{
                py: 1.2,
                fontWeight: "bold",
                borderRadius: 2,
                background: "linear-gradient(90deg, #8e2de2, #4a00e0, #00c6ff)",
                backgroundSize: "200% 200%",
                animation: "moveGradient 4s ease infinite",
                "@keyframes moveGradient": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
              }}
            >
              {loading ? (
                <CircularProgress size={26} color="inherit" />
              ) : (
                "🚀 Generate Reply"
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Typography color="error" sx={{ mt: 3, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {generatedReply && (
          <Paper
            elevation={6}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              backgroundColor: "rgba(45, 45, 70, 0.9)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "600", mb: 2 }}
            >
              ✅ Generated Reply:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
                fontFamily: "Roboto, sans-serif",
              }}
            >
              {generatedReply}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                mt: 2,
                borderColor: "#aaa",
                color: "#fff",
                "&:hover": { borderColor: "#fff" },
              }}
              onClick={handleCopy}
            >
              📋 Copy to Clipboard
            </Button>
          </Paper>
        )}

        {/* ✅ Snackbar for animations */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.type}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default App;
