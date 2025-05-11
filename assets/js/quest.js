(function () {
    const body = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const questText = document.getElementById('questText');
    const questChoices = document.getElementById('questChoices');
    const questResult = document.getElementById('questResult');
    const restartQuestBtn = document.getElementById('restartQuestBtn');

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
        if (window.scrollY > 300) scrollTopBtn.style.display = 'block';
        else scrollTopBtn.style.display = 'none';
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Квестові питання та варіанти відповіді
    const questScenes = [
        {
            text: "Ти стоїш на роздоріжжі в магічному лісі. Куди підеш?",
            choices: ["Ліворуч, до старого дерева", "Праворуч, до сріблястого озера"]
        },
        {
            text: "Перед тобою з'явився ельф. Він пропонує допомогу. Що відповіси?",
            choices: ["Прийняти допомогу", "Відмовитися і йти далі самостійно"]
        },
        {
            text: "Ти натрапляєш на загадкову печеру. Чи зайдеш всередину?",
            choices: ["Зайти в печеру", "Пройти повз печеру"]
        },
        {
            text: "За печерою чути шепіт гномів. Вони запрошують тебе на вечерю. Що робиш?",
            choices: ["Приєднатися до них", "Продовжити шлях без зупинки"]
        },
        {
            text: "На вершині гори зустрічаєш дракона, який охороняє скарб. Як вчинити?",
            choices: ["Поговорити з драконом", "Підготуватися до бою"]
        },
        {
            text: "Фінальна сцена: твій вибір визначить долю світу. Що зробиш?",
            choices: ["Використати магію любові", "Використати магію сили"]
        }
    ];

    let currentSceneIndex = 0;
    let questCompleted = false;

    function renderScene(index) {
        questText.textContent = questScenes[index].text;
        questChoices.innerHTML = '';
        questResult.textContent = '';
        restartQuestBtn.style.display = 'none';

        questScenes[index].choices.forEach((choiceText, i) => {
            const btn = document.createElement('button');
            btn.className = 'choice-button';
            btn.textContent = choiceText;
            btn.setAttribute('aria-label', choiceText);
            btn.addEventListener('click', () => handleChoice(i));
            questChoices.appendChild(btn);
        });
    }

    function handleChoice(choiceIndex) {
        if (questCompleted) return;

        if (currentSceneIndex < questScenes.length - 1) {
            currentSceneIndex++;
            renderScene(currentSceneIndex);
        } else {
            questCompleted = true;
            const finalChoice = questScenes[currentSceneIndex].choices[choiceIndex];

            questText.textContent = "Вітаємо! Ви завершили квест!";
            questChoices.innerHTML = '';
            let outcomeText = "";

            if (finalChoice === "Використати магію любові") {
                outcomeText = "Ваше серце наповнило світ світлом. На землі запанував мир між расами.";
            } else if (finalChoice === "Використати магію сили") {
                outcomeText = "Світ підкорено, але за яку ціну? Магія сили розділила народи.";
            } else {
                outcomeText = "Ваш вибір залишив світ у невизначеності.";
            }

            questResult.textContent = outcomeText;
            restartQuestBtn.style.display = 'inline-block';
        }

    }

    restartQuestBtn.addEventListener('click', () => {
        currentSceneIndex = 0;
        questCompleted = false;
        renderScene(currentSceneIndex);
    });

    // Початкове відображення
    renderScene(0);

})();

let bg_music = new Audio("../assets/audio/music.mp3");
bg_music.loop = true;
bg_music.volume = 0.7;

// Дочекаємося взаємодії користувача (будь-який клік)
document.addEventListener('click', function startMusic() {
    bg_music.play().catch((e) => console.warn("Автовідтворення заблоковане:", e));
    document.removeEventListener('click', startMusic); // більше не слухаємо
});