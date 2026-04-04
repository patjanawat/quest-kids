import { useEffect } from 'react';
import { AppState as RNAppState } from 'react-native';
import { useQuestStore } from '../store/questStore';

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useDailyReset(): void {
  const lastResetDate = useQuestStore((s) => s.lastResetDate);
  const resetDaily = useQuestStore((s) => s.resetDaily);

  useEffect(() => {
    function checkAndReset() {
      const today = todayString();
      if (lastResetDate !== today) {
        resetDaily();
      }
    }

    checkAndReset();

    const subscription = RNAppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkAndReset();
      }
    });

    return () => subscription.remove();
  }, [lastResetDate, resetDaily]);
}
