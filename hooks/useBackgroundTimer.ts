import { useState, useRef, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type TimerStatus = 'idle' | 'running' | 'paused' | 'stopped';

interface UseBackgroundTimerReturn {
  elapsedSeconds: number;
  centiseconds: number;
  status: TimerStatus;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

export function useBackgroundTimer(): UseBackgroundTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [centiseconds, setCentiseconds] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('idle');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const csIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const backgroundAtRef = useRef<number | null>(null);
  const statusRef = useRef<TimerStatus>('idle');

  // keep statusRef in sync so AppState listener can read current value
  useEffect(() => { statusRef.current = status; }, [status]);

  const clearIntervals = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (csIntervalRef.current) { clearInterval(csIntervalRef.current); csIntervalRef.current = null; }
  }, []);

  const startIntervals = useCallback(() => {
    intervalRef.current = setInterval(() => setElapsedSeconds((p) => p + 1), 1000);
    csIntervalRef.current = setInterval(() => setCentiseconds((p) => (p + 1) % 100), 100);
  }, []);

  // AppState: track background/foreground transitions
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        if (statusRef.current === 'running') {
          backgroundAtRef.current = Date.now();
          clearIntervals();
        }
      } else if (nextState === 'active') {
        if (statusRef.current === 'running' && backgroundAtRef.current !== null) {
          const diffSeconds = Math.floor((Date.now() - backgroundAtRef.current) / 1000);
          backgroundAtRef.current = null;
          setElapsedSeconds((p) => p + diffSeconds);
          startIntervals();
        }
      }
    });
    return () => sub.remove();
  }, [clearIntervals, startIntervals]);

  // cleanup on unmount
  useEffect(() => () => clearIntervals(), [clearIntervals]);

  const start = useCallback(() => {
    setStatus('running');
    startIntervals();
  }, [startIntervals]);

  const pause = useCallback(() => {
    clearIntervals();
    setStatus('paused');
  }, [clearIntervals]);

  const resume = useCallback(() => {
    setStatus('running');
    startIntervals();
  }, [startIntervals]);

  const stop = useCallback(() => {
    clearIntervals();
    setStatus('stopped');
  }, [clearIntervals]);

  const reset = useCallback(() => {
    clearIntervals();
    backgroundAtRef.current = null;
    setElapsedSeconds(0);
    setCentiseconds(0);
    setStatus('idle');
  }, [clearIntervals]);

  return { elapsedSeconds, centiseconds, status, start, pause, resume, stop, reset };
}
