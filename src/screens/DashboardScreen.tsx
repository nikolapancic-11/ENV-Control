import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { DashboardStats, EmissionEntry } from '../types';

// ─── Mock Data ───────────────────────────────────────────────────
const MOCK_STATS: DashboardStats = {
  totalEmissions: 1247,
  totalEmissionsPreviousMonth: 1417,
  entriesCount: 23,
  pendingCount: 3,
  topCategory: 'Electricity',
  topCategoryAmount: 482,
  recentEntries: [
    {
      id: '1',
      date: '2026-04-21',
      categoryId: 'elec',
      categoryName: 'Electricity',
      subcategoryId: 'grid',
      subcategoryName: 'Grid Electricity',
      accountId: 'acc-1',
      accountName: 'Energy Account',
      amount: 128,
      unit: 'kgCO2e',
      description: 'Office electricity April W3',
      status: 'submitted',
      createdAt: '2026-04-21T10:00:00Z',
      updatedAt: '2026-04-21T10:00:00Z',
      createdBy: 'demo-user',
    },
    {
      id: '2',
      date: '2026-04-19',
      categoryId: 'travel',
      categoryName: 'Business Travel',
      subcategoryId: 'flight',
      subcategoryName: 'Domestic Flight',
      accountId: 'acc-2',
      accountName: 'Travel Account',
      amount: 245,
      unit: 'kgCO2e',
      description: 'Flight to Amsterdam',
      status: 'submitted',
      createdAt: '2026-04-19T14:30:00Z',
      updatedAt: '2026-04-19T14:30:00Z',
      createdBy: 'demo-user',
    },
    {
      id: '3',
      date: '2026-04-17',
      categoryId: 'fuel',
      categoryName: 'Fleet Fuel',
      subcategoryId: 'diesel',
      subcategoryName: 'Diesel',
      accountId: 'acc-3',
      accountName: 'Fleet Account',
      amount: 87,
      unit: 'kgCO2e',
      description: 'Company car refuel',
      status: 'pending',
      createdAt: '2026-04-17T09:15:00Z',
      updatedAt: '2026-04-17T09:15:00Z',
      createdBy: 'demo-user',
    },
    {
      id: '4',
      date: '2026-04-15',
      categoryId: 'waste',
      categoryName: 'Waste',
      subcategoryId: 'general',
      subcategoryName: 'General Waste',
      accountId: 'acc-4',
      accountName: 'Waste Account',
      amount: 34,
      unit: 'kgCO2e',
      description: 'Office waste collection',
      status: 'draft',
      createdAt: '2026-04-15T11:00:00Z',
      updatedAt: '2026-04-15T11:00:00Z',
      createdBy: 'demo-user',
    },
    {
      id: '5',
      date: '2026-04-12',
      categoryId: 'elec',
      categoryName: 'Electricity',
      subcategoryId: 'grid',
      subcategoryName: 'Grid Electricity',
      accountId: 'acc-1',
      accountName: 'Energy Account',
      amount: 131,
      unit: 'kgCO2e',
      description: 'Office electricity April W2',
      status: 'submitted',
      createdAt: '2026-04-12T10:00:00Z',
      updatedAt: '2026-04-12T10:00:00Z',
      createdBy: 'demo-user',
    },
  ],
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Electricity: 'flash',
  'Business Travel': 'airplane',
  'Fleet Fuel': 'car',
  Waste: 'trash',
};

const STATUS_COLORS: Record<string, string> = {
  submitted: Colors.statusSubmitted,
  pending: Colors.statusPending,
  draft: Colors.statusDraft,
  error: Colors.statusError,
};

