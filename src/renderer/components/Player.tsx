import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { audioService } from '../services/audioService';
import { podcastService } from '../services/podcastService';

const Player: React.FC = () => {
  const {
    currentChannel,
    currentEpisode,
    playbackState,
    volume,
    pausePlayback,
    stopPlayback,
    setVolume,
    playChannel,
    playEpisode,
    selectedPodcast
  } = useStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Update progress for podcasts
    if (currentEpisode && playbackState === 'playing') {
      const interval = setInterval(() => {
        const time = audioService.getPosition();
        const dur = audioService.getDuration();
        setCurrentTime(time);
        setDuration(dur);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [currentEpisode, playbackState]);

  const handlePlayPause = () => {
    if (!currentChannel) return;

    if (playbackState === 'playing') {
      pausePlayback();
    } else if (playbackState === 'paused') {
      if (currentEpisode && selectedPodcast) {
        playEpisode(selectedPodcast, currentEpisode);
      } else {
        playChannel(currentChannel);
      }
    }
  };

  const handleStop = () => {
    stopPlayback();
  };

  const handleSkipForward = () => {
    const newPosition = Math.min(currentTime + 15, duration);
    audioService.seek(newPosition);
    setCurrentTime(newPosition);
  };

  const handleSkipBackward = () => {
    const newPosition = Math.max(currentTime - 15, 0);
    audioService.seek(newPosition);
    setCurrentTime(newPosition);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentEpisode || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newPosition = percentage * duration;
    
    audioService.seek(newPosition);
    setCurrentTime(newPosition);
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

  const isPodcast = currentEpisode !== null;

  if (!currentChannel) {
    return (
      <div className="player">
        <div className="empty-state">
          <div className="empty-state-icon">📻</div>
          <p>Select a channel or episode to start listening</p>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      {/* Left: Now Playing Info */}
      <div className="now-playing">
        <img
          src={currentChannel.logo || 'https://via.placeholder.com/60'}
          alt={currentChannel.name}
          className="player-logo"
        />
        <div className="player-info">
          <h2 className="player-title">
            {currentEpisode ? currentEpisode.title : currentChannel.name}
          </h2>
          <p className="player-description">
            {currentEpisode ? currentChannel.name : (currentChannel.description || 'Radio')}
          </p>
          <div className={`playback-state ${playbackState}`}>
            {getPlaybackStateText()}
          </div>
        </div>
      </div>

      {/* Center: Controls and Progress */}
      <div className="controls">
        <div className="control-buttons">
          {isPodcast && (
            <button
              className="control-btn"
              onClick={handleSkipBackward}
              disabled={playbackState === 'stopped' || playbackState === 'loading'}
              title="Skip back 15s"
            >
              ⏪
            </button>
          )}
          
          <button
            className="control-btn primary"
            onClick={handlePlayPause}
            disabled={playbackState === 'loading'}
            title={playbackState === 'playing' ? 'Pause' : 'Play'}
          >
            {playbackState === 'playing' ? '⏸' : '▶'}
          </button>
          
          {isPodcast && (
            <button
              className="control-btn"
              onClick={handleSkipForward}
              disabled={playbackState === 'stopped' || playbackState === 'loading'}
              title="Skip forward 15s"
            >
              ⏩
            </button>
          )}
          
          <button
            className="control-btn"
            onClick={handleStop}
            disabled={playbackState === 'stopped'}
            title="Stop"
          >
            ⏹
          </button>
        </div>
        
        {isPodcast && duration > 0 && (
          <div className="podcast-progress">
            <span className="progress-time">{podcastService.formatDuration(currentTime)}</span>
            <div className="progress-bar-container" onClick={handleProgressClick}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="progress-time">{podcastService.formatDuration(duration)}</span>
          </div>
        )}
      </div>

      {/* Right: Volume */}
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
  );
};

export default Player;
