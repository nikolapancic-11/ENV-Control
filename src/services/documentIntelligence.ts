import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import Config from '../constants/config';
import { DocumentExtractionResult, DocumentLineItem } from '../types';

const { endpoint, apiKey, modelId } = Config.documentIntelligence;
const POLL_INTERVAL_MS = 1500;

export async function analyzeDocument(
  fileUri: string,
): Promise<DocumentExtractionResult> {
  const fileContent = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const buffer = Uint8Array.from(atob(fileContent), (c) => c.charCodeAt(0));

  // Start analysis
  const startResponse = await axios.post(
    `${endpoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`,
    buffer,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/octet-stream',
      },
    },
  );

  const operationLocation = startResponse.headers['operation-location'];
  if (!operationLocation) {
    throw new Error('No Operation-Location header in ADI response');
  }

  // Poll until complete
  let result: any;
  while (true) {
    const pollResponse = await axios.get(operationLocation, {
      headers: { 'Ocp-Apim-Subscription-Key': apiKey },
    });

    const { status } = pollResponse.data;
    if (status === 'succeeded') {
      result = pollResponse.data;
      break;
    }
    if (status === 'failed') {
      throw new Error('Document analysis failed');
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  return parseInvoiceResult(result);
}

export function parseInvoiceResult(adiResponse: any): DocumentExtractionResult {
  const doc = adiResponse.analyzeResult?.documents?.[0];
  const fields = doc?.fields ?? {};

  const lineItems: DocumentLineItem[] = (
    fields.Items?.values ?? []
  ).map((item: any) => {
    const p = item.properties ?? {};
    return {
      description: p.Description?.content ?? '',
      quantity: p.Quantity?.value ?? 0,
      unitPrice: p.UnitPrice?.value ?? 0,
      amount: p.Amount?.value ?? 0,
      unit: p.Unit?.content,
    };
  });

  const confidence = doc?.confidence ?? 0;

  const rawFields: Record<string, string> = {};
  for (const [key, val] of Object.entries(fields)) {
    rawFields[key] = (val as any)?.content ?? '';
  }

  return {
    vendor: fields.VendorName?.content ?? '',
    invoiceDate: fields.InvoiceDate?.content ?? '',
    invoiceNumber: fields.InvoiceId?.content ?? '',
    totalAmount: fields.InvoiceTotal?.value ?? 0,
    currency: fields.CurrencyCode?.content ?? '',
    lineItems,
    confidence,
    rawFields,
  };
}
