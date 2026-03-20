import { create } from 'zustand';
import { AppState, Channel } from '../types';
import { NRK_CHANNELS } from '../data/nrkChannels';
import { audioService } from '../services/audioService';

export const useStore = create<AppState>((set, get) => {
  // Set up audio service state change callback
  audioService.setStateChangeCallback((state) => {
    set({ playbackState: state });
  });

  return {
    // Initial state
    currentChannel: null,
    playbackState: 'stopped',
    volume: 0.7,
    channels: [...NRK_CHANNELS],
    selectedCategory: null,

    // Actions
    playChannel: (channel: Channel) => {
      const state = get();
      
      if (state.currentChannel?.id === channel.id && state.playbackState === 'paused') {
        // Resume if same channel is paused
        audioService.resume();
      } else {
        // Play new channel
        set({ currentChannel: channel });
        audioService.play(channel);
      }
    },

    pausePlayback: () => {
      audioService.pause();
    },

    stopPlayback: () => {
      audioService.stop();
      set({ currentChannel: null });
    },

    setVolume: (volume: number) => {
      set({ volume });
      audioService.setVolume(volume);
    },

    setPlaybackState: (state) => {
      set({ playbackState: state });
    },

    addChannel: (channel: Channel) => {
      set((state) => ({
        channels: [...state.channels, channel]
      }));
    },

    removeChannel: (channelId: string) => {
      set((state) => ({
        channels: state.channels.filter((ch) => ch.id !== channelId)
      }));
    },

    toggleFavorite: (channelId: string) => {
      set((state) => ({
        channels: state.channels.map((ch) =>
          ch.id === channelId ? { ...ch, favorite: !ch.favorite } : ch
        )
      }));
    },

    setSelectedCategory: (category: string | null) => {
      set({ selectedCategory: category });
    }
  };
});
