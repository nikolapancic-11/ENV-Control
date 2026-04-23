import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { EmissionEntry, EmissionStatus } from '../types';

// ─── Mock Data ───────────────────────────────────────────────────
const MOCK_ENTRIES: EmissionEntry[] = [
  {
    id: '1',
    date: '2026-04-20',
    categoryId: 'cat-1',
    categoryName: 'Energy',
    subcategoryId: 'sub-1',
    subcategoryName: 'Electricity',
    accountId: 'acc-1',
    accountName: 'Utilities',
    amount: 1250.5,
    unit: 'kWh',
    description: 'Office electricity consumption April',
    status: 'submitted',
    createdAt: '2026-04-20T10:00:00Z',
    updatedAt: '2026-04-20T10:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: '2',
    date: '2026-04-18',
    categoryId: 'cat-2',
    categoryName: 'Transport',
    subcategoryId: 'sub-2',
    subcategoryName: 'Company Fleet',
    accountId: 'acc-2',
    accountName: 'Fleet',
    amount: 340.2,
    unit: 'liters',
    description: 'Fleet diesel refueling',
    status: 'submitted',
    createdAt: '2026-04-18T09:30:00Z',
    updatedAt: '2026-04-18T09:30:00Z',
    createdBy: 'user-1',
  },
  {
    id: '3',
    date: '2026-04-17',
    categoryId: 'cat-3',
    categoryName: 'Waste',
    subcategoryId: 'sub-3',
    subcategoryName: 'Landfill',
    accountId: 'acc-3',
    accountName: 'Waste Management',
    amount: 89.0,
    unit: 'kgCO2e',
    description: 'Monthly landfill waste',
    status: 'pending',
    createdAt: '2026-04-17T14:20:00Z',
    updatedAt: '2026-04-17T14:20:00Z',
    createdBy: 'user-2',
  },
  {
    id: '4',
    date: '2026-04-15',
    categoryId: 'cat-1',
    categoryName: 'Energy',
    subcategoryId: 'sub-4',
    subcategoryName: 'Natural Gas',
    accountId: 'acc-1',
    accountName: 'Utilities',
    amount: 520.0,
    unit: 'kgCO2e',
    description: 'Heating natural gas consumption',
    status: 'submitted',
    createdAt: '2026-04-15T11:00:00Z',
    updatedAt: '2026-04-15T11:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: '5',
    date: '2026-04-14',
    categoryId: 'cat-2',
    categoryName: 'Transport',
    subcategoryId: 'sub-5',
    subcategoryName: 'Business Travel',
    accountId: 'acc-4',
    accountName: 'Travel',
    amount: 1820.0,
    unit: 'km',
    description: 'Employee flights to conference',
    status: 'draft',
    createdAt: '2026-04-14T16:45:00Z',
    updatedAt: '2026-04-14T16:45:00Z',
    createdBy: 'user-1',
  },
  {
    id: '6',
    date: '2026-04-12',
    categoryId: 'cat-4',
    categoryName: 'Water',
    subcategoryId: 'sub-6',
    subcategoryName: 'Municipal Water',
    accountId: 'acc-5',
    accountName: 'Water Supply',
    amount: 45.3,
    unit: 'kgCO2e',
    description: 'Office water usage March',
    status: 'submitted',
    createdAt: '2026-04-12T08:15:00Z',
    updatedAt: '2026-04-12T08:15:00Z',
    createdBy: 'user-2',
  },
  {
    id: '7',
    date: '2026-04-10',
    categoryId: 'cat-2',
    categoryName: 'Transport',
    subcategoryId: 'sub-7',
    subcategoryName: 'Employee Commute',
    accountId: 'acc-4',
    accountName: 'Travel',
    amount: 670.0,
    unit: 'km',
    description: 'Monthly employee commute estimate',
    status: 'pending',
    createdAt: '2026-04-10T13:00:00Z',
    updatedAt: '2026-04-10T13:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: '8',
    date: '2026-04-08',
    categoryId: 'cat-1',
    categoryName: 'Energy',
    subcategoryId: 'sub-1',
    subcategoryName: 'Electricity',
    accountId: 'acc-1',
    accountName: 'Utilities',
    amount: 980.0,
    unit: 'kWh',
    description: 'Warehouse electricity Q1',
    status: 'draft',
    createdAt: '2026-04-08T10:30:00Z',
    updatedAt: '2026-04-08T10:30:00Z',
    createdBy: 'user-2',
  },
  {
    id: '9',
    date: '2026-04-06',
    categoryId: 'cat-3',
    categoryName: 'Waste',
    subcategoryId: 'sub-8',
    subcategoryName: 'Recycling',
    accountId: 'acc-3',
    accountName: 'Waste Management',
    amount: 12.5,
    unit: 'kgCO2e',
    description: 'Office recycling processing',
    status: 'submitted',
    createdAt: '2026-04-06T09:00:00Z',
    updatedAt: '2026-04-06T09:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: '10',
    date: '2026-04-04',
    categoryId: 'cat-5',
    categoryName: 'Procurement',
    subcategoryId: 'sub-9',
    subcategoryName: 'Office Supplies',
    accountId: 'acc-6',
    accountName: 'Supplies',
    amount: 156.0,
    unit: 'kgCO2e',
    description: 'Q1 office supply carbon footprint',
    status: 'pending',
    createdAt: '2026-04-04T15:10:00Z',
    updatedAt: '2026-04-04T15:10:00Z',
    createdBy: 'user-1',
  },
  {
    id: '11',
    date: '2026-04-02',
    categoryId: 'cat-1',
    categoryName: 'Energy',
    subcategoryId: 'sub-4',
    subcategoryName: 'Natural Gas',
    accountId: 'acc-1',
    accountName: 'Utilities',
    amount: 410.0,
    unit: 'kgCO2e',
    description: 'Production facility heating',
    status: 'draft',
    createdAt: '2026-04-02T12:00:00Z',
    updatedAt: '2026-04-02T12:00:00Z',
    createdBy: 'user-2',
  },
  {
    id: '12',
    date: '2026-04-01',
    categoryId: 'cat-2',
    categoryName: 'Transport',
    subcategoryId: 'sub-2',
    subcategoryName: 'Company Fleet',
    accountId: 'acc-2',
    accountName: 'Fleet',
    amount: 275.8,
    unit: 'liters',
    description: 'Monthly fleet fuel top-up',
    status: 'submitted',
    createdAt: '2026-04-01T07:45:00Z',
    updatedAt: '2026-04-01T07:45:00Z',
    createdBy: 'user-1',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────
type StatusFilter = 'all' | EmissionStatus;
type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Pending', value: 'pending' },
  { label: 'Draft', value: 'draft' },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Highest', value: 'highest' },
  { label: 'Lowest', value: 'lowest' },
];

const CATEGORY_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  Energy: { icon: 'flash', color: '#F59E0B' },
  Transport: { icon: 'car', color: '#3B82F6' },
  Waste: { icon: 'trash', color: '#EF4444' },
  Water: { icon: 'water', color: '#06B6D4' },
  Procurement: { icon: 'cube', color: '#8B5CF6' },
};

