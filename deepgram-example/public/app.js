// DOM Elements
const textInput = document.getElementById('textInput');
const playButton = document.getElementById('playButton');
const visualizer = document.getElementById('visualizer');
const status = document.getElementById('status');

// Audio state
let isPlaying = false;
let audioContext = null;

// WebSocket connection
let ws = null;

// Audio queue for streaming playback
let nextPlayTime = 0;
let chunksReceived = 0;
let chunksPlayed = 0;

// Sample rate from Deepgram
const SAMPLE_RATE = 24000;

// Initialize Audio Context (must be done after user interaction)
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: SAMPLE_RATE
        });
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    // Reset play time
    nextPlayTime = audioContext.currentTime;
}

// Connect to WebSocket server
function connectWebSocket() {
    return new Promise((resolve, reject) => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(`${protocol}//${window.location.host}`);

        ws.onopen = () => {
            console.log('WebSocket connected');
            resolve();
        };

        ws.onmessage = async (event) => {
            // Check if it's binary audio data or JSON message
            if (event.data instanceof Blob) {
                chunksReceived++;
                const arrayBuffer = await event.data.arrayBuffer();
                console.log(`Chunk ${chunksReceived}: ${arrayBuffer.byteLength} bytes`);

                // Play immediately as chunk arrives
                playAudioChunk(arrayBuffer);

            } else {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'done') {
                        console.log('Audio stream complete');
                        status.textContent = `Playing... (${chunksReceived} chunks received)`;
                        waitForPlaybackComplete();
                    } else if (data.type === 'error') {
                        handleError(data.message);
                    }
                } catch (e) {
                    console.error('Error parsing message:', e);
                }
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            reject(error);
        };

        ws.onclose = () => {
            console.log('WebSocket closed');
        };
    });
}

// Convert PCM16 to Float32 for Web Audio API
function pcm16ToFloat32(pcmData) {
    const int16Array = new Int16Array(pcmData);
    const float32Array = new Float32Array(int16Array.length);

    for (let i = 0; i < int16Array.length; i++) {
        // Convert 16-bit signed int to float [-1, 1]
        float32Array[i] = int16Array[i] / 32768.0;
    }

    return float32Array;
}

// Play audio chunk immediately (real-time streaming)
function playAudioChunk(pcmData) {
    if (!audioContext) return;

    // Convert PCM16 to Float32
    const float32Data = pcm16ToFloat32(pcmData);

    // Create audio buffer for this chunk
    const audioBuffer = audioContext.createBuffer(1, float32Data.length, SAMPLE_RATE);
    audioBuffer.getChannelData(0).set(float32Data);

    // Create buffer source and play
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    // Schedule this chunk to play after the previous one
    const currentTime = audioContext.currentTime;
    if (nextPlayTime < currentTime) {
        // If we've fallen behind, start from now (with small buffer)
        nextPlayTime = currentTime + 0.05;
    }

    source.start(nextPlayTime);
    source.onended = () => {
        chunksPlayed++;
    };

    // Update next play time
    nextPlayTime += audioBuffer.duration;

    // Update status
    status.textContent = `Streaming... chunk ${chunksReceived}`;
}

// Wait for all audio to finish playing
function waitForPlaybackComplete() {
    const checkInterval = setInterval(() => {
        const currentTime = audioContext.currentTime;
        if (currentTime >= nextPlayTime - 0.1) {
            clearInterval(checkInterval);
            resetUI();
        }
    }, 100);
}

// Reset UI state
function resetUI() {
    isPlaying = false;
    playButton.disabled = false;
    playButton.classList.remove('loading');
    visualizer.classList.remove('active');
    status.textContent = 'Playback complete';
    status.className = 'status success';

    // Close WebSocket
    if (ws) {
        ws.close();
        ws = null;
    }
}

// Handle errors
function handleError(message) {
    console.error('Error:', message);
    status.textContent = `Error: ${message}`;
    status.className = 'status error';
    isPlaying = false;
    playButton.disabled = false;
    playButton.classList.remove('loading');
    visualizer.classList.remove('active');

    if (ws) {
        ws.close();
        ws = null;
    }
}

// Play button click handler
playButton.addEventListener('click', async () => {
    const text = textInput.value.trim();

    if (!text) {
        status.textContent = 'Please enter some text';
        status.className = 'status error';
        return;
    }

    if (isPlaying) return;

    try {
        // Initialize audio and reset state
        initAudioContext();
        isPlaying = true;
        chunksReceived = 0;
        chunksPlayed = 0;

        // Update UI
        playButton.disabled = true;
        playButton.classList.add('loading');
        visualizer.classList.add('active');
        status.textContent = 'Connecting...';
        status.className = 'status';

        // Connect to WebSocket
        await connectWebSocket();

        // Send text to server
        status.textContent = 'Waiting for audio...';
        ws.send(JSON.stringify({ type: 'text', text: text }));

    } catch (error) {
        handleError(error.message || 'Connection failed');
    }
});

// Initial status
status.textContent = 'Ready to stream';
