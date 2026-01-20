const express = require("express");
const { WebSocketServer } = require("ws");
const http = require("http");
const path = require("path");
const { createClient, LiveTTSEvents } = require("@deepgram/sdk");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Deepgram API key - move to environment variable in production!
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || '';

wss.on("connection", (ws) => {
    console.log("Client connected");

    let dgConnection = null;

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === "text") {
                console.log("Received text:", data.text);

                // Create Deepgram client
                const deepgram = createClient(DEEPGRAM_API_KEY);

                // Connect to Deepgram Live TTS
                dgConnection = deepgram.speak.live({
                    model: "aura-2-thalia-en",
                    encoding: "linear16",
                    sample_rate: 24000,
                });

                dgConnection.on(LiveTTSEvents.Open, () => {
                    console.log("Deepgram connection opened");

                    // Send text for TTS
                    dgConnection.sendText(data.text);
                    dgConnection.flush();
                });

                dgConnection.on(LiveTTSEvents.Audio, (audioData) => {
                    console.log("Received audio chunk:", audioData.byteLength, "bytes");

                    // Forward audio chunk to client
                    if (ws.readyState === ws.OPEN) {
                        ws.send(audioData);
                    }
                });

                dgConnection.on(LiveTTSEvents.Flushed, () => {
                    console.log("Deepgram flushed");

                    // Signal end of audio to client
                    if (ws.readyState === ws.OPEN) {
                        ws.send(JSON.stringify({ type: "done" }));
                    }
                });

                dgConnection.on(LiveTTSEvents.Error, (err) => {
                    console.error("Deepgram error:", err);
                    if (ws.readyState === ws.OPEN) {
                        ws.send(JSON.stringify({ type: "error", message: err.message }));
                    }
                });

                dgConnection.on(LiveTTSEvents.Close, () => {
                    console.log("Deepgram connection closed");
                });
            }
        } catch (err) {
            console.error("Error processing message:", err);
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        if (dgConnection) {
            dgConnection.requestClose();
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
