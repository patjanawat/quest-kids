import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Animated, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuestStore } from '../store/questStore';
import DigitalClock from '../components/DigitalClock';
import QuestContext from '../components/QuestContext';
import TimerProgressBar from '../components/TimerProgressBar';
import TimerControls from '../components/TimerControls';

type TimerStatus = 'idle' | 'running' | 'paused' | 'stopped';

export default function TimerScreen() {
  const router = useRouter();
  const { questId } = useLocalSearchParams<{ questId?: string }>();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [centiseconds, setCentiseconds] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [donePressed, setDonePressed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const csIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneOpacity = useRef(new Animated.Value(0)).current;

  const quests = useQuestStore((s) => s.quests);
  const startQuestTimer = useQuestStore((s) => s.startQuestTimer);
  const pauseTimer = useQuestStore((s) => s.pauseTimer);
  const resumeTimer = useQuestStore((s) => s.resumeTimer);
  const stopTimer = useQuestStore((s) => s.stopTimer);
  const resetTimer = useQuestStore((s) => s.resetTimer);
  const completeQuest = useQuestStore((s) => s.completeQuest);

  const quest = questId ? quests.find((q) => q.id === questId) ?? null : null;
  const targetSeconds = quest ? quest.rewardMinutes * 60 : 0;

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current ?? undefined);
      clearInterval(csIntervalRef.current ?? undefined);
    };
  }, []);

  useEffect(() => {
    if (status === 'stopped') {
      Animated.timing(doneOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      doneOpacity.setValue(0);
    }
  }, [status]);

  function startInterval() {
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    csIntervalRef.current = setInterval(() => {
      setCentiseconds((prev) => (prev + 1) % 100);
    }, 100);
  }

  function clearIntervals() {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (csIntervalRef.current) { clearInterval(csIntervalRef.current); csIntervalRef.current = null; }
  }

  function handlePlayPause() {
    if (status === 'idle') {
      if (questId) startQuestTimer(questId);
      setStatus('running');
      startInterval();
    } else if (status === 'running') {
      clearIntervals();
      pauseTimer();
      setStatus('paused');
    } else if (status === 'paused') {
      resumeTimer();
      setStatus('running');
      startInterval();
    }
  }

  function handleStop() {
    clearIntervals();
    stopTimer();
    setStatus('stopped');
  }

  function handleReset() {
    Alert.alert('รีเซ็ต timer', 'รีเซ็ต timer ใช่ไหม?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'รีเซ็ต',
        onPress: () => {
          clearIntervals();
          resetTimer();
          setElapsedSeconds(0);
          setCentiseconds(0);
          setStatus('idle');
        },
      },
    ]);
  }

  function handleBack() {
    if (status === 'running' || status === 'paused') {
      Alert.alert('ออกจากหน้านี้', 'ออกจากหน้านี้จะหยุด timer ชั่วคราว ต้องการออกหรือไม่?', [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ออก',
          onPress: () => {
            clearIntervals();
            pauseTimer();
            router.back();
          },
        },
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

  const statusLabel: Record<TimerStatus, string> = {
    idle: 'พร้อมเริ่ม',
    running: 'กำลังจับเวลา',
    paused: 'หยุดชั่วคราว',
    stopped: 'หมดเวลา',
  };

  const statusColor: Record<TimerStatus, string> = {
    idle: 'rgba(255,255,255,0.5)',
    running: '#00FF87',
    paused: 'rgba(255,200,80,0.9)',
    stopped: 'rgba(255,255,255,0.6)',
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <SafeAreaView style={styles.safe}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backText}>← กลับ</Text>
          </TouchableOpacity>
          <Text style={styles.topLabel}>จับเวลา</Text>
          <View style={styles.topSpacer} />
        </View>

        {/* Quest context */}
        <QuestContext quest={quest} />

        {/* Clock */}
        <View style={styles.clockArea}>
          <DigitalClock elapsedSeconds={elapsedSeconds} centiseconds={centiseconds} />
          <Text style={[styles.statusLabel, { color: statusColor[status] }]}>
            {statusLabel[status]}
          </Text>
          <TimerProgressBar elapsedSeconds={elapsedSeconds} targetSeconds={targetSeconds} />
        </View>

        {/* Controls */}
        <TimerControls
          status={status}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
          onReset={handleReset}
        />

        {/* Done button */}
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
