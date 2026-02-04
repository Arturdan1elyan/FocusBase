import { create } from 'zustand';

interface ProjectState {
  selectedProjectId: string | null;
  setSelectedProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  selectedProjectId: null, 
  setSelectedProject: (id) => set({ selectedProjectId: id }), 
}));