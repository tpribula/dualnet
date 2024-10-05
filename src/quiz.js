const filePaths = {
    file1: 'file.txt', // Path to your first file
    file2: 'file2.txt', // Path to your second file
};

let wordPairs = {};
let slovakWords = [];
let germanWords = [];
let currentWord = null;
let correctAnswer = null;
let translateToGerman = true; // Default translation direction
let totalQuestions = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('file1-button').addEventListener('click', () => loadWordPairs(filePaths.file1));
    document.getElementById('file2-button').addEventListener('click', () => loadWordPairs(filePaths.file2));

    document.getElementById('start-button').addEventListener('click', startQuiz);
    document.getElementById('submit-button').addEventListener('click', checkAnswer);
    document.getElementById('answer-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    document.getElementById('mode-switch-button').addEventListener('click', switchMode);
    document.getElementById('background-toggle-button').addEventListener('click', toggleBackgroundColor);
});

async function loadWordPairs(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();
    wordPairs = {};
    text.split('\n').forEach(line => {
        if (line.includes(' – ')) {
            const [german, slovak] = line.trim().split(' – ');
            wordPairs[slovak] = german;
        }
    });

    slovakWords = Object.keys(wordPairs);
    germanWords = [...new Set(Object.values(wordPairs))]; // Unique German words

    document.getElementById('start-button').disabled = false;
    document.getElementById('mode-switch-button').disabled = false;
    document.getElementById('question-label').textContent = 'You can now start the quiz or switch mode.';
}

function startQuiz() {
    shuffleArray(slovakWords);
    totalQuestions = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    updateCounters();
    loadNextWord();
}

function loadNextWord() {
    if (translateToGerman) {
        if (slovakWords.length > 0) {
            currentWord = slovakWords.pop();
            correctAnswer = wordPairs[currentWord];
            document.getElementById('question-label').textContent = `Translate '${currentWord}' to German:`;
        } else {
            endQuiz();
        }
    } else {
        if (germanWords.length > 0) {
            currentWord = germanWords[Math.floor(Math.random() * germanWords.length)];
            correctAnswer = Object.keys(wordPairs).find(key => wordPairs[key] === currentWord);
            document.getElementById('question-label').textContent = `Translate '${currentWord}' to Slovak:`;
        } else {
            endQuiz();
        }
    }

    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').disabled = false;
    document.getElementById('submit-button').disabled = false;
    document.getElementById('feedback-label').textContent = '';
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer-input').value.trim();
    totalQuestions++;
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        provideFeedback("Correct!", "#009200");
        correctAnswers++;
    } else {
        provideFeedback(`Wrong!`, "#960018");
        incorrectAnswers++;
    }
    updateCounters();
    setTimeout(loadNextWord, 200);
}

function provideFeedback(feedback, color) {    
    const askedTextDiv = document.getElementById('asked-text');
    askedTextDiv.innerHTML += `<div style="color: ${color};">${currentWord} – ${correctAnswer} (${feedback})</div>`;
    askedTextDiv.scrollTop = askedTextDiv.scrollHeight;
}

function endQuiz() {
    document.getElementById('question-label').textContent = "Quiz finished!";
    document.getElementById('submit-button').disabled = true;
    document.getElementById('answer-input').disabled = true;
}

function switchMode() {
    translateToGerman = !translateToGerman;
    document.getElementById('mode-switch-button').textContent = translateToGerman
        ? "Switch to German to Slovak"
        : "Switch to Slovak to German";
}

function updateCounters() {
    document.getElementById('total-label').textContent = `Total Questions: ${totalQuestions}`;
    document.getElementById('correct-label').textContent = `Correct Answers: ${correctAnswers}`;
    document.getElementById('incorrect-label').textContent = `Incorrect Answers: ${incorrectAnswers}`;
    const percentage = totalQuestions === 0 ? 0 : (correctAnswers / totalQuestions) * 100;
    document.getElementById('percentage-label').textContent = `Percentage: ${percentage.toFixed(1)}%`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

let isWhiteBackground = false;
function toggleBackgroundColor() {
    isWhiteBackground = !isWhiteBackground;

    // Change the background color of the body, asked-words, and quiz container
    if (isWhiteBackground) {
        document.body.style.backgroundColor = "black";
        document.getElementById('quiz-container').style.backgroundColor = "#28282B"; // Revert the container's background color
        document.getElementById('asked-text').style.backgroundColor = "#28282B"; // Change the asked words background color
        document.getElementById('asked-text').style.color = "black"; // Change the asked words text color
        document.getElementById('feedback-label').style.color = "white"; // Feedback text color
        document.getElementById('question-label').style.color = "white"; // Question text color
        document.getElementById('total-label').style.color = "white"; // Total questions text color
        document.getElementById('correct-label').style.color = "white"; // Correct answers text color
        document.getElementById('incorrect-label').style.color = "white"; // Incorrect answers text color
        document.getElementById('percentage-label').style.color = "white"; // Percentage text color
        document.getElementById('background-toggle-button').textContent = "Light Mode";

    } else {
        document.body.style.backgroundColor = "#28282B";
        document.getElementById('quiz-container').style.backgroundColor = "#ffffff"; // Change the container's background color
        document.getElementById('asked-text').style.backgroundColor = "white"; // Change the asked words background color
        document.getElementById('asked-text').style.color = "black"; // Change the asked words text color
        document.getElementById('feedback-label').style.color = "black"; // Feedback text color
        document.getElementById('question-label').style.color = "black"; // Question text color
        document.getElementById('total-label').style.color = "black"; // Total questions text color
        document.getElementById('correct-label').style.color = "black"; // Correct answers text color
        document.getElementById('incorrect-label').style.color = "black"; // Incorrect answers text color
        document.getElementById('percentage-label').style.color = "black"; // Percentage text color
        document.getElementById('background-toggle-button').textContent = "Dark Mode";

    }
}
