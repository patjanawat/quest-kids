import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../store/questStore';
import { useTimer } from '../hooks/useTimer';
import TimerBar from '../components/TimerBar';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

export default function RewardsScreen() {
  const router = useRouter();
  useTimer();

  const timerActive = useQuestStore((s) => s.timerActive);
  const timerRemainingSeconds = useQuestStore((s) => s.timerRemainingSeconds);
  const totalEarnedMinutes = useQuestStore((s) => s.totalEarnedMinutes);
  const stopTimer = useQuestStore((s) => s.stopTimer);

  const totalSeconds = totalEarnedMinutes * 60;
  const isTimeUp = !timerActive && timerRemainingSeconds === 0;

  const celebrateScale = useSharedValue(0);
  const celebrateRotate = useSharedValue(0);

  useEffect(() => {
    celebrateScale.value = withSpring(1, { damping: 8, stiffness: 150 });
    celebrateRotate.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: 150 }),
        withTiming(-0.05, { duration: 150 }),
        withTiming(0, { duration: 150 })
      ),
      3,
      false
    );
  }, []);

  const celebrateStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: celebrateScale.value },
      { rotate: `${celebrateRotate.value}rad` },
    ],
  }));

  function handleStop() {
    stopTimer();
    router.back();
  }

  function handleDone() {
    router.back();
  }

  const minutes = Math.floor(timerRemainingSeconds / 60);
  const seconds = timerRemainingSeconds % 60;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← กลับ</Text>
        </TouchableOpacity>

        <Animated.View style={[styles.heroArea, celebrateStyle]}>
          <Text style={styles.heroEmoji}>🎮</Text>
          <Text style={styles.heroTitle}>กำลังเล่นอยู่!</Text>
          <Text style={styles.heroSubtitle}>สนุกได้เลย แต่อย่าลืมเวลานะ 😊</Text>
        </Animated.View>

        <View style={styles.timeDisplay}>
          <Text style={styles.timeLabel}>เวลาที่เหลือ</Text>
          <Text style={[styles.timeBig, timerRemainingSeconds < 300 && styles.timeBigLow]}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </Text>
        </View>

        <TimerBar
          remainingSeconds={timerRemainingSeconds}
          totalSeconds={totalSeconds}
        />

        <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
          <Text style={styles.stopBtnText}>⏹️ หยุดก่อน</Text>
        </TouchableOpacity>
      </View>

      {/* Time's Up Modal */}
      <Modal visible={isTimeUp} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🌟</Text>
            <Text style={styles.modalTitle}>หมดเวลาแล้ว!</Text>
            <Text style={styles.modalMessage}>
              เก่งมากเลย! พักสายตาสักครู่{'\n'}แล้วค่อยทำภารกิจต่อนะ 💪
            </Text>
            <TouchableOpacity style={styles.modalBtn} onPress={handleDone}>
              <Text style={styles.modalBtnText}>ตกลง 😊</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeightMedium,
  },
  heroArea: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: Typography.fontSizeXxl,
    fontWeight: Typography.fontWeightExtraBold,
    color: Colors.textPrimary,
  },
  heroSubtitle: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  timeDisplay: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  timeBig: {
    fontSize: Typography.fontSizeDisplay,
    fontWeight: Typography.fontWeightExtraBold,
    color: Colors.success,
  },
  timeBigLow: {
    color: Colors.error,
  },
  stopBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: 'auto',
  },
  stopBtnText: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeightBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  modalEmoji: {
    fontSize: 64,
  },
  modalTitle: {
    fontSize: Typography.fontSizeXxl,
    fontWeight: Typography.fontWeightExtraBold,
    color: Colors.textPrimary,
  },
  modalMessage: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  modalBtnText: {
    fontSize: Typography.fontSizeLg,
    fontWeight: Typography.fontWeightBold,
    color: Colors.white,
  },
});
