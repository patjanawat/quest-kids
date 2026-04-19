import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../../store/questStore';
import { QUEST_LIBRARY, CATEGORY_COLORS } from '../../constants/questLibrary';
import { QuestCategory } from '../../types';

const CATEGORY_LABELS: Record<QuestCategory, string> = {
  education: 'การเรียน',
  exercise: 'ออกกำลังกาย',
  chores: 'งานบ้าน',
  reading: 'การอ่าน',
  social: 'สังคม',
  health: 'สุขภาพ',
  creativity: 'ความคิดสร้างสรรค์',
};

export default function LibraryScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const existingLibraryIds = useQuestStore((s) => new Set(s.quests.map((q) => q.libraryId).filter(Boolean)));
  const addQuestsFromLibrary = useQuestStore((s) => s.addQuestsFromLibrary);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    addQuestsFromLibrary([...selected]);
    router.back();
  }

  const optional = QUEST_LIBRARY.filter((q) => !q.isMandatory);

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← กลับ</Text>
        </TouchableOpacity>
        <Text style={styles.title}>คลังภารกิจ 📚</Text>
        <Text style={styles.subtitle}>เลือกภารกิจที่ต้องการเพิ่ม</Text>
      </SafeAreaView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {optional.map((item) => {
          const isSelected = selected.has(item.id);
          const alreadyAdded = existingLibraryIds.has(item.id);
          const colors = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.chores;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, isSelected && styles.cardSelected, alreadyAdded && styles.cardAdded]}
              onPress={() => !alreadyAdded && toggleSelect(item.id)}
              disabled={alreadyAdded}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: colors.bg }]}>
                <Text style={styles.iconEmoji}>{item.icon}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc} numberOfLines={1}>{item.description}</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={[styles.categoryText, { color: colors.icon }]}>{CATEGORY_LABELS[item.category]}</Text>
                  </View>
                  <Text style={styles.xpText}>+{item.defaultXpReward} XP</Text>
                </View>
              </View>
              {alreadyAdded ? (
                <Text style={styles.addedText}>เพิ่มแล้ว</Text>
              ) : (
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, selected.size === 0 && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={selected.size === 0}
        >
          <Text style={styles.confirmBtnText}>
            {selected.size > 0 ? `✓ เพิ่ม ${selected.size} ภารกิจ` : 'เลือกภารกิจที่ต้องการ'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { backgroundColor: '#185FA5', paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { marginBottom: 8 },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 8 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, borderWidth: 1.5, borderColor: 'transparent', elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  cardSelected: { borderColor: '#185FA5', backgroundColor: '#EEF5FC' },
  cardAdded: { opacity: 0.5 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 22 },
  content: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: '#2C2C2A' },
  itemDesc: { fontSize: 12, color: '#888780', marginTop: 2 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  categoryBadge: { backgroundColor: '#F0F0F0', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  categoryText: { fontSize: 10, fontWeight: '600' },
  xpText: { fontSize: 11, color: '#534AB7', fontWeight: '600' },
  addedText: { fontSize: 12, color: '#888780' },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#B4B2A9', alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: '#185FA5', borderColor: '#185FA5' },
  checkmark: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  footer: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEF5FC', paddingHorizontal: 16, paddingVertical: 12 },
  confirmBtn: { backgroundColor: '#185FA5', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: '#B4B2A9' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
