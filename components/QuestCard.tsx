import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Quest } from '../types';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface QuestCardProps {
  quest: Quest;
  onToggle: (id: string) => void;
}

export default function QuestCard({ quest, onToggle }: QuestCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onToggle(quest.id)}
      activeOpacity={0.8}
    >
      {quest.completed && <View style={styles.overlay} />}
      <View style={styles.row}>
        <Text style={styles.icon}>{quest.icon}</Text>
        <View style={styles.content}>
          <Text style={[styles.title, quest.completed && styles.titleDone]}>{quest.title}</Text>
          <Text style={styles.description}>{quest.description}</Text>
          <View style={styles.rewardRow}>
            <Text style={styles.rewardIcon}>⏱️</Text>
            <Text style={styles.reward}>+{quest.rewardMinutes} นาที</Text>
          </View>
        </View>
        {quest.completed && (
          <View style={styles.check}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        )}
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.success,
    opacity: 0.15,
    borderRadius: BorderRadius.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  icon: { fontSize: 36 },
  content: { flex: 1 },
  title: { fontSize: Typography.fontSizeLg, fontWeight: Typography.fontWeightBold, color: Colors.textPrimary, marginBottom: 2 },
  titleDone: { color: Colors.success },
  description: { fontSize: Typography.fontSizeSm, color: Colors.textSecondary, marginBottom: 4 },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rewardIcon: { fontSize: 14 },
  reward: { fontSize: Typography.fontSizeSm, fontWeight: Typography.fontWeightBold, color: Colors.primary },
  check: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: Colors.white, fontSize: 20, fontWeight: Typography.fontWeightBold },
});
