const { app, BrowserWindow, screen, ipcMain } = require('electron');

describe('Main Process', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('App Initialization', () => {
        it('should set required GPU optimizations', () => {
            require('../main');
            expect(app.commandLine.appendSwitch).toHaveBeenCalledWith('disable-gpu-vsync');
            expect(app.commandLine.appendSwitch).toHaveBeenCalledWith('disable-frame-rate-limit');
            expect(app.commandLine.appendSwitch).toHaveBeenCalledWith('disable-software-rasterizer');
        });

        it('should create windows for all displays', async () => {
            const { createWindows } = require('../main');
            await createWindows();
            expect(BrowserWindow).toHaveBeenCalledTimes(2);
            expect(screen.getAllDisplays).toHaveBeenCalled();
        });
    });

    describe('Window Management', () => {
        it('should handle window creation with correct properties', async () => {
            const { createWindows } = require('../main');
            await createWindows();
            
            const calls = BrowserWindow.mock.calls;
            expect(calls[0][0]).toMatchObject({
                fullscreen: true,
                frame: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                }
            });
        });

        it('should handle ESC key to quit', async () => {
            const { createWindows } = require('../main');
            await createWindows();
            
            const window = BrowserWindow.mock.instances[0];
            const keyEvent = window.webContents.on.mock.calls.find(
                call => call[0] === 'before-input-event'
            );
            
            const [, handler] = keyEvent;
            handler({}, { key: 'Escape' });
            expect(app.quit).toHaveBeenCalled();
        });
    });

    describe('Settings Management', () => {
        it('should handle settings updates', async () => {
            const { createWindows } = require('../main');
            await createWindows();

            const newSettings = {
                speed: 2.0,
                color: '#ff0000',
                density: 1.5,
            };

            // Simulate settings update
            const settingsHandler = ipcMain.on.mock.calls.find(
                call => call[0] === 'settings-update'
            );
            const [, handler] = settingsHandler;
            handler({}, newSettings);

            // Wait for throttle
            await new Promise(resolve => setTimeout(resolve, 150));

            const window = BrowserWindow.mock.instances[0];
            expect(window.webContents.send).toHaveBeenCalledWith(
                'update-settings',
                expect.objectContaining(newSettings)
            );
        });
    });

    describe('Error Handling', () => {
        it('should handle GPU process crashes', () => {
            require('../main');
            const crashHandler = app.on.mock.calls.find(
                call => call[0] === 'gpu-process-crashed'
            );
            expect(crashHandler).toBeTruthy();
        });

        it('should handle render process crashes', async () => {
            const { createWindows } = require('../main');
            await createWindows();
            
            const window = BrowserWindow.mock.instances[0];
            const crashHandler = window.webContents.on.mock.calls.find(
                call => call[0] === 'render-process-gone'
            );
            expect(crashHandler).toBeTruthy();
        });
    });
}); 