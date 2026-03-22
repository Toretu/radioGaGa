import React from 'react';
import { useStore } from './store/useStore';
import ChannelList from './components/ChannelList';
import PodcastList from './components/PodcastList';
import EpisodeList from './components/EpisodeList';
import Player from './components/Player';
import './styles.css';

const App: React.FC = () => {
  const { viewMode, setViewMode } = useStore();

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎵 MyRadio</h1>
        <p className="subtitle">Norwegian Radio & Podcast Player</p>
        
        <div className="view-mode-toggle">
          <button
            className={`view-mode-btn ${viewMode === 'radio' ? 'active' : ''}`}
            onClick={() => setViewMode('radio')}
          >
            📻 Radio
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'podcast' ? 'active' : ''}`}
            onClick={() => setViewMode('podcast')}
          >
            🎙️ Podcasts
          </button>
        </div>
      </header>
      
      <div className="app-content">
        <aside className="sidebar">
          {viewMode === 'radio' ? <ChannelList /> : <PodcastList />}
        </aside>
        
        <main className="main-content">
          {viewMode === 'radio' ? (
            <div className="radio-view">
              {/* Radio channels view is just the empty space */}
            </div>
          ) : (
            <EpisodeList />
          )}
        </main>
      </div>

      {/* Fixed player bar at bottom */}
      <div className="player-bar">
        <Player />
      </div>
    </div>
  );
};

export default App;
