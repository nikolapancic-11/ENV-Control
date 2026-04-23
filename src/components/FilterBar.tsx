import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface Filter {
  key: string;
  label: string;
}

interface FilterBarProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (key: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => {
        const isActive = filter.key === activeFilter;
        return (
          <TouchableOpacity
            key={filter.key}
            style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
            onPress={() => onFilterChange(filter.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipInactive: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
  chipText: {
    ...Typography.buttonSmall,
  },
  chipTextActive: {
    color: Colors.textLight,
  },
  chipTextInactive: {
    color: Colors.textSecondary,
  },
});
