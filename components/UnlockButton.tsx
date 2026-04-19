import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface UnlockButtonProps {
  hasCompleted: boolean;
  hasActiveTimer: boolean;
  pendingApproval: boolean;
  totalEarnedMinutes: number;
  onPress: () => void;
}

export default function UnlockButton({ hasCompleted, hasActiveTimer, pendingApproval, totalEarnedMinutes, onPress }: Readonly<UnlockButtonProps>) {
  if (pendingApproval) {
    return (
      <TouchableOpacity style={styles.pending} disabled>
        <Text style={styles.pendingText}>⏳ รออนุมัติ...</Text>
      </TouchableOpacity>
    );
  }

  const enabled = hasCompleted && !hasActiveTimer;
  return (
    <TouchableOpacity style={[styles.btn, enabled ? styles.enabled : styles.disabled]} onPress={onPress} disabled={!enabled}>
      <Text style={[styles.text, enabled ? styles.textEnabled : styles.textDisabled]}>
        {enabled ? `🔓 ขอปลดล็อก (${totalEarnedMinutes} นาที)` : '🔒 ทำภารกิจก่อนนะ!'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  enabled: { backgroundColor: '#FF8C42' },
  disabled: { backgroundColor: '#E0E0E0' },
  pending: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', backgroundColor: '#FFD4A8' },
  text: { fontSize: 14, fontWeight: '600' },
  textEnabled: { color: '#FFFFFF' },
  textDisabled: { color: '#B4B2A9' },
  pendingText: { fontSize: 14, fontWeight: '600', color: '#D85A30' },
});
