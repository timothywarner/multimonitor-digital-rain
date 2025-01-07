const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

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
                contextIsolation: false
            }
        });

        // Load the matrix HTML file
        win.loadFile('matrix-electron.html');

        // Log when page is loaded
        win.webContents.on('did-finish-load', () => {
            console.log(`Window ${index} loaded`);
        });

        // Handle ESC key to close all windows
        win.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'Escape') {
                app.quit();
            }
        });
    });
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
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindows();
    }
}); 