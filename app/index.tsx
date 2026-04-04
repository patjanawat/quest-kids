import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuestStore } from '../store/questStore';
import { useDailyReset } from '../hooks/useDailyReset';
import { useTimer } from '../hooks/useTimer';
import QuestCard from '../components/QuestCard';
import RewardBadge from '../components/RewardBadge';
import { Quest } from '../types';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  useDailyReset();
  useTimer();

  const quests = useQuestStore((s) => s.quests);
  const totalEarnedMinutes = useQuestStore((s) => s.totalEarnedMinutes);
  const pendingApproval = useQuestStore((s) => s.pendingApproval);
  const timerActive = useQuestStore((s) => s.timerActive);
  const kidProfile = useQuestStore((s) => s.settings.kidProfile);
  const completeQuest = useQuestStore((s) => s.completeQuest);
  const uncompleteQuest = useQuestStore((s) => s.uncompleteQuest);
  const requestApproval = useQuestStore((s) => s.requestApproval);

  function handleToggle(id: string) {
    const quest = quests.find((q) => q.id === id);
    if (!quest) return;
    if (quest.completed) {
      uncompleteQuest(id);
    } else {
      completeQuest(id);
    }
  }

  function handleUnlockRequest() {
    if (totalEarnedMinutes === 0) {
      Alert.alert('ยังไม่มีเวลา', 'ทำภารกิจให้เสร็จก่อนนะ! 💪');
      return;
    }
    requestApproval();
    router.push('/parent');
  }

  function handleGoToTimer() {
    router.push('/rewards');
  }

  const completedCount = quests.filter((q) => q.completed).length;

  function renderFooterAction() {
    if (timerActive) {
      return (
        <TouchableOpacity style={styles.mainBtn} onPress={handleGoToTimer}>
          <Text style={styles.mainBtnText}>⏱️ ดูเวลาที่เหลือ</Text>
        </TouchableOpacity>
      );
    }
    if (pendingApproval) {
      return (
        <View style={styles.pendingBanner}>
          <Text style={styles.pendingText}>⏳ รอพ่อแม่อนุมัติ...</Text>
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.mainBtn, totalEarnedMinutes === 0 && styles.mainBtnDisabled]}
        onPress={handleUnlockRequest}
      >
        <Text style={styles.mainBtnText}>
          🔓 ขอปลดล็อก ({totalEarnedMinutes} นาที)
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          <Text style={styles.avatar}>{kidProfile.avatar}</Text>
          <View>
            <Text style={styles.greeting}>สวัสดี! 👋</Text>
            <Text style={styles.name}>{kidProfile.name}</Text>
          </View>
        </View>
        {timerActive && (
          <TouchableOpacity style={styles.timerPill} onPress={handleGoToTimer}>
            <Text style={styles.timerPillText}>⏱️ ดูเวลา</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.badgeContainer}>
        <RewardBadge totalMinutes={totalEarnedMinutes} />
      </View>

      <Text style={styles.sectionTitle}>
        ภารกิจวันนี้ ({completedCount}/{quests.length})
      </Text>

      <FlatList<Quest>
        data={quests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuestCard quest={item} onToggle={handleToggle} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🌟</Text>
            <Text style={styles.emptyText}>ยังไม่มีภารกิจ</Text>
            <Text style={styles.emptySubtext}>ขอให้พ่อแม่เพิ่มภารกิจให้หน่อยนะ</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        {renderFooterAction()}

        <TouchableOpacity style={styles.parentBtn} onPress={() => router.push('/parent')}>
          <Text style={styles.parentBtnText}>👨‍👩‍👧 โหมดพ่อแม่</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    fontSize: 48,
  },
  greeting: {
    fontSize: Typography.fontSizeSm,
    color: Colors.textSecondary,
  },
  name: {
    fontSize: Typography.fontSizeXl,
    fontWeight: Typography.fontWeightExtraBold,
    color: Colors.textPrimary,
  },
  timerPill: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  timerPillText: {
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeSm,
  },
  badgeContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizeMd,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSizeXl,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  footer: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  mainBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  mainBtnDisabled: {
    opacity: 0.5,
  },
  mainBtnText: {
    fontSize: Typography.fontSizeLg,
    fontWeight: Typography.fontWeightBold,
    color: Colors.white,
  },
  pendingBanner: {
    backgroundColor: Colors.warning,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  pendingText: {
    fontSize: Typography.fontSizeLg,
    fontWeight: Typography.fontWeightBold,
    color: Colors.white,
  },
  parentBtn: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  parentBtnText: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeightMedium,
  },
});
