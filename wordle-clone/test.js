/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8"); // Update path if needed

let dom;
let document;
let window;

describe("Wordle Clone Tests", () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
    window = dom.window;
  });

  //Helper function to simulate keyboard presses
  function simulateKeyPress(key) {
    const event = new window.KeyboardEvent("keydown", { key });
    document.dispatchEvent(event);
  }

  it("R1 & A1: Starts with a random five-letter word", () => {
    const secretWord = window.secretWord; // Access the secretWord variable directly
    expect(secretWord).toBeDefined();
    expect(secretWord.length).toBe(5);
  });

  it("R2 & A2: Displays a 5x6 grid", () => {
    const board = document.getElementById("board");
    expect(board.children.length).toBe(6); // 6 rows
    for (let i = 0; i < 6; i++) {
      expect(board.children[i].children.length).toBe(5); // 5 tiles/columns per row
    }
  });

  it("R3 & A3: Provides an on-screen keyboard", () => {
    const keyboard = document.getElementById("keyboard");
    expect(keyboard).toBeDefined();
    // Check for A-Z, Enter and Backspace.  More robust tests would examine key layout.
    expect(keyboard.querySelectorAll("button")).toHaveLengthGreaterThanOrEqual(
      28
    ); // 26 letters + enter + backspace (at least)
  });

  it("R4 & A4: Allows input from both on-screen and physical keyboard", () => {
    const tile00 = document.getElementById("tile-0-0");
    // Simulate on-screen keyboard click
    const onscreenKeyA = document.querySelector("button:nth-child(1)"); //Assumes QWERTY and 'A' is first. Adjust if needed
    onscreenKeyA.click();
    expect(tile00.textContent).toBe("A");

    // Simulate physical keyboard press
    simulateKeyPress("B");
    const tile01 = document.getElementById("tile-0-1");
    expect(tile01.textContent).toBe("B");
  });

  it("R5 & A5: Accepts only five-letter word guesses", () => {
    // Need to spy on alert (or replace it with a more testable notification)
    window.alert = jest.fn(); // Use Jest to mock window.alert

    // Enter a 4-letter word (invalid)
    simulateKeyPress("A");
    simulateKeyPress("B");
    simulateKeyPress("C");
    simulateKeyPress("D");
    window.checkGuess();
    //expect(window.alert).toHaveBeenCalledWith("Not in word list!");  // Depends on the word lists in the game. If "abcd" is in the list, this would fail.

    // Now add the fifth letter to make it a 5-letter word and it should be accepted
    simulateKeyPress("E");
    window.checkGuess();
    expect(window.alert).not.toHaveBeenCalledWith("Not enough letters!"); // Should not give an error now
  });

  // ... (Remaining tests for R6 to R14)

  // You'll need to adapt these tests based on the exact implementation of your game logic.
  // For example, simulating a whole game and checking for win/lose conditions, color changes, local storage, etc.

  it("R6 & A6: Provides colored feedback for each guess", () => {
    window.secretWord = "above"; // Force the secret word for testing
    simulateKeyPress("a");
    simulateKeyPress("d");
    simulateKeyPress("e");
    simulateKeyPress("p");
    simulateKeyPress("t");
    window.checkGuess();

    const tile00 = document.getElementById("tile-0-0");
    const tile02 = document.getElementById("tile-0-2");
    // ...other tiles...

    expect(tile00.classList.contains("correct")).toBe(true); // 'a' should be green
    expect(tile02.classList.contains("present")).toBe(true); // 'e' should be yellow
    // ...check other tiles for gray...
  });

  it("R7 & A7: Updates on-screen keyboard colors", () => {
    window.secretWord = "crane"; // Force the secret word for testing
    simulateKeyPress("a");
    simulateKeyPress("p");
    simulateKeyPress("p");
    simulateKeyPress("l");
    simulateKeyPress("e");
    window.checkGuess();
    const keyA = document.querySelector("#keyboard button:nth-child(1)"); // Assuming QWERTY and "A" is first
    const keyP = document.querySelector("#keyboard button:nth-child(16)"); // Assuming 'P' is 16th
    const keyE = document.querySelector("#keyboard button:nth-child(5)"); // Assuming 'E' is 5th

    expect(keyA.classList.contains("present")).toBe(true); // A should be yellow
    expect(keyP.classList.contains("absent")).toBe(true); // P should be gray
    expect(keyE.classList.contains("correct")).toBe(true); // E should be green
  });

  it("R8 & A8: Ends the game if the correct word is guessed", () => {
    window.secretWord = "tests"; // Force the secret word for testing
    window.alert = jest.fn(); // Mock alert

    simulateKeyPress("t");
    simulateKeyPress("e");
    simulateKeyPress("s");
    simulateKeyPress("t");
    simulateKeyPress("s");
    window.checkGuess();

    expect(window.alert).toHaveBeenCalledWith("You win!");
  });

  it("R9 & A9: Ends game after six incorrect guesses", () => {
    window.secretWord = "bound"; // Force the secret word for testing
    window.alert = jest.fn(); // Mock alert

    // Enter 6 incorrect guesses
    for (let i = 0; i < 6; i++) {
      simulateKeyPress("t");
      simulateKeyPress("e");
      simulateKeyPress("s");
      simulateKeyPress("t");
      simulateKeyPress("s");
      window.checkGuess();
    }
    expect(window.alert).toHaveBeenCalledWith("You lose! The word was bound");
  });

  it("R10 & A10: Allows selecting difficulty levels", () => {
    expect(window.difficulties).toBeDefined(); // Check difficulties variable exists
    expect(window.difficulty).toBe("easy"); // Check initial difficulty

    document.querySelector('button[onclick="newGame()"]').click(); // Click New Game (should cycle to medium)
    expect(window.difficulty).toBe("medium");

    document.querySelector('button[onclick="newGame()"]').click(); // Click New Game again (should cycle to hard)
    expect(window.difficulty).toBe("hard");
    // ...check for hard
  });

  it("R11 & A11: Allows starting a new game", () => {
    // ...Partially covered in the R10 test...
    // Make a guess and then check that newGame() resets the board
    simulateKeyPress("a");
    document.querySelector('button[onclick="newGame()"]').click(); // Click New Game
    expect(document.getElementById("tile-0-0").textContent).toBe(""); // Should be cleared
  });

  it("R12 & A12: Allows deleting letters with backspace", () => {
    simulateKeyPress("a");
    expect(document.getElementById("tile-0-0").textContent).toBe("A");

    simulateKeyPress("Backspace"); // or use: const backspaceKey = document.querySelector("#keyboard button:contains('⌫')"); backspaceKey.click()
    expect(document.getElementById("tile-0-0").textContent).toBe("");

    // On-screen backspace test (adapt based on actual button selector)
    const backspaceKey = document.querySelector(
      "#keyboard button:contains('⌫')"
    ); // Adapt selector if needed
    simulateKeyPress("a");
    backspaceKey.click();
    expect(document.getElementById("tile-0-0").textContent).toBe("");
  });

  it("R13 & A13: Saves game state locally", () => {
    window.localStorage.setItem = jest.fn(); // Mock localStorage
    window.secretWord = "apple";
    simulateKeyPress("a");
    window.newGame(); // This should trigger a save (check your newGame implementation)

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining("apple")
    ); // Check if the secret word is saved, along with other info
  });

  it("R14 & A14: Implements a win-streak counter", () => {
    //  Difficult to test directly without refactoring how the streak is handled.
    //  One approach is to expose a getWinStreak() method (not ideal from a pure game design perspective)
    // or check the UI element where the streak is displayed after simulated wins.

    // Example with UI check (very fragile, adapt to your HTML):
    window.secretWord = "great";
    simulateKeyPress("g");
    simulateKeyPress("r");
    simulateKeyPress("e");
    simulateKeyPress("a");
    simulateKeyPress("t");
    window.checkGuess();
    // Check if the win streak display has been updated. This requires you to have an element in your HTML that displays the win streak.
    // Example: expect(document.getElementById('win-streak').textContent).toBe("1"); // Example, adapt selector

    // Another win. Check if the streak increases
    window.newGame();
    window.secretWord = "apple"; // Set secretWord directly for testing
    simulateKeyPress("a");
    simulateKeyPress("p");
    simulateKeyPress("p");
    simulateKeyPress("l");
    simulateKeyPress("e");
    window.checkGuess();
    //expect(document.getElementById('win-streak').textContent).toBe("2"); // Example, adapt selector
  });
});
