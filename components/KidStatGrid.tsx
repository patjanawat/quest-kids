import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface KidStatGridProps {
  totalEarnedMinutes: number;
  completedCount: number;
  streakDays: number;
}

export default function KidStatGrid({ totalEarnedMinutes, completedCount, streakDays }: Readonly<KidStatGridProps>) {
  return (
    <View style={styles.row}>
      <StatBox icon="⏱️" value={String(totalEarnedMinutes)} label="นาที" valueColor="#FF8C42" />
      <StatBox icon="✅" value={String(completedCount)} label="เสร็จแล้ว" valueColor="#3B6D11" />
      <StatBox icon="🔥" value={String(streakDays)} label="วันติดต่อกัน" valueColor="#1D9E75" />
    </View>
  );
}

function StatBox({ icon, value, label, valueColor }: { icon: string; value: string; label: string; valueColor: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginHorizontal: 16, marginTop: 12, gap: 10 },
  box: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  icon: { fontSize: 18, marginBottom: 4 },
  value: { fontSize: 24, fontWeight: 'bold' },
  label: { fontSize: 11, color: '#888780', marginTop: 2 },
});
