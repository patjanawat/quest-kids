import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../store/questStore';
import { useDailyReset } from '../hooks/useDailyReset';
import { useTimer } from '../hooks/useTimer';
import KidHeader from '../components/KidHeader';
import KidStatGrid from '../components/KidStatGrid';
import CheerBanner from '../components/CheerBanner';
import QuestCard from '../components/QuestCard';
import UnlockButton from '../components/UnlockButton';
import KidTabBar, { ComingSoon } from '../components/KidTabBar';

type Tab = 'quests' | 'streak' | 'rewards';

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('quests');

  useDailyReset();
  useTimer();

  const quests = useQuestStore((s) => s.quests);
  const totalEarnedMinutes = useQuestStore((s) => s.totalEarnedMinutes);
  const pendingApproval = useQuestStore((s) => s.pendingApproval);
  const timerActive = useQuestStore((s) => s.timerActive);
  const activeQuestId = useQuestStore((s) => s.activeQuestId);
  const kidProfile = useQuestStore((s) => s.settings.kidProfile);
  const progress = useQuestStore((s) => s.progress);
  const activeCheer = useQuestStore((s) => s.activeCheer);

  const requestApproval = useQuestStore((s) => s.requestApproval);
  const startQuestTimer = useQuestStore((s) => s.startQuestTimer);
  const markCheerRead = useQuestStore((s) => s.markCheerRead);

  const completedCount = quests.filter((q) => q.completed).length;
  const totalCount = quests.length;
  const hasCompleted = completedCount > 0;
  const hasActiveTimer = timerActive && activeQuestId !== null;

  const hour = new Date().getHours();
  const greeting =
    hour >= 5 && hour < 12 ? 'สวัสดีตอนเช้า!' :
    hour >= 12 && hour < 18 ? 'สวัสดีตอนบ่าย!' :
    'สวัสดีตอนเย็น!';

  const xpRange = progress.xpToNextLevel + progress.xpThisLevel;
  const levelPercent = progress.currentLevel >= 6 ? 100 :
    xpRange > 0 ? Math.round((progress.xpThisLevel / xpRange) * 100) : 0;

  function handleTimerPress(questId: string) {
    startQuestTimer(questId);
    router.push(`/timer?questId=${questId}`);
  }

  function getCardState(quest: { id: string; completed: boolean }) {
    if (quest.completed) return 'done' as const;
    if (hasActiveTimer && activeQuestId === quest.id) return 'running' as const;
    if (hasActiveTimer) return 'locked' as const;
    return 'normal' as const;
  }

  return (
    <View style={styles.screen}>
      <KidHeader
        name={kidProfile.name}
        avatar={kidProfile.avatar}
        greeting={greeting}
        progress={progress}
        completedCount={completedCount}
        totalCount={totalCount}
        levelPercent={levelPercent}
      />

      {activeTab === 'quests' ? (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <KidStatGrid
              totalEarnedMinutes={totalEarnedMinutes}
              completedCount={completedCount}
              streakDays={progress.streakDays}
            />

            {activeCheer && (
              <CheerBanner cheer={activeCheer} onRead={markCheerRead} />
            )}

            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>🌟 ภารกิจวันนี้</Text>
              <Text style={styles.listCount}>เสร็จ {completedCount}/{totalCount}</Text>
            </View>

            {quests.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🔒</Text>
                <Text style={styles.emptyText}>รอพ่อแม่ตั้งภารกิจก่อนนะ</Text>
                <Text style={styles.emptySub}>พ่อแม่จะเพิ่มภารกิจให้เร็วๆ นี้</Text>
              </View>
            ) : (
              <View style={styles.questList}>
                {quests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    cardState={getCardState(quest)}
                    onTimerPress={handleTimerPress}
                  />
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.bottomBar}>
            <View style={styles.actionRow}>
              <UnlockButton
                hasCompleted={hasCompleted}
                hasActiveTimer={hasActiveTimer}
                pendingApproval={pendingApproval}
                totalEarnedMinutes={totalEarnedMinutes}
                onPress={requestApproval}
              />
              <TouchableOpacity
                style={[styles.addBtn, hasActiveTimer && styles.addBtnDisabled]}
                onPress={() => router.push('/quest-request')}
                disabled={hasActiveTimer}
              >
                <Text style={[styles.addBtnText, hasActiveTimer && styles.addBtnTextDisabled]}>➕ ขอเพิ่ม</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <ComingSoon />
      )}

      <View style={styles.parentLinkRow}>
        <TouchableOpacity onPress={() => router.push('/parent')}>
          <Text style={styles.parentLink}>👨‍👩‍👧 โหมดพ่อแม่</Text>
        </TouchableOpacity>
      </View>

      <KidTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8F2' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
  listTitle: { fontSize: 17, fontWeight: 'bold', color: '#2C2C2A' },
  listCount: { fontSize: 13, color: '#888780' },
  questList: { paddingHorizontal: 16, gap: 8 },
  empty: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 56 },
  emptyText: { fontSize: 16, color: '#888780', textAlign: 'center', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#B4B2A9', textAlign: 'center', marginTop: 8 },
  bottomBar: { backgroundColor: '#FFF8F0', borderTopWidth: 1, borderTopColor: '#FFD4A8', paddingHorizontal: 16, paddingVertical: 12 },
  actionRow: { flexDirection: 'row', gap: 10 },
  addBtn: { backgroundColor: '#534AB7', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  addBtnDisabled: { backgroundColor: '#C4BAEF' },
  addBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  addBtnTextDisabled: { color: 'rgba(255,255,255,0.6)' },
  parentLinkRow: { alignItems: 'center', paddingVertical: 6, backgroundColor: '#FFF8F0' },
  parentLink: { fontSize: 13, color: '#888780' },
});
