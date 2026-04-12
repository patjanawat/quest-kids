import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface TimerBarProps {
  remainingSeconds: number;
  totalSeconds: number;
}

export default function TimerBar({ remainingSeconds, totalSeconds }: Readonly<TimerBarProps>) {
  const progress = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const isLow = remainingSeconds < 300;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  useEffect(() => {
    const ratio = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
    Animated.timing(progress, {
      toValue: ratio,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [remainingSeconds, totalSeconds]);

  useEffect(() => {
    if (isLow) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.05, duration: 500, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulse.stopAnimation();
      Animated.timing(pulse, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [isLow]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const barColor = isLow ? Colors.error : Colors.success;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulse }] }]}>
      <View style={styles.header}>
        <Text style={styles.label}>เวลาที่เหลือ</Text>
        <Text style={[styles.time, isLow && styles.timeLow]}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, { width: barWidth, backgroundColor: barColor }]} />
      </View>
      {isLow && (
        <Text style={styles.warning}>⚠️ เวลาใกล้หมดแล้ว!</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeightMedium,
  },
  time: {
    fontSize: Typography.fontSizeXxl,
    fontWeight: Typography.fontWeightExtraBold,
    color: Colors.success,
  },
  timeLow: {
    color: Colors.error,
  },
  track: {
    height: 16,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
  },
  bar: {
    height: 16,
    borderRadius: BorderRadius.round,
  },
  warning: {
    marginTop: Spacing.sm,
    fontSize: Typography.fontSizeMd,
    color: Colors.error,
    fontWeight: Typography.fontWeightBold,
    textAlign: 'center',
  },
});
