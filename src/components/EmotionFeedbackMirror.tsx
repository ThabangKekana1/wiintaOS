import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type DetectedEmotion = 'strained' | 'excited' | 'calm' | 'tired' | 'focused' | 'overwhelmed';

export function EmotionFeedbackMirror() {
  const [currentEmotion, setCurrentEmotion] = useState<DetectedEmotion>('calm');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const emotionData = {
    strained: {
      message: "You sound a little strained. Shall we lighten the task load?",
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FF6B9D 100%)',
      mirror: 'tense'
    },
    excited: {
      message: "I can hear the excitement in your voice! Let's channel that energy.",
      color: '#FFD93D',
      gradient: 'linear-gradient(135deg, #FFD93D 0%, #FF6B9D 50%, #C44569 100%)',
      mirror: 'energetic'
    },
    calm: {
      message: "You sound centered and peaceful. This feels like a good moment.",
      color: '#6BCF7F',
      gradient: 'linear-gradient(135deg, #6BCF7F 0%, #4D79A4 50%, #9D65C9 100%)',
      mirror: 'serene'
    },
    tired: {
      message: "You sound like you need a moment to recharge. Shall we take a break?",
      color: '#A8A8A8',
      gradient: 'linear-gradient(135deg, #A8A8A8 0%, #7D4CDB 50%, #5A67D8 100%)',
      mirror: 'weary'
    },
    focused: {
      message: "I can sense your deep focus. You're in the zone right now.",
      color: '#4299E1',
      gradient: 'linear-gradient(135deg, #4299E1 0%, #3182CE 50%, #2D3748 100%)',
      mirror: 'concentrated'
    },
    overwhelmed: {
      message: "It sounds like there's a lot on your mind. Let's simplify things.",
      color: '#E53E3E',
      gradient: 'linear-gradient(135deg, #E53E3E 0%, #DD6B20 50%, #D69E2E 100%)',
      mirror: 'scattered'
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnalyzing(true);
      
      setTimeout(() => {
        const emotions: DetectedEmotion[] = ['strained', 'excited', 'calm', 'tired', 'focused', 'overwhelmed'];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        setCurrentEmotion(randomEmotion);
        setIsAnalyzing(false);
      }, 1500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const getMirrorEffect = (emotion: DetectedEmotion) => {
    const effects = {
      tense: { scale: [1, 0.95, 1], duration: 0.5 },
      energetic: { scale: [1, 1.1, 1], duration: 0.3 },
      serene: { scale: [1, 1.02, 1], duration: 2 },
      weary: { scale: [1, 0.98, 1], duration: 1.5 },
      concentrated: { scale: [1, 1.05, 1], duration: 1 },
      scattered: { scale: [1, 0.9, 1.1, 1], duration: 0.4 }
    };

    return effects[emotionData[emotion].mirror as keyof typeof effects];
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isAnalyzing 
            ? 'linear-gradient(135deg, #2D3748 0%, #4A5568 50%, #718096 100%)'
            : emotionData[currentEmotion].gradient
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut"
        }}
      />

      {/* Mirror Frame */}
      <div className="absolute inset-8 rounded-full border-4 border-white/20 backdrop-blur-sm">
        <motion.div
          className="relative w-full h-full rounded-full overflow-hidden"
          animate={getMirrorEffect(currentEmotion)}
          transition={{
            repeat: Infinity,
            ease: "easeInOut",
            ...getMirrorEffect(currentEmotion)
          }}
        >
          {/* Mirror Reflection Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12" />
          
          {/* Emotion Visualization */}
          <motion.div
            className="absolute inset-4 rounded-full"
            style={{
              background: `radial-gradient(circle at center, ${emotionData[currentEmotion].color}40 0%, transparent 70%)`
            }}
            animate={{
              opacity: isAnalyzing ? [0.2, 0.6, 0.2] : [0.4, 0.8, 0.4],
              scale: isAnalyzing ? [1, 1.1, 1] : [1, 1.05, 1]
            }}
            transition={{
              duration: isAnalyzing ? 1 : 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Emotion Particles */}
          {!isAnalyzing && Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: emotionData[currentEmotion].color,
                opacity: 0.6
              }}
              animate={{
                x: [0, Math.cos(i * Math.PI / 4) * 60],
                y: [0, Math.sin(i * Math.PI / 4) * 60],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
        {/* Analysis State */}
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <div className="mb-6">
                <motion.div
                  className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
              <p className="text-xl text-white/80">
                Let me listen to how you're feeling...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={currentEmotion}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center max-w-2xl"
            >
              <motion.p
                className="text-3xl md:text-4xl text-white leading-relaxed mb-8"
                style={{ fontWeight: 300, letterSpacing: '0.02em' }}
                animate={{
                  textShadow: [
                    `0 0 20px ${emotionData[currentEmotion].color}40`,
                    `0 0 40px ${emotionData[currentEmotion].color}60`,
                    `0 0 20px ${emotionData[currentEmotion].color}40`
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {emotionData[currentEmotion].message}
              </motion.p>

              <motion.div
                className="w-24 h-1 bg-white/40 mx-auto rounded-full"
                animate={{
                  backgroundColor: [
                    'rgba(255, 255, 255, 0.4)',
                    emotionData[currentEmotion].color + '80',
                    'rgba(255, 255, 255, 0.4)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Corner Hint */}
      <motion.div
        className="absolute bottom-8 right-8 text-white/40 text-sm text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        Emotional reflection updates automatically
      </motion.div>
    </div>
  );
}