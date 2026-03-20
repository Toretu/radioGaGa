import React from 'react';
import { useStore } from './store/useStore';
import ChannelList from './components/ChannelList';
import Player from './components/Player';
import './styles.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🎵 MyRadio</h1>
        <p className="subtitle">Norwegian Radio Player</p>
      </header>
      
      <div className="app-content">
        <aside className="sidebar">
          <ChannelList />
        </aside>
        
        <main className="main-content">
          <Player />
        </main>
      </div>
    </div>
  );
};

export default App;
