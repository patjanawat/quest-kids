import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Quest } from '../types';

type QuestCardState = 'normal' | 'running' | 'locked' | 'done';

interface QuestCardProps {
  quest: Quest;
  cardState: QuestCardState;
  onTimerPress: (questId: string) => void;
}

export default function QuestCard({ quest, cardState, onTimerPress }: Readonly<QuestCardProps>) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (cardState === 'running') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.1, duration: 500, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1.0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }
  }, [cardState]);

  const isDone = cardState === 'done';
  const isLocked = cardState === 'locked';
  const isRunning = cardState === 'running';

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconEmoji}>{quest.icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{quest.title}</Text>
        <Text style={styles.description} numberOfLines={1}>{quest.description}</Text>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{quest.xpReward} XP</Text>
        </View>
      </View>

      {!isDone && (
        <View style={styles.timerCol}>
          <TouchableOpacity
            style={[styles.timerBtn, isRunning && styles.timerBtnRunning, isLocked && styles.timerBtnLocked]}
            onPress={() => !isLocked && onTimerPress(quest.id)}
            disabled={isLocked}
            activeOpacity={0.7}
          >
            <Animated.Text style={[styles.timerIcon, { transform: [{ scale: isRunning ? pulse : 1 }] }]}>
              {isRunning ? '⏱' : isLocked ? '🔒' : '▶'}
            </Animated.Text>
          </TouchableOpacity>
          {isRunning && <Text style={styles.runningLabel}>กำลังทำ</Text>}
        </View>
      )}

      {isDone && (
        <View style={styles.doneOverlay}>
          <Text style={styles.doneCheck}>✓</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E0E0E0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, overflow: 'hidden' },
  cardDone: { borderWidth: 1.5, borderColor: '#97C459' },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0EDFF', alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 26 },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: '#2C2C2A' },
  description: { fontSize: 12, color: '#888780', marginTop: 2 },
  xpBadge: { marginTop: 4, alignSelf: 'flex-start', backgroundColor: '#534AB7', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  xpText: { fontSize: 11, color: '#FFFFFF' },
  timerCol: { alignItems: 'center', gap: 4 },
  timerBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#534AB7', alignItems: 'center', justifyContent: 'center' },
  timerBtnRunning: { backgroundColor: '#FF8C42' },
  timerBtnLocked: { backgroundColor: '#E0E0E0' },
  timerIcon: { fontSize: 18, color: '#FFFFFF' },
  runningLabel: { fontSize: 10, color: '#FF8C42' },
  doneOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(234,243,222,0.9)', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  doneCheck: { fontSize: 32, color: '#3B6D11' },
});
