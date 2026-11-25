import { animate, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

interface AnimatedMetricValueProps {
  value: number;
  decimals?: number;
  duration?: number;
}

/**
 * Smoothly counts from 0 to the exact measured metric value without altering
 * underlying precision. Respects prefers-reduced-motion.
 */
export function AnimatedMetricValue({
  value,
  decimals = 1,
  duration = 0.65,
}: AnimatedMetricValueProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(
    prefersReducedMotion ? value : 0
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
      onComplete: () => {
        setDisplayValue(value);
      },
    });

    return () => {
      controls.stop();
    };
  }, [value, duration, prefersReducedMotion]);

  return <>{displayValue.toFixed(decimals)}</>;
}
