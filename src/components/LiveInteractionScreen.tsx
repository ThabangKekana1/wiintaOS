import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VoiceInteraction } from './VoiceInteraction';

export function LiveInteractionScreen() {
  const [backgroundGradient, setBackgroundGradient] = useState(
    'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 30%, #6366F1 60%, #8B5CF6 100%)'
  );

  // Dynamic background that responds to emotional state
  useEffect(() => {
    // This could be enhanced to listen to emotion changes from the VoiceInteraction component
    const gradientCycle = setInterval(() => {
      const gradients = [
        'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 30%, #6366F1 60%, #8B5CF6 100%)',
        'linear-gradient(135deg, #0F172A 0%, #1E293B 30%, #334155 60%, #475569 100%)',
        'linear-gradient(135deg, #4C1D95 0%, #6D28D9 30%, #8B5CF6 60%, #A78BFA 100%)'
      ];
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
      setBackgroundGradient(randomGradient);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(gradientCycle);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Dynamic Emotional Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: backgroundGradient
        }}
        transition={{
          duration: 3,
          ease: "easeInOut"
        }}
      />

      {/* Ambient Emotional Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 400 - 200],
              y: [0, Math.random() * 400 - 200],
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Emotional Grid Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 2px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Real Hume API Voice Interaction */}
      <div className="relative z-10 w-full h-full">
        <VoiceInteraction />
      </div>

      {/* Live Status Indicators */}
      <motion.div
        className="absolute top-8 right-8 text-white/50 text-sm text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="flex items-center justify-end space-x-2 mb-1">
          <motion.div
            className="w-2 h-2 bg-blue-400 rounded-full"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span>Live Emotional AI</span>
        </div>
        <div className="text-xs opacity-60">
          Real-time emotion detection active
        </div>
      </motion.div>
    </div>
  );
}