# MyRadio - Desktop Radio Player
## Project Plan

### Project Overview
A desktop radio player application for Windows that can stream Norwegian NRK radio channels, with support for custom channels and podcasts. Built with cross-platform technology for future expansion.

---

## Technology Stack

### Recommended: Electron + React + TypeScript
**Why this stack:**
- ✅ Cross-platform ready (Windows, macOS, Linux)
- ✅ Modern, native-looking UI with HTML/CSS
- ✅ Large community and extensive libraries
- ✅ Easy media streaming integration
- ✅ Auto-update capabilities
- ✅ System tray integration

**Alternative Options (for consideration):**
- Python + PyQt6 (Good for rapid development)
- Flutter Desktop (Newer, growing ecosystem)
- .NET MAUI (Microsoft ecosystem, good Windows support)

---

## Core Features

### Phase 1: MVP (Minimum Viable Product)
1. **Basic Audio Playback**
   - Play/Pause/Stop controls
   - Volume control
   - Current playing status display

2. **Pre-configured NRK Channels**
   - P1
   - P2
   - P3
   - NRK Alltid Nyheter (News)
   - Channel list display

3. **Basic UI**
   - Main window with channel list
   - Playback controls
   - Now playing information

### Phase 2: Extended Features
1. **Channel Management**
   - Add custom radio channels
   - Edit channel information
   - Delete channels
   - Import/Export channel lists

2. **Podcast Support**
   - Add podcast feeds
   - Browse podcast episodes
   - Play podcast episodes
   - Track playback position

3. **Enhanced UI**
   - Channel favorites/bookmarks
   - Recent channels history
   - Search functionality
   - Mini player mode

### Phase 3: Advanced Features
1. **System Integration**
   - System tray icon
   - Global media keyboard shortcuts
   - Minimize to tray
   - Start with Windows option

2. **Audio Features**
   - Equalizer
   - Recording functionality
   - Sleep timer
   - Crossfade between tracks

3. **Data & Settings**
   - Save user preferences
   - Theme customization (light/dark mode)
   - Keyboard shortcuts customization

---

## Technical Architecture

### Application Structure
```
myradio/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts          # Application entry point
│   │   ├── ipc-handlers.ts  # IPC communication
│   │   └── tray.ts          # System tray management
│   ├── renderer/             # Electron renderer process
│   │   ├── components/       # React components
│   │   │   ├── Player.tsx
│   │   │   ├── ChannelList.tsx
│   │   │   ├── Controls.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # Business logic
│   │   │   ├── audioService.ts
│   │   │   ├── channelService.ts
│   │   │   └── podcastService.ts
│   │   ├── store/           # State management
│   │   ├── types/           # TypeScript definitions
│   │   ├── App.tsx          # Main React component
│   │   └── index.tsx        # Renderer entry
│   ├── shared/              # Shared code
│   │   └── types.ts
│   └── assets/              # Images, icons
├── public/                  # Static files
├── build/                   # Build configuration
└── dist/                    # Compiled output
```

### Key Components

#### 1. Audio Service
- HTML5 Audio API or Howler.js for playback
- Stream management
- Volume control
- Playback state management

#### 2. Channel Service
- NRK API integration
- Custom channel CRUD operations
- Channel data persistence (JSON or SQLite)

#### 3. Podcast Service
- RSS feed parsing
- Episode management
- Download queue management

#### 4. State Management
- Redux Toolkit or Zustand
- Persistent storage with electron-store

---

## NRK Radio Integration

### NRK Radio Stream URLs
The NRK channels use HLS (HTTP Live Streaming) format:

```
P1: https://lyd.nrk.no/nrk_radio_p1_ostlandssendingen_mp3_h
P2: https://lyd.nrk.no/nrk_radio_p2_mp3_h
P3: https://lyd.nrk.no/nrk_radio_p3_mp3_h
NRK Alltid Nyheter: https://lyd.nrk.no/nrk_radio_alltid_nyheter_mp3_h
```

