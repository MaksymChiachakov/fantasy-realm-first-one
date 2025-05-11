


// Створюємо об'єкт аудіо   
let bg_music = new Audio("../assets/audio/music.mp3");
bg_music.loop = true;
bg_music.volume = 0.7;

// Дочекаємося взаємодії користувача (будь-який клік)
document.addEventListener('click', function startMusic() {
    bg_music.play().catch((e) => console.warn("Автовідтворення заблоковане:", e));
    document.removeEventListener('click', startMusic); // більше не слухаємо
});

(function () {
    const body = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            themeToggleBtn.textContent = 'Light Mode';
        } else {
            themeToggleBtn.textContent = 'Dark Mode';
        }
    }

    let currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
        setTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();



