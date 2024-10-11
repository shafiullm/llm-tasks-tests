let currentQuestion = 0;
let score = 0;
let timeLeft;
let timerInterval;

window.onload = function () {
  const quizData = JSON.parse(localStorage.getItem("quizData"));
  if (!quizData) {
    alert("No quiz data found. Please go back and add some questions first.");
    window.location.href = "quiz_maker.html";
    return;
  }
  displayQuestion(quizData);

  timeLeft = quizData[currentQuestion].timeLimit;

  timerInterval = setInterval(updateTimer, 1000);
};

function displayQuestion(quizData) {
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const questionData = quizData[currentQuestion];

  questionElement.textContent = currentQuestion + 1 + ". " + questionData.text;
  optionsElement.innerHTML = "";

  questionData.options.forEach((option, index) => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.id = `option${index}`;
    radio.value = index; // Store the actual index for the option

    const label = document.createElement("label");
    label.htmlFor = `option${index}`;
    label.textContent = option;

    optionsElement.appendChild(radio);
    optionsElement.appendChild(label);
    optionsElement.appendChild(document.createElement("br"));
  });
}

function nextQuestion() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (!selectedAnswer) {
    alert("Please select an answer!");
    return;
  }

  const quizData = JSON.parse(localStorage.getItem("quizData"));

  if (
    parseInt(selectedAnswer.value) === quizData[currentQuestion].correctAnswer
  ) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    clearInterval(timerInterval); // Clear the previous timer

    timeLeft = quizData[currentQuestion].timeLimit;
    timerInterval = setInterval(updateTimer, 1000); // Reset the timer

    displayQuestion(quizData);
  } else {
    clearInterval(timerInterval);
    showResults(quizData);
  }
}

function showResults(quizData) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = `
        <h2>Quiz Results</h2>
        <p>You scored ${score} out of ${quizData.length}.</p>
        <p>Your percentage is: ${((score / quizData.length) * 100).toFixed(
          1
        )}%</p>
    `;

  document.getElementById("quizContainer").style.display = "none";
  resultsContainer.style.display = "block";
}

function updateTimer() {
  const timerElement = document.getElementById("timer");

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerElement.textContent = `Time remaining: ${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  if (timeLeft === 0) {
    clearInterval(timerInterval);
    nextQuestion(); // Automatically move to the next question if timer is up
  }

  timeLeft--;
}
