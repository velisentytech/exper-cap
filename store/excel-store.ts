import { create } from "zustand";

interface ExcelStore {
  data: any[];
  setData: (data: any[]) => void;
  clearData: () => void;
}

export const useExcelStore = create<ExcelStore>((set) => ({
  data: [],
  setData: (data) => set({ data }),
  clearData: () => set({ data: [] }),
}));
