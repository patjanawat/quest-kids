import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ApprovalCardProps {
  completedCount: number;
  totalEarnedMinutes: number;
  onApprove: () => void;
  onDeny: () => void;
}

export default function ApprovalCard({ completedCount, totalEarnedMinutes, onApprove, onDeny }: Readonly<ApprovalCardProps>) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.bell}>🔔</Text>
        <View style={styles.textCol}>
          <Text style={styles.title}>ลูกขอปลดล็อกเวลาเล่น!</Text>
          <Text style={styles.sub}>ทำ {completedCount} ภารกิจ — ได้ {totalEarnedMinutes} นาที</Text>
        </View>
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.approveBtn} onPress={onApprove}>
          <Text style={styles.approveBtnText}>อนุมัติ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.denyBtn} onPress={onDeny}>
          <Text style={styles.denyBtnText}>ปฏิเสธ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FCEBEB', borderWidth: 1.5, borderColor: '#F09595', borderRadius: 12, marginHorizontal: 16, marginTop: 10, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bell: { fontSize: 24 },
  textCol: { flex: 1 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#2C2C2A' },
  sub: { fontSize: 13, color: '#888780', marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  approveBtn: { flex: 1, backgroundColor: '#185FA5', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  approveBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  denyBtn: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#F09595', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  denyBtnText: { color: '#E24B4A', fontSize: 14, fontWeight: '600' },
});
