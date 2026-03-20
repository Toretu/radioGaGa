import React, { useState, useEffect } from 'react';
import { Channel } from '../types';
import { useStore } from '../store/useStore';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  editChannel?: Channel | null;
}

const AddChannelModal: React.FC<AddChannelModalProps> = ({ isOpen, onClose, editChannel }) => {
  const { addChannel, updateChannel } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    category: 'custom',
    logo: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Populate form when editing
  useEffect(() => {
    if (editChannel) {
      setFormData({
        name: editChannel.name,
        url: editChannel.url,
        description: editChannel.description || '',
        category: editChannel.category || 'custom',
        logo: editChannel.logo || ''
      });
    } else {
      // Reset form when not editing
      setFormData({
        name: '',
        url: '',
        description: '',
        category: 'custom',
        logo: ''
      });
    }
    setErrors({});
  }, [editChannel, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Channel name is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'Stream URL is required';
    } else {
      // Basic URL validation
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editChannel) {
      // Update existing channel
      updateChannel(editChannel.id, {
        name: formData.name.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        category: formData.category,
        logo: formData.logo.trim() || undefined
      });
    } else {
      // Add new channel
      const newChannel: Channel = {
        id: `custom-${Date.now()}`,
        name: formData.name.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        category: formData.category,
        logo: formData.logo.trim() || undefined,
        type: 'radio',
        favorite: false
      };
      addChannel(newChannel);
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      url: '',
      description: '',
      category: 'custom',
      logo: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editChannel ? 'Edit Channel' : 'Add Custom Channel'}</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="channel-form">
          <div className="form-group">
            <label htmlFor="name">Channel Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., My Radio Station"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="url">Stream URL *</label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com/stream.mp3"
              className={errors.url ? 'error' : ''}
            />
            {errors.url && <span className="error-message">{errors.url}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="custom">Custom</option>
              <option value="music">Music</option>
              <option value="news">News</option>
              <option value="culture">Culture</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="logo">Logo URL (optional)</label>
            <input
              type="text"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editChannel ? 'Update Channel' : 'Add Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChannelModal;
