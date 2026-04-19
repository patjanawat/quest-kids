import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Animated, StatusBar, BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useQuestStore } from '../store/questStore';

const AVATARS = ['🐱', '🐶', '🐸', '🦊', '🐻', '🐼', '🦁', '🐯', '🦄', '🐲', '🦸', '🧙', '👸', '🤴', '🚀'];

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useQuestStore((s) => s.completeOnboarding);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [kidName, setKidName] = useState('');
  const [avatar, setAvatar] = useState('🐱');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinError, setPinError] = useState('');
  const [finishing, setFinishing] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  // Disable hardware back button during onboarding
  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, [])
  );

  function animateToStep(next: 1 | 2 | 3, direction: 'forward' | 'back') {
    const outTo = direction === 'forward' ? -400 : 400;
    const inFrom = direction === 'forward' ? 400 : -400;
    Animated.timing(slideAnim, { toValue: outTo, duration: 200, useNativeDriver: true }).start(() => {
      setStep(next);
      slideAnim.setValue(inFrom);
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    });
  }

  function handleStep1Next() {
    if (!kidName.trim()) return;
    animateToStep(2, 'forward');
  }

  function handleStep2Next() {
    if (pin.length < 4 || pinConfirm.length < 4) return;
    if (pin !== pinConfirm) {
      setPinError('PIN ไม่ตรงกัน กรุณาลองใหม่');
      return;
    }
    if (pin === '1234') {
      setPinError('PIN ง่ายเกินไป กรุณาตั้ง PIN อื่น');
      return;
    }
    setPinError('');
    animateToStep(3, 'forward');
  }

  function handleStep2Back() {
    setPinError('');
    animateToStep(1, 'back');
  }

  function handleStart() {
    if (finishing) return;
    setFinishing(true);
    completeOnboarding(kidName.trim(), avatar, pin);
    router.replace('/');
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />
      <SafeAreaView style={styles.safe}>
        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[styles.dot, step === s ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        <Animated.View style={[styles.content, { transform: [{ translateX: slideAnim }] }]}>
          {step === 1 && (
            <ScrollView contentContainerStyle={styles.stepContent} keyboardShouldPersistTaps="handled">
              <Text style={styles.stepEmoji}>👶</Text>
              <Text style={styles.stepTitle}>สวัสดี! มาตั้งชื่อกัน</Text>
              <Text style={styles.stepSubtitle}>เราจะเรียกลูกว่าอะไรดีนะ?</Text>

              <View style={styles.inputSection}>
                <Text style={styles.label}>ชื่อลูก</Text>
                <TextInput
                  style={styles.textInput}
                  value={kidName}
                  onChangeText={setKidName}
                  placeholder="เช่น น้องมะลิ"
                  placeholderTextColor="#C4BAEF"
                  maxLength={20}
                  textAlign="center"
                  returnKeyType="done"
                />
              </View>

              <View style={styles.avatarSection}>
                <Text style={styles.label}>เลือก Avatar</Text>
                <View style={styles.avatarGrid}>
                  {AVATARS.map((em) => (
                    <TouchableOpacity
                      key={em}
                      style={[styles.avatarItem, avatar === em && styles.avatarItemSelected]}
                      onPress={() => setAvatar(em)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.avatarEmoji}>{em}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.nextBtn, !kidName.trim() && styles.nextBtnDisabled]}
                onPress={handleStep1Next}
                disabled={!kidName.trim()}
                activeOpacity={0.85}
              >
                <Text style={styles.nextBtnText}>ถัดไป →</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {step === 2 && (
            <ScrollView contentContainerStyle={styles.stepContent} keyboardShouldPersistTaps="handled">
              <Text style={styles.stepEmoji}>🔐</Text>
              <Text style={styles.stepTitle}>ตั้ง PIN สำหรับพ่อแม่</Text>
              <Text style={styles.stepSubtitle}>PIN 4 หลัก สำหรับเข้าหน้าจัดการของพ่อแม่</Text>

              <View style={styles.pinSection}>
                <Text style={styles.label}>ตั้ง PIN</Text>
                <PinDots value={pin} />
                <TextInput
                  style={styles.hiddenInput}
                  value={pin}
                  onChangeText={(v) => { setPin(v.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
              </View>

              <View style={[styles.pinSection, { marginTop: 24 }]}>
                <Text style={styles.label}>ยืนยัน PIN</Text>
                <PinDots value={pinConfirm} />
                <TextInput
                  style={styles.hiddenInput}
                  value={pinConfirm}
                  onChangeText={(v) => { setPinConfirm(v.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
              </View>

              {pinError !== '' && <Text style={styles.pinError}>{pinError}</Text>}

              <TouchableOpacity
                style={[styles.nextBtn, (pin.length < 4 || pinConfirm.length < 4) && styles.nextBtnDisabled]}
                onPress={handleStep2Next}
                disabled={pin.length < 4 || pinConfirm.length < 4}
                activeOpacity={0.85}
              >
                <Text style={styles.nextBtnText}>ถัดไป →</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleStep2Back} style={styles.backBtn}>
                <Text style={styles.backBtnText}>← ย้อนกลับ</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={[styles.stepEmoji, { fontSize: 80, marginTop: 60 }]}>🎉</Text>
              <Text style={[styles.stepTitle, { fontSize: 32, marginTop: 20 }]}>พร้อมแล้ว!</Text>
              <Text style={[styles.stepSubtitle, { color: '#534AB7', lineHeight: 26, marginTop: 12 }]}>
                ยินดีต้อนรับ {kidName}!{'\n'}มาเริ่มทำภารกิจกันเลย 🌟
              </Text>

              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryIcon}>{avatar}</Text>
                  <Text style={styles.summaryText}>ชื่อ: {kidName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryIcon}>🔐</Text>
                  <Text style={styles.summaryText}>PIN ตั้งค่าแล้ว</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.startBtn}
                onPress={handleStart}
                disabled={finishing}
                activeOpacity={0.85}
              >
                <Text style={styles.startBtnText}>🚀 เริ่มเลย!</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function PinDots({ value }: { value: string }) {
  return (
    <View style={styles.pinDots}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={[styles.pinDot, i < value.length && styles.pinDotFilled]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F3FF' },
  safe: { flex: 1 },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 },
  dot: { borderRadius: 5 },
  dotActive: { width: 10, height: 10, backgroundColor: '#534AB7' },
  dotInactive: { width: 8, height: 8, backgroundColor: 'rgba(83,74,183,0.25)' },
  content: { flex: 1 },
  stepContent: { paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  stepEmoji: { fontSize: 64, textAlign: 'center', marginTop: 40 },
  stepTitle: { fontSize: 26, fontWeight: 'bold', color: '#2C2C2A', textAlign: 'center', marginTop: 16 },
  stepSubtitle: { fontSize: 15, color: '#888780', textAlign: 'center', marginTop: 8 },

  inputSection: { width: '100%', marginTop: 32 },
  label: { fontSize: 14, color: '#534AB7', fontWeight: '600', marginBottom: 6 },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C4BAEF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 18,
    color: '#2C2C2A',
    width: '100%',
  },

  avatarSection: { width: '100%', marginTop: 20 },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  avatarItem: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#F0EEFF',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'transparent',
  },
  avatarItemSelected: { borderColor: '#534AB7', backgroundColor: '#E8E4FF' },
  avatarEmoji: { fontSize: 28 },

  nextBtn: { backgroundColor: '#534AB7', borderRadius: 16, paddingVertical: 18, width: '100%', alignItems: 'center', marginTop: 32 },
  nextBtnDisabled: { backgroundColor: '#C4BAEF' },
  nextBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },

  pinSection: { width: '100%' },
  pinDots: { flexDirection: 'row', gap: 16, justifyContent: 'center', marginBottom: 8 },
  pinDot: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#C4BAEF', backgroundColor: '#FFFFFF' },
  pinDotFilled: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  hiddenInput: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  pinError: { fontSize: 13, color: '#D84040', textAlign: 'center', marginTop: 12 },

  backBtn: { marginTop: 16 },
  backBtnText: { fontSize: 14, color: '#888780', textAlign: 'center' },

  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, width: '100%',
    marginTop: 32, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  summaryIcon: { fontSize: 32 },
  summaryText: { fontSize: 15, color: '#2C2C2A', fontWeight: '600' },

  startBtn: { backgroundColor: '#FF8C42', borderRadius: 16, paddingVertical: 20, width: '100%', alignItems: 'center', marginTop: 40 },
  startBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
});
