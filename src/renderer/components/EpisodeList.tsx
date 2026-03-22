import React from 'react';
import { useStore } from '../store/useStore';
import { PodcastEpisode } from '../types';
import { podcastService } from '../services/podcastService';

const EpisodeList: React.FC = () => {
  const { selectedPodcast, currentEpisode, playEpisode, playbackState } = useStore();

  if (!selectedPodcast) {
    return (
      <div className="episode-list-empty">
        <div className="empty-state">
          <div className="empty-state-icon">🎙️</div>
          <p>Select a podcast to view episodes</p>
        </div>
      </div>
    );
  }

  const episodes = selectedPodcast.episodes || [];

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    playEpisode(selectedPodcast, episode);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return d.toLocaleDateString();
  };

  return (
    <div className="episode-list">
      <div className="episode-list-header">
        <img 
          src={selectedPodcast.logo || 'https://via.placeholder.com/80'} 
          alt={selectedPodcast.name}
          className="podcast-header-logo"
        />
        <div className="podcast-header-info">
          <h2>{selectedPodcast.name}</h2>
          <p className="podcast-description">{selectedPodcast.description}</p>
          <p className="episode-count">{episodes.length} episodes</p>
        </div>
      </div>

      <div className="episodes">
        {episodes.length === 0 && (
          <div className="empty-state">
            <p>No episodes available</p>
          </div>
        )}

        {episodes.map((episode) => {
          const isPlaying = currentEpisode?.id === episode.id && playbackState === 'playing';
          const isPaused = currentEpisode?.id === episode.id && playbackState === 'paused';
          const progressPercent = episode.duration && episode.position 
            ? (episode.position / episode.duration) * 100 
            : 0;

          return (
            <div
              key={episode.id}
              className={`episode-item ${currentEpisode?.id === episode.id ? 'active' : ''} ${episode.played ? 'played' : ''}`}
              onClick={() => handlePlayEpisode(episode)}
            >
              <div className="episode-play-button">
                {isPlaying ? '⏸' : '▶'}
              </div>
              
              <div className="episode-content">
                <div className="episode-header">
                  <h3 className="episode-title">{episode.title}</h3>
                  <span className="episode-date">{formatDate(episode.publishDate)}</span>
                </div>
                
                {episode.description && (
                  <p className="episode-description">
                    {episode.description.substring(0, 150)}
                    {episode.description.length > 150 ? '...' : ''}
                  </p>
                )}
                
                <div className="episode-meta">
                  {episode.duration && (
                    <span className="episode-duration">
                      {podcastService.formatDuration(episode.duration)}
                    </span>
                  )}
                  
                  {episode.position > 0 && episode.duration && (
                    <span className="episode-progress-text">
                      {podcastService.formatDuration(episode.position)} / {podcastService.formatDuration(episode.duration)}
                    </span>
                  )}
                </div>

                {progressPercent > 0 && (
                  <div className="episode-progress-bar">
                    <div 
                      className="episode-progress-fill" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EpisodeList;
