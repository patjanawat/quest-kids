import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Tab = 'quests' | 'streak' | 'rewards';

interface KidTabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function KidTabBar({ activeTab, onTabChange }: Readonly<KidTabBarProps>) {
  const tabs: { key: Tab; icon: string; label: string; activeColor: string }[] = [
    { key: 'quests', icon: '🌟', label: 'ภารกิจ', activeColor: '#FF8C42' },
    { key: 'streak', icon: '🔥', label: 'Streak', activeColor: '#1D9E75' },
    { key: 'rewards', icon: '🏆', label: 'รางวัล', activeColor: '#534AB7' },
  ];

  return (
    <View style={styles.bar}>
      {tabs.map((t) => {
        const isActive = activeTab === t.key;
        return (
          <TouchableOpacity key={t.key} style={styles.tab} onPress={() => onTabChange(t.key)}>
            <Text style={styles.icon}>{t.icon}</Text>
            <Text style={[styles.label, { color: isActive ? t.activeColor : '#B4B2A9' }]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function ComingSoon() {
  return (
    <View style={styles.comingSoon}>
      <Text style={styles.csIcon}>🚧</Text>
      <Text style={styles.csText}>Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#FFF8F0', borderTopWidth: 1, borderTopColor: '#FFD4A8' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  icon: { fontSize: 22 },
  label: { fontSize: 11, marginTop: 2 },
  comingSoon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  csIcon: { fontSize: 64 },
  csText: { fontSize: 20, color: '#888780', marginTop: 12 },
});
