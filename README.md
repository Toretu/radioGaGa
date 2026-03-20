# MyRadio 🎵

A modern desktop radio player for Windows with support for Norwegian NRK channels, custom radio stations, and podcasts.

## Features

- 🎧 Stream Norwegian NRK radio channels (P1, P2, P3, Alltid Nyheter)
- ▶️ Play, pause, and stop controls
- 🔊 Volume control
- ⭐ Add custom radio channels
- 🎙️ Podcast support (planned)
- 🎨 Modern, clean interface
- 💾 Save your favorite channels
- 🖥️ System tray integration (planned)

## Quick Start

### Prerequisites
- Node.js 18 or later
- Windows 10/11

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Technology Stack

- **Electron** - Desktop application framework
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Howler.js** - Audio playback
- **Zustand** - State management

## Project Structure

```
myradio/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # React application
│   │   ├── components/ # UI components
│   │   ├── services/   # Business logic
│   │   ├── store/      # State management
│   │   └── types/      # TypeScript definitions
│   └── assets/         # Images and icons
├── public/             # Static files
└── dist/              # Build output
```

## Development

See [INSTRUCTIONS.md](INSTRUCTIONS.md) for detailed setup and development instructions.

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for the complete project roadmap and architecture.

## Building for Production

```bash
# Build the application
npm run build

# Create Windows installer
npm run dist:win
```

## Roadmap

- [x] Project setup
- [ ] Basic audio playback
- [ ] NRK channels integration
- [ ] Custom channel management
- [ ] Podcast support
- [ ] System tray integration
- [ ] Keyboard shortcuts
- [ ] Settings panel
- [ ] Windows installer

## License

*To be determined*

## Credits

Built with ❤️ for Norwegian radio listeners.

Norwegian Broadcasting Corporation (NRK) channels are property of NRK.
