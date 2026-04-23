import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface DropdownOption {
  label: string;
  value: string;
}

interface FormDropdownProps {
  label: string;
  value: string;
  placeholder?: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  error?: string;
  icon?: string;
}

export const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  value,
  placeholder = 'Select...',
  options,
  onSelect,
  error,
  icon,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const selectedOption = options.find((o) => o.value === value);
  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setModalVisible(false);
    setSearch('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.selector, error ? styles.selectorError : undefined]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={Colors.textSecondary}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            styles.selectorText,
            !selectedOption ? styles.placeholderText : undefined,
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); setSearch(''); }}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color={Colors.placeholder} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor={Colors.placeholder}
                value={search}
                onChangeText={setSearch}
              />
            </View>
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value ? styles.optionActive : undefined,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value ? styles.optionTextActive : undefined,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No options found</Text>
              }
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm + 2,
  },
  selectorError: {
    borderColor: Colors.error,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  selectorText: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  placeholderText: {
    color: Colors.placeholder,
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  modalTitle: {
    ...Typography.h3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.background,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  optionActive: {
    backgroundColor: Colors.background,
  },
  optionText: {
    ...Typography.body,
    flex: 1,
  },
  optionTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
});
