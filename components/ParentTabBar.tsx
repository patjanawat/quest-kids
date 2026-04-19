import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

const TABS = [
  { key: 'index', label: 'ภาพรวม', icon: '📊', path: '/parent' },
  { key: 'manage', label: 'จัดการ', icon: '🗂️', path: '/parent/manage' },
  { key: 'settings', label: 'ตั้งค่า', icon: '⚙️', path: '/parent/settings' },
];

export default function ParentTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const isActive =
          pathname === t.path ||
          (t.key === 'index' && (pathname === '/parent' || pathname === '/parent/'));
        return (
          <TouchableOpacity key={t.key} style={styles.tab} onPress={() => router.push(t.path as never)}>
            <Text style={styles.icon}>{t.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{t.label}</Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEF5FC' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, position: 'relative' },
  icon: { fontSize: 20 },
  label: { fontSize: 11, color: '#B4B2A9', marginTop: 2 },
  labelActive: { color: '#185FA5', fontWeight: '600' },
  indicator: { position: 'absolute', bottom: 0, width: 32, height: 3, backgroundColor: '#185FA5', borderRadius: 2 },
});
