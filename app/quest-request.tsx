import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../store/questStore';
import { QUEST_LIBRARY } from '../constants/questLibrary';
import QuestRequestItem from '../components/QuestRequestItem';

export default function QuestRequestScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const quests = useQuestStore((s) => s.quests);
  const submitQuestRequest = useQuestStore((s) => s.submitQuestRequest);

  const todayLibraryIds = quests.map((q) => q.libraryId).filter(Boolean) as string[];
  const availableQuests = QUEST_LIBRARY.filter((item) => !todayLibraryIds.includes(item.id));
  const isMaxSelected = selected.length >= 3;
  const canSubmit = selected.length > 0;

  function handleToggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    submitQuestRequest(selected);
    router.back();
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>ขอภารกิจเพิ่ม ➕</Text>
            <Text style={styles.subtitle}>เลือกภารกิจที่อยากทำเพิ่มวันนี้</Text>
          </View>
          {selected.length > 0 && (
            <View style={styles.counter}>
              <Text style={styles.counterText}>เลือก {selected.length}/3</Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* Info bar */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>เลือกได้สูงสุด 3 ข้อ · พ่อแม่จะอนุมัติก่อนนะ</Text>
      </View>

      {/* Quest list */}
      {availableQuests.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={styles.emptyText}>ทำภารกิจครบทุกอันแล้ว!</Text>
          <Text style={styles.emptySub}>ไม่มีภารกิจเพิ่มเติมในคลัง</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {availableQuests.map((item) => (
            <QuestRequestItem
              key={item.id}
              item={item}
              selected={selected.includes(item.id)}
              disabled={isMaxSelected && !selected.includes(item.id)}
              onToggle={handleToggle}
            />
          ))}
        </ScrollView>
      )}

      {/* Submit button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
          activeOpacity={0.85}
        >
          <Text style={[styles.submitBtnText, !canSubmit && styles.submitBtnTextDisabled]}>
            {canSubmit ? `📨 ส่งให้พ่อแม่ (${selected.length} ภารกิจ)` : '📨 ส่งให้พ่อแม่'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F3FF' },
  header: { backgroundColor: '#534AB7' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 20, color: '#FFFFFF' },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  counter: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4 },
  counterText: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  infoBar: { backgroundColor: '#3C3489', paddingHorizontal: 20, paddingVertical: 10 },
  infoText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 8, paddingBottom: 100 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyIcon: { fontSize: 56 },
  emptyText: { fontSize: 16, color: '#888780', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#B4B2A9', textAlign: 'center', marginTop: 6 },
  footer: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E8E6F8', paddingHorizontal: 16, paddingVertical: 12 },
  submitBtn: { backgroundColor: '#534AB7', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: '#C4BAEF' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  submitBtnTextDisabled: { color: 'rgba(255,255,255,0.6)' },
});
