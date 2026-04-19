import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuestStore } from '../../store/questStore';
import ParentTabBar from '../../components/ParentTabBar';

export default function SettingsScreen() {
  const kidProfile = useQuestStore((s) => s.settings.kidProfile);
  const dailyLimitMinutes = useQuestStore((s) => s.settings.dailyLimitMinutes);
  const quests = useQuestStore((s) => s.quests);
  const totalEarnedMinutes = useQuestStore((s) => s.totalEarnedMinutes);
  const timerSessions = useQuestStore((s) => s.timerSessions);
  const updateSettings = useQuestStore((s) => s.updateSettings);

  const [newKidName, setNewKidName] = useState('');
  const [newPin, setNewPin] = useState('');

  function handleSave() {
    const updates: Record<string, unknown> = {};
    if (newKidName.trim()) {
      updates.kidProfile = { ...kidProfile, name: newKidName.trim() };
    }
    if (newPin.length === 4 && /^\d{4}$/.test(newPin)) {
      updates.pin = newPin;
    }
    if (Object.keys(updates).length > 0) {
      updateSettings(updates as Parameters<typeof updateSettings>[0]);
      Alert.alert('บันทึกแล้ว ✓', 'อัปเดตการตั้งค่าเรียบร้อย');
      setNewKidName('');
      setNewPin('');
    }
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.title}>ตั้งค่า ⚙️</Text>
        <Text style={styles.subtitle}>ข้อมูลโปรไฟล์และความปลอดภัย</Text>
      </SafeAreaView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>โปรไฟล์เด็ก</Text>
          <Text style={styles.label}>ชื่อเด็ก (ปัจจุบัน: {kidProfile.name})</Text>
          <TextInput
            style={styles.input}
            value={newKidName}
            onChangeText={setNewKidName}
            placeholder="ใส่ชื่อใหม่"
            placeholderTextColor="#B4B2A9"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ความปลอดภัย</Text>
          <Text style={styles.label}>PIN ใหม่ (4 ตัวเลข)</Text>
          <TextInput
            style={styles.input}
            value={newPin}
            onChangeText={setNewPin}
            placeholder="ใส่ PIN ใหม่"
            placeholderTextColor="#B4B2A9"
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>💾 บันทึกการตั้งค่า</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ข้อมูลวันนี้</Text>
          <Text style={styles.infoRow}>🎮 จำนวนภารกิจ: {quests.length} รายการ</Text>
          <Text style={styles.infoRow}>⏱️ เวลาที่ได้รับ: {totalEarnedMinutes} นาที</Text>
          <Text style={styles.infoRow}>🔒 เซสชันวันนี้: {timerSessions.length} ครั้ง</Text>
          <Text style={styles.infoRow}>⏰ เวลาสูงสุดต่อวัน: {dailyLimitMinutes} นาที</Text>
        </View>
      </ScrollView>

      <ParentTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EEF5FC' },
  header: { backgroundColor: '#185FA5', paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 0 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#2C2C2A', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#2C2C2A', marginBottom: 6 },
  input: { backgroundColor: '#F5F7FA', borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 10, padding: 12, fontSize: 15, color: '#2C2C2A', marginBottom: 4 },
  saveBtn: { backgroundColor: '#185FA5', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, gap: 8 },
  infoTitle: { fontSize: 15, fontWeight: 'bold', color: '#2C2C2A', marginBottom: 4 },
  infoRow: { fontSize: 14, color: '#888780' },
});
