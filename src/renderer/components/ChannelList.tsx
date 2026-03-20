import React from 'react';
import { useStore } from '../store/useStore';
import { Channel } from '../types';

const ChannelList: React.FC = () => {
  const { channels, currentChannel, playChannel, toggleFavorite } = useStore();

  const handleChannelClick = (channel: Channel) => {
    playChannel(channel);
  };

  const handleFavoriteClick = (e: React.MouseEvent, channelId: string) => {
    e.stopPropagation();
    toggleFavorite(channelId);
  };

  return (
    <div className="channel-list">
      <h2>Radio Channels</h2>
      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`channel-item ${currentChannel?.id === channel.id ? 'active' : ''}`}
          onClick={() => handleChannelClick(channel)}
        >
          <img
            src={channel.logo || 'https://via.placeholder.com/48'}
            alt={channel.name}
            className="channel-logo"
          />
          <div className="channel-info">
            <div className="channel-name">{channel.name}</div>
            <div className="channel-description">{channel.description}</div>
          </div>
          <button
            className={`favorite-btn ${channel.favorite ? 'active' : ''}`}
            onClick={(e) => handleFavoriteClick(e, channel.id)}
            title={channel.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {channel.favorite ? '★' : '☆'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChannelList;
