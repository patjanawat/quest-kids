import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../../store/questStore';
import PinInput from '../../components/PinInput';
import StatGrid from '../../components/StatGrid';
import ProgressSummaryCard from '../../components/ProgressSummaryCard';
import ApprovalCard from '../../components/ApprovalCard';
import QuestRequestCard from '../../components/QuestRequestCard';
import CheerSection from '../../components/CheerSection';
import ParentTabBar from '../../components/ParentTabBar';
import { Text, TouchableOpacity } from 'react-native';

export default function ParentDashboard() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);

  const kidProfile = useQuestStore((s) => s.settings.kidProfile);
  const pin = useQuestStore((s) => s.settings.pin);
  const pinLockoutUntil = useQuestStore((s) => s.pinLockoutUntil);
  const quests = useQuestStore((s) => s.quests);
  const totalEarnedMinutes = useQuestStore((s) => s.totalEarnedMinutes);
  const pendingApproval = useQuestStore((s) => s.pendingApproval);
  const pendingQuestRequests = useQuestStore((s) => s.pendingQuestRequests);
  const progress = useQuestStore((s) => s.progress);

  const approveUnlock = useQuestStore((s) => s.approveUnlock);
  const denyUnlock = useQuestStore((s) => s.denyUnlock);
  const approveQuestRequest = useQuestStore((s) => s.approveQuestRequest);
  const denyQuestRequest = useQuestStore((s) => s.denyQuestRequest);
  const sendCheer = useQuestStore((s) => s.sendCheer);
  const recordPinFail = useQuestStore((s) => s.recordPinFail);
  const resetPinFails = useQuestStore((s) => s.resetPinFails);

  const completedCount = quests.filter((q) => q.completed).length;
  const totalCount = quests.length;
  const xpToday = quests.filter((q) => q.completed).reduce((s, q) => s + q.xpReward, 0);
  const percentDone = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pendingRequest = pendingQuestRequests.find((r) => r.status === 'pending') ?? null;

  const isLocked = pinLockoutUntil != null && new Date(pinLockoutUntil) > new Date();
  const lockoutMinutes = isLocked
    ? Math.ceil((new Date(pinLockoutUntil as string).getTime() - Date.now()) / 60000)
    : 0;

  if (!unlocked) {
    return (
      <SafeAreaView style={styles.pinScreen}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← กลับ</Text>
        </TouchableOpacity>
        <Text style={styles.pinTitle}>โหมดพ่อแม่ 👨‍👩‍👧</Text>
        <PinInput
          correctPin={pin}
          onSuccess={() => { resetPinFails(); setUnlocked(true); }}
          onFail={recordPinFail}
          isLocked={isLocked}
          lockoutMessage={isLocked ? `ลองใหม่อีก ${lockoutMinutes} นาที` : undefined}
        />
        <Text style={styles.pinHint}>รหัสเริ่มต้น: 1234</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Dashboard 📊</Text>
            <Text style={styles.headerSub}>{kidProfile.name}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{kidProfile.avatar}</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StatGrid completedCount={completedCount} totalCount={totalCount} xpToday={xpToday} />
        <ProgressSummaryCard percentDone={percentDone} totalEarnedMinutes={totalEarnedMinutes} />
        {pendingApproval && (
          <ApprovalCard
            completedCount={completedCount}
            totalEarnedMinutes={totalEarnedMinutes}
            onApprove={approveUnlock}
            onDeny={denyUnlock}
          />
        )}
        {pendingRequest && (
          <QuestRequestCard
            request={pendingRequest}
            onApprove={approveQuestRequest}
            onDeny={denyQuestRequest}
          />
        )}
        <CheerSection onSend={sendCheer} />
        <View style={styles.lockRow}>
          <TouchableOpacity onPress={() => setUnlocked(false)}>
            <Text style={styles.lockText}>🔒 ล็อกหน้าจอ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ParentTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  pinScreen: { flex: 1, backgroundColor: '#FFF8F2' },
  backBtn: { padding: 24, paddingBottom: 0 },
  backText: { fontSize: 16, color: '#7A5C3A' },
  pinTitle: { fontSize: 32, fontWeight: '800', color: '#2D1B00', textAlign: 'center', marginTop: 16 },
  pinHint: { textAlign: 'center', color: '#B8966A', fontSize: 14, marginTop: 8 },
  screen: { flex: 1, backgroundColor: '#EEF5FC' },
  header: { backgroundColor: '#185FA5' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 24 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  lockRow: { alignItems: 'center', marginTop: 16, marginBottom: 8 },
  lockText: { fontSize: 13, color: '#888780' },
});
