import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Channel } from '../types';
import AddChannelModal from './AddChannelModal';
import { NRK_CHANNELS } from '../data/nrkChannels';

const ChannelList: React.FC = () => {
  const { channels, currentChannel, playChannel, toggleFavorite, removeChannel } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);

  const handleChannelClick = (channel: Channel) => {
    playChannel(channel);
  };

  const handleFavoriteClick = (e: React.MouseEvent, channelId: string) => {
    e.stopPropagation();
    toggleFavorite(channelId);
  };

  const handleEditClick = (e: React.MouseEvent, channel: Channel) => {
    e.stopPropagation();
    setEditingChannel(channel);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, channel: Channel) => {
    e.stopPropagation();
    
    if (confirm(`Are you sure you want to delete "${channel.name}"?`)) {
      removeChannel(channel.id);
    }
  };

  const handleAddChannel = () => {
    setEditingChannel(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingChannel(null);
  };

  // Check if channel is a built-in NRK channel
  const isNRKChannel = (channelId: string) => {
    return NRK_CHANNELS.some(ch => ch.id === channelId);
  };

  return (
    <div className="channel-list">
      <div className="channel-list-header">
        <h2>Radio Channels</h2>
        <button className="btn-add-channel" onClick={handleAddChannel} title="Add custom channel">
          + Add Channel
        </button>
      </div>

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
          <div className="channel-actions">
            <button
              className={`favorite-btn ${channel.favorite ? 'active' : ''}`}
              onClick={(e) => handleFavoriteClick(e, channel.id)}
              title={channel.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {channel.favorite ? '★' : '☆'}
            </button>
            {!isNRKChannel(channel.id) && (
              <>
                <button
                  className="edit-btn"
                  onClick={(e) => handleEditClick(e, channel)}
                  title="Edit channel"
                >
                  ✏️
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeleteClick(e, channel)}
                  title="Delete channel"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      <AddChannelModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editChannel={editingChannel}
      />
    </div>
  );
};

export default ChannelList;
