import { create } from 'zustand';

type Machine = {
  id: number;
  machine_code: string;
  machine_desc: string;
  adet: number;
  power: number;
  puan: number;
};

type MachineStore = {
  selectedMachines: Machine[];
  setSelectedMachines: (machines: Machine[]) => void;
};

export const useMachineStore = create<MachineStore>((set) => ({
  selectedMachines: [],
  setSelectedMachines: (machines) => set({ selectedMachines: machines }),
}));
