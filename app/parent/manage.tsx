import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../../store/questStore';
import QuestManageCard from '../../components/QuestManageCard';
import ParentTabBar from '../../components/ParentTabBar';

export default function ManageScreen() {
  const router = useRouter();
  const [toast, setToast] = useState('');

  const quests = useQuestStore((s) => s.quests);
  const randomizeQuests = useQuestStore((s) => s.randomizeQuests);
  const removeQuest = useQuestStore((s) => s.removeQuest);
  const saveQuestsForKid = useQuestStore((s) => s.saveQuestsForKid);

  const hasActiveTimer = useQuestStore((s) => s.timerActive && s.activeQuestId !== null);
  const completedCount = quests.filter((q) => q.completed).length;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  function handleRandomize() {
    if (completedCount > 0) {
      Alert.alert(
        'สุ่มภารกิจใหม่',
        'การสุ่มจะ reset ภารกิจที่ทำไปแล้ว ต้องการดำเนินการต่อหรือไม่?',
        [
          { text: 'ยกเลิก', style: 'cancel' },
          { text: 'ดำเนินการ', onPress: () => { randomizeQuests(); showToast('สุ่มภารกิจแล้ว! 9 ภารกิจ'); } },
        ]
      );
    } else {
      randomizeQuests();
      showToast('สุ่มภารกิจแล้ว! 9 ภารกิจ');
    }
  }

  function handleClearAll() {
    Alert.alert(
      'ล้างทั้งหมด',
      'ต้องการล้างภารกิจทั้งหมดใช่ไหม?\n(mandatory จะยังคงอยู่)',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ล้าง',
          style: 'destructive',
          onPress: () => {
            quests.filter((q) => !q.isMandatory).forEach((q) => removeQuest(q.id));
          },
        },
      ]
    );
  }

  function handleSave() {
    saveQuestsForKid();
    Alert.alert('✓ ส่งภารกิจแล้ว', `ส่งภารกิจให้ลูกแล้ว! ${quests.length} ภารกิจ`, [
      { text: 'ตกลง', onPress: () => router.push('/parent') },
    ]);
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.title}>จัดการภารกิจ 🗂️</Text>
        <Text style={styles.subtitle}>สุ่ม / เลือกจากคลัง</Text>
      </SafeAreaView>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.randomBtn} onPress={handleRandomize}>
          <Text style={styles.randomBtnText}>🔀 สุ่มภารกิจ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.libraryBtn} onPress={() => router.push('/parent/library')}>
          <Text style={styles.libraryBtnText}>📚 เลือกเอง</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>ภารกิจวันนี้</Text>
        <View style={styles.listRight}>
          <Text style={styles.listCount}>{quests.length} รายการ</Text>
          <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
            <Text style={styles.clearText}>ล้างทั้งหมด</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {quests.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>ยังไม่มีภารกิจ</Text>
            <Text style={styles.emptySub}>กด 'สุ่มภารกิจ' หรือ 'เลือกเอง' เพื่อเพิ่มภารกิจ</Text>
          </View>
        ) : (
          <View style={styles.questList}>
            {quests.map((quest) => (
              <QuestManageCard key={quest.id} quest={quest} onRemove={removeQuest} />
            ))}
          </View>
        )}
      </ScrollView>

      {toast !== '' && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      <View style={styles.saveArea}>
        <TouchableOpacity
          style={[styles.saveBtn, quests.length === 0 && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={quests.length === 0}
        >
          <Text style={styles.saveBtnText}>✓ บันทึกและส่งให้ลูก</Text>
        </TouchableOpacity>
      </View>

      <ParentTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { backgroundColor: '#185FA5', paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 16 },
  randomBtn: { flex: 1, backgroundColor: '#185FA5', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  randomBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  libraryBtn: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#185FA5', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  libraryBtnText: { color: '#185FA5', fontSize: 14, fontWeight: '600' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginTop: 20, marginBottom: 8 },
  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C2C2A' },
  listRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  listCount: { fontSize: 13, color: '#888780' },
  clearBtn: { paddingHorizontal: 4 },
  clearText: { fontSize: 12, color: '#E24B4A', textDecorationLine: 'underline' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  questList: { gap: 8 },
  empty: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 16, color: '#888780', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#B4B2A9', textAlign: 'center', marginTop: 6 },
  toast: { position: 'absolute', bottom: 140, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 },
  toastText: { color: '#FFFFFF', fontSize: 14 },
  saveArea: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEF5FC', paddingHorizontal: 16, paddingVertical: 12 },
  saveBtn: { backgroundColor: '#185FA5', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  saveBtnDisabled: { backgroundColor: '#B4B2A9' },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
