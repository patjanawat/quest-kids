import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TimerProgressBarProps {
  elapsedSeconds: number;
  targetSeconds: number;
}

export default function TimerProgressBar({ elapsedSeconds, targetSeconds }: Readonly<TimerProgressBarProps>) {
  if (targetSeconds <= 0) return <View style={styles.track} />;

  const progress = Math.min(elapsedSeconds / targetSeconds, 1.0);
  const exceeded = elapsedSeconds >= targetSeconds;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${progress * 100}%` }, exceeded && styles.fillGold]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 24 },
  fill: { height: 4, borderRadius: 2, backgroundColor: '#00FF87' },
  fillGold: { backgroundColor: '#FFD700' },
});
