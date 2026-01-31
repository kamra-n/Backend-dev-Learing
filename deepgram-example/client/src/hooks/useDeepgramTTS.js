import { useState, useRef, useCallback } from 'react';

const SAMPLE_RATE = 24000;

export function useDeepgramTTS() {
    const [status, setStatus] = useState('Ready to stream');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [chunksReceived, setChunksReceived] = useState(0);

    const audioContextRef = useRef(null);
    const wsRef = useRef(null);
    const nextPlayTimeRef = useRef(0);

    // Initialize Audio Context
    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: SAMPLE_RATE
            });
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        nextPlayTimeRef.current = audioContextRef.current.currentTime;
    }, []);

    // Convert PCM16 to Float32
    const pcm16ToFloat32 = useCallback((pcmData) => {
        const int16Array = new Int16Array(pcmData);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
        }
        return float32Array;
    }, []);

    // Play audio chunk immediately
    const playAudioChunk = useCallback((pcmData) => {
        const audioContext = audioContextRef.current;
        if (!audioContext) return;

        const float32Data = pcm16ToFloat32(pcmData);
        const audioBuffer = audioContext.createBuffer(1, float32Data.length, SAMPLE_RATE);
        audioBuffer.getChannelData(0).set(float32Data);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        const currentTime = audioContext.currentTime;
        if (nextPlayTimeRef.current < currentTime) {
            nextPlayTimeRef.current = currentTime + 0.05;
        }

        source.start(nextPlayTimeRef.current);
        nextPlayTimeRef.current += audioBuffer.duration;
    }, [pcm16ToFloat32]);

    // Wait for playback to complete
    const waitForPlaybackComplete = useCallback(() => {
        const checkInterval = setInterval(() => {
            const audioContext = audioContextRef.current;
            if (audioContext && audioContext.currentTime >= nextPlayTimeRef.current - 0.1) {
                clearInterval(checkInterval);
                setIsPlaying(false);
                setIsSuccess(true);
                setIsError(false);
                setStatus('Playback complete');
                if (wsRef.current) {
                    wsRef.current.close();
                    wsRef.current = null;
                }
            }
        }, 100);
    }, []);

    // Handle errors
    const handleError = useCallback((message) => {
        console.error('Error:', message);
        setStatus(`Error: ${message}`);
        setIsError(true);
        setIsSuccess(false);
        setIsPlaying(false);
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    }, []);

    // Main play function
    const play = useCallback(async (text) => {
        if (!text.trim()) {
            setStatus('Please enter some text');
            setIsError(true);
            return;
        }

        if (isPlaying) return;

        try {
            initAudioContext();
            setIsPlaying(true);
            setIsError(false);
            setIsSuccess(false);
            setChunksReceived(0);
            setStatus('Connecting...');

            // Connect to WebSocket
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = import.meta.env.DEV
                ? `ws://localhost:3000`
                : `${protocol}//${window.location.host}`;

            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                console.log('WebSocket connected');
                setStatus('Waiting for audio...');
                wsRef.current.send(JSON.stringify({ type: 'text', text }));
            };

            wsRef.current.onmessage = async (event) => {
                if (event.data instanceof Blob) {
                    const arrayBuffer = await event.data.arrayBuffer();
                    setChunksReceived(prev => {
                        const newCount = prev + 1;
                        setStatus(`Streaming... chunk ${newCount}`);
                        return newCount;
                    });
                    playAudioChunk(arrayBuffer);
                } else {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'done') {
                            console.log('Audio stream complete');
                            waitForPlaybackComplete();
                        } else if (data.type === 'error') {
                            handleError(data.message);
                        }
                    } catch (e) {
                        console.error('Error parsing message:', e);
                    }
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                handleError('Connection failed');
            };

            wsRef.current.onclose = () => {
                console.log('WebSocket closed');
            };

        } catch (error) {
            handleError(error.message || 'Connection failed');
        }
    }, [isPlaying, initAudioContext, playAudioChunk, waitForPlaybackComplete, handleError]);

    return {
        play,
        status,
        isPlaying,
        isError,
        isSuccess,
        chunksReceived
    };
}
