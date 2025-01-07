const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

// GPU Optimizations
function setupGPU() {
  app.commandLine.appendSwitch('disable-gpu-vsync');
  app.commandLine.appendSwitch('disable-frame-rate-limit');
  app.commandLine.appendSwitch('disable-software-rasterizer');
  app.commandLine.appendSwitch('enable-gpu-rasterization');
}

// Window Management
let windows = [];
let settingsWindow = null;

function createWindows() {
  setupGPU();
  
  const displays = screen.getAllDisplays();
  console.log('Found displays:', displays.length);
  
  displays.forEach((display, index) => {
    console.log(`Creating window for display ${index}`);
    const win = new BrowserWindow({
      x: display.bounds.x,
      y: display.bounds.y,
      width: display.bounds.width,
      height: display.bounds.height,
      fullscreen: true,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    win.loadFile('matrix-electron.html');
    win.setAlwaysOnTop(true);
    win.setSkipTaskbar(true);
    win.setMenuBarVisibility(false);
    win.setAutoHideMenuBar(true);
    win.maximize();
    win.show();

    // Handle ESC key to quit
    win.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'Escape') {
        app.quit();
      } else if (input.key === 's' || input.key === 'S') {
        openSettings();
      }
    });

    // Handle GPU crashes
    win.webContents.on('gpu-process-crashed', (event, killed) => {
      console.error('GPU process crashed', { killed });
      app.quit();
    });

    // Handle render process crashes
    win.webContents.on('render-process-gone', (event, details) => {
      console.error('Render process gone', details);
      app.quit();
    });

    win.webContents.on('did-finish-load', () => {
      console.log(`Window ${index} loaded`);
    });

    windows.push(win);
  });
}

function openSettings() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  settingsWindow.loadFile('settings.html');
  settingsWindow.setMenuBarVisibility(false);

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

// Settings Management
function handleSettingsUpdate(settings) {
  windows.forEach(win => {
    if (!win.isDestroyed()) {
      win.webContents.send('settings-updated', settings);
    }
  });
}

// App Lifecycle
app.whenReady().then(() => {
  console.log('App is ready, creating windows...');
  createWindows();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (windows.length === 0) {
    createWindows();
  }
});

// IPC Communication
ipcMain.on('settings-update', (event, settings) => {
  handleSettingsUpdate(settings);
});

module.exports = {
  app,
  createWindows,
  openSettings,
  handleSettingsUpdate
}; 