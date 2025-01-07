/**
 * @jest-environment jsdom
 */

const { ipcRenderer } = require('electron');

describe('Matrix Effect', () => {
    let matrix;

    beforeEach(() => {
        jest.resetModules();
        document.body.innerHTML = `
            <div id="container"></div>
        `;
        matrix = require('../matrix');
    });

    describe('Initialization', () => {
        it('should create matrix with default settings', () => {
            matrix.initMatrix();
            const columns = document.querySelectorAll('.matrix-column');
            expect(columns.length).toBeGreaterThan(0);
        });

        it('should create correct number of columns based on settings', () => {
            matrix.settings.fontSize = 20;
            matrix.initMatrix();
            
            const expectedColumns = Math.floor(window.innerWidth / 20);
            const columns = document.querySelectorAll('.matrix-column');
            expect(columns.length).toBe(expectedColumns);
        });
    });

    describe('Animation', () => {
        it('should update character positions correctly', () => {
            const char = document.createElement('div');
            char.style.setProperty('--y-pos', '0');
            
            matrix.updateCharacterPosition(char);
            expect(char.style.setProperty).toHaveBeenCalledWith(
                '--y-pos',
                expect.stringMatching(/\d+px/)
            );
        });

        it('should reset characters when they reach bottom', () => {
            const char = document.createElement('div');
            char.style.getPropertyValue.mockReturnValue('1100');
            
            matrix.updateCharacterPosition(char);
            expect(char.style.setProperty).toHaveBeenCalledWith('--y-pos', '0px');
            expect(char.textContent).toBeTruthy();
        });
    });

    describe('Settings Updates', () => {
        it('should handle color changes', () => {
            matrix.initMatrix();
            
            const newSettings = {
                color: '#ff0000',
                opacity: 0.8
            };
            
            ipcRenderer.emit('settings-updated', {}, newSettings);
            
            const chars = document.querySelectorAll('.matrix-char');
            expect(chars[0].style.color).toMatch(/rgba\(255, 0, 0, 0\.8\)/);
        });

        it('should recreate matrix when fontSize changes', () => {
            matrix.initMatrix();
            const originalColumns = document.querySelectorAll('.matrix-column').length;
            
            const newSettings = {
                fontSize: 30
            };
            
            ipcRenderer.emit('settings-updated', {}, newSettings);
            
            const newColumns = document.querySelectorAll('.matrix-column').length;
            expect(newColumns).toBeLessThan(originalColumns);
        });
    });

    describe('Cleanup', () => {
        it('should cancel animation frame on unload', () => {
            matrix.initMatrix();
            window.dispatchEvent(new Event('unload'));
            expect(window.cancelAnimationFrame).toHaveBeenCalled();
        });
    });
}); 