# MyRadio - Setup and Development Instructions

## Prerequisites

### Required Software
1. **Node.js** (v18 or later)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Git** (for version control)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

3. **Code Editor**
   - Recommended: Visual Studio Code
   - Download from: https://code.visualstudio.com/

### Recommended VS Code Extensions
- ESLint
- Prettier - Code formatter
- TypeScript Vue Plugin (Volar)
- Error Lens
- Auto Rename Tag

---

## Project Setup

### Step 1: Initialize the Project

```bash
# Navigate to project directory
cd c:\code\myradio

# Initialize npm project
npm init -y

# Install Electron
npm install --save-dev electron

# Install Electron Builder (for packaging)
npm install --save-dev electron-builder

# Install development dependencies
npm install --save-dev typescript @types/node
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev ts-loader css-loader style-loader
npm install --save-dev html-webpack-plugin
npm install --save-dev concurrently wait-on
```

### Step 2: Install React and Dependencies

```bash
# Install React
npm install react react-dom
npm install --save-dev @types/react @types/react-dom

# Install state management
npm install zustand

# Install utility libraries
npm install electron-store
npm install howler
npm install @types/howler --save-dev
```

### Step 3: Install Additional Libraries

```bash
# For podcast support
npm install rss-parser
npm install @types/rss-parser --save-dev

# For UI components (optional - choose one)
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
# OR
npm install antd

# For HTTP requests
npm install axios
```

---

## Project Configuration

### TypeScript Configuration (tsconfig.json)

Create `tsconfig.json` in the root directory:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "start": "electron .",
    "dev": "concurrently \"npm run watch\" \"wait-on http://localhost:3000 && electron .\"",
    "watch": "webpack serve --mode development",
    "build": "webpack --mode production",
    "pack": "electron-builder --dir",
    "dist": "electron-builder",
    "dist:win": "electron-builder --win"
  }
}
```

---

## Development Workflow

### Starting Development Server

```bash
# Start the development server with hot reload
npm run dev
```

This will:
1. Start the Webpack dev server
2. Launch Electron when ready
3. Enable hot module replacement

### Building for Production

```bash
# Build the application
npm run build

