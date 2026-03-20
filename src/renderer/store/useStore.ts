import { create } from 'zustand';
import { AppState, Channel } from '../types';
import { NRK_CHANNELS } from '../data/nrkChannels';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';

// Load persisted data
const customChannels = storageService.getCustomChannels();
const favorites = storageService.getFavorites();
const savedVolume = storageService.getVolume();

// Merge NRK channels with custom channels and apply favorites
const allChannels = [
  ...NRK_CHANNELS.map(ch => ({ ...ch, favorite: favorites.includes(ch.id) })),
  ...customChannels.map(ch => ({ ...ch, favorite: favorites.includes(ch.id) }))
];

export const useStore = create<AppState>((set, get) => {
  // Set up audio service state change callback
  audioService.setStateChangeCallback((state) => {
    set({ playbackState: state });
  });

  // Set initial volume
  audioService.setVolume(savedVolume);

  return {
    // Initial state
    currentChannel: null,
    playbackState: 'stopped',
    volume: savedVolume,
    channels: allChannels,
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
      storageService.saveVolume(volume);
    },

    setPlaybackState: (state) => {
      set({ playbackState: state });
    },

    addChannel: (channel: Channel) => {
      set((state) => ({
        channels: [...state.channels, channel]
      }));
      // Persist custom channel
      storageService.addCustomChannel(channel);
    },

    updateChannel: (channelId: string, updates: Partial<Channel>) => {
      set((state) => ({
        channels: state.channels.map((ch) =>
          ch.id === channelId ? { ...ch, ...updates } : ch
        )
      }));
      // Persist update if it's a custom channel
      const customChannels = storageService.getCustomChannels();
      if (customChannels.some(ch => ch.id === channelId)) {
        storageService.updateCustomChannel(channelId, updates);
      }
    },

    removeChannel: (channelId: string) => {
      set((state) => ({
        channels: state.channels.filter((ch) => ch.id !== channelId)
      }));
      // Remove from storage
      storageService.removeCustomChannel(channelId);
    },

    toggleFavorite: (channelId: string) => {
      set((state) => ({
        channels: state.channels.map((ch) =>
          ch.id === channelId ? { ...ch, favorite: !ch.favorite } : ch
        )
      }));
      // Persist favorite status
      storageService.toggleFavorite(channelId);
    },

    setSelectedCategory: (category: string | null) => {
      set({ selectedCategory: category });
    }
  };
});
