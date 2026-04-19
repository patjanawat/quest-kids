import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QuestRequest } from '../types';
import { QUEST_LIBRARY } from '../constants/questLibrary';

interface QuestRequestCardProps {
  request: QuestRequest;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

export default function QuestRequestCard({ request, onApprove, onDeny }: Readonly<QuestRequestCardProps>) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>➕</Text>
        <Text style={styles.headerText}>ลูกขอภารกิจเพิ่ม!</Text>
      </View>
      <View style={styles.questList}>
        {request.libraryIds.map((id) => {
          const item = QUEST_LIBRARY.find((q) => q.id === id);
          if (!item) return null;
          return (
            <View key={id} style={styles.questRow}>
              <Text style={styles.questIcon}>{item.icon}</Text>
              <Text style={styles.questTitle}>{item.title}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.approveBtn} onPress={() => onApprove(request.id)}>
          <Text style={styles.approveBtnText}>อนุมัติ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.denyBtn} onPress={() => onDeny(request.id)}>
          <Text style={styles.denyBtnText}>ไม่อนุมัติ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#F5F3FF', borderWidth: 1.5, borderColor: '#C4BAEF', borderRadius: 12, marginHorizontal: 16, marginTop: 10, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: { fontSize: 24 },
  headerText: { fontSize: 15, fontWeight: 'bold', color: '#534AB7' },
  questList: { marginTop: 10, gap: 6 },
  questRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  questIcon: { fontSize: 16 },
  questTitle: { fontSize: 13, color: '#2C2C2A' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  approveBtn: { flex: 1, backgroundColor: '#534AB7', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  approveBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  denyBtn: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#C4BAEF', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  denyBtnText: { color: '#534AB7', fontSize: 14, fontWeight: '600' },
});
