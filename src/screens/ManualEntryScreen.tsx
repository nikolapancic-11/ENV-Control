import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { Category, Subcategory, Account, EmissionUnit } from '../types';

// ─── Mock Data ───────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: '1', code: 'ELEC', name: 'Electricity' },
  { id: '2', code: 'GAS', name: 'Natural Gas' },
  { id: '3', code: 'FLEET', name: 'Fleet Vehicles' },
  { id: '4', code: 'TRAVEL', name: 'Business Travel' },
  { id: '5', code: 'WATER', name: 'Water' },
  { id: '6', code: 'WASTE', name: 'Waste' },
];

const SUBCATEGORIES: Subcategory[] = [
  { id: '101', categoryId: '1', code: 'OFFICE', name: 'Office Building', unit: 'kWh' },
  { id: '102', categoryId: '1', code: 'DC', name: 'Data Center', unit: 'kWh' },
  { id: '103', categoryId: '1', code: 'WH', name: 'Warehouse', unit: 'kWh' },
  { id: '201', categoryId: '2', code: 'HEAT', name: 'Heating', unit: 'kWh' },
  { id: '202', categoryId: '2', code: 'KITCHEN', name: 'Kitchen', unit: 'kWh' },
  { id: '203', categoryId: '2', code: 'IND', name: 'Industrial', unit: 'kWh' },
  { id: '301', categoryId: '3', code: 'DIESEL', name: 'Diesel', unit: 'liters' },
  { id: '302', categoryId: '3', code: 'PETROL', name: 'Petrol', unit: 'liters' },
  { id: '303', categoryId: '3', code: 'EV', name: 'Electric', unit: 'kWh' },
  { id: '401', categoryId: '4', code: 'AIR', name: 'Air Travel', unit: 'km' },
  { id: '402', categoryId: '4', code: 'RAIL', name: 'Rail', unit: 'km' },
  { id: '403', categoryId: '4', code: 'HOTEL', name: 'Hotel', unit: 'kgCO2e' },
  { id: '501', categoryId: '5', code: 'MUN', name: 'Municipal', unit: 'liters' },
  { id: '502', categoryId: '5', code: 'REC', name: 'Recycled', unit: 'liters' },
  { id: '601', categoryId: '6', code: 'LAND', name: 'Landfill', unit: 'kgCO2e' },
  { id: '602', categoryId: '6', code: 'RECY', name: 'Recycling', unit: 'kgCO2e' },
  { id: '603', categoryId: '6', code: 'COMP', name: 'Composting', unit: 'kgCO2e' },
];

const ACCOUNTS: Account[] = [
  { id: '1', number: '6100', name: '6100 - Utilities', category: 'Expense', blocked: false },
  { id: '2', number: '6200', name: '6200 - Travel', category: 'Expense', blocked: false },
  { id: '3', number: '6300', name: '6300 - Fleet', category: 'Expense', blocked: false },
  { id: '4', number: '6400', name: '6400 - Facilities', category: 'Expense', blocked: false },
];

const UNITS: { label: string; value: EmissionUnit }[] = [
  { label: 'kgCO2e', value: 'kgCO2e' },
  { label: 'liters', value: 'liters' },
  { label: 'kWh', value: 'kWh' },
  { label: 'km', value: 'km' },
];

// ─── Types ───────────────────────────────────────────────────────
interface DropdownOption {
  id: string;
  label: string;
}

interface FormErrors {
  category?: string;
  subcategory?: string;
  account?: string;
  date?: string;
  amount?: string;
  description?: string;
}

