const { ipcRenderer } = require('electron');

const defaultSettings = {
  speed: 1.0,
  fontSize: 20,
  color: '#00ff00',
  opacity: 0.8
};

let currentSettings = { ...defaultSettings };

function init() {
  const speedInput = document.getElementById('speed');
  const fontSizeInput = document.getElementById('fontSize');
  const colorInput = document.getElementById('color');
  const opacityInput = document.getElementById('opacity');
  
  // Initialize input values
  speedInput.value = currentSettings.speed;
  fontSizeInput.value = currentSettings.fontSize;
  colorInput.value = currentSettings.color;
  opacityInput.value = currentSettings.opacity;
  
  // Update displays
  updateValueDisplay(speedInput);
  updateValueDisplay(fontSizeInput);
  
  // Add event listeners
  speedInput.addEventListener('input', handleInputChange);
  fontSizeInput.addEventListener('input', handleInputChange);
  colorInput.addEventListener('change', handleInputChange);
  opacityInput.addEventListener('input', handleInputChange);
  
  // Preset buttons
  document.getElementById('classic').addEventListener('click', () => applyPreset('classic'));
  document.getElementById('bright').addEventListener('click', () => applyPreset('bright'));
  document.getElementById('subtle').addEventListener('click', () => applyPreset('subtle'));
  
  // Reset button
  document.getElementById('reset').addEventListener('click', resetSettings);
}

function handleInputChange(event) {
  const { id, value } = event.target;
  currentSettings[id] = parseFloat(value) || value;
  
  if (event.target.type === 'range') {
    updateValueDisplay(event.target);
  }
  
  ipcRenderer.send('settings-update', currentSettings);
}

function updateValueDisplay(input) {
  const display = input.parentElement.querySelector('.value-display');
  if (display) {
    display.textContent = input.id === 'fontSize' ? `${input.value}px` : input.value;
  }
}

function applyPreset(name) {
  switch (name) {
    case 'classic':
      currentSettings = { ...defaultSettings };
      break;
    case 'bright':
      currentSettings = {
        speed: 1.5,
        fontSize: 24,
        color: '#00ff00',
        opacity: 1.0
      };
      break;
    case 'subtle':
      currentSettings = {
        speed: 0.5,
        fontSize: 16,
        color: '#00ff00',
        opacity: 0.6
      };
      break;
  }
  
  // Update inputs
  Object.entries(currentSettings).forEach(([key, value]) => {
    const input = document.getElementById(key);
    if (input) {
      input.value = value;
      if (input.type === 'range') {
        updateValueDisplay(input);
      }
    }
  });
  
  ipcRenderer.send('settings-update', currentSettings);
}

function resetSettings() {
  currentSettings = { ...defaultSettings };
  
  // Update inputs
  Object.entries(defaultSettings).forEach(([key, value]) => {
    const input = document.getElementById(key);
    if (input) {
      input.value = value;
      if (input.type === 'range') {
        updateValueDisplay(input);
      }
    }
  });
  
  ipcRenderer.send('settings-update', currentSettings);
}

module.exports = {
  init,
  handleInputChange,
  updateValueDisplay,
  applyPreset,
  resetSettings,
  defaultSettings,
  currentSettings
}; 