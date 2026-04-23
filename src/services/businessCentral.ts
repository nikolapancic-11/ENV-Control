import Config from '../constants/config';
import { Category, Subcategory, Account, JournalEntry } from '../types';
import { createApiClient } from './api';

const { tenantId, environment, companyId } = Config.businessCentral;

const bc = createApiClient(
  `${Config.businessCentral.baseUrl}/${tenantId}/${environment}/api/v2.0/companies(${companyId})`,
);

export async function getCategories(): Promise<Category[]> {
  const response = await bc.get('/dimensionValues', {
    params: { $filter: "dimensionCode eq 'EMISSION_CAT'" },
  });
  return response.data.value as Category[];
}

export async function getSubcategories(
  categoryId: string,
): Promise<Subcategory[]> {
  const response = await bc.get('/dimensionValues', {
    params: {
      $filter: `dimensionCode eq 'EMISSION_SUB' and parentId eq '${categoryId}'`,
    },
  });
  return response.data.value as Subcategory[];
}

export async function getAccounts(): Promise<Account[]> {
  const response = await bc.get('/accounts', {
    params: { $filter: 'blocked eq false' },
  });
  return response.data.value as Account[];
}

export async function submitJournalEntry(
  entry: JournalEntry,
): Promise<JournalEntry> {
  const response = await bc.post('/generalJournalLines', entry);
  return response.data as JournalEntry;
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const response = await bc.get('/generalJournalLines');
  return response.data.value as JournalEntry[];
}
