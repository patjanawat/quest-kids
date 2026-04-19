import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface RewardBadgeProps {
  totalMinutes: number;
}

export default function RewardBadge({ totalMinutes }: Readonly<RewardBadgeProps>) {
  return (
    <View style={styles.badge}>
      <Text style={styles.icon}>⭐</Text>
      <View style={styles.info}>
        <Text style={styles.label}>เวลาที่ได้รับวันนี้</Text>
        <Text style={styles.minutes}>
          {totalMinutes} <Text style={styles.unit}>นาที</Text>
        </Text>
      </View>
      <Text style={styles.coin}>🪙</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: { fontSize: 32 },
  info: { flex: 1 },
  label: { fontSize: Typography.fontSizeSm, color: Colors.white, opacity: 0.85 },
  minutes: { fontSize: Typography.fontSizeXxl, fontWeight: Typography.fontWeightExtraBold, color: Colors.white },
  unit: { fontSize: Typography.fontSizeLg, fontWeight: Typography.fontWeightRegular },
  coin: { fontSize: 32 },
});
