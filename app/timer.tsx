import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Animated, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuestStore } from '../store/questStore';
import { useBackgroundTimer } from '../hooks/useBackgroundTimer';
import DigitalClock from '../components/DigitalClock';
import QuestContext from '../components/QuestContext';
import TimerProgressBar from '../components/TimerProgressBar';
import TimerControls from '../components/TimerControls';

export default function TimerScreen() {
  const router = useRouter();
  const { questId } = useLocalSearchParams<{ questId?: string }>();
  const [donePressed, setDonePressed] = useState(false);
  const doneOpacity = useRef(new Animated.Value(0)).current;

  const quests = useQuestStore((s) => s.quests);
  const startQuestTimer = useQuestStore((s) => s.startQuestTimer);
  const pauseTimer = useQuestStore((s) => s.pauseTimer);
  const resumeTimer = useQuestStore((s) => s.resumeTimer);
  const stopTimer = useQuestStore((s) => s.stopTimer);
  const resetTimer = useQuestStore((s) => s.resetTimer);
  const completeQuest = useQuestStore((s) => s.completeQuest);

  const { elapsedSeconds, centiseconds, status, start, pause, resume, stop, reset } = useBackgroundTimer();

  const quest = questId ? quests.find((q) => q.id === questId) ?? null : null;
  const targetSeconds = quest ? quest.rewardMinutes * 60 : 0;

  useEffect(() => {
    if (status === 'stopped') {
      Animated.timing(doneOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      doneOpacity.setValue(0);
    }
  }, [status]);

  function handlePlayPause() {
    if (status === 'idle') {
      if (questId) startQuestTimer(questId);
      start();
    } else if (status === 'running') {
      pauseTimer();
      pause();
    } else if (status === 'paused') {
      resumeTimer();
      resume();
    }
  }

  function handleStop() {
    stopTimer();
    stop();
  }

  function handleReset() {
    Alert.alert('รีเซ็ต timer', 'รีเซ็ต timer ใช่ไหม?', [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'รีเซ็ต', onPress: () => { resetTimer(); reset(); } },
    ]);
  }

  function handleBack() {
    if (status === 'running' || status === 'paused') {
      Alert.alert('ออกจากหน้านี้', 'ออกจากหน้านี้จะหยุด timer ชั่วคราว ต้องการออกหรือไม่?', [
        { text: 'ยกเลิก', style: 'cancel' },
        { text: 'ออก', onPress: () => { pauseTimer(); pause(); router.back(); } },
      ]);
    } else {
      router.back();
    }
  }

  function handleDone() {
    if (donePressed) return;
    setDonePressed(true);
    if (questId) completeQuest(questId);
    router.back();
  }

  const statusLabel: Record<typeof status, string> = {
    idle: 'พร้อมเริ่ม',
    running: 'กำลังจับเวลา',
    paused: 'หยุดชั่วคราว',
    stopped: 'หมดเวลา',
  };

  const statusColor: Record<typeof status, string> = {
    idle: 'rgba(255,255,255,0.5)',
    running: '#00FF87',
    paused: 'rgba(255,200,80,0.9)',
    stopped: 'rgba(255,255,255,0.6)',
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backText}>← กลับ</Text>
          </TouchableOpacity>
          <Text style={styles.topLabel}>จับเวลา</Text>
          <View style={styles.topSpacer} />
        </View>

        <QuestContext quest={quest} />

        <View style={styles.clockArea}>
          <DigitalClock elapsedSeconds={elapsedSeconds} centiseconds={centiseconds} />
          <Text style={[styles.statusLabel, { color: statusColor[status] }]}>
            {statusLabel[status]}
          </Text>
          <TimerProgressBar elapsedSeconds={elapsedSeconds} targetSeconds={targetSeconds} />
        </View>

        <TimerControls
          status={status}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
          onReset={handleReset}
        />

        <Animated.View style={[styles.doneArea, { opacity: doneOpacity }]}>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={handleDone}
            disabled={status !== 'stopped' || donePressed}
            activeOpacity={0.85}
          >
            <Text style={styles.doneBtnText}>✓ ทำเสร็จแล้ว!</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#1a1a2e' },
  safe: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingBottom: 32 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16 },
  backText: { fontSize: 16, color: 'rgba(255,255,255,0.6)' },
  topLabel: { fontSize: 16, color: 'rgba(255,255,255,0.4)', flex: 1, textAlign: 'center' },
  topSpacer: { width: 48 },
  clockArea: { alignItems: 'center', marginTop: 32 },
  statusLabel: { fontSize: 14, textAlign: 'center', marginTop: 12, letterSpacing: 1 },
  doneArea: { marginTop: 24 },
  doneBtn: { backgroundColor: '#00FF87', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  doneBtnText: { color: '#1a1a2e', fontSize: 18, fontWeight: 'bold' },
});
