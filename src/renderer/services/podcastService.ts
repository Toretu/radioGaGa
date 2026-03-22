import Parser from 'rss-parser';
import { Podcast, PodcastEpisode } from '../types';

const parser = new Parser({
  customFields: {
    item: [
      ['itunes:duration', 'duration'],
      ['itunes:image', 'image'],
    ]
  }
});

export const podcastService = {
  /**
   * Fetch and parse a podcast RSS feed
   */
  async fetchPodcast(feedUrl: string): Promise<Podcast> {
    try {
      const feed = await parser.parseURL(feedUrl);
      
      const episodes: PodcastEpisode[] = (feed.items || []).map((item, index) => {
        const podcastId = this.generatePodcastId(feedUrl);
        
        // Handle item properties safely
        const itemAny = item as any;
        
        return {
          id: `${podcastId}-ep-${index}`,
          podcastId,
          title: item.title || 'Untitled Episode',
          url: item.enclosure?.url || item.link || '',
          description: item.contentSnippet || item.content,
          duration: this.parseDuration(itemAny.duration || itemAny['itunes:duration']),
          publishDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          played: false,
          position: 0,
          thumbnail: itemAny.image?.url || itemAny['itunes:image']
        };
      });

      const podcast: Podcast = {
        id: this.generatePodcastId(feedUrl),
        name: feed.title || 'Untitled Podcast',
        url: feedUrl,
        feedUrl,
        type: 'podcast',
        logo: (feed as any).image?.url || (feed as any)['itunes:image'],
        description: feed.description,
        category: 'podcast',
        favorite: false,
        episodes,
        lastFetched: new Date()
      };

      return podcast;
    } catch (error) {
      console.error('Failed to fetch podcast:', error);
      throw new Error(`Failed to fetch podcast: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Generate a consistent podcast ID from feed URL
   */
  generatePodcastId(feedUrl: string): string {
    // Simple hash function for podcast ID
    const hash = feedUrl.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    return `podcast-${Math.abs(hash)}`;
  },

  /**
   * Parse duration string to seconds
   */
  parseDuration(duration: any): number | undefined {
    if (!duration) return undefined;
    
    if (typeof duration === 'number') return duration;
    
    if (typeof duration === 'string') {
      // Try to parse HH:MM:SS or MM:SS format
      const parts = duration.split(':').map(p => parseInt(p, 10));
      
      if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
      } else if (parts.length === 1) {
        return parts[0];
      }
    }
    
    return undefined;
  },

  /**
   * Format seconds to HH:MM:SS or MM:SS
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * Validate RSS feed URL
   */
  async validateFeedUrl(url: string): Promise<boolean> {
    try {
      await parser.parseURL(url);
      return true;
    } catch {
      return false;
    }
  }
};
