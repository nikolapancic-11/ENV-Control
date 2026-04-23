import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { Card } from './Card';

interface StatCardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  trend?: { direction: 'up' | 'down'; value: string };
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconColor,
  label,
  value,
  trend,
  onPress,
}) => {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: iconColor + '1A' }]}>
        <Ionicons name={icon as any} size={22} color={iconColor} />
      </View>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      {trend && (
        <View style={styles.trendContainer}>
          <Ionicons
            name={trend.direction === 'up' ? 'arrow-up' : 'arrow-down'}
            size={14}
            color={trend.direction === 'up' ? Colors.error : Colors.success}
          />
          <Text
            style={[
              styles.trendText,
              {
                color:
                  trend.direction === 'up' ? Colors.error : Colors.success,
              },
            ]}
          >
            {trend.value}
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    ...Typography.h2,
    marginBottom: 2,
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  trendText: {
    ...Typography.caption,
    fontWeight: '600',
    marginLeft: 2,
  },
});
