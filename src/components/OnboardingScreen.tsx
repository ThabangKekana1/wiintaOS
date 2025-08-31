import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waveform } from './Waveform';

export function OnboardingScreen() {
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const messages = [
    "Hello. I'm Wiinta.",
    "I don't just respond, I understand.",
    "May I ask a few things to get to know you?"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < messages.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentStep, messages.length]);

  const handleMicClick = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, #E6E6FA 0%, #9370DB 50%, #FFB6C1 100%)',
            'linear-gradient(135deg, #DDA0DD 0%, #8A2BE2 50%, #FFC0CB 100%)',
            'linear-gradient(135deg, #E6E6FA 0%, #9370DB 50%, #FFB6C1 100%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
        {/* Message Display */}
        <div className="mb-16 min-h-[120px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl text-white max-w-4xl leading-relaxed"
              style={{ fontWeight: 300, letterSpacing: '0.02em' }}
            >
              {messages[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Waveform Visualizer */}
        <div className="mb-12">
          <Waveform
            isActive={isListening}
            emotion="empathetic"
            size="large"
            className="w-full max-w-2xl"
          />
        </div>

        {/* Floating Mic Button */}
        <motion.button
          className="relative w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center group"
          onClick={handleMicClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: isListening 
              ? ['0 0 0 0 rgba(255,255,255,0.4)', '0 0 0 20px rgba(255,255,255,0)']
              : ['0 0 0 0 rgba(255,255,255,0.2)', '0 0 0 10px rgba(255,255,255,0)']
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }
          }}
        >
          {/* Mic Icon */}
          <motion.svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            animate={{
              scale: isListening ? [1, 1.1, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: isListening ? Infinity : 0
            }}
          >
            <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
            <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
            <path d="M12 18v4"/>
            <path d="M8 22h8"/>
          </motion.svg>

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            animate={{
              scale: isListening ? [1, 1.2, 1] : 1,
              opacity: isListening ? [0.3, 0.1, 0.3] : 0.1
            }}
            transition={{
              duration: 2,
              repeat: isListening ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
        </motion.button>

        {/* Status Text */}
        <motion.p
          className="mt-8 text-white/70 text-lg"
          animate={{
            opacity: isListening ? [0.7, 1, 0.7] : 0.7
          }}
          transition={{
            duration: 2,
            repeat: isListening ? Infinity : 0
          }}
        >
          {isListening ? "I'm listening..." : "Tap to speak"}
        </motion.p>
      </div>
    </div>
  );
}