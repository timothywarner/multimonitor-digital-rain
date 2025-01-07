const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

require('@testing-library/jest-dom');

// Mock Electron
const mockIpcRenderer = {
    on: jest.fn(),
    send: jest.fn(),
};

const mockIpcMain = {
    on: jest.fn(),
};

jest.mock('electron', () => ({
    app: {
        commandLine: {
            appendSwitch: jest.fn(),
        },
        on: jest.fn(),
        whenReady: jest.fn().mockResolvedValue(undefined),
        quit: jest.fn(),
    },
    ipcMain: mockIpcMain,
    ipcRenderer: mockIpcRenderer,
    BrowserWindow: jest.fn().mockImplementation(() => ({
        loadFile: jest.fn(),
        on: jest.fn(),
        webContents: {
            on: jest.fn(),
            send: jest.fn(),
        },
        setMenu: jest.fn(),
        close: jest.fn(),
        isDestroyed: jest.fn().mockReturnValue(false),
    })),
    screen: {
        getAllDisplays: jest.fn().mockReturnValue([
            { bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
            { bounds: { x: 1920, y: 0, width: 1920, height: 1080 } },
        ]),
    },
})); 