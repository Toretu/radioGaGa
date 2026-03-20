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

export type PlaybackState = 'playing' | 'paused' | 'stopped' | 'loading' | 'error';

export interface AppState {
  // Playback state
  currentChannel: Channel | null;
  playbackState: PlaybackState;
  volume: number;
  
  // Channels
  channels: Channel[];
  
  // UI state
  selectedCategory: string | null;
  
  // Actions
  playChannel: (channel: Channel) => void;
  pausePlayback: () => void;
  stopPlayback: () => void;
  setVolume: (volume: number) => void;
  setPlaybackState: (state: PlaybackState) => void;
  addChannel: (channel: Channel) => void;
  updateChannel: (channelId: string, updates: Partial<Channel>) => void;
  removeChannel: (channelId: string) => void;
  toggleFavorite: (channelId: string) => void;
  setSelectedCategory: (category: string | null) => void;
}
