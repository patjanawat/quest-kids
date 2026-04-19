import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DigitalClockProps {
  elapsedSeconds: number;
  centiseconds: number;
}

export default function DigitalClock({ elapsedSeconds, centiseconds }: Readonly<DigitalClockProps>) {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const cs = String(centiseconds).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.clock}>{mm}:{ss}</Text>
      <Text style={styles.centiseconds}>{cs}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  clock: {
    fontFamily: 'Courier New',
    fontSize: 80,
    fontWeight: 'bold',
    color: '#00FF87',
    letterSpacing: 4,
    textShadowColor: '#00FF87',
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
  },
  centiseconds: {
    fontFamily: 'Courier New',
    fontSize: 28,
    color: 'rgba(0,255,135,0.4)',
    marginTop: 4,
    letterSpacing: 2,
  },
});