# Create distributable package
npm run dist:win
```

---

## Project Structure Setup

### Create Directory Structure

```bash
# Create main directories
mkdir src
mkdir src\main
mkdir src\renderer
mkdir src\renderer\components
mkdir src\renderer\services
mkdir src\renderer\store
mkdir src\renderer\types
mkdir src\renderer\hooks
mkdir src\assets
mkdir public
```

---

## Core Files to Create

### 1. Main Process Entry (src/main/main.ts)

This file initializes the Electron application and creates the main window.

**Key responsibilities:**
- Create the browser window
- Handle application lifecycle events
- Set up IPC communication
- Configure security settings

### 2. Renderer Entry (src/renderer/index.tsx)

This is the React application entry point.

**Key responsibilities:**
- Render the React app
- Set up providers (state management, theme)
- Initialize the root component

### 3. Main React Component (src/renderer/App.tsx)

The main application component.

**Components to include:**
- ChannelList - Display available channels
- Player - Audio player controls
- NowPlaying - Current track/channel info
- Settings - Application settings

### 4. Audio Service (src/renderer/services/audioService.ts)

Manages audio playback.

**Features:**
- Initialize audio player (Howler.js)
- Play/pause/stop methods
- Volume control
- Stream status monitoring
- Error handling

### 5. Channel Service (src/renderer/services/channelService.ts)

Manages channel data.

**Features:**
- Load default NRK channels
- Add/edit/delete custom channels
- Save/load from persistent storage
- Channel validation

### 6. State Store (src/renderer/store/useStore.ts)

Application state management using Zustand.

**State includes:**
- Current playing channel
- Playback state (playing/paused/stopped)
- Volume level
- Channel list
- Settings
- UI state (active view, etc.)

---

## NRK Channel Configuration

### Default Channels Data

Create `src/renderer/data/nrkChannels.ts`:

```typescript
export const NRK_CHANNELS = [
  {
    id: 'nrk-p1',
    name: 'NRK P1',
    url: 'https://lyd.nrk.no/nrk_radio_p1_ostlandssendingen_mp3_h',
    logo: 'https://gfx.nrk.no/nXPi81aQ_bTZH1iinWLCHgI7wt9PQGvfCc8i9oCvjlGg',
    description: 'NRK P1',
    category: 'news',
    favorite: false
  },
  {
    id: 'nrk-p2',
    name: 'NRK P2',
    url: 'https://lyd.nrk.no/nrk_radio_p2_mp3_h',
    logo: 'https://gfx.nrk.no/3CzMPYKVBN6IFhTZWv72cQBRPK_cCxEqiRz9cHlEW14w',
    description: 'NRK P2 - Kultur og nyheter',
    category: 'culture',
    favorite: false
  },
  {
    id: 'nrk-p3',
    name: 'NRK P3',
    url: 'https://lyd.nrk.no/nrk_radio_p3_mp3_h',
    logo: 'https://gfx.nrk.no/Wvxl6m4wMF_jCPm8XCLsjwHJGhWLHzgPmJ-kCL2X0cLw',
    description: 'NRK P3 - Musikk og underholdning',
    category: 'music',
    favorite: false
  },
  {
    id: 'nrk-alltid-nyheter',
    name: 'NRK Alltid Nyheter',
    url: 'https://lyd.nrk.no/nrk_radio_alltid_nyheter_mp3_h',
    logo: 'https://gfx.nrk.no/LTecZUX7l_4KFXF-b5J8Nwc_4-q9zyvHLbzQrXP-Eeqw',
    description: 'Alltid nyheter fra NRK',
    category: 'news',
    favorite: false
  }
];
```

**Note:** These URLs may need to be verified and updated. Check NRK's developer documentation for the most current streaming URLs.

---

## Testing the Application

### Manual Testing Checklist

**Audio Playback:**
- [ ] Play NRK P1
- [ ] Play NRK P2
- [ ] Play NRK P3
- [ ] Play NRK Alltid Nyheter
- [ ] Pause/Resume playback
- [ ] Stop playback
- [ ] Adjust volume
- [ ] Switch between channels

**Channel Management:**
- [ ] Add custom channel
- [ ] Edit channel information
- [ ] Delete channel
- [ ] Mark channel as favorite

**Application:**
- [ ] Window can be minimized
- [ ] Window can be maximized
- [ ] Application closes properly
- [ ] Settings are saved
- [ ] Application restarts with last state

---

## Troubleshooting

### Common Issues

#### Issue: Electron app won't start
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Streams won't play
**Solutions:**
- Verify stream URLs are correct
- Check internet connection
- Check browser console for CORS errors
- Ensure audio codecs are supported

#### Issue: Hot reload not working
**Solution:**
```bash
# Restart the dev server
# Close Electron app
# Run npm run dev again
```

#### Issue: Build fails
**Solutions:**
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all dependencies are installed
- Check webpack configuration

---

## Performance Optimization

### Tips for Smooth Performance

1. **Lazy load components**
   - Use React.lazy() for non-critical components
   - Implement code splitting

2. **Optimize audio streaming**
   - Use appropriate buffer sizes
   - Implement stream preloading for favorites

3. **Minimize memory usage**
   - Clean up listeners and subscriptions
   - Avoid memory leaks in React components

4. **Optimize bundle size**
   - Use production builds
   - Enable tree shaking
   - Compress assets

---

## Next Steps After Setup

1. **Implement Basic UI**
   - Create simple channel list
   - Add playback controls
   - Style with CSS or UI library

2. **Implement Audio Playback**
   - Set up Howler.js
   - Connect to NRK streams
   - Add play/pause/stop functionality

3. **Add State Management**
   - Set up Zustand store
   - Connect components to store
   - Implement persistence

4. **Test Thoroughly**
   - Test all channels
   - Test error scenarios
   - Test on different Windows versions

5. **Package Application**
   - Create Windows installer
   - Add application icon
   - Configure auto-updater (optional)

---

## Useful Commands Reference

```bash
# Install a new package
npm install <package-name>

# Install as dev dependency
npm install --save-dev <package-name>

# Remove a package
npm uninstall <package-name>

# Check for outdated packages
npm outdated

# Update packages
npm update

# Run TypeScript compiler check
npx tsc --noEmit

# Clear Electron cache
rm -rf ~/AppData/Roaming/myradio
```

---

## Resources

### Learning Resources
- [Electron Tutorial](https://www.electronjs.org/docs/latest/tutorial/tutorial-prerequisites)
- [React Documentation](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Howler.js Documentation](https://howlerjs.com/)

### NRK Resources
- [NRK Open Source](https://nrkno.github.io/)
- [NRK Radio Guide](https://radio.nrk.no/)

### Community
- [Electron Discord](https://discord.gg/electron)
- [React Community](https://react.dev/community)

---

## Support and Contribution

### Getting Help
- Check documentation first
- Search for existing issues
- Ask in community forums

### Contributing
- Follow TypeScript best practices
- Write clear commit messages
- Test thoroughly before committing
- Document new features

---

## License

*To be determined - Recommend MIT or Apache 2.0 for open source projects*

---

**Last Updated:** March 20, 2026
**Version:** 1.0.0
