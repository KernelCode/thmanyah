import { Episode } from "@/components/EpisodeCard";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Track {
  url: string;
  title: string;
  length: number; // Length in seconds
  artist?: string;
}
interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack?: Track;
  volume: number;
  progress: number;
  lastPlays: Episode[] | undefined;
}

interface AudioPlayerActions {
  play: () => void;
  pause: () => void;
  setCurrentTrack: (track: Track | undefined) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  reset: () => void;
  updateLastPlays?: (episode: Episode) => void;
}

const useAudioStore = create(
  persist<AudioPlayerState & AudioPlayerActions>(
    (set) => ({
      // Initial state
      isPlaying: false,
      currentTrack: undefined,
      volume: 1,
      progress: 0,
      lastPlays: undefined,
      // Actions
      updateLastPlays: (episode) =>
        set((state) => {
          if (!state.lastPlays) {
            return { lastPlays: [episode] };
          }
          const existingIndex = state.lastPlays.findIndex((e) => e.id === episode.id);
          if (existingIndex !== -1) {
            const updatedLastPlays = [...state.lastPlays];
            updatedLastPlays.splice(existingIndex, 1);
            updatedLastPlays.unshift(episode);
            return { lastPlays: updatedLastPlays };
          }
          return { lastPlays: [episode, ...state.lastPlays] };
        }),

      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: true }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setProgress: (progress) => set({ progress: Math.max(0, Math.min(1, progress)) }),
      reset: () =>
        set({
          isPlaying: false,
          currentTrack: undefined,
          progress: 0,
        }),
    }),
    {
      name: "audio-player-store",
    }
  )
);

export default useAudioStore;