const STATUS_CONFIG: Record<EmissionStatus, { label: string; bg: string; text: string }> = {
  submitted: { label: 'Submitted', bg: '#E8F5E9', text: Colors.statusSubmitted },
  pending: { label: 'Pending', bg: '#FFF8E1', text: '#F57F17' },
  draft: { label: 'Draft', bg: '#F5F5F5', text: Colors.statusDraft },
  error: { label: 'Error', bg: '#FFEBEE', text: Colors.statusError },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Component ───────────────────────────────────────────────────
export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<StatusFilter>('all');
  const [activeSortOption, setActiveSortOption] = useState<SortOption>('newest');
  const [entries, setEntries] = useState<EmissionEntry[]>(MOCK_ENTRIES);
  const [refreshing, setRefreshing] = useState(false);

  const filteredEntries = useMemo(() => {
    let result = [...entries];

    // Status filter
    if (activeStatusFilter !== 'all') {
      result = result.filter((e) => e.status === activeStatusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.categoryName.toLowerCase().includes(q) ||
          e.subcategoryName.toLowerCase().includes(q),
      );
    }

    // Sort
    switch (activeSortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest':
        result.sort((a, b) => a.amount - b.amount);
        break;
    }

    return result;
  }, [entries, activeStatusFilter, searchQuery, activeSortOption]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setEntries(MOCK_ENTRIES);
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleEntryPress = (entry: EmissionEntry) => {
    Alert.alert(
      entry.categoryName,
      `Subcategory: ${entry.subcategoryName}\nDate: ${formatDate(entry.date)}\nAmount: ${entry.amount} ${entry.unit}\nStatus: ${STATUS_CONFIG[entry.status].label}\n\nDescription: ${entry.description}`,
    );
  };

  const handleDeleteEntry = (entry: EmissionEntry) => {
    Alert.alert('Delete Entry', `Are you sure you want to delete "${entry.description}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setEntries((prev) => prev.filter((e) => e.id !== entry.id)),
      },
    ]);
  };

  const renderChip = (
    label: string,
    isActive: boolean,
    onPress: () => void,
  ) => (
    <TouchableOpacity
      key={label}
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderEntry = ({ item }: { item: EmissionEntry }) => {
    const catConfig = CATEGORY_ICONS[item.categoryName] ?? { icon: 'ellipse' as const, color: Colors.textSecondary };
    const statusConfig = STATUS_CONFIG[item.status];

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => handleEntryPress(item)}
        onLongPress={() => handleDeleteEntry(item)}
      >
        <View style={[styles.categoryIcon, { backgroundColor: catConfig.color + '20' }]}>
          <Ionicons name={catConfig.icon} size={22} color={catConfig.color} />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardCategory}>{item.categoryName}</Text>
          <Text style={styles.cardSubcategory}>{item.subcategoryName}</Text>
          <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.cardAmount}>
            {item.amount.toLocaleString()} {item.unit}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Text style={[styles.statusText, { color: statusConfig.text }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={Colors.disabled} />
      <Text style={styles.emptyTitle}>No entries found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or filters to find what you're looking for.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.placeholder} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search entries..."
          placeholderTextColor={Colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.placeholder} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Bar */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {STATUS_FILTERS.map((f) =>
            renderChip(f.label, activeStatusFilter === f.value, () => setActiveStatusFilter(f.value)),
          )}
          <View style={styles.chipDivider} />
          {SORT_OPTIONS.map((s) =>
            renderChip(s.label, activeSortOption === s.value, () => setActiveSortOption(s.value)),
          )}
        </ScrollView>
      </View>

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
      </Text>

      {/* Entry List */}
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={filteredEntries.length === 0 ? styles.listEmpty : styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    padding: 0,
  },
  filterSection: {
    marginTop: Spacing.md,
  },
  chipRow: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.white,
  },
  chipDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  resultsCount: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardCategory: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardSubcategory: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cardDate: {
    ...Typography.caption,
    color: Colors.placeholder,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  cardAmount: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
    marginTop: Spacing.xs,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
