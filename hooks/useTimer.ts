import { useEffect, useRef } from 'react';
import { useQuestStore } from '../store/questStore';

export function useTimer(): void {
  const timerActive = useQuestStore((s) => s.timerActive);
  const tickTimer = useQuestStore((s) => s.tickTimer);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerActive, tickTimer]);
}
