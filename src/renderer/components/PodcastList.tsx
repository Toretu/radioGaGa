import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Podcast } from '../types';

const PodcastList: React.FC = () => {
  const { podcasts, selectedPodcast, setSelectedPodcast, addPodcast, removePodcast, refreshPodcast } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [feedUrl, setFeedUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedUrl.trim()) {
      setError('Please enter a feed URL');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await addPodcast(feedUrl);
      setFeedUrl('');
      setIsAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add podcast');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (e: React.MouseEvent, podcastId: string) => {
    e.stopPropagation();
    try {
      await refreshPodcast(podcastId);
    } catch (err) {
      console.error('Failed to refresh:', err);
    }
  };

  const handleDelete = (e: React.MouseEvent, podcastId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this podcast?')) {
      removePodcast(podcastId);
    }
  };

  return (
    <div className="podcast-list">
      <div className="podcast-list-header">
        <h2>Podcasts</h2>
        <button 
          className="btn-add-channel" 
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? 'Cancel' : '+ Add Podcast'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddPodcast} className="add-podcast-form">
          <input
            type="text"
            value={feedUrl}
            onChange={(e) => setFeedUrl(e.target.value)}
            placeholder="Enter RSS feed URL"
            className={error ? 'error' : ''}
            disabled={loading}
          />
          {error && <span className="error-message">{error}</span>}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
      )}

      {podcasts.length === 0 && !isAdding && (
        <div className="empty-state">
          <div className="empty-state-icon">🎙️</div>
          <p>No podcasts yet</p>
          <p className="empty-state-hint">Add your first podcast to get started</p>
        </div>
      )}

      {podcasts.map((podcast) => (
        <div
          key={podcast.id}
          className={`channel-item ${selectedPodcast?.id === podcast.id ? 'active' : ''}`}
          onClick={() => setSelectedPodcast(podcast)}
        >
          <img
            src={podcast.logo || 'https://via.placeholder.com/48'}
            alt={podcast.name}
            className="channel-logo"
          />
          <div className="channel-info">
            <div className="channel-name">{podcast.name}</div>
            <div className="channel-description">
              {podcast.episodes?.length || 0} episodes
            </div>
          </div>
          <div className="channel-actions">
            <button
              className="refresh-btn"
              onClick={(e) => handleRefresh(e, podcast.id)}
              title="Refresh episodes"
            >
              🔄
            </button>
            <button
              className="delete-btn"
              onClick={(e) => handleDelete(e, podcast.id)}
              title="Remove podcast"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PodcastList;
