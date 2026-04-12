import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface TimerBarProps {
  remainingSeconds: number;
  totalSeconds: number;
}

export default function TimerBar({ remainingSeconds, totalSeconds }: Readonly<TimerBarProps>) {
  const progress = useSharedValue(1);
  const pulse = useSharedValue(1);

  const isLow = remainingSeconds < 300; // < 5 minutes
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  useEffect(() => {
    const ratio = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
    progress.value = withTiming(ratio, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });
  }, [remainingSeconds, totalSeconds]);

  useEffect(() => {
    if (isLow) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      pulse.value = withTiming(1);
    }
  }, [isLow]);

  const barStyle = useAnimatedStyle(() => ({
    flex: progress.value,
    backgroundColor: isLow ? Colors.error : Colors.success,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text style={styles.label}>เวลาที่เหลือ</Text>
        <Text style={[styles.time, isLow && styles.timeLow]}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, barStyle]} />
        <View style={styles.barRemainder} />
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
    flexDirection: 'row',
  },
  bar: {
    height: 16,
    borderRadius: BorderRadius.round,
  },
  barRemainder: {
    flex: 1,
  },
  warning: {
    marginTop: Spacing.sm,
    fontSize: Typography.fontSizeMd,
    color: Colors.error,
    fontWeight: Typography.fontWeightBold,
    textAlign: 'center',
  },
});