// ─── Component ───────────────────────────────────────────────────
export default function ManualEntryScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<EmissionUnit>('kgCO2e');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalOptions, setModalOptions] = useState<DropdownOption[]>([]);
  const [modalOnSelect, setModalOnSelect] = useState<(id: string) => void>(() => () => {});

  const filteredSubcategories = selectedCategory
    ? SUBCATEGORIES.filter((s) => s.categoryId === selectedCategory.id)
    : [];

  const openDropdown = useCallback(
    (title: string, options: DropdownOption[], onSelect: (id: string) => void) => {
      setModalTitle(title);
      setModalOptions(options);
      setModalOnSelect(() => onSelect);
      setModalVisible(true);
    },
    [],
  );

  const handleCategorySelect = useCallback((id: string) => {
    const cat = CATEGORIES.find((c) => c.id === id) ?? null;
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
    setErrors((prev) => ({ ...prev, category: undefined, subcategory: undefined }));
  }, []);

  const handleSubcategorySelect = useCallback((id: string) => {
    const sub = SUBCATEGORIES.find((s) => s.id === id) ?? null;
    setSelectedSubcategory(sub);
    if (sub) setSelectedUnit(sub.unit);
    setErrors((prev) => ({ ...prev, subcategory: undefined }));
  }, []);

  const handleAccountSelect = useCallback((id: string) => {
    const acc = ACCOUNTS.find((a) => a.id === id) ?? null;
    setSelectedAccount(acc);
    setErrors((prev) => ({ ...prev, account: undefined }));
  }, []);

  const handleUnitSelect = useCallback((id: string) => {
    const unit = UNITS.find((u) => u.value === id);
    if (unit) setSelectedUnit(unit.value);
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!selectedCategory) newErrors.category = 'Category is required';
    if (!selectedSubcategory) newErrors.subcategory = 'Subcategory is required';
    if (!selectedAccount) newErrors.account = 'Account is required';
    if (!date.trim()) {
      newErrors.date = 'Date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      newErrors.date = 'Use format YYYY-MM-DD';
    }
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Enter a valid positive number';
    }
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedAccount(null);
    setDate('');
    setAmount('');
    setSelectedUnit('kgCO2e');
    setDescription('');
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    Alert.alert('Entry Submitted', 'Your emission entry has been recorded successfully.', [
      { text: 'OK', onPress: resetForm },
    ]);
  };

  // ─── Dropdown Renderer ──────────────────────────────────────────
  const renderDropdown = (
    label: string,
    placeholder: string,
    selectedValue: string | undefined,
    error: string | undefined,
    onPress: () => void,
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdown, error ? styles.dropdownError : null]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={selectedValue ? styles.dropdownText : styles.dropdownPlaceholder}>
          {selectedValue ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Log Emission Entry</Text>
          <Text style={styles.headerSubtitle}>
            Manually record an emission data point for reporting
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Category */}
          {renderDropdown('Category', 'Select a category', selectedCategory?.name, errors.category, () =>
            openDropdown(
              'Select Category',
              CATEGORIES.map((c) => ({ id: c.id, label: c.name })),
              handleCategorySelect,
            ),
          )}

          {/* Subcategory */}
          {renderDropdown(
            'Subcategory',
            selectedCategory ? 'Select a subcategory' : 'Select a category first',
            selectedSubcategory?.name,
            errors.subcategory,
            () => {
              if (!selectedCategory) {
                setErrors((prev) => ({ ...prev, subcategory: 'Select a category first' }));
                return;
              }
              openDropdown(
                'Select Subcategory',
                filteredSubcategories.map((s) => ({ id: s.id, label: s.name })),
                handleSubcategorySelect,
              );
            },
          )}

          {/* Account */}
          {renderDropdown('Account', 'Select an account', selectedAccount?.name, errors.account, () =>
            openDropdown(
              'Select Account',
              ACCOUNTS.map((a) => ({ id: a.id, label: a.name })),
              handleAccountSelect,
            ),
          )}

          {/* Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={[styles.textInput, errors.date ? styles.inputError : null]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.placeholder}
              value={date}
              onChangeText={(val) => {
                setDate(val);
                setErrors((prev) => ({ ...prev, date: undefined }));
              }}
              keyboardType="numbers-and-punctuation"
              maxLength={10}
            />
            {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
          </View>

          {/* Amount + Unit */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountRow}>
              <TextInput
                style={[styles.amountInput, errors.amount ? styles.inputError : null]}
                placeholder="0.00"
                placeholderTextColor={Colors.placeholder}
                value={amount}
                onChangeText={(val) => {
                  setAmount(val);
                  setErrors((prev) => ({ ...prev, amount: undefined }));
                }}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                style={styles.unitSelector}
                onPress={() =>
                  openDropdown(
                    'Select Unit',
                    UNITS.map((u) => ({ id: u.value, label: u.label })),
                    handleUnitSelect,
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={styles.unitText}>{selectedUnit}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}
          </View>

          {/* Description */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textArea, errors.description ? styles.inputError : null]}
              placeholder="Enter a description for this entry..."
              placeholderTextColor={Colors.placeholder}
              value={description}
              onChangeText={(val) => {
                setDescription(val);
                setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={22} color={Colors.white} style={{ marginRight: Spacing.sm }} />
              <Text style={styles.submitButtonText}>Submit Entry</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Dropdown Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modalOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    modalOnSelect(item.id);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalDivider} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.primary,
  },
  headerSubtitle: {
    ...Typography.subtitle,
    marginTop: Spacing.xs,
  },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },

  // Fields
  fieldContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },

  // Dropdown
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  dropdownError: {
    borderColor: Colors.error,
  },
  dropdownText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  dropdownPlaceholder: {
    ...Typography.body,
    color: Colors.placeholder,
  },

  // Text inputs
  textInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  textArea: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    ...Typography.body,
    color: Colors.textPrimary,
    minHeight: 100,
  },

  // Amount row
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.xs,
  },
  unitText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primary,
  },

  // Errors
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },

  // Submit
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    marginTop: Spacing.lg,
    ...Shadows.md,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  submitButtonText: {
    ...Typography.button,
    color: Colors.white,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '60%',
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalTitle: {
    ...Typography.h3,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  modalOptionText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.md,
  },
});
