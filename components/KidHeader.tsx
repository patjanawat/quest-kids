import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KidProgress } from '../types';

interface KidHeaderProps {
  name: string;
  avatar: string;
  greeting: string;
  progress: KidProgress;
  completedCount: number;
  totalCount: number;
  levelPercent: number;
}

export default function KidHeader({ name, avatar, greeting, progress, completedCount, totalCount, levelPercent }: Readonly<KidHeaderProps>) {
  const animWidth = useRef(new Animated.Value(levelPercent)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: levelPercent,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [levelPercent]);

  const isMaxLevel = progress.currentLevel >= 6;

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{avatar}</Text>
          </View>
          <View style={styles.nameCol}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name} numberOfLines={1}>{name} 👋</Text>
          </View>
        </View>

        <View style={styles.xpBox}>
          <View style={styles.xpRow}>
            <View>
              <Text style={styles.levelTitle}>{progress.currentLevelTitle}</Text>
              <Text style={styles.levelNum}>Lv.{progress.currentLevel}</Text>
            </View>
            <View style={styles.xpRight}>
              <Text style={styles.questCount}>{completedCount}/{totalCount} quest</Text>
              {isMaxLevel ? (
                <Text style={styles.nextLevel}>MAX</Text>
              ) : (
                <Text style={styles.nextLevel}>Lv.{progress.currentLevel + 1} ต้องการ {progress.xpToNextLevel} XP</Text>
              )}
            </View>
          </View>
          <View style={styles.barTrack}>
            <Animated.View
              style={[
                styles.barFill,
                { width: animWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
              ]}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#FF8C42' },
  container: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFD4A8', alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 28 },
  nameCol: { flex: 1 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 2 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  xpBox: { marginTop: 16, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: 12 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelTitle: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  levelNum: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  xpRight: { alignItems: 'flex-end' },
  questCount: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  nextLevel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  barTrack: { marginTop: 8, backgroundColor: 'rgba(0,0,0,0.2)', height: 8, borderRadius: 4 },
  barFill: { height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
});
