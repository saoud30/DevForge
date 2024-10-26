import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Template, HistoryItem } from './types';

interface AppState {
  templates: Template[];
  history: HistoryItem[];
  theme: 'light' | 'dark' | 'system';
  addTemplate: (template: Template) => void;
  removeTemplate: (id: string) => void;
  addHistoryItem: (item: HistoryItem) => void;
  clearHistory: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      templates: [],
      history: [],
      theme: 'system',
      addTemplate: (template) =>
        set((state) => ({
          templates: [...state.templates, template],
        })),
      removeTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),
      addHistoryItem: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 10),
        })),
      clearHistory: () => set({ history: [] }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'devforge-storage',
    }
  )
);