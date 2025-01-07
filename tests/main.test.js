const { app, BrowserWindow, screen } = require('electron');

describe('Main Process', () => {
  let main;

  beforeEach(() => {
    jest.resetModules();
    main = require('../main');
  });

  describe('App Initialization', () => {
    it('should create windows for all displays', async () => {
      await main.createWindows();
      expect(BrowserWindow).toHaveBeenCalledTimes(2);
      expect(screen.getAllDisplays).toHaveBeenCalled();
    });
  });

  describe('Window Management', () => {
    it('should handle window creation with correct properties', async () => {
      await main.createWindows();
      
      const calls = BrowserWindow.mock.calls;
      expect(calls[0][0]).toMatchObject({
        fullscreen: true,
        frame: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });
    });

    it('should handle ESC key to quit', async () => {
      await main.createWindows();
      
      const window = BrowserWindow.mock.instances[0];
      const keyEvent = window.webContents.on.mock.calls.find(
        call => call[0] === 'before-input-event'
      );
      expect(keyEvent).toBeTruthy();

      // Simulate ESC key press
      keyEvent[1]({}, { key: 'Escape' });
      expect(app.quit).toHaveBeenCalled();
    });
  });

  describe('Settings Management', () => {
    it('should handle settings updates', async () => {
      await main.createWindows();

      const newSettings = {
        speed: 2.0,
        color: '#00ff00',
        fontSize: 24
      };

      main.handleSettingsUpdate(newSettings);
      
      const window = BrowserWindow.mock.instances[0];
      expect(window.webContents.send).toHaveBeenCalledWith(
        'settings-updated',
        newSettings
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle GPU process crashes', async () => {
      await main.createWindows();
      
      const window = BrowserWindow.mock.instances[0];
      const crashHandler = window.webContents.on.mock.calls.find(
        call => call[0] === 'gpu-process-crashed'
      );
      expect(crashHandler).toBeTruthy();

      // Simulate GPU crash
      crashHandler[1]({}, false);
      expect(app.quit).toHaveBeenCalled();
    });

    it('should handle render process crashes', async () => {
      await main.createWindows();
      
      const window = BrowserWindow.mock.instances[0];
      const crashHandler = window.webContents.on.mock.calls.find(
        call => call[0] === 'render-process-gone'
      );
      expect(crashHandler).toBeTruthy();

      // Simulate render process crash
      crashHandler[1]({}, { reason: 'crashed' });
      expect(app.quit).toHaveBeenCalled();
    });
  });
}); 