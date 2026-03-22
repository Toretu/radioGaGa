import { Howl } from 'howler';
import { Channel, PlaybackState, PodcastEpisode } from '../types';

class AudioService {
  private currentSound: Howl | null = null;
  private currentChannel: Channel | null = null;
  private currentEpisode: PodcastEpisode | null = null;
  private onStateChange: ((state: PlaybackState) => void) | null = null;
  private onPositionUpdate: ((position: number) => void) | null = null;
  private onEpisodeEnd: (() => void) | null = null;
  private positionInterval: NodeJS.Timeout | null = null;

  setStateChangeCallback(callback: (state: PlaybackState) => void) {
    this.onStateChange = callback;
  }

  setPositionUpdateCallback(callback: (position: number) => void) {
    this.onPositionUpdate = callback;
  }

  setEpisodeEndCallback(callback: () => void) {
    this.onEpisodeEnd = callback;
  }

  play(channel: Channel, startPosition: number = 0) {
    // Stop current playback
    if (this.currentSound) {
      this.currentSound.unload();
    }

    this.stopPositionTracking();
    this.currentChannel = channel;
    this.currentEpisode = null;
    this.onStateChange?.('loading');

    try {
      this.currentSound = new Howl({
        src: [channel.url],
        html5: true,
        format: ['mp3', 'aac'],
        onload: () => {
          if (startPosition > 0 && this.currentSound) {
            this.currentSound.seek(startPosition);
          }
          this.onStateChange?.('playing');
        },
        onplay: () => {
          this.onStateChange?.('playing');
          if (channel.type === 'podcast') {
            this.startPositionTracking();
          }
        },
        onpause: () => {
          this.onStateChange?.('paused');
          this.stopPositionTracking();
        },
        onstop: () => {
          this.onStateChange?.('stopped');
          this.stopPositionTracking();
        },
        onend: () => {
          if (channel.type === 'radio') {
            // Streams shouldn't end, but restart if they do
            if (this.currentSound) {
              this.currentSound.play();
            }
          } else {
            // Podcast episode ended
            this.stopPositionTracking();
            this.onStateChange?.('stopped');
            this.onEpisodeEnd?.();
          }
        },
        onloaderror: (_id: number, error: unknown) => {
          console.error('Load error:', error);
          this.onStateChange?.('error');
          this.stopPositionTracking();
        },
        onplayerror: (_id: number, error: unknown) => {
          console.error('Play error:', error);
          this.onStateChange?.('error');
          this.stopPositionTracking();
        }
      });

      this.currentSound.play();
    } catch (error) {
      console.error('Error creating audio:', error);
      this.onStateChange?.('error');
    }
  }

  playEpisode(episode: PodcastEpisode, podcast: Channel, startPosition: number = 0) {
    this.currentEpisode = episode;
    // Create a temporary channel object with the episode URL for playback
    const episodeChannel: Channel = {
      ...podcast,
      url: episode.url,  // Use the episode's audio URL
      type: 'podcast'
    };
    this.play(episodeChannel, startPosition);
  }

  private startPositionTracking() {
    // Update position every second
    this.positionInterval = setInterval(() => {
      const position = this.getPosition();
      if (position > 0) {
        this.onPositionUpdate?.(position);
      }
    }, 1000);
  }

  private stopPositionTracking() {
    if (this.positionInterval) {
      clearInterval(this.positionInterval);
      this.positionInterval = null;
    }
  }

  getPosition(): number {
    if (this.currentSound) {
      return this.currentSound.seek() as number;
    }
    return 0;
  }

  getDuration(): number {
    if (this.currentSound) {
      return this.currentSound.duration();
    }
    return 0;
  }

  seek(position: number) {
    if (this.currentSound) {
      this.currentSound.seek(position);
    }
  }

  pause() {
    if (this.currentSound) {
      this.currentSound.pause();
    }
  }

  resume() {
    if (this.currentSound) {
      this.currentSound.play();
    }
  }

  stop() {
    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound.unload();
      this.currentSound = null;
    }
    this.stopPositionTracking();
    this.currentChannel = null;
    this.currentEpisode = null;
    this.onStateChange?.('stopped');
  }

  setVolume(volume: number) {
    if (this.currentSound) {
      this.currentSound.volume(volume);
    }
  }

  getCurrentChannel(): Channel | null {
    return this.currentChannel;
  }

  getCurrentEpisode(): PodcastEpisode | null {
    return this.currentEpisode;
  }

  isPlaying(): boolean {
    return this.currentSound?.playing() || false;
  }
}

export const audioService = new AudioService();
