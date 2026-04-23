import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  size = 'md',
}) => {
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    isDisabled ? styles.disabled : undefined,
  ].filter(Boolean) as ViewStyle[];

  const textColor = getTextColor(variant, isDisabled);
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;
  const textStyle: TextStyle =
    size === 'sm' ? Typography.buttonSmall : Typography.button;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} style={styles.loader} />
      ) : icon ? (
        <Ionicons
          name={icon as any}
          size={iconSize}
          color={textColor}
          style={styles.icon}
        />
      ) : null}
      <Text style={[textStyle, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

function getTextColor(variant: string, isDisabled: boolean): string {
  if (isDisabled) return Colors.disabled;
  switch (variant) {
    case 'primary':
    case 'danger':
      return Colors.textLight;
    case 'secondary':
      return Colors.primary;
    case 'outline':
      return Colors.primary;
    default:
      return Colors.textLight;
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  variant_primary: {
    backgroundColor: Colors.primary,
  },
  variant_secondary: {
    backgroundColor: Colors.background,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  variant_danger: {
    backgroundColor: Colors.error,
  },
  size_sm: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
  },
  size_md: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
  },
  size_lg: {
    paddingVertical: Spacing.sm + 6,
    paddingHorizontal: Spacing.xl,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  loader: {
    marginRight: Spacing.sm,
  },
});
