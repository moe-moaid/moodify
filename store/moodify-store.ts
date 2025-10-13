import { create } from 'zustand';

interface MoodifyState {
  image: string | null;
  mood: string;
  caption: string | null;
  setImage: (uri: string) => void;
  setMood: (mood: string) => void;
  setCaption: (caption: string) => void;
  reset: () => void;
}

export const useMoodifyStore = create<MoodifyState>((set: any) => ({
  image: null,
  mood: 'aesthetic',
  caption: null,
  setImage: (uri: string) => set({ image: uri, caption: null }),
  setMood: (mood: string) => set({ mood }),
  setCaption: (caption: string) => set({ caption }),
  reset: () => set({ image: null, mood: 'aesthetic', caption: null }),
}));
