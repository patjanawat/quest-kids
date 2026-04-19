import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Quest } from '../types';

interface QuestContextProps {
  quest: Quest | null;
}

export default function QuestContext({ quest }: Readonly<QuestContextProps>) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{quest?.icon ?? '⏱'}</Text>
      </View>
      <Text style={[styles.title, !quest && styles.titleGeneric]}>
        {quest?.title ?? 'จับเวลาอิสระ'}
      </Text>
      {quest?.description ? (
        <Text style={styles.description} numberOfLines={1}>{quest.description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 24 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,255,135,0.1)', borderWidth: 1.5, borderColor: 'rgba(0,255,135,0.3)', alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 40 },
  title: { fontSize: 16, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 10 },
  titleGeneric: { color: 'rgba(255,255,255,0.5)' },
  description: { fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 4 },
});
