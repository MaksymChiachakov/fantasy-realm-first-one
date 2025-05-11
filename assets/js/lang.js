let translations = {};
let currentLanguage = localStorage.getItem('language') || 'en';  // зчитуємо мову з localStorage

// Функція для завантаження перекладів з JSON файлу
async function loadTranslations() {
    try {
        const response = await fetch('../translations.json');
        if (!response.ok) {
            throw new Error('Не вдалося завантажити файл JSON');
        }
        translations = await response.json();
        updateLanguage(currentLanguage);
        updateToggleText();
    } catch (error) {
        console.error("Не вдалося завантажити переклади:", error);
    }
}

// Функція для оновлення текстів на сторінці
function updateLanguage(language) {
    if (!translations[language]) {
        console.error("Переклади для цієї мови не знайдені:", language);
        return;
    }

    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(element => {
        const key = element.getAttribute("data-i18n");
        element.innerHTML = translations[language][key] || element.innerHTML;
    });

    // Зберігаємо мову в localStorage
    localStorage.setItem('language', language);
}

// Оновлює текст кнопки перемикача
function updateToggleText() {
    if (languageToggle) {
        languageToggle.innerText = currentLanguage === 'en' ? 'UA' : 'EN';
    }
}

// Перемикання мови при натисканні
const languageToggle = document.getElementById("languageToggle");
if (languageToggle) {
    languageToggle.addEventListener("click", () => {
        currentLanguage = currentLanguage === 'en' ? 'ua' : 'en';
        updateLanguage(currentLanguage);
        updateToggleText();
    });
}

// Завантаження перекладів при завантаженні сторінки
document.addEventListener("DOMContentLoaded", loadTranslations);
