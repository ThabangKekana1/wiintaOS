import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmotionDisplay } from './EmotionDisplay';
import { Waveform } from './Waveform';
import { useHumeVoice } from '../hooks/useHumeVoice';

interface Emotion {
  name: string;
  score: number;
}

export function VoiceInteraction() {
  const [detectedEmotions, setDetectedEmotions] = useState<Emotion[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');

  const {
    recordingState,
    emotions,
    transcript,
    error,
    isConnected,
    toggleRecording,
    cleanup
  } = useHumeVoice({
    onEmotionsDetected: (emotions) => {
      setDetectedEmotions(emotions);
    },
    onTranscriptReceived: (transcript) => {
      setCurrentTranscript(transcript);
    },
    onError: (error) => {
      console.error('Hume Voice Error:', error);
    }
  });

  useEffect(() => {
    setDetectedEmotions(emotions);
  }, [emotions]);

  useEffect(() => {
    setCurrentTranscript(transcript);
  }, [transcript]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const getStatusMessage = () => {
    const messages = {
      idle: isConnected ? 'Tap to start emotional conversation' : 'Connecting to Hume AI...',
      connecting: 'Connecting to Hume Empathic Voice Interface...',
      recording: 'Listening to your voice and emotions...',
      processing: 'Analyzing emotional patterns with Hume AI...',
      speaking: 'Hume AI is responding with empathy...'
    };
    return messages[recordingState];
  };

  const getMicButtonState = () => {
    if (!isConnected && recordingState !== 'connecting') {
      return {
        color: '#6B7280',
        backgroundColor: 'rgba(107, 114, 128, 0.15)',
        borderColor: '#6B7280',
        scale: 1,
        glow: '0 0 15px rgba(107, 114, 128, 0.3)'
      };
    }

    switch (recordingState) {
      case 'connecting':
        return {
          color: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          borderColor: '#F59E0B',
          scale: 1.02,
          glow: '0 0 20px rgba(245, 158, 11, 0.5)'
        };
      case 'recording':
        return {
          color: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          borderColor: '#EF4444',
          scale: 1.1,
          glow: '0 0 25px rgba(239, 68, 68, 0.6)'
        };
      case 'processing':
        return {
          color: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          borderColor: '#8B5CF6',
          scale: 1.05,
          glow: '0 0 25px rgba(139, 92, 246, 0.6)'
        };
      case 'speaking':
        return {
          color: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          borderColor: '#10B981',
          scale: 1.05,
          glow: '0 0 25px rgba(16, 185, 129, 0.6)'
        };
      default:
        return {
          color: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderColor: '#3B82F6',
          scale: 1,
          glow: '0 0 20px rgba(59, 130, 246, 0.4)'
        };
    }
  };

  const buttonState = getMicButtonState();
  const isButtonDisabled = !isConnected || recordingState === 'processing' || recordingState === 'speaking' || recordingState === 'connecting';

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      {/* Emotional Waveform Visualization */}
      <div className="mb-12">
        <Waveform
          isActive={recordingState === 'recording' || recordingState === 'speaking'}
          emotion={detectedEmotions[0]?.name.toLowerCase() as any || 'calm'}
          size="large"
          className="w-full max-w-4xl"
        />
      </div>

      {/* Main Interaction Button */}
      <motion.button
        className="relative w-36 h-36 rounded-full backdrop-blur-md border-2 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: buttonState.backgroundColor,
          borderColor: buttonState.borderColor,
          boxShadow: buttonState.glow
        }}
        onClick={toggleRecording}
        disabled={isButtonDisabled}
        animate={{
          scale: buttonState.scale,
        }}
        whileHover={{ 
          scale: !isButtonDisabled ? buttonState.scale * 1.05 : buttonState.scale 
        }}
        whileTap={{ 
          scale: !isButtonDisabled ? buttonState.scale * 0.95 : buttonState.scale 
        }}
      >
        {/* Animated Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: buttonState.color }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />

        {/* Secondary Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-opacity-40"
          style={{ borderColor: buttonState.color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.5
          }}
        />

        {/* Icon Content */}
        <AnimatePresence mode="wait">
          {recordingState === 'processing' || recordingState === 'connecting' ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              className="relative"
            >
              <div 
                className="w-10 h-10 border-4 border-transparent rounded-full"
                style={{ 
                  borderTopColor: buttonState.color,
                  borderRightColor: buttonState.color + '60'
                }}
              />
              <motion.div
                className="absolute inset-0 w-10 h-10 border-4 border-transparent rounded-full"
                style={{ borderBottomColor: buttonState.color + '40' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="microphone"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              <svg
                className="w-14 h-14"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ color: buttonState.color }}
              >
                {recordingState === 'recording' ? (
                  <motion.rect 
                    x="6" y="6" width="12" height="12" rx="2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ) : recordingState === 'speaking' ? (
                  <motion.g
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </motion.g>
                ) : !isConnected ? (
                  <motion.g
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" opacity="0.5"/>
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1" opacity="0.5"/>
                    <path d="M12 18v4" opacity="0.5"/>
                    <path d="M8 22h8" opacity="0.5"/>
                  </motion.g>
                ) : (
                  <>
                    <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
                    <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                    <path d="M12 18v4"/>
                    <path d="M8 22h8"/>
                  </>
                )}
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Status Message */}
      <motion.p
        className="mt-8 text-white/85 text-lg text-center max-w-lg"
        animate={{
          opacity: recordingState === 'recording' ? [0.85, 1, 0.85] : 0.85
        }}
        transition={{
          duration: 1.5,
          repeat: recordingState === 'recording' ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {getStatusMessage()}
      </motion.p>

      {/* Hume EVI Connection Status */}
      <motion.div
        className="mt-4 flex items-center space-x-2 text-sm"
        animate={{
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          className={`w-2 h-2 rounded-full ${
            error ? 'bg-red-400' : 
            isConnected ? 'bg-green-400' : 
            recordingState === 'connecting' ? 'bg-yellow-400' : 'bg-gray-400'
          }`}
          animate={{
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <span className="text-white/60">
          {error ? 'Connection Error' : 
           isConnected ? 'Hume EVI Connected' : 
           recordingState === 'connecting' ? 'Connecting...' : 'Disconnected'}
        </span>
      </motion.div>

      {/* Real-time Transcript */}
      <AnimatePresence>
        {currentTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-center"
          >
            <p className="text-white/50 text-sm mb-2">Emotional Context Detected:</p>
            <p className="text-white/90 text-lg italic leading-relaxed">
              "{currentTranscript}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Emotion Analysis */}
      <EmotionDisplay 
        emotions={detectedEmotions} 
        isVisible={detectedEmotions.length > 0 && recordingState !== 'recording'} 
      />

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 max-w-md"
          >
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 backdrop-blur-md">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <div>
                  <p className="text-red-200 text-sm font-medium mb-1">Hume API Error</p>
                  <p className="text-red-300 text-xs">{error}</p>
                  <p className="text-red-400 text-xs mt-2">Please check your internet connection and try again.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        className="absolute bottom-8 right-8 text-white/40 text-sm text-right max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <p>Complete emotional AI conversation</p>
        <p className="text-xs mt-1">
          {isConnected ? 'Powered entirely by Hume Empathic Voice Interface' : 'Connecting to Hume EVI...'}
        </p>
      </motion.div>
    </div>
  );
}