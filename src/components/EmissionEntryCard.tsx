import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { EmissionEntry } from '../types';
import { Card } from './Card';

const STATUS_COLORS: Record<string, string> = {
  submitted: Colors.statusSubmitted,
  pending: Colors.statusPending,
  draft: Colors.statusDraft,
  error: Colors.statusError,
};

const CATEGORY_ICONS: Record<string, string> = {
  energy: 'flash',
  transport: 'car',
  waste: 'trash',
  water: 'water',
};

interface EmissionEntryCardProps {
  entry: EmissionEntry;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const EmissionEntryCard: React.FC<EmissionEntryCardProps> = ({
  entry,
  onPress,
  onLongPress,
}) => {
  const iconName = CATEGORY_ICONS[entry.categoryName.toLowerCase()] || 'leaf';
  const statusColor = STATUS_COLORS[entry.status] || Colors.statusDraft;

  return (
    <Card
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: Colors.primaryLight + '1A' }]}>
          <Ionicons name={iconName as any} size={20} color={Colors.primaryLight} />
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.category} numberOfLines={1}>
              {entry.categoryName}
            </Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={styles.statusText}>{entry.status}</Text>
            </View>
          </View>
          <Text style={styles.subcategory} numberOfLines={1}>
            {entry.subcategoryName}
          </Text>
          <View style={styles.bottomRow}>
            <Text style={styles.date}>{entry.date}</Text>
            <Text style={styles.amount}>
              {entry.amount} {entry.unit}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    ...Typography.body,
    fontWeight: '600',
    flex: 1,
  },
  subcategory: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  date: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  amount: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    ...Typography.caption,
    textTransform: 'capitalize',
  },
});
