import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface QuestFormProps {
  onSubmit: (quest: { title: string; description: string; icon: string; rewardMinutes: number }) => void;
  onCancel: () => void;
}

const ICON_OPTIONS = ['📚', '🏃', '🧹', '📖', '🎨', '🎵', '🍳', '🌱', '🏊', '🧘', '🦷', '🛏️'];

export default function QuestForm({ onSubmit, onCancel }: Readonly<QuestFormProps>) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📚');
  const [rewardMinutes, setRewardMinutes] = useState(15);

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), icon, rewardMinutes });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>เพิ่มภารกิจใหม่</Text>

      <Text style={styles.label}>ไอคอน</Text>
      <View style={styles.iconRow}>
        {ICON_OPTIONS.map((e) => (
          <TouchableOpacity
            key={e}
            style={[styles.iconBtn, e === icon && styles.iconBtnSelected]}
            onPress={() => setIcon(e)}
          >
            <Text style={styles.iconEmoji}>{e}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>ชื่อภารกิจ</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="เช่น ทำการบ้าน"
        placeholderTextColor={Colors.textMuted}
        maxLength={40}
      />

      <Text style={styles.label}>คำอธิบาย</Text>
      <TextInput
        style={[styles.input, styles.inputMulti]}
        value={description}
        onChangeText={setDescription}
        placeholder="รายละเอียดเพิ่มเติม (ไม่จำเป็น)"
        placeholderTextColor={Colors.textMuted}
        multiline
        numberOfLines={2}
        maxLength={100}
      />

      <Text style={styles.label}>รางวัล: {rewardMinutes} นาที</Text>
      <View style={styles.minuteRow}>
        {[5, 10, 15, 20, 30, 45, 60].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.minuteBtn, m === rewardMinutes && styles.minuteBtnSelected]}
            onPress={() => setRewardMinutes(m)}
          >
            <Text style={[styles.minuteText, m === rewardMinutes && styles.minuteTextSelected]}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>ยกเลิก</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, !title.trim() && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!title.trim()}
        >
          <Text style={styles.submitText}>เพิ่มภารกิจ ✓</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  heading: {
    fontSize: Typography.fontSizeXl,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  label: {
    fontSize: Typography.fontSizeMd,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSizeMd,
    color: Colors.textPrimary,
  },
  inputMulti: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  iconBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '22',
  },
  iconEmoji: {
    fontSize: 24,
  },
  minuteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  minuteBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  minuteBtnSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  minuteText: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeightMedium,
  },
  minuteTextSelected: {
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  cancelBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: Typography.fontSizeMd,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeightBold,
  },
  submitBtn: {
    flex: 2,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: Typography.fontSizeMd,
    color: Colors.white,
    fontWeight: Typography.fontWeightBold,
  },
});
