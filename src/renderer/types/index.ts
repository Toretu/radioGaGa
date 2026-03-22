export interface Channel {
  id: string;
  name: string;
  url: string;
  type: 'radio' | 'podcast';
  logo?: string;
  description?: string;
  category?: string;
  favorite: boolean;
  lastPlayed?: Date;
}

export interface PodcastEpisode {
  id: string;
  podcastId: string;
  title: string;
  url: string;
  description?: string;
  duration?: number;
  publishDate: Date;
  played: boolean;
  position: number; // For resume playback (in seconds)
  thumbnail?: string;
}

export interface Podcast extends Channel {
  type: 'podcast';
  feedUrl: string;
  episodes?: PodcastEpisode[];
  lastFetched?: Date;
}

export type PlaybackState = 'playing' | 'paused' | 'stopped' | 'loading' | 'error';

export interface AppState {
  // Playback state
  currentChannel: Channel | null;
  currentEpisode: PodcastEpisode | null;
  playbackState: PlaybackState;
  volume: number;
  
  // Channels
  channels: Channel[];
  
  // Podcasts
  podcasts: Podcast[];
  selectedPodcast: Podcast | null;
  
  // UI state
  selectedCategory: string | null;
  viewMode: 'radio' | 'podcast';
  
  // Actions
  playChannel: (channel: Channel) => void;
  playEpisode: (podcast: Podcast, episode: PodcastEpisode) => void;
  pausePlayback: () => void;
  stopPlayback: () => void;
  setVolume: (volume: number) => void;
  setPlaybackState: (state: PlaybackState) => void;
  addChannel: (channel: Channel) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  removeChannel: (channelId: string) => void;
  toggleFavorite: (channelId: string) => void;
  setSelectedCategory: (category: string | null) => void;
  
  // Podcast actions
  addPodcast: (feedUrl: string) => Promise<void>;
  removePodcast: (podcastId: string) => void;
  refreshPodcast: (podcastId: string) => Promise<void>;
  setSelectedPodcast: (podcast: Podcast | null) => void;
  updateEpisodePosition: (episodeId: string, position: number) => void;
  markEpisodeAsPlayed: (episodeId: string) => void;
  setViewMode: (mode: 'radio' | 'podcast') => void;
}
