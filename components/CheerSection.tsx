import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CHEER_PRESETS } from '../constants/cheerPresets';

interface CheerSectionProps {
  onSend: (text: string, emoji: string) => void;
}

export default function CheerSection({ onSend }: Readonly<CheerSectionProps>) {
  const [sentId, setSentId] = useState<string | null>(null);

  function handlePress(id: string, text: string, emoji: string) {
    if (sentId) return;
    onSend(text, emoji);
    setSentId(id);
    setTimeout(() => setSentId(null), 2000);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>ส่งกำลังใจให้ลูก 💬</Text>
      <View style={styles.list}>
        {CHEER_PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={styles.cheerBtn}
            onPress={() => handlePress(preset.id, preset.text, preset.emoji)}
            disabled={sentId !== null}
            activeOpacity={0.7}
          >
            {sentId === preset.id ? (
              <Text style={styles.sentText}>✓ ส่งให้ลูกแล้ว!</Text>
            ) : (
              <>
                <Text style={styles.cheerEmoji}>{preset.emoji}</Text>
                <Text style={[styles.cheerText, sentId !== null && styles.cheerTextDisabled]}>
                  {preset.text}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 16, marginTop: 10, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  title: { fontSize: 15, fontWeight: 'bold', color: '#2C2C2A', marginBottom: 12 },
  list: { gap: 8 },
  cheerBtn: { backgroundColor: '#EEF5FC', borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cheerEmoji: { fontSize: 18 },
  cheerText: { fontSize: 13, color: '#185FA5', flex: 1 },
  cheerTextDisabled: { opacity: 0.5 },
  sentText: { fontSize: 13, color: '#3B6D11', fontWeight: '600' },
});
