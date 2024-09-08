const body = document.body;
const desertThemeBtn = document.getElementById('desertTheme');
const oceanThemeBtn = document.getElementById('oceanTheme');
const spaceThemeBtn = document.getElementById('spaceTheme'); // New Space Theme Button

function setTheme(theme) {
    body.className = theme + '-theme';
    localStorage.setItem('theme', theme);
    updateActiveButton(theme);
}

function updateActiveButton(theme) {
    desertThemeBtn.classList.toggle('active', theme === 'desert');
    oceanThemeBtn.classList.toggle('active', theme === 'ocean');
    spaceThemeBtn.classList.toggle('active', theme === 'space'); // Update active button for space theme
}

desertThemeBtn.addEventListener('click', () => setTheme('desert'));
oceanThemeBtn.addEventListener('click', () => setTheme('ocean'));
spaceThemeBtn.addEventListener('click', () => setTheme('space')); // Event listener for space theme

// Set initial theme
const savedTheme = localStorage.getItem('theme') || 'space'; // Default to space theme
setTheme(savedTheme);
