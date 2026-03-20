import { Howl } from 'howler';
import { Channel, PlaybackState } from '../types';

class AudioService {
  private currentSound: Howl | null = null;
  private currentChannel: Channel | null = null;
  private onStateChange: ((state: PlaybackState) => void) | null = null;

  setStateChangeCallback(callback: (state: PlaybackState) => void) {
    this.onStateChange = callback;
  }

  play(channel: Channel) {
    // Stop current playback
    if (this.currentSound) {
      this.currentSound.unload();
    }

    this.currentChannel = channel;
    this.onStateChange?.('loading');

    try {
      this.currentSound = new Howl({
        src: [channel.url],
        html5: true,
        format: ['mp3', 'aac'],
        onload: () => {
          this.onStateChange?.('playing');
        },
        onplay: () => {
          this.onStateChange?.('playing');
        },
        onpause: () => {
          this.onStateChange?.('paused');
        },
        onstop: () => {
          this.onStateChange?.('stopped');
        },
        onend: () => {
          // Streams shouldn't end, but restart if they do
          if (this.currentSound) {
            this.currentSound.play();
          }
        },
        onloaderror: (_id: number, error: unknown) => {
          console.error('Load error:', error);
          this.onStateChange?.('error');
        },
        onplayerror: (_id: number, error: unknown) => {
          console.error('Play error:', error);
          this.onStateChange?.('error');
        }
      });

      this.currentSound.play();
    } catch (error) {
      console.error('Error creating audio:', error);
      this.onStateChange?.('error');
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
    this.currentChannel = null;
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

  isPlaying(): boolean {
    return this.currentSound?.playing() || false;
  }
}

export const audioService = new AudioService();
