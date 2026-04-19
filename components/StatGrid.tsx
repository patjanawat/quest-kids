import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatGridProps {
  completedCount: number;
  totalCount: number;
  xpToday: number;
}

export default function StatGrid({ completedCount, totalCount, xpToday }: Readonly<StatGridProps>) {
  return (
    <View style={styles.row}>
      <StatBox label="ทำแล้ว" value={String(completedCount)} sub="ภารกิจ" valueColor="#185FA5" />
      <StatBox label="ทั้งหมด" value={String(totalCount)} sub="ภารกิจ" valueColor="#2C2C2A" />
      <StatBox label="XP วันนี้" value={String(xpToday)} sub="คะแนน" valueColor="#534AB7" />
    </View>
  );
}

function StatBox({ label, value, sub, valueColor }: { label: string; value: string; sub: string; valueColor: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.sub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, gap: 10 },
  box: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  label: { fontSize: 12, color: '#888780', marginBottom: 4 },
  value: { fontSize: 28, fontWeight: 'bold' },
  sub: { fontSize: 11, color: '#888780', marginTop: 2 },
});