// ─── Helpers ─────────────────────────────────────────────────────
function getCurrentMonthYear(): string {
  const date = new Date();
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getTrendPercentage(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

// ─── Component ───────────────────────────────────────────────────
export default function DashboardScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [stats] = useState<DashboardStats>(MOCK_STATS);

  const trendPercent = getTrendPercentage(stats.totalEmissions, stats.totalEmissionsPreviousMonth);
  const trendDown = trendPercent <= 0;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const renderRecentEntry = ({ item }: { item: EmissionEntry }) => {
    const icon = CATEGORY_ICONS[item.categoryName] || 'ellipse';
    const statusColor = STATUS_COLORS[item.status] || Colors.textSecondary;

    return (
      <View style={styles.entryRow}>
        <View style={styles.entryIconContainer}>
          <Ionicons name={icon} size={20} color={Colors.primary} />
        </View>
        <View style={styles.entryContent}>
          <Text style={styles.entryCategory}>{item.categoryName}</Text>
          <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.entryRight}>
          <Text style={styles.entryAmount}>
            {item.amount} {item.unit}
          </Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back, Demo User</Text>
          <Text style={styles.dateText}>{getCurrentMonthYear()}</Text>
        </View>
        <TouchableOpacity style={styles.bellButton}>
          <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        {/* Total Emissions */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.success + '18' }]}>
              <Ionicons name="leaf" size={18} color={Colors.success} />
            </View>
            <View style={[styles.trendBadge, { backgroundColor: trendDown ? Colors.success + '18' : Colors.error + '18' }]}>
              <Ionicons
                name={trendDown ? 'trending-down' : 'trending-up'}
                size={12}
                color={trendDown ? Colors.success : Colors.error}
              />
              <Text style={[styles.trendText, { color: trendDown ? Colors.success : Colors.error }]}>
                {Math.abs(trendPercent)}%
              </Text>
            </View>
          </View>
          <Text style={styles.statValue}>1,247</Text>
          <Text style={styles.statUnit}>kgCO2e</Text>
          <Text style={styles.statLabel}>Total Emissions</Text>
        </View>

        {/* Entries This Month */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.secondary + '18' }]}>
              <Ionicons name="document-text" size={18} color={Colors.secondary} />
            </View>
          </View>
          <Text style={styles.statValue}>{stats.entriesCount}</Text>
          <Text style={styles.statUnit}>&nbsp;</Text>
          <Text style={styles.statLabel}>Entries This Month</Text>
        </View>

        {/* Pending Submissions */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.warning + '18' }]}>
              <Ionicons name="time" size={18} color={Colors.warning} />
            </View>
          </View>
          <Text style={[styles.statValue, { color: Colors.warning }]}>{stats.pendingCount}</Text>
          <Text style={styles.statUnit}>&nbsp;</Text>
          <Text style={styles.statLabel}>Pending Submissions</Text>
        </View>

        {/* Top Category */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.accent + '18' }]}>
              <Ionicons name="flash" size={18} color={Colors.accent} />
            </View>
          </View>
          <Text style={styles.statValue} numberOfLines={1}>{stats.topCategory}</Text>
          <Text style={styles.statUnit}>{stats.topCategoryAmount} kgCO2e</Text>
          <Text style={styles.statLabel}>Top Category</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('NewEntry' as never)}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: Colors.primary }]}>
            <Ionicons name="add-circle" size={22} color={Colors.white} />
          </View>
          <Text style={styles.actionLabel}>New Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Upload' as never)}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: Colors.secondary }]}>
            <Ionicons name="cloud-upload" size={22} color={Colors.white} />
          </View>
          <Text style={styles.actionLabel}>Upload Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('History' as never)}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: Colors.accent }]}>
            <Ionicons name="time" size={22} color={Colors.white} />
          </View>
          <Text style={styles.actionLabel}>View History</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Entries */}
      <Text style={styles.sectionTitle}>Recent Entries</Text>
      <View style={styles.recentCard}>
        <FlatList
          data={stats.recentEntries}
          keyExtractor={(item) => item.id}
          renderItem={renderRecentEntry}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  welcomeText: {
    ...Typography.h3,
  },
  dateText: {
    ...Typography.bodySmall,
    marginTop: Spacing.xs,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    ...Typography.h2,
  },
  statUnit: {
    ...Typography.caption,
    marginTop: 2,
  },
  statLabel: {
    ...Typography.bodySmall,
    marginTop: Spacing.xs,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  trendText: {
    ...Typography.caption,
    fontWeight: '600',
    marginLeft: 2,
  },

  // Quick Actions
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.xs,
    ...Shadows.sm,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    ...Typography.buttonSmall,
    color: Colors.textPrimary,
  },

  // Recent Entries
  recentCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
    overflow: 'hidden',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  entryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  entryContent: {
    flex: 1,
  },
  entryCategory: {
    ...Typography.body,
    fontWeight: '500',
  },
  entryDate: {
    ...Typography.caption,
    marginTop: 2,
  },
  entryRight: {
    alignItems: 'flex-end',
  },
  entryAmount: {
    ...Typography.body,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    ...Typography.caption,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.md,
  },
});
