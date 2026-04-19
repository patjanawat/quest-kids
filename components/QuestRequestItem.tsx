import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QuestLibraryItem } from '../types';
import { CATEGORY_COLORS } from '../constants/questLibrary';

interface QuestRequestItemProps {
  item: QuestLibraryItem;
  selected: boolean;
  disabled: boolean;
  onToggle: (id: string) => void;
}

export default function QuestRequestItem({ item, selected, disabled, onToggle }: Readonly<QuestRequestItemProps>) {
  const colors = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.chores;

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected, disabled && styles.cardDisabled]}
      onPress={() => onToggle(item.id)}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.bg }]}>
        <Text style={styles.iconEmoji}>{item.icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{item.defaultXpReward} XP</Text>
          </View>
          <View style={styles.minBadge}>
            <Text style={styles.minText}>+{item.defaultRewardMinutes} นาที</Text>
          </View>
        </View>
      </View>

      {selected && (
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: 'transparent', elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  cardSelected: { backgroundColor: '#FFF0E6', borderColor: '#FF8C42', elevation: 2 },
  cardDisabled: { backgroundColor: '#F5F3FF', opacity: 0.5 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 24 },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', color: '#2C2C2A' },
  description: { fontSize: 12, color: '#888780', marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  xpBadge: { backgroundColor: '#534AB7', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  xpText: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  minBadge: { backgroundColor: '#EEF5FC', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  minText: { fontSize: 11, color: '#185FA5' },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FF8C42', alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
});
