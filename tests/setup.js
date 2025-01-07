// Mock Electron
const mockApp = {
  commandLine: {
    appendSwitch: jest.fn()
  },
  whenReady: jest.fn().mockResolvedValue(),
  quit: jest.fn(),
  on: jest.fn()
};

const mockBrowserWindow = jest.fn().mockImplementation(() => ({
  loadFile: jest.fn().mockResolvedValue(),
  setFullScreen: jest.fn(),
  webContents: {
    on: jest.fn(),
    send: jest.fn(),
    openDevTools: jest.fn()
  },
  on: jest.fn(),
  setAlwaysOnTop: jest.fn(),
  setSkipTaskbar: jest.fn(),
  setMenuBarVisibility: jest.fn(),
  setAutoHideMenuBar: jest.fn(),
  maximize: jest.fn(),
  show: jest.fn(),
  focus: jest.fn(),
  isDestroyed: jest.fn().mockReturnValue(false)
}));

jest.mock('electron', () => ({
  app: mockApp,
  BrowserWindow: mockBrowserWindow,
  screen: {
    getAllDisplays: jest.fn().mockReturnValue([
      { bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
      { bounds: { x: 1920, y: 0, width: 1920, height: 1080 } }
    ])
  },
  ipcMain: {
    on: jest.fn(),
    emit: jest.fn()
  },
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn(),
    emit: jest.fn()
  }
}));

// Mock DOM
const mockStyle = {
  setProperty: jest.fn(),
  getPropertyValue: jest.fn(),
  color: ''
};

const mockClassList = {
  add: jest.fn(),
  remove: jest.fn(),
  contains: jest.fn()
};

const mockElement = {
  style: mockStyle,
  classList: mockClassList,
  children: [],
  appendChild: jest.fn(child => {
    mockElement.children.push(child);
    return child;
  }),
  querySelector: jest.fn(() => ({ ...mockElement })),
  querySelectorAll: jest.fn(() => [{ ...mockElement }, { ...mockElement }]),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  textContent: '',
  value: '',
  click: jest.fn(),
  parentElement: null
};

// Set up circular reference after object creation
mockElement.parentElement = { ...mockElement };

global.document = {
  createElement: jest.fn(() => ({ ...mockElement })),
  getElementById: jest.fn(() => ({ ...mockElement })),
  querySelector: jest.fn(() => ({ ...mockElement })),
  querySelectorAll: jest.fn(() => [{ ...mockElement }, { ...mockElement }]),
  body: { ...mockElement }
};

global.window = {
  innerWidth: 1920,
  innerHeight: 1080,
  requestAnimationFrame: jest.fn(),
  cancelAnimationFrame: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
};

global.Event = class {
  constructor(type) {
    this.type = type;
  }
}; 