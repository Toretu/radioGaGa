import { Channel, Podcast, PodcastEpisode } from '../types';

// Use localStorage for renderer process storage
const STORAGE_KEYS = {
  CUSTOM_CHANNELS: 'myradio_custom_channels',
  FAVORITES: 'myradio_favorites',
  VOLUME: 'myradio_volume',
  LAST_PLAYED: 'myradio_last_played',
  PODCASTS: 'myradio_podcasts',
  EPISODE_POSITIONS: 'myradio_episode_positions'
};

const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStoredData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const storageService = {
  // Custom channels
  getCustomChannels(): Channel[] {
    return getStoredData<Channel[]>(STORAGE_KEYS.CUSTOM_CHANNELS, []);
  },

  saveCustomChannels(channels: Channel[]): void {
    setStoredData(STORAGE_KEYS.CUSTOM_CHANNELS, channels);
  },

  addCustomChannel(channel: Channel): void {
    const channels = this.getCustomChannels();
    channels.push(channel);
    this.saveCustomChannels(channels);
  },

  updateCustomChannel(channelId: string, updates: Partial<Channel>): void {
    const channels = this.getCustomChannels();
    const index = channels.findIndex(ch => ch.id === channelId);
    if (index !== -1) {
      channels[index] = { ...channels[index], ...updates };
      this.saveCustomChannels(channels);
    }
  },

  removeCustomChannel(channelId: string): void {
    const channels = this.getCustomChannels();
    const filtered = channels.filter(ch => ch.id !== channelId);
    this.saveCustomChannels(filtered);
  },

  // Favorites
  getFavorites(): string[] {
    return getStoredData<string[]>(STORAGE_KEYS.FAVORITES, []);
  },

  toggleFavorite(channelId: string): void {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(channelId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(channelId);
    }
    
    setStoredData(STORAGE_KEYS.FAVORITES, favorites);
  },

  isFavorite(channelId: string): boolean {
    return this.getFavorites().includes(channelId);
  },

  // Volume
  getVolume(): number {
    return getStoredData<number>(STORAGE_KEYS.VOLUME, 0.7);
  },

  saveVolume(volume: number): void {
    setStoredData(STORAGE_KEYS.VOLUME, volume);
  },

  // Last played channel
  getLastPlayedChannelId(): string | null {
    return getStoredData<string | null>(STORAGE_KEYS.LAST_PLAYED, null);
  },

  saveLastPlayedChannelId(channelId: string | null): void {
    setStoredData(STORAGE_KEYS.LAST_PLAYED, channelId);
  },

  // Podcasts
  getPodcasts(): Podcast[] {
    return getStoredData<Podcast[]>(STORAGE_KEYS.PODCASTS, []);
  },

  savePodcasts(podcasts: Podcast[]): void {
    setStoredData(STORAGE_KEYS.PODCASTS, podcasts);
  },

  addPodcast(podcast: Podcast): void {
    const podcasts = this.getPodcasts();
    podcasts.push(podcast);
    this.savePodcasts(podcasts);
  },

  updatePodcast(podcastId: string, updates: Partial<Podcast>): void {
    const podcasts = this.getPodcasts();
    const index = podcasts.findIndex(p => p.id === podcastId);
    if (index !== -1) {
      podcasts[index] = { ...podcasts[index], ...updates };
      this.savePodcasts(podcasts);
    }
  },

  removePodcast(podcastId: string): void {
    const podcasts = this.getPodcasts();
    const filtered = podcasts.filter(p => p.id !== podcastId);
    this.savePodcasts(filtered);
  },

  // Episode positions
  getEpisodePosition(episodeId: string): number {
    const positions = getStoredData<Record<string, number>>(STORAGE_KEYS.EPISODE_POSITIONS, {});
    return positions[episodeId] || 0;
  },

  saveEpisodePosition(episodeId: string, position: number): void {
    const positions = getStoredData<Record<string, number>>(STORAGE_KEYS.EPISODE_POSITIONS, {});
    positions[episodeId] = position;
    setStoredData(STORAGE_KEYS.EPISODE_POSITIONS, positions);
  }
};
