require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5002;
const API_KEY =
  "019402cd-caee-74ea-b4cb-dfbe14cf9ff1:a28b2e067e4f5fb5f9420a3b080021c588a7c98a6e7a4cb8d5a6a431fd2d130d";
const WEBHOOK_URL =
  "https://legislative-raeann-arnology-568c6f22.koyeb.app/webhook";

app.use(bodyParser.json());

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("A user connected");

  // Log disconnections
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Webhook endpoint with WebSocket integration
app.post("/webhook", (req, res) => {
  console.log("Webhook received:", req.body);

  // Emit the webhook data to connected WebSocket clients
  io.emit("webhook_event", req.body);

  res.status(200).send("Webhook processed.");
});

app.get("/getUpdates", async (req, res) => {
  try {
    const resp = await axios.post(
      "https://yoai.yophone.com/api/pub/getUpdates",
      {},
      {
        headers: { "X-YoAI-API-KEY": API_KEY },
      }
    );
    console.log(resp)
    res.json(resp.data);
  } catch (error) {
    console.error("Error fetching from YoAI API:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/sendMessage", async (req, res) => {
  try {
    const resp = await axios.post(
      "https://yoai.yophone.com/api/pub/sendMessage",
      {
        to: "37495998920",
        text: "Bot message",
      },
      {
        headers: { "X-YoAI-API-KEY": API_KEY },
      }
    );
    res.json(resp);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/setWebhook", async (req, res) => {
  try {
    const resp = await axios.post(
      "https://yoai.yophone.com/api/pub/setWebhook",
      { webhookURL: WEBHOOK_URL },
      {
        headers: { "X-YoAI-API-KEY": API_KEY },
      }
    );
    res.json(resp.data);
  } catch (error) {
    console.error("Error setting webhook:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
