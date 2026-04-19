import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type TimerStatus = 'idle' | 'running' | 'paused' | 'stopped';

interface TimerControlsProps {
  status: TimerStatus;
  onPlayPause: () => void;
  onStop: () => void;
  onReset: () => void;
}

export default function TimerControls({ status, onPlayPause, onStop, onReset }: Readonly<TimerControlsProps>) {
  const isIdle = status === 'idle';
  const isStopped = status === 'stopped';
  const isRunning = status === 'running';
  const resetDisabled = isIdle;
  const stopDisabled = isIdle || isStopped;
  const playDisabled = isStopped;

  return (
    <View style={styles.row}>
      {/* Reset */}
      <TouchableOpacity
        style={[styles.sideBtn, resetDisabled && styles.btnDisabled]}
        onPress={onReset}
        disabled={resetDisabled}
        activeOpacity={0.7}
      >
        <Text style={styles.sideBtnIcon}>🔄</Text>
      </TouchableOpacity>

      {/* Play / Pause */}
      <TouchableOpacity
        style={[styles.mainBtn, playDisabled && styles.mainBtnDisabled]}
        onPress={onPlayPause}
        disabled={playDisabled}
        activeOpacity={0.8}
      >
        <Text style={[styles.mainBtnIcon, playDisabled && styles.mainBtnIconDisabled]}>
          {isRunning ? '⏸' : '▶'}
        </Text>
      </TouchableOpacity>

      {/* Stop */}
      <TouchableOpacity
        style={[styles.sideBtn, styles.stopBtn, stopDisabled && styles.stopBtnDisabled]}
        onPress={onStop}
        disabled={stopDisabled}
        activeOpacity={0.7}
      >
        <Text style={styles.sideBtnIcon}>⏹</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, marginTop: 40 },
  sideBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.4 },
  sideBtnIcon: { fontSize: 24 },
  mainBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00FF87', alignItems: 'center', justifyContent: 'center' },
  mainBtnDisabled: { backgroundColor: 'rgba(0,255,135,0.3)', opacity: 0.6 },
  mainBtnIcon: { fontSize: 32, color: '#1a1a2e' },
  mainBtnIconDisabled: { color: 'rgba(26,26,46,0.5)' },
  stopBtn: { backgroundColor: '#FF6B6B' },
  stopBtnDisabled: { backgroundColor: 'rgba(255,107,107,0.3)', opacity: 0.4 },
});
