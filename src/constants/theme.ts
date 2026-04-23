export const Colors = {
  primary: '#1B3A5C',
  primaryLight: '#2A5A8C',
  primaryDark: '#0F2440',
  secondary: '#4A90D9',
  secondaryLight: '#6BA8E8',
  accent: '#00B4D8',
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',

  // Neutrals
  white: '#FFFFFF',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  border: '#E1E5EB',
  divider: '#DEE2E6',
  disabled: '#ADB5BD',
  placeholder: '#8E99A4',
  textPrimary: '#1A1A2E',
  textSecondary: '#6C757D',
  textLight: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Status
  statusSubmitted: '#28A745',
  statusPending: '#FFC107',
  statusDraft: '#6C757D',
  statusError: '#DC3545',
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 8,
  },
};
