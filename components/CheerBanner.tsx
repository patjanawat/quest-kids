import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheerMessage } from '../types';

interface CheerBannerProps {
  cheer: CheerMessage;
  onRead: () => void;
}

export default function CheerBanner({ cheer, onRead }: Readonly<CheerBannerProps>) {
  useEffect(() => {
    onRead();
  }, [cheer.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.bubbleIcon}>💬</Text>
      <View style={styles.textCol}>
        <Text style={styles.label}>ข้อความจากพ่อแม่</Text>
        <Text style={styles.text}>{cheer.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#EAF3DE', borderWidth: 1.5, borderColor: '#97C459', borderRadius: 12, marginHorizontal: 16, marginTop: 10, padding: 14 },
  bubbleIcon: { fontSize: 22 },
  textCol: { flex: 1 },
  label: { fontSize: 11, color: '#3B6D11', fontWeight: '600' },
  text: { fontSize: 14, color: '#2C2C2A' },
});
