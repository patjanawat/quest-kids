import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface PinInputProps {
  onSuccess: () => void;
  onFail: () => void;
  correctPin: string;
  isLocked?: boolean;
  lockoutMessage?: string;
}

const NUMPAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', '⌫'],
];

export default function PinInput({ onSuccess, onFail, correctPin, isLocked, lockoutMessage }: Readonly<PinInputProps>) {
  const [input, setInput] = useState('');

  function handlePress(key: string) {
    if (isLocked) return;
    if (key === '⌫') { setInput((prev) => prev.slice(0, -1)); return; }
    if (key === '') return;
    const next = input + key;
    setInput(next);
    if (next.length === 4) {
      if (next === correctPin) { onSuccess(); setInput(''); }
      else { onFail(); setInput(''); }
    }
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>ใส่รหัส PIN</Text>
      {isLocked && lockoutMessage ? <Text style={styles.lockout}>{lockoutMessage}</Text> : null}
      <View style={styles.dotsRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i < input.length && styles.dotFilled]} />
        ))}
      </View>
      <View style={styles.numpad}>
        {NUMPAD.map((row) => (
          <View key={row.join('-')} style={styles.numRow}>
            {row.map((key, ki) => (
              <TouchableOpacity
                key={`${key}-${ki}`}
                style={[styles.numKey, key === '' && styles.numKeyEmpty]}
                onPress={() => handlePress(key)}
                disabled={isLocked || key === ''}
                activeOpacity={0.7}
              >
                <Text style={[styles.numText, key === '⌫' && styles.deleteText]}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', padding: Spacing.xl },
  title: { fontSize: Typography.fontSizeXl, fontWeight: Typography.fontWeightBold, color: Colors.textPrimary, marginBottom: Spacing.lg },
  lockout: { fontSize: Typography.fontSizeMd, color: Colors.error, marginBottom: Spacing.md, textAlign: 'center' },
  dotsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.primary, backgroundColor: Colors.white },
  dotFilled: { backgroundColor: Colors.primary },
  numpad: { gap: Spacing.sm },
  numRow: { flexDirection: 'row', gap: Spacing.sm },
  numKey: { width: 72, height: 72, borderRadius: BorderRadius.xl, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  numKeyEmpty: { backgroundColor: 'transparent', borderColor: 'transparent' },
  numText: { fontSize: Typography.fontSizeXl, fontWeight: Typography.fontWeightBold, color: Colors.textPrimary },
  deleteText: { color: Colors.error },
});
