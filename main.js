const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

// GPU Optimizations
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blacklist');

// Handle GPU process crashes
app.on('gpu-process-crashed', (event, killed) => {
    console.log('GPU Process crashed, restarting windows...');
    restartWindows();
});

let mainWindows = [];
let settingsWindow = null;

// Store settings
let settings = {
    speed: 1.0,
    color: '#00ff00',
    density: 1.0,
    fontSize: 20,
    glowIntensity: 1.0
};

function createWindows() {
    // Get all displays
    const displays = screen.getAllDisplays();
    console.log('Found displays:', displays.length);
    
    // Create a window for each display
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
                contextIsolation: false,
                backgroundThrottling: false,
                enablePreferredSizeMode: true
            },
            backgroundColor: '#000000'
        });

        mainWindows.push(win);

        // Load the matrix HTML file
        win.loadFile('matrix-electron.html');

        // Log when page is loaded
        win.webContents.on('did-finish-load', () => {
            console.log(`Window ${index} loaded`);
            win.webContents.send('update-settings', settings);
        });

        // Handle ESC key to close all windows
        win.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'Escape') {
                app.quit();
            }
            // Open settings on 'S' key
            if (input.key === 's' && !settingsWindow) {
                createSettingsWindow();
            }
        });

        // Handle render process crashes
        win.webContents.on('render-process-gone', (event, details) => {
            console.log(`Window ${index} render process gone:`, details.reason);
            restartWindows();
        });
    });
}

function restartWindows() {
    mainWindows.forEach(win => {
        if (!win.isDestroyed()) {
            win.close();
        }
    });
    mainWindows = [];
    setTimeout(createWindows, 1000); // Add delay before restart
}

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 400,
        height: 600,
        title: 'Digital Rain Settings',
        frame: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false
        },
        backgroundColor: '#1a1a1a'
    });

    settingsWindow.loadFile('settings.html');
    settingsWindow.setMenu(null);

    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
}

// Throttle settings updates with more delay
let updateTimeout;
function throttledSettingsUpdate(newSettings) {
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }
    updateTimeout = setTimeout(() => {
        mainWindows.forEach(win => {
            if (!win.isDestroyed()) {
                win.webContents.send('update-settings', newSettings);
            }
        });
    }, 100); // Increased to 100ms throttle
}

// When ready
app.whenReady().then(() => {
    console.log('App is ready, creating windows...');
    createWindows();
});

app.on('window-all-closed', () => {
    console.log('All windows closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindows.length === 0) {
        createWindows();
    }
});

// Handle settings updates
ipcMain.on('settings-update', (event, newSettings) => {
    settings = { ...settings, ...newSettings };
    throttledSettingsUpdate(settings);
}); 