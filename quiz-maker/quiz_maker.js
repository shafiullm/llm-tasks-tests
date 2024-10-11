// quiz_maker.js (for quiz creation)

const questions = [];

function addQuestion() {
  const questionText = document.getElementById("questionText").value;
  const options = [
    document.getElementById("option1").value,
    document.getElementById("option2").value,
    document.getElementById("option3").value,
    document.getElementById("option4").value,
  ];
  const correctAnswer = parseInt(
    document.getElementById("correctAnswer").value
  );
  const timeLimit = parseInt(document.getElementById("timeLimit").value) || 10; // Default 10 minutes

  if (
    questionText &&
    options.every((opt) => opt) &&
    !isNaN(correctAnswer) &&
    correctAnswer >= 1 &&
    correctAnswer <= 4 &&
    timeLimit <= 10 &&
    timeLimit > 0
  ) {
    questions.push({
      text: questionText,
      options: options,
      correctAnswer: correctAnswer - 1, // Adjust to 0-indexed
      timeLimit: timeLimit * 60, // Convert to seconds
    });

    // Clear input fields
    document.getElementById("questionText").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("option4").value = "";
    document.getElementById("correctAnswer").value = "";
    document.getElementById("timeLimit").value = "";

    displayQuestions();
  } else {
    alert(
      "Please fill in all fields correctly. Time limit should be a number between 1 and 10."
    );
  }

  if (questions.length >= 10) {
    alert("Maximum of 10 questions can be added.");
    document.getElementById("addQuestionBtn").disabled = true;
  }
}

function displayQuestions() {
  const questionList = document.getElementById("questionList");
  questionList.innerHTML = ""; // Clear previous questions
  questions.forEach((q, index) => {
    const questionItem = document.createElement("li");
    questionItem.innerHTML = `
            ${index + 1}. ${q.text}<br>
            Options: ${q.options.join(", ")}<br>
            Correct Answer: ${q.options[q.correctAnswer]}<br>
            Time Limit: ${q.timeLimit / 60} minutes

        `;
    questionList.appendChild(questionItem);
  });
}

function generateQuiz() {
  if (questions.length === 0) {
    alert("You have not added any questions to the quiz!");
    return;
  }
  const quizData = JSON.stringify(questions);
  localStorage.setItem("quizData", quizData); // Store in local storage
  window.location.href = "quiz_attendee.html"; // Redirect to attendee page
}
