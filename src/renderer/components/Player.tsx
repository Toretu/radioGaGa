import React from 'react';
import { useStore } from '../store/useStore';

const Player: React.FC = () => {
  const {
    currentChannel,
    playbackState,
    volume,
    pausePlayback,
    stopPlayback,
    setVolume,
    playChannel
  } = useStore();

  const handlePlayPause = () => {
    if (!currentChannel) return;

    if (playbackState === 'playing') {
      pausePlayback();
    } else if (playbackState === 'paused') {
      playChannel(currentChannel);
    }
  };

  const handleStop = () => {
    stopPlayback();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const getPlaybackStateText = () => {
    switch (playbackState) {
      case 'playing':
        return 'Now Playing';
      case 'paused':
        return 'Paused';
      case 'loading':
        return 'Loading...';
      case 'error':
        return 'Error';
      case 'stopped':
      default:
        return 'Stopped';
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return '🔇';
    if (volume < 0.5) return '🔉';
    return '🔊';
  };

  if (!currentChannel) {
    return (
      <div className="player">
        <div className="empty-state">
          <div className="empty-state-icon">📻</div>
          <p>Select a channel to start listening</p>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      <div className="now-playing">
        <img
          src={currentChannel.logo || 'https://via.placeholder.com/200'}
          alt={currentChannel.name}
          className="player-logo"
        />
        <h2 className="player-title">{currentChannel.name}</h2>
        <p className="player-description">{currentChannel.description}</p>
        <div className={`playback-state ${playbackState}`}>
          {getPlaybackStateText()}
        </div>
      </div>

      <div className="controls">
        <div className="control-buttons">
          <button
            className="control-btn"
            onClick={handleStop}
            disabled={playbackState === 'stopped'}
            title="Stop"
          >
            ⏹
          </button>
          <button
            className="control-btn primary"
            onClick={handlePlayPause}
            disabled={playbackState === 'loading'}
            title={playbackState === 'playing' ? 'Pause' : 'Play'}
          >
            {playbackState === 'playing' ? '⏸' : '▶'}
          </button>
        </div>

        <div className="volume-control">
          <span className="volume-icon">{getVolumeIcon()}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
          <span className="volume-value">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default Player;
