import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Quest } from '../types';
import { CATEGORY_COLORS } from '../constants/questLibrary';
import { QUEST_LIBRARY } from '../constants/questLibrary';

interface QuestManageCardProps {
  quest: Quest;
  onRemove: (id: string) => void;
}

export default function QuestManageCard({ quest, onRemove }: Readonly<QuestManageCardProps>) {
  const libraryItem = QUEST_LIBRARY.find((q) => q.id === quest.libraryId);
  const category = libraryItem?.category ?? 'chores';
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.chores;

  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: colors.bg }]}>
        <Text style={styles.iconEmoji}>{quest.icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{quest.title}</Text>
        <Text style={styles.description} numberOfLines={1}>{quest.description}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{quest.xpReward} XP</Text>
          </View>
          <View style={styles.minBadge}>
            <Text style={styles.minText}>+{quest.rewardMinutes} นาที</Text>
          </View>
        </View>
      </View>

      {quest.isMandatory ? (
        <View style={styles.mandatoryDot} />
      ) : (
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onRemove(quest.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 22 },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: '#2C2C2A' },
  description: { fontSize: 12, color: '#888780', marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  xpBadge: { backgroundColor: '#534AB7', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  xpText: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  minBadge: { backgroundColor: '#EEF5FC', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  minText: { fontSize: 11, color: '#185FA5' },
  mandatoryDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E24B4A' },
  deleteBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  deleteIcon: { fontSize: 16, color: '#888780' },
});
