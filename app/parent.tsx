import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../store/questStore';
import PinInput from '../components/PinInput';
import QuestForm from '../components/QuestForm';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

type Tab = 'approve' | 'quests' | 'settings';

export default function ParentScreen() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('approve');
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [newKidName, setNewKidName] = useState('');
  const [newPin, setNewPin] = useState('');

  const pin = useQuestStore((s) => s.settings.pin);
  const kidProfile = useQuestStore((s) => s.settings.kidProfile);
  const dailyLimitMinutes = useQuestStore((s) => s.settings.dailyLimitMinutes);
  const quests = useQuestStore((s) => s.quests);
  const totalEarnedMinutes = useQuestStore((s) => s.totalEarnedMinutes);
  const pendingApproval = useQuestStore((s) => s.pendingApproval);
  const timerSessions = useQuestStore((s) => s.timerSessions);
  const pinLockoutUntil = useQuestStore((s) => s.pinLockoutUntil);

  const approveUnlock = useQuestStore((s) => s.approveUnlock);
  const denyUnlock = useQuestStore((s) => s.denyUnlock);
  const addQuest = useQuestStore((s) => s.addQuest);
  const removeQuest = useQuestStore((s) => s.removeQuest);
  const updateSettings = useQuestStore((s) => s.updateSettings);
  const recordPinFail = useQuestStore((s) => s.recordPinFail);
  const resetPinFails = useQuestStore((s) => s.resetPinFails);

  const isLocked = pinLockoutUntil != null && new Date(pinLockoutUntil) > new Date();
  const lockoutMinutes = isLocked
    ? Math.ceil((new Date(pinLockoutUntil as string).getTime() - Date.now()) / 60000)
    : 0;

  function handlePinSuccess() {
    resetPinFails();
    setUnlocked(true);
  }

  function handlePinFail() {
    recordPinFail();
  }

  function handleApprove() {
    approveUnlock();
    router.back();
  }

  function handleDeny() {
    denyUnlock();
    Alert.alert('ปฏิเสธแล้ว', 'ไม่อนุมัติคำขอนี้');
  }

  function handleAddQuest(quest: { title: string; description: string; icon: string; rewardMinutes: number; xpReward: number }) {
    addQuest(quest);
    setShowQuestForm(false);
  }

  function handleSaveSettings() {
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

  const TABS: { key: Tab; label: string }[] = [
    { key: 'approve', label: '✅ อนุมัติ' },
    { key: 'quests', label: '📋 ภารกิจ' },
    { key: 'settings', label: '⚙️ ตั้งค่า' },
  ];

  if (!unlocked) {
    return (
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← กลับ</Text>
        </TouchableOpacity>
        <Text style={styles.parentTitle}>โหมดพ่อแม่ 👨‍👩‍👧</Text>
        <PinInput
          correctPin={pin}
          onSuccess={handlePinSuccess}
          onFail={handlePinFail}
          isLocked={isLocked}
          lockoutMessage={
            isLocked ? `ลองใหม่อีก ${lockoutMinutes} นาที (ใส่รหัสผิดเกิน 3 ครั้ง)` : undefined
          }
        />
        <Text style={styles.pinHint}>รหัสเริ่มต้น: 1234</Text>
      </SafeAreaView>
    );
  }

  function renderApproveTab() {
    return (
      <View style={styles.section}>
        {pendingApproval ? (
          <View style={styles.approveCard}>
            <Text style={styles.approveTitle}>คำขอปลดล็อก 🔓</Text>
            <Text style={styles.approveInfo}>
              {kidProfile.name} ทำภารกิจได้ {totalEarnedMinutes} นาที
            </Text>
            <Text style={styles.approveSub}>
              ต้องการปลดล็อกเวลาเล่น {Math.min(totalEarnedMinutes, dailyLimitMinutes)} นาที
            </Text>
            <View style={styles.approveButtons}>
              <TouchableOpacity style={styles.denyBtn} onPress={handleDeny}>
                <Text style={styles.denyBtnText}>❌ ปฏิเสธ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
                <Text style={styles.approveBtnText}>✅ อนุมัติ</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noPending}>
            <Text style={styles.noPendingIcon}>💤</Text>
            <Text style={styles.noPendingText}>ไม่มีคำขอตอนนี้</Text>
          </View>
        )}

        {timerSessions.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>ประวัติวันนี้</Text>
            {timerSessions.map((session) => (
              <View key={session.startedAt} style={styles.historyRow}>
                <Text style={styles.historyText}>
                  🕐 {new Date(session.startedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.historyDuration}>{session.durationMinutes} นาที</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  function handleRemoveQuest(id: string, title: string) {
    Alert.alert('ลบภารกิจ', `ลบ "${title}" ใช่ไหม?`, [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ลบ', style: 'destructive', onPress: () => removeQuest(id) },
    ]);
  }

  function renderQuestsTab() {
    return (
      <View style={styles.section}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowQuestForm(true)}>
          <Text style={styles.addBtnText}>+ เพิ่มภารกิจ</Text>
        </TouchableOpacity>
        {quests.map((quest) => (
          <View key={quest.id} style={styles.questRow}>
            <Text style={styles.questIcon}>{quest.icon}</Text>
            <View style={styles.questInfo}>
              <Text style={styles.questTitle}>{quest.title}</Text>
              <Text style={styles.questReward}>+{quest.rewardMinutes} นาที</Text>
            </View>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemoveQuest(quest.id, quest.title)}
            >
              <Text style={styles.removeBtnText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }

  function renderSettingsTab() {
    return (
      <View style={styles.section}>
        <Text style={styles.settingLabel}>ชื่อเด็ก (ปัจจุบัน: {kidProfile.name})</Text>
        <TextInput
          style={styles.settingInput}
          value={newKidName}
          onChangeText={setNewKidName}
          placeholder="ใส่ชื่อใหม่"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={styles.settingLabel}>PIN ใหม่ (4 ตัวเลข)</Text>
        <TextInput
          style={styles.settingInput}
          value={newPin}
          onChangeText={setNewPin}
          placeholder="ใส่ PIN ใหม่"
          placeholderTextColor={Colors.textMuted}
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSettings}>
          <Text style={styles.saveBtnText}>💾 บันทึกการตั้งค่า</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ข้อมูลวันนี้</Text>
          <Text style={styles.infoRow}>🎮 จำนวนภารกิจ: {quests.length} รายการ</Text>
          <Text style={styles.infoRow}>⏱️ เวลาที่ได้รับ: {totalEarnedMinutes} นาที</Text>
          <Text style={styles.infoRow}>🔒 เซสชันวันนี้: {timerSessions.length} ครั้ง</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← กลับ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>โหมดพ่อแม่</Text>
        <TouchableOpacity onPress={() => setUnlocked(false)}>
          <Text style={styles.lockText}>🔒</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {activeTab === 'approve' && renderApproveTab()}
        {activeTab === 'quests' && renderQuestsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </ScrollView>

      {/* Quest Form Modal */}
      <Modal visible={showQuestForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <QuestForm
              onSubmit={handleAddQuest}
              onCancel={() => setShowQuestForm(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  backBtn: { padding: Spacing.lg, paddingBottom: 0 },
  backText: { fontSize: Typography.fontSizeMd, color: Colors.textSecondary },
  parentTitle: {
    fontSize: Typography.fontSizeXxl,
    fontWeight: Typography.fontWeightExtraBold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  pinHint: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: Typography.fontSizeSm,
    marginTop: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSizeLg,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
  },
  lockText: { fontSize: 24 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSizeSm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeightMedium,
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
  },
  content: { flex: 1 },
  contentInner: { padding: Spacing.lg },
  section: { gap: Spacing.md },
  approveCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    gap: Spacing.sm,
  },
  approveTitle: {
    fontSize: Typography.fontSizeXl,
    fontWeight: Typography.fontWeightExtraBold,
    color: Colors.textPrimary,
  },
  approveInfo: {
    fontSize: Typography.fontSizeLg,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeightBold,
  },
  approveSub: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textSecondary,
  },
  approveButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  denyBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  denyBtnText: {
    color: Colors.error,
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeMd,
  },
  approveBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.success,
    alignItems: 'center',
  },
  approveBtnText: {
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeMd,
  },
  noPending: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  noPendingIcon: { fontSize: 48 },
  noPendingText: {
    fontSize: Typography.fontSizeLg,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  historySection: { marginTop: Spacing.md },
  historyTitle: {
    fontSize: Typography.fontSizeMd,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyText: { fontSize: Typography.fontSizeMd, color: Colors.textPrimary },
  historyDuration: {
    fontSize: Typography.fontSizeMd,
    fontWeight: Typography.fontWeightBold,
    color: Colors.primary,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeLg,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questIcon: { fontSize: 28 },
  questInfo: { flex: 1 },
  questTitle: {
    fontSize: Typography.fontSizeMd,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
  },
  questReward: {
    fontSize: Typography.fontSizeSm,
    color: Colors.primary,
    fontWeight: Typography.fontWeightMedium,
  },
  removeBtn: { padding: Spacing.sm },
  removeBtnText: { fontSize: 20 },
  settingLabel: {
    fontSize: Typography.fontSizeMd,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  settingInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSizeMd,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeMd,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  infoTitle: {
    fontSize: Typography.fontSizeMd,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  infoRow: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '90%',
  },
});
