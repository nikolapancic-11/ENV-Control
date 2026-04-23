import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { DocumentExtractionResult } from '../types';

type ScreenState = 'upload' | 'preview' | 'processing' | 'results';

interface SelectedFile {
  uri: string;
  name: string;
  size: number;
}

const MOCK_EXTRACTION: DocumentExtractionResult = {
  vendor: 'City Power & Light',
  invoiceDate: '2026-03-15',
  invoiceNumber: 'INV-2026-0847',
  totalAmount: 1234.56,
  currency: 'USD',
  lineItems: [
    {
      description: 'Electricity - March 2026',
      quantity: 1,
      unitPrice: 1234.56,
      amount: 1234.56,
    },
  ],
  confidence: 0.92,
  rawFields: {},
};

const PROCESSING_STEPS = [
  'Uploading document...',
  'Running OCR analysis...',
  'Extracting data...',
];

export default function FileUploadScreen() {
  const [screenState, setScreenState] = useState<ScreenState>('upload');
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [extractionResult, setExtractionResult] = useState<DocumentExtractionResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Editable fields
  const [vendor, setVendor] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const stepAnimations = useRef(PROCESSING_STEPS.map(() => new Animated.Value(0))).current;

  const handleTakePhoto = () => {
    setSelectedFile({
      uri: 'file:///mock/photo/invoice_capture.jpg',
      name: 'invoice_capture.jpg',
      size: 2_456_789,
    });
    setScreenState('preview');
  };

  const handleChooseFile = () => {
    setSelectedFile({
      uri: 'file:///mock/documents/utility_bill.pdf',
      name: 'utility_bill.pdf',
      size: 1_823_456,
    });
    setScreenState('preview');
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setScreenState('upload');
  };

  const handleAnalyze = () => {
    setScreenState('processing');
    setCurrentStep(0);
    stepAnimations.forEach((a) => a.setValue(0));

    // Animate each step sequentially
    const animateSteps = (step: number) => {
      if (step >= PROCESSING_STEPS.length) {
        // Done – show results
        const result = MOCK_EXTRACTION;
        setExtractionResult(result);
        setVendor(result.vendor);
        setInvoiceDate(result.invoiceDate);
        setInvoiceNumber(result.invoiceNumber);
        setTotalAmount(result.totalAmount.toString());
        setScreenState('results');
        return;
      }
      setCurrentStep(step);
      Animated.timing(stepAnimations[step], {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => animateSteps(step + 1), 700);
      });
    };

    setTimeout(() => animateSteps(0), 300);
  };

  const handleSubmit = () => {
    Alert.alert('Success', 'Document submitted to Business Central.', [
      {
        text: 'OK',
        onPress: () => {
          setScreenState('upload');
          setSelectedFile(null);
          setExtractionResult(null);
        },
      },
    ]);
  };

  const handleDiscard = () => {
    setScreenState('upload');
    setSelectedFile(null);
    setExtractionResult(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ─── Upload State ────────────────────────────────────────────────
  const renderUpload = () => (
    <View style={styles.centeredContent}>
      <View style={styles.uploadArea}>
        <View style={styles.uploadIconRow}>
          <Ionicons name="camera-outline" size={36} color={Colors.secondary} />
          <Ionicons
            name="document-text-outline"
            size={36}
            color={Colors.secondary}
            style={{ marginLeft: Spacing.lg }}
          />
        </View>
        <Text style={styles.uploadTitle}>Upload Document</Text>
        <Text style={styles.uploadSubtitle}>
          Upload a utility bill or invoice to automatically extract emission data
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleTakePhoto}>
        <Ionicons name="camera" size={20} color={Colors.white} style={{ marginRight: Spacing.sm }} />
        <Text style={styles.primaryButtonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleChooseFile}>
        <Ionicons name="folder-open" size={20} color={Colors.primary} style={{ marginRight: Spacing.sm }} />
        <Text style={styles.secondaryButtonText}>Choose File</Text>
      </TouchableOpacity>
    </View>
  );

  // ─── Preview State ───────────────────────────────────────────────
  const renderPreview = () => (
    <View style={styles.centeredContent}>
      <View style={styles.previewCard}>
        <View style={styles.previewImageContainer}>
          <Ionicons name="document-text" size={64} color={Colors.secondary} />
        </View>
        <View style={styles.previewInfo}>
          <Text style={styles.previewFilename} numberOfLines={1}>
            {selectedFile?.name}
          </Text>
          <Text style={styles.previewSize}>
            {selectedFile ? formatFileSize(selectedFile.size) : ''}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleAnalyze}>
        <Ionicons name="scan" size={20} color={Colors.white} style={{ marginRight: Spacing.sm }} />
        <Text style={styles.primaryButtonText}>Analyze Document</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.outlineButton} onPress={handleRemove}>
        <Text style={styles.outlineButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  // ─── Processing State ────────────────────────────────────────────
  const renderProcessing = () => (
    <View style={styles.centeredContent}>
      <ActivityIndicator size="large" color={Colors.primary} style={{ marginBottom: Spacing.lg }} />
      <Text style={styles.processingTitle}>Analyzing document...</Text>

      <View style={styles.stepsContainer}>
        {PROCESSING_STEPS.map((step, index) => (
          <Animated.View
            key={step}
            style={[
              styles.stepRow,
              { opacity: stepAnimations[index] },
            ]}
          >
            <Ionicons
              name={index <= currentStep ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={index <= currentStep ? Colors.success : Colors.disabled}
            />
            <Text
              style={[
                styles.stepText,
                index <= currentStep && { color: Colors.textPrimary },
              ]}
            >
              {step}
            </Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );

  // ─── Results State ───────────────────────────────────────────────
  const renderResults = () => (
    <View style={styles.resultsContainer}>
      {/* Confidence badge */}
      <View style={styles.confidenceBadge}>
        <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
        <Text style={styles.confidenceText}>
          {Math.round((extractionResult?.confidence ?? 0) * 100)}% confident
        </Text>
      </View>

      {/* Editable fields */}
      <Text style={styles.sectionTitle}>Extracted Data</Text>

      <Text style={styles.fieldLabel}>Vendor Name</Text>
      <TextInput
        style={styles.textInput}
        value={vendor}
        onChangeText={setVendor}
        placeholder="Vendor name"
        placeholderTextColor={Colors.placeholder}
      />

      <Text style={styles.fieldLabel}>Invoice Date</Text>
      <TextInput
        style={styles.textInput}
        value={invoiceDate}
        onChangeText={setInvoiceDate}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={Colors.placeholder}
      />

      <Text style={styles.fieldLabel}>Invoice Number</Text>
      <TextInput
        style={styles.textInput}
        value={invoiceNumber}
        onChangeText={setInvoiceNumber}
        placeholder="Invoice number"
        placeholderTextColor={Colors.placeholder}
      />

      <Text style={styles.fieldLabel}>Total Amount</Text>
      <TextInput
        style={styles.textInput}
        value={totalAmount}
        onChangeText={setTotalAmount}
        placeholder="0.00"
        placeholderTextColor={Colors.placeholder}
        keyboardType="decimal-pad"
      />

      {/* Line items */}
      <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Line Items</Text>
      {extractionResult?.lineItems.map((item, i) => (
        <View key={i} style={styles.lineItemCard}>
          <Text style={styles.lineItemDescription}>{item.description}</Text>
          <View style={styles.lineItemRow}>
            <Text style={styles.lineItemDetail}>Qty: {item.quantity}</Text>
            <Text style={styles.lineItemDetail}>
              Unit: {extractionResult.currency} {item.unitPrice.toFixed(2)}
            </Text>
            <Text style={styles.lineItemAmount}>
              {extractionResult.currency} {item.amount.toFixed(2)}
            </Text>
          </View>
        </View>
      ))}

      {/* Action buttons */}
      <TouchableOpacity style={[styles.primaryButton, { marginTop: Spacing.lg }]} onPress={handleSubmit}>
        <Ionicons name="cloud-upload" size={20} color={Colors.white} style={{ marginRight: Spacing.sm }} />
        <Text style={styles.primaryButtonText}>Submit to Business Central</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.outlineButton} onPress={handleDiscard}>
        <Text style={styles.outlineButtonText}>Discard</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {screenState === 'upload' && renderUpload()}
      {screenState === 'preview' && renderPreview()}
      {screenState === 'processing' && renderProcessing()}
      {screenState === 'results' && renderResults()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  centeredContent: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },

  // ─── Upload ──────────────────────────────────────
  uploadArea: {
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginBottom: Spacing.lg,
  },
  uploadIconRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  uploadTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  uploadSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // ─── Buttons ─────────────────────────────────────
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    width: '100%',
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary,
    width: '100%',
    marginTop: Spacing.sm,
  },
  secondaryButtonText: {
    ...Typography.button,
    color: Colors.primary,
  },
  outlineButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
    marginTop: Spacing.sm,
  },
  outlineButtonText: {
    ...Typography.button,
    color: Colors.textSecondary,
  },

  // ─── Preview ─────────────────────────────────────
  previewCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  previewImageContainer: {
    height: 200,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewInfo: {
    padding: Spacing.md,
  },
  previewFilename: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  previewSize: {
    ...Typography.bodySmall,
    marginTop: Spacing.xs,
  },

  // ─── Processing ──────────────────────────────────
  processingTitle: {
    ...Typography.h3,
    marginBottom: Spacing.lg,
  },
  stepsContainer: {
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  stepText: {
    ...Typography.body,
    color: Colors.disabled,
    marginLeft: Spacing.sm,
  },

  // ─── Results ─────────────────────────────────────
  resultsContainer: {
    paddingTop: Spacing.md,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.round,
    marginBottom: Spacing.lg,
  },
  confidenceText: {
    ...Typography.bodySmall,
    color: Colors.success,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.body,
    color: Colors.textPrimary,
  },

  // ─── Line Items ──────────────────────────────────
  lineItemCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lineItemDescription: {
    ...Typography.body,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  lineItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lineItemDetail: {
    ...Typography.bodySmall,
  },
  lineItemAmount: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primary,
  },
});
