// ─── User ────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user' | 'finance';
  department?: string;
  avatarUrl?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// ─── Emissions ───────────────────────────────────────────────────
export type EmissionStatus = 'draft' | 'pending' | 'submitted' | 'error';

export type EmissionUnit = 'kgCO2e' | 'liters' | 'kWh' | 'km';

export interface EmissionEntry {
  id: string;
  date: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  accountId: string;
  accountName: string;
  amount: number;
  unit: EmissionUnit;
  description: string;
  status: EmissionStatus;
  documentUrl?: string;
  journalEntryId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  code: string;
  name: string;
  description?: string;
  emissionFactor?: number;
  unit: EmissionUnit;
}

export interface Account {
  id: string;
  number: string;
  name: string;
  category: string;
  blocked: boolean;
}

// ─── Business Central ────────────────────────────────────────────
export interface JournalEntry {
  id?: string;
  journalBatchName: string;
  lineNumber: number;
  accountType: string;
  accountNumber: string;
  postingDate: string;
  documentNumber: string;
  description: string;
  amount: number;
  dimensionValues?: Record<string, string>;
}

// ─── Dashboard ───────────────────────────────────────────────────
export interface DashboardStats {
  totalEmissions: number;
  totalEmissionsPreviousMonth: number;
  entriesCount: number;
  pendingCount: number;
  topCategory: string;
  topCategoryAmount: number;
  recentEntries: EmissionEntry[];
}

// ─── Document Intelligence ───────────────────────────────────────
export interface DocumentExtractionResult {
  vendor: string;
  invoiceDate: string;
  invoiceNumber: string;
  totalAmount: number;
  currency: string;
  lineItems: DocumentLineItem[];
  confidence: number;
  rawFields: Record<string, string>;
}

export interface DocumentLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  unit?: string;
}

// ─── API Responses ───────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── Filter / Sort ───────────────────────────────────────────────
export interface HistoryFilters {
  dateFrom?: string;
  dateTo?: string;
  categoryId?: string;
  status?: EmissionStatus;
  searchQuery?: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

// ─── Notifications ───────────────────────────────────────────────
export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}
