import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PodStatus = 'connected' | 'listening' | 'processing' | 'disconnected';

export function WiintaPodScreen() {
  const [podStatus, setPodStatus] = useState<PodStatus>('connected');
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const statusCycle = setInterval(() => {
      const statuses: PodStatus[] = ['connected', 'listening', 'processing', 'connected'];
      const currentIndex = statuses.indexOf(podStatus);
      const nextIndex = (currentIndex + 1) % statuses.length;
      setPodStatus(statuses[nextIndex]);
    }, 4000);

    return () => clearInterval(statusCycle);
  }, [podStatus]);

  const statusConfig = {
    connected: {
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #064E3B 0%, #065F46 30%, #10B981 60%, #34D399 100%)',
      message: 'Wiinta Pod is ready',
      pulseIntensity: 0.6
    },
    listening: {
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 30%, #3B82F6 60%, #60A5FA 100%)',
      message: 'Listening for your voice',
      pulseIntensity: 1.0
    },
    processing: {
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 30%, #8B5CF6 60%, #A78BFA 100%)',
      message: 'Processing your request',
      pulseIntensity: 0.8
    },
    disconnected: {
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 30%, #EF4444 60%, #F87171 100%)',
      message: 'Pod disconnected',
      pulseIntensity: 0.3
    }
  };

  const config = statusConfig[podStatus];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: config.gradient
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut"
        }}
      />

      {/* Ambient Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-8">
        <div className="max-w-4xl w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Pod Visualization */}
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                {/* Pod Device */}
                <motion.div
                  className="relative w-48 h-48 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-white/20 shadow-2xl"
                  animate={{
                    boxShadow: [
                      `0 0 0 0 ${config.color}40`,
                      `0 0 0 20px ${config.color}00`,
                      `0 0 0 0 ${config.color}40`
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                >
                  {/* Status Light */}
                  <motion.div
                    className="absolute top-6 right-6 w-4 h-4 rounded-full"
                    style={{ backgroundColor: config.color }}
                    animate={{
                      opacity: [config.pulseIntensity, 1, config.pulseIntensity],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Touch Sensors */}
                  <div className="absolute inset-6 rounded-full border border-white/10">
                    <motion.div
                      className="w-full h-full rounded-full bg-gradient-to-br from-white/5 to-transparent"
                      animate={{
                        opacity: podStatus === 'listening' ? [0.1, 0.3, 0.1] : 0.1
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  </div>

                  {/* Center Logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="text-4xl text-white/80"
                      animate={{
                        scale: podStatus === 'processing' ? [1, 1.1, 1] : 1
                      }}
                      transition={{
                        duration: 1,
                        repeat: podStatus === 'processing' ? Infinity : 0
                      }}
                    >
                      W
                    </motion.div>
                  </div>
                </motion.div>

                {/* Pod Case */}
                <motion.div
                  className="w-32 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl mx-auto border border-white/10 shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="flex items-center justify-center h-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                    <span className="text-xs text-white/60">Case</span>
                  </div>
                </motion.div>
              </div>

              {/* Status Message */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={podStatus}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xl text-white/90 text-center mb-4"
                >
                  {config.message}
                </motion.p>
              </AnimatePresence>

              {/* Battery Indicator */}
              <div className="flex items-center space-x-3 text-white/70">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
                </svg>
                <span className="text-sm">{batteryLevel}%</span>
                <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-400 rounded-full"
                    style={{ width: `${batteryLevel}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${batteryLevel}%` }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl text-white mb-2">Wiinta Pod</h2>
                <p className="text-white/60 text-lg">Voice-first, screenless companion</p>
              </div>

              {/* Control Cards */}
              <div className="space-y-4">
                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-white mb-2">Privacy Controls</h3>
                  <p className="text-white/60 text-sm mb-4">Manage data and voice processing</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Voice Recording</span>
                    <motion.div
                      className="w-12 h-6 bg-green-500 rounded-full p-1 cursor-pointer"
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full"
                        animate={{ x: 20 }}
                      />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-white mb-2">Audio Feedback</h3>
                  <p className="text-white/60 text-sm mb-4">Customize response preferences</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Voice Volume</span>
                      <div className="w-24 h-2 bg-white/20 rounded-full">
                        <div className="w-16 h-full bg-blue-400 rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Haptic Feedback</span>
                      <div className="w-12 h-6 bg-blue-500 rounded-full p-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-white mb-2">Voice Models</h3>
                  <p className="text-white/60 text-sm mb-4">Select Wiinta's personality</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-white/20 text-white/90 px-3 py-2 rounded-lg text-sm">
                      Empathetic
                    </button>
                    <button className="bg-white/5 text-white/60 px-3 py-2 rounded-lg text-sm">
                      Professional
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="absolute top-8 left-8">
        <motion.div
          className="flex items-center space-x-2 text-white/70"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span className="text-sm capitalize">{podStatus}</span>
        </motion.div>
      </div>
    </div>
  );
}