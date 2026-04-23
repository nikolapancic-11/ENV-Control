import * as FileSystem from 'expo-file-system';
import Config from '../constants/config';
import { createApiClient } from './api';

const sp = createApiClient(
  `${Config.sharePoint.siteUrl}/_api/web`,
);

const LIB = Config.sharePoint.documentLibrary;

export async function uploadDocument(
  fileName: string,
  fileUri: string,
  folder?: string,
): Promise<{ url: string }> {
  const folderPath = folder
    ? `${LIB}/${folder}`
    : LIB;

  const fileContent = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const buffer = Uint8Array.from(atob(fileContent), (c) => c.charCodeAt(0));

  const response = await sp.post(
    `/GetFolderByServerRelativeUrl('${folderPath}')/Files/add(url='${fileName}',overwrite=true)`,
    buffer,
    { headers: { 'Content-Type': 'application/octet-stream' } },
  );

  return { url: response.data.ServerRelativeUrl as string };
}

export async function listDocuments(
  folder?: string,
): Promise<Array<{ name: string; url: string; modified: string }>> {
  const folderPath = folder
    ? `${LIB}/${folder}`
    : LIB;

  const response = await sp.get(
    `/GetFolderByServerRelativeUrl('${folderPath}')/Files`,
  );

  return (response.data.value as any[]).map((f) => ({
    name: f.Name,
    url: f.ServerRelativeUrl,
    modified: f.TimeLastModified,
  }));
}

export function getDocumentUrl(fileName: string): string {
  return `${Config.sharePoint.siteUrl}/${LIB}/${fileName}`;
}
