import { get, set } from 'idb-keyval';

export interface SavedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string; // base64
  uploadedAt: number;
}

const STORE_KEY = 'lexora_documents';

export const saveDocument = async (file: File): Promise<SavedDocument> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const content = reader.result as string;
      const doc: SavedDocument = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        content,
        uploadedAt: Date.now(),
      };
      
      try {
        const existingDocs = await getDocuments();
        await set(STORE_KEY, [...existingDocs, doc]);
        resolve(doc);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getDocuments = async (): Promise<SavedDocument[]> => {
  const docs = await get(STORE_KEY);
  return docs || [];
};

export const deleteDocument = async (id: string): Promise<void> => {
  const docs = await getDocuments();
  const newDocs = docs.filter(d => d.id !== id);
  await set(STORE_KEY, newDocs);
};
