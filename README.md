# Multimonitor Digital Rain

A Matrix-style digital rain effect that spreads across all your connected monitors. Perfect for creating atmospheric video backgrounds, streaming scenes, or just for fun. Features authentic Matrix-style characters, customizable effects, and seamless multi-monitor support.

![Digital Rain Preview](docs/preview.gif)

## Quick Start (Windows)

1. Go to [Releases](https://github.com/timothywarner/multimonitor-digital-rain/releases)
2. Download the latest `Digital Rain.exe`
3. Double-click to run
4. Press ESC to exit

## Features

- 🖥️ **True Multi-monitor Support**: Automatically detects and utilizes all connected displays
- 🎬 **Perfect for Video**: Ideal for creating atmospheric backgrounds in videos/streams
- 🎮 **Simple Controls**: Just run and press ESC to exit
- 📦 **Zero Installation**: Single portable executable
- 🎨 **Authentic Style**: 
  - Japanese katakana and special characters
  - Glowing green matrix effect
  - White "leader" characters
  - Trailing fade effects
  - Variable speed and density

## Use Cases

- **Content Creation**: Perfect background for tech-focused videos
- **Live Streaming**: Create an engaging background for your stream setup
- **Presentations**: Add a cyberpunk atmosphere to tech talks
- **Ambient Display**: Transform idle monitors into conversation pieces

## Technical Details

- **Performance**: Optimized for smooth performance across multiple displays
- **Resolution**: Automatically adapts to each monitor's native resolution
- **Memory**: Minimal resource usage
- **Compatibility**: Windows 10/11 compatible

## Building from Source

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/timothywarner/multimonitor-digital-rain.git
   cd multimonitor-digital-rain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm start
   ```

4. Build executable:
   ```bash
   npm run build
   ```
   Find the executable in `dist/Digital Rain.exe`

## Contributing

Contributions are welcome! Some areas for enhancement:
- macOS/Linux support
- Additional visual customization options
- Performance optimizations
- Alternative character sets

## Troubleshooting

- **Black Screen Only**: Ensure your graphics drivers are up to date
- **Performance Issues**: Try reducing the number of active columns/effects
- **Window Not Fullscreen**: Press Alt+Enter or restart the application
- **Multiple Instances**: Only one instance can run at a time

## License

MIT License - Feel free to use in personal and commercial projects.

## Credits

- Inspired by The Matrix (1999)
- Built with Electron and modern web technologies
- Created by Timothy Warner 