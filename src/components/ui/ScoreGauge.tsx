'use client';

import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { getScoreColor } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function ScoreGauge({ score, size = 200, strokeWidth = 10 }: ScoreGaugeProps) {
  const [mounted, setMounted] = useState(false);
  const motionValue = useMotionValue(0);
  const displayScore = useTransform(motionValue, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || hasAnimated.current) return;
    hasAnimated.current = true;

    const normalizedScore = Math.min(100, Math.max(0, score));
    const controls = animate(motionValue, normalizedScore, {
      duration: 1.5,
      ease: [0.25, 0.1, 0.25, 1],
    });

    const unsubscribe = displayScore.on('change', (v) => {
      setDisplayValue(Math.round(v));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [mounted, score, motionValue, displayScore]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const dashOffset = circumference - (normalizedScore / 100) * circumference;

  const color = getScoreColor(normalizedScore);

  if (!mounted) {
    return <div style={{ width: size, height: size }} className="rounded-full bg-[#111] animate-pulse" />;
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Radial gradient backdrop for depth */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`,
        }}
      />

      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1A1A1A"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Glow layer */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth + 6}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ opacity: 0.15, filter: 'blur(6px)' }}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-5xl font-bold tracking-tight text-white font-mono"
        >
          {displayValue}
        </motion.span>
        <span className="text-[10px] text-[#71717A] uppercase tracking-widest mt-1 font-medium">
          Score
        </span>
      </div>
    </div>
  );
}
