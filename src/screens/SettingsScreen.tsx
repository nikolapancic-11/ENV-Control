import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import Config from '../constants/config';

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  right: React.ReactNode;
  onPress?: () => void;
};

function SettingRow({ icon, label, right, onPress }: SettingRowProps) {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container style={styles.row} onPress={onPress} activeOpacity={0.6}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={Colors.textSecondary} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {right}
    </Container>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.statusRow}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={styles.statusText}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.disabled} />
    </View>
  );
}

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  const handleAbout = () => {
    Alert.alert(
      Config.app.name,
      `Version ${Config.app.version}\n\nCarbon emission tracking and reporting for Business Central.\n\n© 2025 ENV-Control`,
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>DU</Text>
        </View>
        <Text style={styles.profileName}>Demo User</Text>
        <Text style={styles.profileEmail}>{Config.demo.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>User</Text>
        </View>
      </View>

      {/* Preferences */}
      <SectionHeader title="Preferences" />
      <View style={styles.section}>
        <SettingRow
          icon="notifications-outline"
          label="Push Notifications"
          right={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.border, true: Colors.secondaryLight }}
              thumbColor={notificationsEnabled ? Colors.primary : Colors.disabled}
            />
          }
        />
        <View style={styles.divider} />
        <SettingRow
          icon="moon-outline"
          label="Dark Mode"
          right={
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: Colors.border, true: Colors.secondaryLight }}
              thumbColor={darkModeEnabled ? Colors.primary : Colors.disabled}
            />
          }
        />
      </View>

      {/* Integrations */}
      <SectionHeader title="Integrations" />
      <View style={styles.section}>
        <SettingRow
          icon="business-outline"
          label="Business Central"
          right={<StatusBadge label="Connected" color={Colors.success} />}
          onPress={() => {}}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="cloud-outline"
          label="SharePoint"
          right={<StatusBadge label="Connected" color={Colors.success} />}
          onPress={() => {}}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="document-text-outline"
          label="Document Intelligence"
          right={<StatusBadge label="Configured" color={Colors.success} />}
          onPress={() => {}}
        />
      </View>

      {/* General */}
      <SectionHeader title="General" />
      <View style={styles.section}>
        <SettingRow
          icon="trash-outline"
          label="Clear Cache"
          right={<Ionicons name="chevron-forward" size={18} color={Colors.disabled} />}
          onPress={handleClearCache}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="information-circle-outline"
          label="About"
          right={<Ionicons name="chevron-forward" size={18} color={Colors.disabled} />}
          onPress={handleAbout}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="help-circle-outline"
          label="Help & Support"
          right={<Ionicons name="chevron-forward" size={18} color={Colors.disabled} />}
          onPress={() => {}}
        />
      </View>

      {/* Version */}
      <Text style={styles.versionText}>
        {Config.app.name} v{Config.app.version}
      </Text>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  // Profile Card
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.white,
  },
  profileName: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  profileEmail: {
    ...Typography.bodySmall,
    marginBottom: Spacing.sm,
  },
  roleBadge: {
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  roleBadgeText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Sections
  sectionHeader: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowLabel: {
    ...Typography.body,
    marginLeft: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: Spacing.md + 20 + Spacing.sm,
  },

  // Status
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  statusText: {
    ...Typography.bodySmall,
    color: Colors.success,
    marginRight: Spacing.xs,
  },

  // Footer
  versionText: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  signOutButton: {
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  signOutText: {
    ...Typography.button,
    color: Colors.error,
  },
});