**Note:** These URLs may need verification and updating. NRK may also provide an API for channel information and metadata.

---

## Data Models

### Channel
```typescript
interface Channel {
  id: string;
  name: string;
  url: string;
  type: 'radio' | 'podcast';
  logo?: string;
  description?: string;
  category?: string;
  favorite: boolean;
  lastPlayed?: Date;
}
```

### Podcast Episode
```typescript
interface PodcastEpisode {
  id: string;
  podcastId: string;
  title: string;
  url: string;
  description?: string;
  duration?: number;
  publishDate: Date;
  played: boolean;
  position: number; // For resume playback
}
```

### App Settings
```typescript
interface AppSettings {
  volume: number;
  theme: 'light' | 'dark' | 'system';
  startWithWindows: boolean;
  minimizeToTray: boolean;
  lastPlayedChannel?: string;
  audioQuality: 'low' | 'medium' | 'high';
}
```

---

## Development Phases Timeline

### Week 1-2: Setup & MVP
- [ ] Project setup with Electron + React + TypeScript
- [ ] Basic UI layout
- [ ] Audio playback implementation
- [ ] Pre-configured NRK channels
- [ ] Play/Pause/Stop controls
- [ ] Volume control

### Week 3: Channel Management
- [ ] Add custom channels feature
- [ ] Channel list CRUD operations
- [ ] Data persistence
- [ ] Channel favorites

### Week 4: Podcast Support
- [ ] RSS feed parser
- [ ] Podcast episode list
- [ ] Episode playback
- [ ] Position tracking

### Week 5: Polish & System Integration
- [ ] System tray integration
- [ ] Global keyboard shortcuts
- [ ] Settings panel
- [ ] UI polish and refinements

### Week 6: Testing & Packaging
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Windows installer creation
- [ ] Documentation

---

## Testing Strategy

### Unit Tests
- Audio service functions
- Channel management logic
- Data persistence
- Podcast feed parsing

### Integration Tests
- Audio playback with different stream types
- IPC communication between main and renderer
- Settings persistence

### Manual Testing
- UI/UX testing
- Stream playback reliability
- Performance monitoring
- Memory leak detection

---

## Deployment

### Windows Distribution
- **Installer:** electron-builder (NSIS or Squirrel)
- **Auto-update:** electron-updater
- **Code signing:** Optional but recommended

### Build Process
1. Compile TypeScript
2. Bundle with Webpack/Vite
3. Package with electron-builder
4. Create installer (.exe)
5. Generate update files

---

## Future Considerations

### Cross-Platform Expansion (Phase 4)
- macOS build and testing
- Linux build and testing
- Platform-specific UI adjustments
- Platform-specific system integration

### Additional Features
- Chromecast support
- Bluetooth audio device integration
- Lyrics display
- Social sharing
- Statistics and listening history
- Cloud sync for settings and favorites

---

## Resources & References

### Documentation
- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [NRK Developer Resources](https://nrkno.github.io/)

### Libraries to Consider
- **Audio:** Howler.js, video.js
- **UI:** Material-UI, Ant Design, Chakra UI
- **State:** Redux Toolkit, Zustand, Jotai
- **Storage:** electron-store, lowdb
- **RSS:** rss-parser

### Similar Projects for Inspiration
- Streamtuner
- RadioTray-NG
- Gradio (GNOME Radio)

---

## Success Criteria

1. ✅ Successfully play all NRK channels
2. ✅ Add and play custom channels
3. ✅ Responsive and intuitive UI
4. ✅ Reliable playback with minimal buffering
5. ✅ Low memory footprint (< 200MB idle)
6. ✅ Fast startup time (< 3 seconds)
7. ✅ Stable (no crashes during normal usage)

---

## Notes

- Focus on Windows for initial release
- Keep UI simple and intuitive
- Prioritize audio quality and stability
- Consider accessibility features (keyboard navigation, screen reader support)
- Plan for localization (Norwegian + English)
