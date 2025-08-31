import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Emotion {
  name: string;
  score: number;
}

interface EmotionDisplayProps {
  emotions: Emotion[];
  isVisible: boolean;
}

const emotionColors: Record<string, string> = {
  'Joy': '#FFD700',
  'Happiness': '#FFD700',
  'Excitement': '#FF6B6B',
  'Confidence': '#4ECDC4',
  'Calmness': '#95E1D3',
  'Sadness': '#3D5A80',
  'Anxiety': '#EE6C4D',
  'Anger': '#E63946',
  'Surprise': '#F77F00',
  'Fear': '#6F2232',
  'Disgust': '#8B5A3C',
  'Curiosity': '#A663CC',
  'Love': '#FF69B4',
  'Pride': '#9B59B6',
  'Contempt': '#7D4F39'
};

const getEmotionColor = (emotionName: string): string => {
  return emotionColors[emotionName] || '#6B7280';
};

export function EmotionDisplay({ emotions, isVisible }: EmotionDisplayProps) {
  return (
    <AnimatePresence>
      {isVisible && emotions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-4 mt-8"
        >
          {emotions.map((emotion, index) => (
            <motion.div
              key={emotion.name}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="relative"
            >
              {/* Emotion Tag */}
              <div
                className="px-6 py-3 rounded-full text-white relative overflow-hidden backdrop-blur-sm border border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${getEmotionColor(emotion.name)}CC, ${getEmotionColor(emotion.name)}88)`
                }}
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundColor: getEmotionColor(emotion.name) }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Content */}
                <div className="relative z-10 flex items-center space-x-3">
                  <span className="font-medium text-sm">
                    {emotion.name}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs opacity-80">
                      {Math.round(emotion.score * 100)}%
                    </span>
                  </div>
                </div>

                {/* Score Bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${emotion.score * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>

              {/* Pulsing Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 opacity-60"
                style={{ borderColor: getEmotionColor(emotion.name) }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.2, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
              />

              {/* Rank Indicator */}
              {index === 0 && (
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  1
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}