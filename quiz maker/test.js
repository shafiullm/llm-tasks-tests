const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// Read the HTML content
const makerHtml = fs.readFileSync(
  path.resolve(__dirname, "./quiz_maker.html"),
  "utf8"
);
const attendeeHtml = fs.readFileSync(
  path.resolve(__dirname, "./quiz_attendee.html"),
  "utf8"
);

let dom;
let window;
let document;

describe("Quiz Maker", () => {
  beforeEach(() => {
    dom = new JSDOM(makerHtml, { runScripts: "dangerously" });
    window = dom.window;
    document = window.document;

    const script = fs.readFileSync(
      path.resolve(__dirname, "./quiz_maker.js"),
      "utf8"
    );
    const scriptElement = document.createElement("script");
    scriptElement.textContent = script;
    document.body.appendChild(scriptElement);

    // Mock alert and localStorage
    window.alert = jest.fn();
    window.localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
    };
  });

  // Test case 1: Adding multiple-choice questions
  test("allows quiz makers to add multiple-choice questions", () => {
    document.getElementById("questionText").value =
      "What is the capital of France?";
    document.getElementById("option1").value = "London";
    document.getElementById("option2").value = "Berlin";
    document.getElementById("option3").value = "Paris";
    document.getElementById("option4").value = "Madrid";
    document.getElementById("correctAnswer").value = "3";
    document.getElementById("timeLimit").value = "5";

    window.addQuestion();

    expect(window.questions.length).toBe(1);
    expect(window.questions[0].text).toBe("What is the capital of France?");
    expect(window.questions[0].options).toEqual([
      "London",
      "Berlin",
      "Paris",
      "Madrid",
    ]);
  });

  // Test case 2: Storing correct answers
  test("stores the correct answer for each question added", () => {
    document.getElementById("questionText").value = "What is 2 + 2?";
    document.getElementById("option1").value = "3";
    document.getElementById("option2").value = "4";
    document.getElementById("option3").value = "5";
    document.getElementById("option4").value = "6";
    document.getElementById("correctAnswer").value = "2";
    document.getElementById("timeLimit").value = "5";

    window.addQuestion();

    expect(window.questions[0].correctAnswer).toBe(1); // 0-indexed
  });

  // Test case 3: Maximum 10 questions
  test("supports a maximum of 10 questions for a quiz", () => {
    for (let i = 0; i < 11; i++) {
      document.getElementById("questionText").value = `Question ${i + 1}`;
      document.getElementById("option1").value = "Option 1";
      document.getElementById("option2").value = "Option 2";
      document.getElementById("option3").value = "Option 3";
      document.getElementById("option4").value = "Option 4";
      document.getElementById("correctAnswer").value = "1";
      document.getElementById("timeLimit").value = "5";
      window.addQuestion();
    }

    expect(window.questions.length).toBe(10);
    expect(window.alert).toHaveBeenCalledWith(
      "Maximum of 10 questions can be added."
    );
  });

  // Test case 4: Time limit for quiz
  test("allows quiz makers to add a time limit for the quiz", () => {
    document.getElementById("questionText").value = "Test Question";
    document.getElementById("option1").value = "Option 1";
    document.getElementById("option2").value = "Option 2";
    document.getElementById("option3").value = "Option 3";
    document.getElementById("option4").value = "Option 4";
    document.getElementById("correctAnswer").value = "1";
    document.getElementById("timeLimit").value = "10"; // 10 minutes

    window.addQuestion();

    expect(window.questions[0].timeLimit).toBe(600); // 10 minutes in seconds
  });

  // Test case 5: Validate four answer options
  test("validates that all questions have four answer options", () => {
    document.getElementById("questionText").value = "Test Question";
    document.getElementById("option1").value = "Option 1";
    document.getElementById("option2").value = "Option 2";
    document.getElementById("option3").value = ""; // Missing option
    document.getElementById("option4").value = "Option 4";
    document.getElementById("correctAnswer").value = "1";
    document.getElementById("timeLimit").value = "5";

    window.addQuestion();

    expect(window.alert).toHaveBeenCalledWith(
      "Please fill in all fields correctly. Time limit should be a number between 1 and 10."
    );
    expect(window.questions.length).toBe(0);
  });
});

describe("Quiz Attendee", () => {
  beforeEach(() => {
    dom = new JSDOM(attendeeHtml, {
      runScripts: "dangerously",
      resources: "usable",
    });
    window = dom.window;
    document = window.document;

    const script = fs.readFileSync(
      path.resolve(__dirname, "./quiz_attendee.js"),
      "utf8"
    );
    const scriptElement = document.createElement("script");
    scriptElement.textContent = script;
    document.body.appendChild(scriptElement);

    // Mock localStorage
    const mockQuizData = JSON.stringify([
      {
        text: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        timeLimit: 300,
      },
    ]);
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => mockQuizData),
        setItem: jest.fn(),
      },
      writable: true,
    });

    // Mock timer functions
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Test case 6: Countdown timer
  test("displays a countdown timer for the quiz duration", () => {
    window.onload();
    expect(document.getElementById("timer").textContent).toContain(
      "Time remaining: 5:00"
    );

    jest.advanceTimersByTime(1000);
    expect(document.getElementById("timer").textContent).toContain(
      "Time remaining: 4:59"
    );
  });

  // Test case 7: Selecting one answer
  test("allows the attendee to select one answer for each question", () => {
    window.onload();
    const options = document.querySelectorAll('input[name="answer"]');
    options[0].checked = true;
    options[1].checked = true;

    const checkedOptions = document.querySelectorAll(
      'input[name="answer"]:checked'
    );
    expect(checkedOptions.length).toBe(1);
    expect(checkedOptions[0]).toBe(options[1]);
  });

  // Test case 8: Auto-submit on time limit
  test("submits the quiz automatically if the time limit is reached", () => {
    window.onload();
    const nextQuestionSpy = jest.spyOn(window, "nextQuestion");

    jest.advanceTimersByTime(300000); // 5 minutes

    expect(nextQuestionSpy).toHaveBeenCalled();
  });

  // Test case 9: Calculate and show score
  test("calculates the attendee's score based on the given correct answers to show a result", () => {
    window.onload();
    document.querySelector('input[name="answer"][value="1"]').checked = true;
    window.nextQuestion();

    const resultsContainer = document.getElementById("results");
    expect(resultsContainer.style.display).toBe("block");
    expect(resultsContainer.innerHTML).toContain("You scored 1 out of 1");
    expect(resultsContainer.innerHTML).toContain("Your percentage is: 100.0%");
  });

  // Test case 10: Save progress on refresh
  test("saves the attendee's quiz progress if they mistakenly turn off the browser or refresh the page", () => {
    window.onload();
    document.querySelector('input[name="answer"][value="1"]').checked = true;
    window.nextQuestion();

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "quizData",
      expect.any(String)
    );
  });
});
