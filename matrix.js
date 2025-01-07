const { ipcRenderer } = require('electron');

const settings = {
  speed: 1.0,
  fontSize: 20,
  color: '#00ff00',
  opacity: 0.8
};

let animationFrame;
const container = document.getElementById('container');

function initMatrix() {
  container.innerHTML = '';
  const columns = Math.floor(window.innerWidth / settings.fontSize);
  
  for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.classList.add('matrix-column');
    
    const chars = Math.ceil(window.innerHeight / settings.fontSize) + 1;
    for (let j = 0; j < chars; j++) {
      const char = document.createElement('div');
      char.classList.add('matrix-char');
      char.style.setProperty('--y-pos', Math.random() * window.innerHeight + 'px');
      char.style.color = `rgba(${hexToRgb(settings.color)}, ${settings.opacity})`;
      char.textContent = getRandomChar();
      column.appendChild(char);
    }
    
    container.appendChild(column);
  }
  
  animate();
}

function animate() {
  const chars = document.querySelectorAll('.matrix-char');
  chars.forEach(updateCharacterPosition);
  animationFrame = requestAnimationFrame(animate);
}

function updateCharacterPosition(char) {
  let yPos = parseFloat(char.style.getPropertyValue('--y-pos'));
  yPos += settings.speed;
  
  if (yPos > window.innerHeight) {
    yPos = 0;
    char.textContent = getRandomChar();
  }
  
  char.style.setProperty('--y-pos', yPos + 'px');
}

function getRandomChar() {
  const chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
  return chars[Math.floor(Math.random() * chars.length)];
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 255, 0';
}

ipcRenderer.on('settings-updated', (event, newSettings) => {
  Object.assign(settings, newSettings);
  
  if (newSettings.fontSize) {
    initMatrix();
  } else {
    const chars = document.querySelectorAll('.matrix-char');
    chars.forEach(char => {
      char.style.color = `rgba(${hexToRgb(settings.color)}, ${settings.opacity})`;
    });
  }
});

window.addEventListener('unload', () => {
  cancelAnimationFrame(animationFrame);
});

module.exports = {
  settings,
  initMatrix,
  updateCharacterPosition,
  getRandomChar,
  hexToRgb
}; 