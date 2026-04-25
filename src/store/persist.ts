import { createJSONStorage } from 'zustand/middleware';
import { storageService } from '../services/storageService';

export const secureJsonStorage = createJSONStorage(() => storageService);
