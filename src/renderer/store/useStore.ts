import { create } from 'zustand';
import { AppState, Channel, Podcast, PodcastEpisode } from '../types';
import { NRK_CHANNELS } from '../data/nrkChannels';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import { podcastService } from '../services/podcastService';

// Load persisted data
const customChannels = storageService.getCustomChannels();
const favorites = storageService.getFavorites();
const savedVolume = storageService.getVolume();
const savedPodcasts = storageService.getPodcasts();

// Merge NRK channels with custom channels and apply favorites
const allChannels = [
  ...NRK_CHANNELS.map(ch => ({ ...ch, favorite: favorites.includes(ch.id) })),
  ...customChannels.map(ch => ({ ...ch, favorite: favorites.includes(ch.id) }))
];

export const useStore = create<AppState>((set, get) => {
  // Set up audio service callbacks
  audioService.setStateChangeCallback((state) => {
    set({ playbackState: state });
  });

  audioService.setPositionUpdateCallback((position) => {
    const { currentEpisode } = get();
    if (currentEpisode) {
      get().updateEpisodePosition(currentEpisode.id, position);
    }
  });

  audioService.setEpisodeEndCallback(() => {
    const { currentEpisode } = get();
    if (currentEpisode) {
      get().markEpisodeAsPlayed(currentEpisode.id);
    }
  });

  // Set initial volume
  audioService.setVolume(savedVolume);

  return {
    // Initial state
    currentChannel: null,
    currentEpisode: null,
    playbackState: 'stopped',
    volume: savedVolume,
    channels: allChannels,
    podcasts: savedPodcasts,
    selectedPodcast: null,
    selectedCategory: null,
    viewMode: 'radio',

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
    },

    // Podcast actions
    addPodcast: async (feedUrl: string) => {
      try {
        const podcast = await podcastService.fetchPodcast(feedUrl);
        set((state) => ({
          podcasts: [...state.podcasts, podcast]
        }));
        storageService.addPodcast(podcast);
      } catch (error) {
        console.error('Failed to add podcast:', error);
        throw error;
      }
    },

    removePodcast: (podcastId: string) => {
      set((state) => ({
        podcasts: state.podcasts.filter(p => p.id !== podcastId),
        selectedPodcast: state.selectedPodcast?.id === podcastId ? null : state.selectedPodcast
      }));
      storageService.removePodcast(podcastId);
    },

    refreshPodcast: async (podcastId: string) => {
      const state = get();
      const podcast = state.podcasts.find(p => p.id === podcastId);
      if (!podcast) return;

      try {
        const updatedPodcast = await podcastService.fetchPodcast(podcast.feedUrl);
        set((state) => ({
          podcasts: state.podcasts.map(p =>
            p.id === podcastId ? updatedPodcast : p
          ),
          selectedPodcast: state.selectedPodcast?.id === podcastId ? updatedPodcast : state.selectedPodcast
        }));
        storageService.updatePodcast(podcastId, updatedPodcast);
      } catch (error) {
        console.error('Failed to refresh podcast:', error);
        throw error;
      }
    },

    setSelectedPodcast: (podcast: Podcast | null) => {
      set({ selectedPodcast: podcast });
    },

    playEpisode: (podcast: Podcast, episode: PodcastEpisode) => {
      const startPosition = storageService.getEpisodePosition(episode.id);
      set({ 
        currentChannel: podcast,
        currentEpisode: episode
      });
      audioService.playEpisode(episode, podcast, startPosition);
    },

    updateEpisodePosition: (episodeId: string, position: number) => {
      // Save position every update
      storageService.saveEpisodePosition(episodeId, position);
      
      // Update episode position in the podcast episodes array
      set((state) => ({
        podcasts: state.podcasts.map(podcast => ({
          ...podcast,
          episodes: podcast.episodes?.map(ep =>
            ep.id === episodeId ? { ...ep, position } : ep
          )
        }))
      }));
    },

    markEpisodeAsPlayed: (episodeId: string) => {
      set((state) => ({
        podcasts: state.podcasts.map(podcast => ({
          ...podcast,
          episodes: podcast.episodes?.map(ep =>
            ep.id === episodeId ? { ...ep, played: true, position: 0 } : ep
          )
        })),
        currentEpisode: null
      }));
      
      // Update in storage
      const { podcasts } = get();
      podcasts.forEach(podcast => {
        const episode = podcast.episodes?.find(ep => ep.id === episodeId);
        if (episode) {
          storageService.updatePodcast(podcast.id, podcast);
        }
      });
    },

    setViewMode: (mode: 'radio' | 'podcast') => {
      set({ viewMode: mode });
    }
  };
});
