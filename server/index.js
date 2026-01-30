const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { verifyGoogleToken } = require("google-auth-lite");

const app = express();
app.use(cors()); 
app.use(express.json()); 


app.get("/",(req,res) => {
    res.send(".hello world");
})

app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const result = await verifyGoogleToken(token, process.env.GOOGLE_CLIENT_ID);
    if (!result.valid) {
      return res.status(401).json({ error: "Invalid Google Token" });
    }
    res.status(200).json({
      message: "Login successful",
      user: result.user,
    });

  } catch (error) {
    res.status(500).json({ error: "Server error during verification" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});