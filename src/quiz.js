const filePath = 'file.txt'; // Path to your file

let wordPairs = {};
let slovakWords = [];
let germanWords = [];
let currentWord = null;
let correctAnswer = null;
let translateToGerman = true; // Default translation direction
let totalQuestions = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let rankedWords = [];

document.addEventListener('DOMContentLoaded', () => {
    loadWordPairs(filePath).then(() => {
        document.getElementById('start-button').addEventListener('click', startQuiz);
        document.getElementById('submit-button').addEventListener('click', checkAnswer);
        document.getElementById('answer-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
        document.getElementById('switch-button').addEventListener('click', switchDirection);
        document.getElementById('ranked-button').addEventListener('click', startRankedQuiz);
    });
});

async function loadWordPairs(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();
    text.split('\n').forEach(line => {
        if (line.includes(' – ')) {
            const [german, slovak] = line.trim().split(' – ');
            wordPairs[slovak] = german;
        }
    });
    slovakWords = Object.keys(wordPairs);
    germanWords = [...new Set(Object.values(wordPairs))]; // Extract unique German words
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
    document.getElementById('feedback-label').textContent = '';
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer-input').value.trim();
    totalQuestions++;
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        provideFeedback("Correct!", "green", "Correct");
        correctAnswers++;
    } else {
        provideFeedback(`Wrong! The correct word is '${correctAnswer}'.`, "red", "Incorrect");
        incorrectAnswers++;
    }
    updateCounters();
    setTimeout(loadNextWord, 2000);
}

function provideFeedback(feedback, color, result) {
    // Update the feedback label with the current feedback
    document.getElementById('feedback-label').textContent = feedback;
    document.getElementById('feedback-label').style.color = color;

    // Get the container for all answered text
    const askedText = document.getElementById('asked-text');
    
    // Create a new div element for the feedback entry
    const feedbackEntry = document.createElement('div');

    // Set the content and color based on the result
    if (result === "Correct") {
        feedbackEntry.innerHTML = `<span style="color: green;">${currentWord} – ${correctAnswer} (Correct)</span>`;
    } else {
        feedbackEntry.innerHTML = `<span style="color: red;">${currentWord} – ${correctAnswer} (Incorrect)</span>`;
    }

    // Append the new entry to the container
    askedText.appendChild(feedbackEntry);
    
    // Scroll to the bottom of the container to show the latest entry
    askedText.scrollTop = askedText.scrollHeight;
}

function endQuiz() {
    document.getElementById('question-label').textContent = "Quiz finished!";
    document.getElementById('feedback-label').textContent = "Great job!";
    document.getElementById('submit-button').disabled = true;
}

function switchDirection() {
    translateToGerman = !translateToGerman;
    document.getElementById('switch-button').textContent = translateToGerman ? "Switch to German to Slovak" : "Switch to Slovak to German";
    resetQuiz();
}

function startRankedQuiz() {
    const rankedWindow = window.open("", "Ranked", "width=800,height=600");
    rankedWindow.document.write(`
        <html>
            <head>
                <title>Ranked Quiz</title>
                <style>
                    body { font-family: 'Helvetica', sans-serif; background-color: #e0f7fa; }
                    #ranked-container { display: flex; flex-direction: column; padding: 20px; width: 100%; max-width: 800px; }
                    #question-section { margin-bottom: 20px; }
                    #answer-input { font-size: 16px; padding: 10px; width: 100%; margin: 5px 0; }
                    #asked-text { width: 100%; height: 200px; padding: 10px; background-color: #ffffff; overflow-y: auto; }
                </style>
            </head>
            <body>
                <div id="ranked-container">
                    <button id="start-ranked-button">Start Ranked Quiz</button>
                    <div id="question-section">
                        <p id="question-label">Press 'Start Ranked Quiz' to begin.</p>
                        <input type="text" id="answer-input" placeholder="Enter your answer" disabled />
                        <button id="submit-button" disabled>Submit</button>
                        <p id="feedback-label"></p>
                    </div>
                    <div id="asked-words">
                        <textarea id="asked-text" readonly></textarea>
                    </div>
                </div>
                <script>
                    let wordPairs = ${JSON.stringify(wordPairs)};
                    let slovakWords = Object.keys(wordPairs);
                    let currentWord = null;
                    let correctAnswer = null;

                    document.getElementById('start-ranked-button').addEventListener('click', () => {
                        document.getElementById('answer-input').disabled = false;
                        document.getElementById('submit-button').disabled = false;
                        shuffleArray(slovakWords);
                        loadNextWord();
                    });

                    document.getElementById('submit-button').addEventListener('click', checkAnswer);
                    document.getElementById('answer-input').addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            checkAnswer();
                        }
                    });

                    function loadNextWord() {
                        if (slovakWords.length > 0) {
                            currentWord = slovakWords.pop();
                            correctAnswer = wordPairs[currentWord];
                            document.getElementById('question-label').textContent = \`Translate '\${currentWord}' to German:\`;
                            document.getElementById('answer-input').value = '';
                            document.getElementById('feedback-label').textContent = '';
                        } else {
                            endQuiz();
                        }
                    }

                    function checkAnswer() {
                        const userAnswer = document.getElementById('answer-input').value.trim();
                        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                            provideFeedback("Correct!", "green");
                        } else {
                            provideFeedback(\`Wrong! The correct word is '\${correctAnswer}'.\`, "red");
                        }
                        setTimeout(loadNextWord, 2000);
                    }

                    function provideFeedback(feedback, color) {
                        document.getElementById('feedback-label').textContent = feedback;
                        document.getElementById('feedback-label').style.color = color;
                    }

                    function endQuiz() {
                        document.getElementById('question-label').textContent = "Ranked Quiz finished!";
                        document.getElementById('answer-input').disabled = true;
                        document.getElementById('submit-button').disabled = true;
                    }

                    function shuffleArray(array) {
                        for (let i = array.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [array[i], array[j]] = [array[j], array[i]];
                        }
                    }
                </script>
            </body>
        </html>
    `);
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
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function resetQuiz() {
    totalQuestions = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    updateCounters();
    document.getElementById('asked-text').value = '';
    loadNextWord();
}
