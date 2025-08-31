import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface WaveformProps {
  isActive?: boolean;
  emotion?: 'calm' | 'excited' | 'focused' | 'empathetic' | 'confused';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const emotionColors = {
  calm: ['#E6E6FA', '#DDA0DD', '#E6E6FA'], // Lavender tones
  excited: ['#FF69B4', '#FF1493', '#FF69B4'], // Pink/Magenta
  focused: ['#4169E1', '#6495ED', '#4169E1'], // Blue tones
  empathetic: ['#FFB6C1', '#FFC0CB', '#FFB6C1'], // Blush/Pink
  confused: ['#A9A9A9', '#D3D3D3', '#A9A9A9'] // Gray tones
};

export function Waveform({ isActive = false, emotion = 'calm', size = 'medium', className = '' }: WaveformProps) {
  const [bars, setBars] = useState<number[]>([]);
  
  const barCount = size === 'small' ? 20 : size === 'medium' ? 40 : 60;
  const colors = emotionColors[emotion];

  useEffect(() => {
    const generateBars = () => {
      const newBars = Array.from({ length: barCount }, () => 
        isActive ? Math.random() * 100 + 10 : 10 + Math.random() * 20
      );
      setBars(newBars);
    };

    generateBars();
    const interval = isActive ? setInterval(generateBars, 150) : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, barCount]);

  const maxHeight = size === 'small' ? 40 : size === 'medium' ? 80 : 120;

  return (
    <div className={`flex items-end justify-center gap-1 ${className}`}>
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className="rounded-full"
          style={{
            background: `linear-gradient(to top, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
            width: size === 'small' ? '2px' : size === 'medium' ? '3px' : '4px',
          }}
          animate={{
            height: (height / 100) * maxHeight,
            opacity: isActive ? 0.8 + (height / 100) * 0.2 : 0.4
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}