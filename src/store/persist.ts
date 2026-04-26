import { createJSONStorage } from 'zustand/middleware';
import * as FileSystem from 'expo-file-system/legacy';
import { storageService } from '../services/storageService';

export const secureJsonStorage = createJSONStorage(() => storageService);

const fileUri = (name: string) => `${FileSystem.documentDirectory ?? ''}${name}.json`;

const fileStorage = {
  getItem: async (name: string) => {
    if (!FileSystem.documentDirectory) {
      return storageService.getItem(name);
    }
    try {
      return await FileSystem.readAsStringAsync(fileUri(name));
    } catch {
      return storageService.getItem(name);
    }
  },
  setItem: async (name: string, value: string) => {
    if (!FileSystem.documentDirectory) {
      await storageService.setItem(name, value);
      return;
    }
    await FileSystem.writeAsStringAsync(fileUri(name), value);
  },
  removeItem: async (name: string) => {
    if (FileSystem.documentDirectory) {
      await FileSystem.deleteAsync(fileUri(name), { idempotent: true });
    }
    await storageService.removeItem(name);
  },
};

export const fileJsonStorage = createJSONStorage(() => fileStorage);
