import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Quest } from '../types';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface QuestCardProps {
  quest: Quest;
  onToggle: (id: string) => void;
}

export default function QuestCard({ quest, onToggle }: QuestCardProps) {
  const progress = useSharedValue(quest.completed ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(quest.completed ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [quest.completed]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.15,
    backgroundColor: Colors.success,
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.lg,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progress.value }],
    opacity: progress.value,
  }));

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onToggle(quest.id)}
      activeOpacity={0.8}
    >
      <Animated.View style={overlayStyle} />
      <View style={styles.row}>
        <Text style={styles.icon}>{quest.icon}</Text>
        <View style={styles.content}>
          <Text style={[styles.title, quest.completed && styles.titleDone]}>
            {quest.title}
          </Text>
          <Text style={styles.description}>{quest.description}</Text>
          <View style={styles.rewardRow}>
            <Text style={styles.rewardIcon}>⏱️</Text>
            <Text style={styles.reward}>+{quest.rewardMinutes} นาที</Text>
          </View>
        </View>
        <Animated.View style={[styles.check, checkStyle]}>
          <Text style={styles.checkText}>✓</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    minHeight: 80,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  icon: {
    fontSize: 36,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSizeLg,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  titleDone: {
    color: Colors.success,
  },
  description: {
    fontSize: Typography.fontSizeSm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardIcon: {
    fontSize: 14,
  },
  reward: {
    fontSize: Typography.fontSizeSm,
    fontWeight: Typography.fontWeightBold,
    color: Colors.primary,
  },
  check: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: Typography.fontWeightBold,
  },
});
