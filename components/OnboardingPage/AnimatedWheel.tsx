import Wheel from '@/components/MeditationPage/Wheel';
import React, { useEffect, useState } from 'react';

interface AnimatedWheelProps {
  size: number;
  label: string;
  colors: [string, string];
  startTime: number; // Starting seconds
  total: number;
}

const AnimatedWheel = ({ size, label, colors, startTime, total }: AnimatedWheelProps) => {
  const [remaining, setRemaining] = useState(startTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 0) {
          // Reset to start time when it reaches 0
          return startTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <Wheel 
      size={size}
      label={label}
      remaining={remaining}
      total={total}
      state="active"
      colors={colors}
    />
  );
};

export default AnimatedWheel;
