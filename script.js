const englishTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "The pen is mightier than the sword."
];

const indonesianTexts = [
    "Anak ayam turun sepuluh mati satu tinggal sembilan.",
    "Ada gula ada semut.",
    "Air beriak tanda tak dalam.",
    "Air tenang menghanyutkan.",
    "Alah bisa karena biasa."
];

let currentTexts = englishTexts;

let startTime;
let textDisplay = document.getElementById('text-display');
let textInput = document.getElementById('text-input');
let feedback = document.getElementById('feedback');
let wpmDisplay = document.getElementById('wpm');
let accuracyDisplay = document.getElementById('accuracy');
let timeDisplay = document.getElementById('time');
let nameInput = document.getElementById('name-input');
let languageSelect = document.getElementById('language-select');
let startScreen = document.getElementById('start-screen');
let typingTest = document.getElementById('typing-test');
let resultScreen = document.getElementById('result');
let finalWpm = document.getElementById('final-wpm');
let finalAccuracy = document.getElementById('final-accuracy');
let backsound = document.getElementById('backsound');

let currentText;
let errorCount = 0;
let maxErrors = 5;
let timer;
let timeLeft = 60;

languageSelect.addEventListener('change', () => {
    currentTexts = languageSelect.value === 'english' ? englishTexts : indonesianTexts;
});

function startTest() {
    if (nameInput.value.trim() === '') {
        alert('Please enter your name first.');
        return;
    }
    startScreen.style.display = 'none';
    typingTest.style.display = 'block';
    backsound.play();
    errorCount = 0;
    timeLeft = 60;
    textInput.disabled = false;
    startTypingTest();
}

function startTypingTest() {
    currentText = currentTexts[Math.floor(Math.random() * currentTexts.length)];
    textDisplay.innerHTML = `<span class="sentence">${currentText}</span>`;
    textInput.value = '';
    feedback.innerText = '';
    wpmDisplay.innerText = 'WPM: 0';
    accuracyDisplay.innerText = 'Accuracy: 0%';
    timeDisplay.innerText = 'Time: 60s';
    startTime = new Date().getTime();
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

textInput.addEventListener('input', () => {
    const inputText = textInput.value;
    const displayText = currentText;
    let formattedText = '';
    let correctChars = 0;

    for (let i = 0; i < displayText.length; i++) {
        if (inputText[i] == null) {
            formattedText += displayText[i];
        } else if (inputText[i] === displayText[i]) {
            formattedText += `<span class="correct">${displayText[i]}</span>`;
            correctChars++;
        } else {
            formattedText += `<span class="incorrect">${displayText[i]}</span>`;
            errorCount++;
        }
    }

    if (inputText === displayText) {
        feedback.innerText = 'Perfect! You typed it correctly.';
        feedback.style.color = 'green';
        clearInterval(timer);
    } else {
        feedback.innerHTML = formattedText;
        feedback.style.color = 'black';
    }

    updateStats();
    checkErrors();
});

function updateTimer() {
    timeLeft--;
    timeDisplay.innerText = `Time: ${timeLeft}s`;
    if (timeLeft === 0) {
        clearInterval(timer);
        textInput.disabled = true;
        showResult();
    }
}

function updateStats() {
    const inputText = textInput.value;
    const displayText = currentText;
    const wordsTyped = inputText.split(' ').filter(word => word).length;
    const elapsedTime = (new Date().getTime() - startTime) / 60000;
    const wpm = Math.round(wordsTyped / elapsedTime);
    wpmDisplay.innerText = `WPM: ${wpm}`;

    const correctChars = Array.from(inputText).filter((char, index) => char === displayText[index]).length;
    const accuracy = Math.round((correctChars / displayText.length) * 100);
    accuracyDisplay.innerText = `Accuracy: ${accuracy}%`;
}

function checkErrors() {
    if (errorCount >= maxErrors) {
        clearInterval(timer);
        textInput.disabled = true;
        showResult();
    }
}

function nextText() {
    errorCount = 0;
    startTypingTest();
}

function showResult() {
    typingTest.style.display = 'none';
    resultScreen.style.display = 'block';
    finalWpm.innerText = wpmDisplay.innerText;
    finalAccuracy.innerText = accuracyDisplay.innerText;
    backsound.pause();
    backsound.currentTime = 0;
}

function restart() {
    resultScreen.style.display = 'none';
    startScreen.style.display = 'block';
    textInput.disabled = false;
    nameInput.value = '';
    backsound.pause();
    backsound.currentTime = 0;
    startTypingTest();
}

startTypingTest();
