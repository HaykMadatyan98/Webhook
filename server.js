const express = require("express");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.get("/webhook", async (req, res) => {
  console.log(req);
  res.send(req);
});

app.get("/setWebhook", async (req, res) => {
  try {
    const resp = await axios.post(
      "https://yoai.yophone.com/api/pub/setWebhook",
      {
        webhookURL:
          "https://legislative-raeann-arnology-568c6f22.koyeb.app/webhook",
      },
      {
        headers: {
          "X-YoAI-API-KEY":
            "019402cd-caee-74ea-b4cb-dfbe14cf9ff1:a28b2e067e4f5fb5f9420a3b080021c588a7c98a6e7a4cb8d5a6a431fd2d130d",
        },
      }
    );
    // Check if the response is OK
    res.json(resp.data); // Send the JSON data back to the client
  } catch (error) {
    console.error("Error fetching from YoAI API:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
