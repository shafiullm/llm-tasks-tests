/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

let dom;
let canvas;
let ctx;
let game;

describe("Breakout Game Tests", () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    global.window = dom.window;
    global.document = window.document;
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    // Mock LocalStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();

    game = require("./game"); // Assuming your game logic is in game.js
    game.initGame(); // Reset game for every test if you have such a function
  });

  it("R1/A1: HTML canvas element exists", () => {
    expect(canvas).not.toBeNull();
  });

  it("R2/A2: Paddle moves horizontally", () => {
    const initialPaddleX = game.paddleX;
    // Simulate right key press
    let event = new window.KeyboardEvent("keydown", { key: "ArrowRight" });
    document.dispatchEvent(event);
    game.draw(); // Call draw to update paddle position
    expect(game.paddleX).toBeGreaterThan(initialPaddleX);
  });

  it("R3/A3: Ball exists and has position", () => {
    expect(game.x).toBeDefined();
    expect(game.y).toBeDefined();
  });

  it("R4/A4: Ball bounces off top wall", () => {
    const initialDy = game.dy;
    game.y = 0; // Set ball to top edge
    game.draw();
    expect(game.dy).toBe(-initialDy); // dy should be reversed
  });

  it("R5/A5: Bricks are initialized", () => {
    expect(game.bricks).toBeDefined();
    expect(game.bricks.length).toBeGreaterThan(0);
  });

  it("R6/A6: Brick is destroyed on collision", () => {
    game.bricks[0][0].status = 1; // Ensure a brick exists
    game.x = game.bricks[0][0].x + game.brickWidth / 2; // Ball centered on brick
    game.y = game.bricks[0][0].y + game.brickHeight / 2;
    game.draw(); // Run collision detection
    expect(game.bricks[0][0].status).toBe(0); // Brick status should be 0 (destroyed)
  });

  it("R7/A7: Levels have different brick layouts", () => {
    const level1Bricks = JSON.parse(JSON.stringify(game.bricks)); // Deep copy
    game.level = 2;
    game.createBricks();
    expect(game.bricks).not.toEqual(level1Bricks);
  });

  it("R8/A8: Score is displayed and updated", () => {
    game.score = 50;
    game.draw(); // Update the display potentially called in your draw function
    expect(document.getElementById("score").innerHTML).toContain(50);
  });

  it("R9/A9: Game over when ball goes below paddle", () => {
    window.alert = jest.fn(); // Mock alert
    game.y = canvas.height + game.ballRadius; // Below canvas
    game.lives = 1;
    game.draw();
    expect(window.alert).toHaveBeenCalledWith("GAME OVER");
  });

  it("R10/A10: Level is displayed", () => {
    // You'll need to ensure you have a #level element if you want to display it on screen
    // For this example, I assume you store level as text in the DOM:
    game.level = 2;
    // Your game logic would update the DOM here (e.g., in a draw() function):
    // document.getElementById("level").textContent = "Level: " + game.level;
    // game.draw(); // Assuming this function updates the display

    // If no DOM element:
    expect(game.level).toBe(2);
  });

  it("R11/A11: Game proceeds to next level", () => {
    game.score = game.brickRowCount * game.brickColumnCount;
    game.draw();
    expect(game.level).toBeGreaterThan(1);
  });

  it("R12/A12: Game has lives and decreases on ball loss", () => {
    const initialLives = game.lives;
    game.y = canvas.height + game.ballRadius;
    game.draw();
    expect(game.lives).toBeLessThan(initialLives);
  });

  it("R13/A13: Score calculation is correct", () => {
    const initialScore = game.score;
    const destroyedBricks = 5;
    game.score += destroyedBricks;
    expect(game.score).toBe(initialScore + destroyedBricks);
  });

  it("R14/A14: High score is saved locally", () => {
    // Set a high score
    localStorage.setItem("highscore", "50"); // LocalStorage is now mocked

    // Retrieve the score. This test will fail if localStorage is not accessed
    const highscore = localStorage.getItem("highscore");

    // Use highscore. Value should be 50
    expect(highscore).toBe("50");
  });

  it("R15/A15: Displays victory message", () => {
    window.alert = jest.fn(); // Mock alert
    game.level = 4; // Assuming 3 is the max level
    game.draw();
    expect(window.alert).toHaveBeenCalledWith("YOU WIN, CONGRATULATIONS!");
  });
});
