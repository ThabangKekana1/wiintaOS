import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waveform } from './Waveform';

type Mode = 'personal' | 'work';

export function ModeToggleScreen() {
  const [currentMode, setCurrentMode] = useState<Mode>('personal');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const modeConfig = {
    personal: {
      gradient: 'linear-gradient(135deg, #E6E6FA 0%, #FFB6C1 30%, #FFC0CB 60%, #DDA0DD 100%)',
      title: 'Personal Wiinta',
      subtitle: 'Emotional, casual, home-focused',
      message: 'Hey there! Ready to unwind and connect?',
      waveformEmotion: 'empathetic' as const,
      accent: '#FFB6C1',
      particles: {
        color: '#FFC0CB',
        count: 25,
        size: 'large'
      }
    },
    work: {
      gradient: 'linear-gradient(135deg, #2D3748 0%, #4A5568 30%, #5A67D8 60%, #667EEA 100%)',
      title: 'Work Wiinta',
      subtitle: 'Sharp, focused, task-efficient',
      message: 'Let\'s make space for focus. What\'s the priority?',
      waveformEmotion: 'focused' as const,
      accent: '#5A67D8',
      particles: {
        color: '#667EEA',
        count: 15,
        size: 'small'
      }
    }
  };

  const handleToggle = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentMode(current => current === 'personal' ? 'work' : 'personal');
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 500);
  };

  const config = modeConfig[currentMode];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isTransitioning 
            ? 'linear-gradient(135deg, #000000 0%, #1A202C 50%, #2D3748 100%)'
            : config.gradient
        }}
        transition={{
          duration: 1,
          ease: "easeInOut"
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: config.particles.count }).map((_, i) => (
          <motion.div
            key={`${currentMode}-${i}`}
            className="absolute rounded-full"
            style={{
              backgroundColor: config.particles.color,
              width: config.particles.size === 'large' ? '8px' : '4px',
              height: config.particles.size === 'large' ? '8px' : '4px',
              opacity: 0.3
            }}
            animate={{
              x: [0, Math.random() * 400 - 200],
              y: [0, Math.random() * 400 - 200],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: currentMode === 'personal' ? 8 : 12,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: currentMode === 'personal' ? "easeInOut" : "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        {/* Mode Toggle */}
        <div className="mb-12">
          <motion.div
            className="relative bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              {/* Personal Button */}
              <motion.button
                className={`relative px-8 py-4 rounded-full transition-all duration-300 ${
                  currentMode === 'personal' 
                    ? 'text-white' 
                    : 'text-white/60 hover:text-white/80'
                }`}
                onClick={() => currentMode !== 'personal' && handleToggle()}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 font-medium">Personal</span>
                {currentMode === 'personal' && (
                  <motion.div
                    layoutId="activeMode"
                    className="absolute inset-0 bg-gradient-to-r from-pink-400/40 to-purple-400/40 rounded-full"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </motion.button>

              {/* Work Button */}
              <motion.button
                className={`relative px-8 py-4 rounded-full transition-all duration-300 ${
                  currentMode === 'work' 
                    ? 'text-white' 
                    : 'text-white/60 hover:text-white/80'
                }`}
                onClick={() => currentMode !== 'work' && handleToggle()}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 font-medium">Work</span>
                {currentMode === 'work' && (
                  <motion.div
                    layoutId="activeMode"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-indigo-500/40 rounded-full"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Mode Display */}
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={currentMode}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <motion.h1
                className="text-5xl md:text-6xl text-white mb-4"
                style={{ 
                  fontWeight: currentMode === 'work' ? 600 : 300,
                  letterSpacing: currentMode === 'work' ? '-0.02em' : '0.02em'
                }}
                animate={{
                  textShadow: [
                    `0 0 20px ${config.accent}40`,
                    `0 0 40px ${config.accent}60`,
                    `0 0 20px ${config.accent}40`
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {config.title}
              </motion.h1>
              
              <p className="text-xl text-white/70 mb-8">
                {config.subtitle}
              </p>

              <motion.p
                className="text-2xl md:text-3xl text-white/90 max-w-2xl leading-relaxed"
                style={{ fontWeight: 300 }}
              >
                {config.message}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transition State */}
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12"
          >
            <div className="mb-6">
              <motion.div
                className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
            <p className="text-2xl text-white/80">
              {currentMode === 'personal' ? 'Switching to Work Wiinta.' : 'Switching to Personal Wiinta.'}
            </p>
          </motion.div>
        )}

        {/* Waveform */}
        {!isTransitioning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Waveform
              isActive={true}
              emotion={config.waveformEmotion}
              size="medium"
              className="w-full max-w-xl"
            />
          </motion.div>
        )}
      </div>

      {/* Mode Indicator */}
      <div className="absolute bottom-8 left-8">
        <motion.div
          className="flex items-center space-x-3 text-white/60"
          animate={{
            opacity: isTransitioning ? 0.3 : 1
          }}
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: config.accent }}
          />
          <span className="text-sm">
            {currentMode === 'personal' ? 'Home Mode' : 'Focus Mode'} Active
          </span>
        </motion.div>
      </div>
    </div>
  );
}