import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface ProgressSummaryCardProps {
  percentDone: number;
  totalEarnedMinutes: number;
}

export default function ProgressSummaryCard({ percentDone, totalEarnedMinutes }: Readonly<ProgressSummaryCardProps>) {
  const animWidth = useRef(new Animated.Value(percentDone)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: percentDone,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [percentDone]);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.percent}>{percentDone}% สำเร็จ</Text>
        <Text style={styles.minutes}>{totalEarnedMinutes} นาที</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            { width: animWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 16, marginTop: 10, padding: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  percent: { fontSize: 15, fontWeight: '600', color: '#2C2C2A' },
  minutes: { fontSize: 13, color: '#185FA5', fontWeight: '500' },
  track: { marginTop: 10, backgroundColor: '#EEF5FC', height: 10, borderRadius: 5 },
  fill: { height: 10, borderRadius: 5, backgroundColor: '#185FA5' },
});
