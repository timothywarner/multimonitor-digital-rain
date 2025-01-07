/**
 * @jest-environment jsdom
 */

const { ipcRenderer } = require('electron');

describe('Settings UI', () => {
  let settings;

  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = `
      <div id="settings">
        <div class="setting">
          <label>Speed</label>
          <input type="range" id="speed" min="0.1" max="5" step="0.1" value="1">
          <span class="value-display">1.0</span>
        </div>
        <div class="setting">
          <label>Font Size</label>
          <input type="range" id="fontSize" min="10" max="40" step="2" value="20">
          <span class="value-display">20px</span>
        </div>
        <div class="setting">
          <label>Color</label>
          <input type="color" id="color" value="#00ff00">
        </div>
        <div class="setting">
          <label>Opacity</label>
          <input type="range" id="opacity" min="0.1" max="1" step="0.1" value="0.8">
          <span class="value-display">0.8</span>
        </div>
        <div class="presets">
          <button id="classic">Classic</button>
          <button id="bright">Bright</button>
          <button id="subtle">Subtle</button>
        </div>
        <button id="reset">Reset</button>
      </div>
    `;
    settings = require('../settings');
  });

  describe('Input Controls', () => {
    it('should update settings when sliders change', () => {
      settings.init();
      
      const speedInput = document.getElementById('speed');
      speedInput.value = '1.5';
      speedInput.dispatchEvent(new Event('input'));

      expect(ipcRenderer.send).toHaveBeenCalledWith('settings-update', expect.objectContaining({
        speed: 1.5
      }));
    });

    it('should update settings when color changes', () => {
      settings.init();
      
      const colorInput = document.getElementById('color');
      colorInput.value = '#ff0000';
      colorInput.dispatchEvent(new Event('change'));

      expect(ipcRenderer.send).toHaveBeenCalledWith('settings-update', expect.objectContaining({
        color: '#ff0000'
      }));
    });
  });

  describe('Presets', () => {
    it('should apply classic preset correctly', () => {
      settings.init();
      
      const classicButton = document.getElementById('classic');
      classicButton.click();

      expect(ipcRenderer.send).toHaveBeenCalledWith('settings-update', expect.objectContaining({
        color: '#00ff00',
        speed: 1.0,
        fontSize: 20,
        opacity: 0.8
      }));
    });

    it('should apply bright preset correctly', () => {
      settings.init();
      
      const brightButton = document.getElementById('bright');
      brightButton.click();

      expect(ipcRenderer.send).toHaveBeenCalledWith('settings-update', expect.objectContaining({
        color: '#00ff00',
        speed: 1.5,
        fontSize: 24,
        opacity: 1.0
      }));
    });

    it('should apply subtle preset correctly', () => {
      settings.init();
      
      const subtleButton = document.getElementById('subtle');
      subtleButton.click();

      expect(ipcRenderer.send).toHaveBeenCalledWith('settings-update', expect.objectContaining({
        color: '#00ff00',
        speed: 0.5,
        fontSize: 16,
        opacity: 0.6
      }));
    });
  });

  describe('Value Display', () => {
    it('should update value displays correctly', () => {
      settings.init();
      
      const speedInput = document.getElementById('speed');
      const speedDisplay = speedInput.parentElement.querySelector('.value-display');
      
      speedInput.value = '2.5';
      speedInput.dispatchEvent(new Event('input'));

      expect(speedDisplay.textContent).toBe('2.5');
    });

    it('should format font size display with px', () => {
      settings.init();
      
      const fontSizeInput = document.getElementById('fontSize');
      const fontSizeDisplay = fontSizeInput.parentElement.querySelector('.value-display');
      
      fontSizeInput.value = '24';
      fontSizeInput.dispatchEvent(new Event('input'));

      expect(fontSizeDisplay.textContent).toBe('24px');
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all values to defaults', () => {
      settings.init();
      
      // Change some values first
      const speedInput = document.getElementById('speed');
      speedInput.value = '2.0';
      speedInput.dispatchEvent(new Event('input'));

      const resetButton = document.getElementById('reset');
      resetButton.click();

      expect(ipcRenderer.send).toHaveBeenCalledWith('settings-update', expect.objectContaining({
        speed: 1.0,
        fontSize: 20,
        color: '#00ff00',
        opacity: 0.8
      }));
    });
  });
}); 