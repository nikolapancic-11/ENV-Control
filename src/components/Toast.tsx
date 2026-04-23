import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

const TOAST_CONFIG: Record<string, { bg: string; icon: string }> = {
  success: { bg: Colors.success, icon: 'checkmark-circle' },
  error: { bg: Colors.error, icon: 'alert-circle' },
  info: { bg: Colors.info, icon: 'information-circle' },
};

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  onDismiss,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  if (!visible) return null;

  const config = TOAST_CONFIG[type];

  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon as any} size={20} color={Colors.white} />
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    zIndex: 9999,
    ...Shadows.md,
  },
  message: {
    ...Typography.body,
    color: Colors.white,
    marginLeft: Spacing.sm,
    flex: 1,
  },
});
