import { useState, useRef, useCallback, useEffect } from 'react';
import { HumeVoiceClient, playAudioFromBase64, generateEmotionalResponse, type Emotion } from '../utils/humeVoice';

interface UseHumeVoiceOptions {
  onEmotionsDetected?: (emotions: Emotion[]) => void;
  onTranscriptReceived?: (transcript: string) => void;
  onError?: (error: string) => void;
}

type RecordingState = 'idle' | 'recording' | 'processing' | 'speaking' | 'connecting';

export function useHumeVoice(options: UseHumeVoiceOptions = {}) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const humeClientRef = useRef<HumeVoiceClient | null>(null);
  const connectionPromiseRef = useRef<Promise<WebSocket> | null>(null);

  const initializeHumeClient = useCallback(async () => {
    if (humeClientRef.current?.isConnected()) {
      return;
    }

    if (connectionPromiseRef.current) {
      try {
        await connectionPromiseRef.current;
        return;
      } catch (error) {
        // Connection failed, try again
      }
    }

    try {
      setRecordingState('connecting');
      setError(null);
      
      humeClientRef.current = new HumeVoiceClient();
      
      // Set up message handler for emotions and transcripts
      humeClientRef.current.onMessage((detectedEmotions, transcript) => {
        setEmotions(detectedEmotions);
        setTranscript(transcript || '');
        options.onEmotionsDetected?.(detectedEmotions);
        options.onTranscriptReceived?.(transcript || '');
      });

      // Set up audio handler for Hume TTS responses
      humeClientRef.current.onAudio(async (audioData) => {
        try {
          setRecordingState('speaking');
          await playAudioFromBase64(audioData);
          setRecordingState('idle');
        } catch (error) {
          console.error('Audio playback error:', error);
          setRecordingState('idle');
        }
      });

      connectionPromiseRef.current = humeClientRef.current.connect();
      await connectionPromiseRef.current;
      
      setIsConnected(true);
      setRecordingState('idle');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Hume API';
      setError(errorMessage);
      setIsConnected(false);
      setRecordingState('idle');
      options.onError?.(errorMessage);
      throw err;
    } finally {
      connectionPromiseRef.current = null;
    }
  }, [options]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      if (!isConnected) {
        await initializeHumeClient();
      }

      setRecordingState('recording');
      setEmotions([]);
      setTranscript('');

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
          }
        }
      }

      const mediaRecorderOptions: MediaRecorderOptions = {};
      if (mimeType) {
        mediaRecorderOptions.mimeType = mimeType;
      }

      const mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      options.onError?.(errorMessage);
      setRecordingState('idle');
    }
  }, [isConnected, initializeHumeClient, options]);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || recordingState !== 'recording') return;

    setRecordingState('processing');

    return new Promise<void>((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;
      
      mediaRecorder.onstop = async () => {
        try {
          if (audioChunksRef.current.length === 0) {
            throw new Error('No audio data recorded');
          }

          const audioBlob = new Blob(audioChunksRef.current, { 
            type: mediaRecorder.mimeType || 'audio/webm' 
          });
          
          await processAudioWithHume(audioBlob);
          resolve();
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to process audio';
          setError(errorMessage);
          options.onError?.(errorMessage);
          setRecordingState('idle');
          resolve();
        }
      };

      mediaRecorder.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    });
  }, [recordingState, options]);

  const processAudioWithHume = useCallback(async (audioBlob: Blob) => {
    try {
      if (!humeClientRef.current?.isConnected()) {
        throw new Error('Not connected to Hume API');
      }

      // Send audio to Hume for emotion analysis
      await humeClientRef.current.sendAudio(audioBlob);
      
      // Wait for emotion analysis response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // If we have emotions, generate and send a response to Hume for TTS
      if (emotions.length > 0) {
        const responseText = generateEmotionalResponse(emotions);
        await humeClientRef.current.sendTextMessage(responseText);
      }
      
      // The audio response will be handled by the onAudio callback
      
    } catch (err) {
      console.error('Hume processing error:', err);
      setRecordingState('idle');
      throw new Error(`Failed to analyze audio: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [emotions]);

  const toggleRecording = useCallback(() => {
    if (recordingState === 'recording') {
      stopRecording();
    } else if (recordingState === 'idle') {
      startRecording();
    }
  }, [recordingState, startRecording, stopRecording]);

  // Initialize connection on mount
  useEffect(() => {
    initializeHumeClient().catch(err => {
      console.warn('Failed to initialize Hume connection on mount:', err);
    });
  }, [initializeHumeClient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (humeClientRef.current) {
        humeClientRef.current.disconnect();
        humeClientRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsConnected(false);
    };
  }, []);

  const cleanup = useCallback(() => {
    if (humeClientRef.current) {
      humeClientRef.current.disconnect();
      humeClientRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsConnected(false);
  }, []);

  return {
    recordingState,
    emotions,
    transcript,
    error,
    isConnected,
    startRecording,
    stopRecording,
    toggleRecording,
    cleanup
  };
}