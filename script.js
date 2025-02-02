const questions = [
    { audio: 'aani1.mp3', correct: 1, img1: 'kuva2.png', img2: 'kuva1.png', questionId: 'aani1_1' },
    { audio: 'aani1.mp3', correct: 2, img1: 'kuva7.png', img2: 'kuva4.png', questionId: 'aani1_2' },
    { audio: 'aani2.mp3', correct: 1, img1: 'kuva1.png', img2: 'kuva5.png', questionId: 'aani2_1' },
    { audio: 'aani2.mp3', correct: 1, img1: 'kuva3.png', img2: 'kuva6.png', questionId: 'aani2_2' },
    { audio: 'aani3.mp3', correct: 1, img1: 'kuva7.png', img2: 'kuva6.png', questionId: 'aani3_1' },
    { audio: 'aani3.mp3', correct: 2, img1: 'kuva5.png', img2: 'kuva2.png', questionId: 'aani3_2' },
    { audio: 'aani4.mp3', correct: 1, img1: 'kuva5.png', img2: 'kuva1.png', questionId: 'aani4_1' },
    { audio: 'aani4.mp3', correct: 2, img1: 'kuva7.png', img2: 'kuva6.png', questionId: 'aani4_2' }
];

let currentQuestions = [];
let currentQuestion = 0;
let selectedOption = 0;
let correctAnswers = 0;
let checkButtonClicked = false;
let currentAudio = null;
let lastAudioUsed = null;

function getRandomQuestions(count) {
    const shuffled = [...questions];
    const selected = [];
    
    while (selected.length < count) {
        // Shuffle the remaining questions
        const remainingQuestions = shuffled.filter(q => 
            // Don't include questions that use the same audio as the last selected question
            (!selected.length || !q.audio.startsWith(lastAudioUsed)) &&
            // Don't include questions that are already selected
            !selected.includes(q)
        );
        
        if (remainingQuestions.length === 0) break;
        
        // Randomly select a question from the remaining ones
        const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
        const selectedQuestion = remainingQuestions[randomIndex];
        
        // Randomly decide if we should swap the images
        if (Math.random() < 0.5) {
            const temp = selectedQuestion.img1;
            selectedQuestion.img1 = selectedQuestion.img2;
            selectedQuestion.img2 = temp;
            selectedQuestion.correct = selectedQuestion.correct === 1 ? 2 : 1;
        }
        
        selected.push(selectedQuestion);
        lastAudioUsed = selectedQuestion.audio.split('.')[0]; // Store just the 'aani1', 'aani2', etc.
    }
    
    return selected;
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('stars-container').style.display = 'block';
    document.querySelector('#question-container h2').style.display = 'block';
    currentQuestions = getRandomQuestions(5);
    loadQuestion();
    playAudio('valitse.mp3', () => {
        playAudio(currentQuestions[currentQuestion].audio);
    });
}

function replayCurrentAudio() {
    if (currentQuestions[currentQuestion]) {
        playAudio(currentQuestions[currentQuestion].audio);
    }
}

function loadQuestion() {
    const question = currentQuestions[currentQuestion];
    document.getElementById('option1').src = question.img1;
    document.getElementById('option2').src = question.img2;
    document.getElementById('check-button').style.display = 'block';
    document.getElementById('next-arrow').style.display = 'none';
    checkButtonClicked = false;
    selectedOption = 0;
    
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    updateCheckButtonState();
}

// Rest of the functions remain the same as in your original code
function selectOption(option) {
    selectedOption = option;
    const options = document.querySelectorAll('.option');
    options.forEach(optionElement => {
        optionElement.classList.remove('selected');
    });
    document.getElementById(`option${option}`).classList.add('selected');
    updateCheckButtonState();
}

function updateCheckButtonState() {
    const checkButton = document.getElementById('check-button');
    checkButton.disabled = selectedOption === 0;
    checkButton.classList.toggle('disabled', selectedOption === 0);
}

function checkAnswer() {
    if (checkButtonClicked || selectedOption === 0) return;
    
    checkButtonClicked = true;
    const question = currentQuestions[currentQuestion];
    
    const selectedElement = document.getElementById(`option${selectedOption}`);
    if (selectedOption === question.correct) {
        selectedElement.classList.add('correct');
        correctAnswers++;
        updateStars();
        playAudio('oikein.mp3');
    } else {
        selectedElement.classList.add('incorrect');
        document.getElementById(`option${question.correct}`).classList.add('correct');
        playAudio('vaarin.mp3');
    }
    document.getElementById('check-button').style.display = 'none';
    document.getElementById('next-arrow').style.display = 'block';
}

function updateStars() {
    const starsContainer = document.getElementById('stars-container');
    starsContainer.innerHTML = '<img src="tahti.png" alt="Star" class="star-icon">'.repeat(correctAnswers);
}

function nextQuestion() {
    stopAllAudio();
    lastAudioUsed = currentQuestions[currentQuestion].audio.split('.')[0];
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('correct', 'incorrect', 'selected');
    });
    currentQuestion++;
    if (currentQuestion >= currentQuestions.length) {
        showResult();
    } else {
        loadQuestion();
        playAudio(currentQuestions[currentQuestion].audio);
    }
}

function showResult() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h1>LÄHDETÄÄN YHDESSÄ</h1>
        <p id="result">SAIT ${correctAnswers} / ${currentQuestions.length} OIKEIN</p>
        <div id="final-stars-container">${'<img src="tahti.png" alt="Star" class="star-icon">'.repeat(correctAnswers)}</div>
        <button onclick="restartGame()">PELAA UUDELLEEN</button>
    `;
    document.getElementById('stars-container').style.display = 'none';
}

function restartGame() {
    stopAllAudio();
    currentQuestion = 0;
    selectedOption = 0;
    correctAnswers = 0;
    checkButtonClicked = false;
    lastAudioUsed = null;
    currentQuestions = getRandomQuestions(5);
    
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h2>VALITSE OIKEA KUVA:</h2>
        <button id="replay-sound" class="replay-button">
            <img src="kaiutin.png" alt="Toista ääni">
        </button>
        <div class="options">
            <img id="option1" class="option" onclick="selectOption(1)">
            <img id="option2" class="option" onclick="selectOption(2)">
        </div>
        <div id="game-controls">
            <button id="check-button" onclick="checkAnswer()">TARKISTA</button>
            <img id="next-arrow" src="nuoli.png" onclick="nextQuestion()">
        </div>
    `;
    
    document.getElementById('replay-sound').addEventListener('click', replayCurrentAudio);
    
    document.getElementById('stars-container').innerHTML = '';
    document.getElementById('stars-container').style.display = 'block';
    
    loadQuestion();
    playAudio('valitse.mp3', () => {
        playAudio(currentQuestions[currentQuestion].audio);
    });
}

function stopAllAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function playAudio(src, callback) {
    stopAllAudio();
    currentAudio = new Audio(src);
    currentAudio.play().catch(error => console.error('Error playing audio:', error));
    if (callback) {
        currentAudio.onended = callback;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startGame);

    document.getElementById('replay-sound').addEventListener('click', replayCurrentAudio);  // Lisää tämä rivi

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' && document.getElementById('next-arrow').style.display !== 'none') {
            nextQuestion();
        }
    });
});