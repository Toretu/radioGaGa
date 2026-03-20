# MyRadio - Desktop Radio Player
## Project Plan

### Project Status Dashboard
**Version:** 1.0.2  
**Last Updated:** March 20, 2026  
**Current Phase:** Week 3 (Channel Management) - ✅ Completed  
**Repository:** [radioGaGa](https://github.com/Toretu/radioGaGa)

**Progress Overview:**
- ✅ **Phase 1 (MVP):**  100% Complete - Basic playback working
- ✅ **Phase 2 (Extended Features):** 60% Complete - Channel management implemented
- ❌ **Phase 3 (Advanced Features):** Not started
- ✅ **Deployment & CI/CD:** 100% Complete

**Key Milestones:**
- ✅ First working prototype with NRK channels (Completed)
- ✅ Windows installer and GitHub Releases setup (Completed)
- 🎯 **Next:** Custom channel management and persistence
- 🔮 **Future:** Podcast support and system integration

---

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

## Current Implementation Status

### ✅ Completed Features
- **Project Foundation**
  - Electron + React + TypeScript setup
  - Webpack build configuration
  - Development and production build scripts
  - Hot reload for development

- **Audio Playback (Phase 1 - MVP)**
  - HTML5 Audio implementation in audioService.ts
  - Play/Pause/Stop controls
  - Volume control
  - Basic playback state management
  - Stream URL handling

- **Channel Management (Phase 1 - MVP)**
  - Pre-configured NRK channels (P1, P2, P3, P13, Alltid Nyheter, etc.)
  - Channel list UI component (ChannelList.tsx)
  - Player UI component (Player.tsx)
  - Channel selection and switching
  - TypeScript interfaces for channels

- **State Management**
  - Zustand store implementation (useStore.ts)
  - Global state for current channel and playback status
  - Persistent state structure
  - Integrated persistence layer (storageService.ts)

- **Channel Management (Phase 2 - Extended)**
  - Add/Edit/Delete custom channels
  - AddChannelModal component with form validation
  - localStorage-based persistence
  - Favorite channels with persistence
  - Distinguish between NRK and custom channels
  - Edit and delete only available for custom channels

- **Build & Deployment**
  - electron-builder configuration
  - Windows installer (NSIS)
  - GitHub Actions CI/CD pipeline
  - Automated version bumping
  - Automated release creation

- **Development Process & Documentation**
  - GitHub Copilot instructions file for code quality standards
  - Mandatory PROJECT_PLAN.md updates with each feature
  - Release-ready development workflow
  - Conventional commit message standards

### 🔄 In Progress / Partial Implementation
- **UI Styling**
  - Comprehensive styles.css with modal and form styling
  - Professional animations and transitions

### ❌ Not Yet Implemented
- Import/Export channel lists (JSON)
- Podcast support (Phase 2)
- System tray integration
- Global keyboard shortcuts
- Settings panel
- Theme customization
- Testing suite

---

## Development Phases Timeline

### Week 1-2: Setup & MVP
- [x] Project setup with Electron + React + TypeScript
- [x] Basic UI layout (App.tsx, index.tsx)
- [x] Audio playback implementation (audioService.ts)
- [x] Pre-configured NRK channels (nrkChannels.ts)
- [x] Play/Pause/Stop controls (Player.tsx)
- [x] Volume control (Player component)
- [x] Webpack build configuration
- [x] TypeScript configuration
- [x] Development environment setup

### Week 3: Channel Management
- [x] Channel list display (ChannelList.tsx)
- [x] Channel data structure (types/index.ts)
- [x] State management with Zustand (useStore.ts)
- [x] Add custom channels feature (AddChannelModal component)
- [x] Channel list CRUD operations (add, edit, delete)
- [x] Data persistence with localStorage (storageService.ts)
- [x] Channel favorites (toggle and persist)
- [x] Edit channel information (modal-based editing)
- [x] Delete channels (with confirmation)
- [x] Form validation for custom channels
- [ ] Import/Export channel lists (JSON format) - deferred to future release

### Week 4: Podcast Support
- [ ] RSS feed parser integration
- [ ] Podcast episode list UI
- [ ] Episode playback
- [ ] Position tracking for resume playback
- [ ] Podcast subscription management
- [ ] Episode download queue

### Week 5: Polish & System Integration
- [ ] System tray integration
- [ ] Global media keyboard shortcuts
- [ ] Settings panel
- [ ] UI polish and refinements
- [ ] Minimize to tray functionality
- [ ] Start with Windows option
- [ ] Theme customization (light/dark mode)

### Week 6: Testing & Packaging
- [ ] Bug fixes
- [ ] Performance optimization
- [x] Windows installer creation (electron-builder with NSIS)
- [x] GitHub Actions CI/CD pipeline setup (release.yml, bump-version.yml)
- [x] Automated version bumping workflow (manual trigger via GitHub Actions)
- [x] Automated release workflow (triggered by tags)
- [x] CI/CD troubleshooting and fixes:
  - Fixed workflow chaining with PAT_TOKEN
  - Resolved npm cache and npm ci errors
  - Configured proper GitHub Actions permissions
- [x] Package.json scripts for building and distribution
- [x] Development standards and Copilot instructions
- [ ] Unit tests implementation
- [ ] Integration tests
- [ ] Manual testing checklist
- [ ] Documentation (README, usage guide)
- [ ] Code signing setup

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

### CI/CD Pipeline (✅ Implemented - March 2026)

#### GitHub Actions Workflows
Two automated workflows have been set up and debugged:

1. **Bump Version Workflow** (`.github/workflows/bump-version.yml`)
   - Manual trigger via GitHub Actions UI
   - Bumps version in package.json (patch/minor/major)
   - Creates and pushes git tag using PAT_TOKEN
   - Triggers release workflow automatically
   - **Status:** ✅ Configured with PAT_TOKEN for workflow chaining

2. **Release Workflow** (`.github/workflows/release.yml`)
   - Triggered automatically on tag push (v*.*.*)
   - Runs on windows-latest
   - Installs dependencies with `npm install` (no lock file required)
   - Builds Windows executable with electron-builder
   - Packages application with `npm run dist:win`
   - Creates GitHub Release with artifacts (.exe, .zip, .yml)
   - **Status:** ✅ Fixed npm caching and install issues

#### Setup Requirements (✅ Completed)
- **PAT_TOKEN:** Fine-grained Personal Access Token configured in repository secrets
  - Scope: Repository-specific (myradio repo only)
  - Permissions: Contents (Read and write), Metadata (Read-only)
  - Purpose: Allow bump-version workflow to trigger release workflow
  - **Note:** Default GITHUB_TOKEN cannot trigger workflows from workflows

#### Known Issues & Fixes Applied
- ✅ Fixed: Workflow chaining - Changed from GITHUB_TOKEN to PAT_TOKEN
- ✅ Fixed: npm cache error - Removed cache requirement (no package-lock.json)
- ✅ Fixed: npm ci error - Changed to npm install for flexibility

#### Release Process
1. Go to GitHub Actions → "Bump Version" workflow
2. Click "Run workflow" and select version bump type (patch/minor/major)
3. Workflow creates tag and triggers automatic build/release
4. Release appears in GitHub Releases with Windows installer

**Alternative:** Manually push a tag to trigger release:
```bash
git tag v1.0.X
git push origin v1.0.X
```

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

### MVP Launch Criteria
1. [x] Successfully play all NRK channels
2. [ ] Add and play custom channels (planned for Phase 2)
3. [x] Responsive and intuitive UI (basic implementation complete)
4. [x] Reliable playback with minimal buffering
5. [ ] Low memory footprint (< 200MB idle) - needs testing
6. [ ] Fast startup time (< 3 seconds) - needs testing
7. [x] Stable (no crashes during normal usage)
8. [x] Windows installer available via GitHub Releases

### Phase 2+ Goals
- [ ] Channel management (add, edit, delete custom channels)
- [ ] Podcast support with episode playback
- [ ] Data persistence for user preferences
- [ ] System tray integration
- [ ] Performance benchmarks met (memory, startup time)

---

## Recent Updates

### March 20, 2026 - CI/CD Implementation & Development Standards
- ✅ Created automated bump-version workflow for version management
- ✅ Created automated release workflow for Windows builds
- ✅ Fixed workflow issues:
  - Removed npm cache requirement (no package-lock.json needed)
  - Changed from `npm ci` to `npm install` for flexibility
  - Configured PAT_TOKEN requirement for workflow chaining
- ✅ Documented release process in deployment section
- ✅ Created GitHub Copilot instructions file (`.github/copilot-instructions.md`)
  - Enforces code quality and best practices
  - Mandates PROJECT_PLAN.md updates with each feature
  - Ensures release-ready code at each iteration
  - Provides quick reference for common tasks

### March 20, 2026 - Custom Channel Management Implementation (Week 3)
- ✅ Implemented complete custom channel CRUD operations
  - Created AddChannelModal component with form validation
  - Add new custom radio channels with name, URL, description, category, and logo
  - Edit existing custom channels (but not built-in NRK channels)
  - Delete custom channels with confirmation dialog
  - Form validation for required fields and URL format
- ✅ Implemented data persistence
  - Created storageService.ts using localStorage
  - Persist custom channels across app restarts
  - Persist favorite status for all channels
  - Persist volume settings
- ✅ Enhanced ChannelList UI
  - Added "+ Add Channel" button in header
  - Edit and delete buttons for custom channels only
  - Improved layout with channel actions section
  - Smooth animations and hover effects
- ✅ Styled modal and form components
  - Professional modal overlay with animations
  - Responsive form layout with error handling
  - Primary and secondary button styles
  - Consistent color scheme matching app design
- ✅ **Released v1.0.2** with all custom channel management features
  - Configured PAT_TOKEN for workflow automation
  - Successfully triggered automated release workflow
  - Windows installer available on GitHub Releases

---

## Notes

- Focus on Windows for initial release
- Keep UI simple and intuitive
- Prioritize audio quality and stability
- Consider accessibility features (keyboard navigation, screen reader support)
- Plan for localization (Norwegian + English)
