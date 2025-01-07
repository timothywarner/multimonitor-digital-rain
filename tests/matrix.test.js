/**
 * @jest-environment jsdom
 */

describe('Matrix Effect', () => {
    let container;

    beforeEach(() => {
        // Set up DOM
        document.body.innerHTML = '<div id="container"></div>';
        container = document.getElementById('container');
        
        // Reset window dimensions
        global.innerWidth = 1920;
        global.innerHeight = 1080;
        
        // Clear require cache
        jest.resetModules();
    });

    describe('Initialization', () => {
        it('should create matrix with default settings', () => {
            require('../matrix-electron.html');
            
            const columns = container.querySelectorAll('.matrix-column');
            expect(columns.length).toBeGreaterThan(0);
            
            const characters = container.querySelectorAll('.character');
            expect(characters.length).toBeGreaterThan(0);
        });

        it('should create correct number of columns based on settings', () => {
            const { createMatrix, settings } = require('../matrix-electron.html');
            settings.fontSize = 20;
            settings.density = 1.0;
            
            createMatrix();
            
            const expectedColumns = Math.floor(window.innerWidth / (settings.fontSize * settings.density));
            const columns = container.querySelectorAll('.matrix-column');
            expect(columns.length).toBe(expectedColumns);
        });
    });

    describe('Animation', () => {
        it('should update character positions correctly', () => {
            const { updateCharacterPosition } = require('../matrix-electron.html');
            
            const char = document.createElement('div');
            char.style.setProperty('--y-pos', '0px');
            
            updateCharacterPosition(char, 1.0);
            
            const newPos = parseFloat(char.style.getPropertyValue('--y-pos'));
            expect(newPos).toBeGreaterThan(0);
        });

        it('should reset characters when they reach bottom', () => {
            const { updateCharacterPosition } = require('../matrix-electron.html');
            
            const char = document.createElement('div');
            char.style.setProperty('--y-pos', '1100px'); // Beyond window height
            const originalChar = char.textContent;
            
            updateCharacterPosition(char, 1.0);
            
            expect(char.style.getPropertyValue('--y-pos')).toBe('-100px');
            expect(char.textContent).not.toBe(originalChar);
        });
    });

    describe('Settings Updates', () => {
        it('should handle color changes', () => {
            const { ipcRenderer } = require('electron');
            require('../matrix-electron.html');
            
            const newSettings = {
                color: '#ff0000',
                glowIntensity: 1.5
            };
            
            // Simulate settings update
            const updateHandler = ipcRenderer.on.mock.calls.find(
                call => call[0] === 'update-settings'
            );
            const [, handler] = updateHandler;
            handler({}, newSettings);
            
            const characters = container.querySelectorAll('.character:not(.leader)');
            const char = characters[0];
            expect(char.style.getPropertyValue('--char-color')).toBe('#ff0000');
        });

        it('should recreate matrix when fontSize changes', () => {
            const { ipcRenderer } = require('electron');
            require('../matrix-electron.html');
            
            const originalColumns = container.querySelectorAll('.matrix-column').length;
            
            const newSettings = {
                fontSize: 30 // Different from default
            };
            
            // Simulate settings update
            const updateHandler = ipcRenderer.on.mock.calls.find(
                call => call[0] === 'update-settings'
            );
            const [, handler] = updateHandler;
            handler({}, newSettings);
            
            // Wait for recreation delay
            jest.advanceTimersByTime(100);
            
            const newColumns = container.querySelectorAll('.matrix-column').length;
            expect(newColumns).not.toBe(originalColumns);
        });
    });

    describe('Cleanup', () => {
        it('should cancel animation frame on unload', () => {
            global.cancelAnimationFrame = jest.fn();
            require('../matrix-electron.html');
            
            // Simulate window unload
            window.dispatchEvent(new Event('unload'));
            
            expect(cancelAnimationFrame).toHaveBeenCalled();
        });
    });
}); 