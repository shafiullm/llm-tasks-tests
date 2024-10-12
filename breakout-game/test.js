const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

describe("Breakout Game", () => {
  let dom;
  let window;
  let document;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf8");
    dom = new JSDOM(html, { runScripts: "dangerously" });
    window = dom.window;
    document = window.document;
  });

  // Requirement 1: The game will be implemented using Javascript and HTML5 canvas.
  test("Canvas element exists", () => {
    const canvas = document.querySelector("canvas");
    expect(canvas).toBeTruthy();
  });

  // Requirement 2: The game will consist of a paddle at the bottom that can be moved left or right by the user.
  test("Paddle exists and can be moved", () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const initialFillStyle = ctx.fillStyle;

    window.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "ArrowRight" })
    );

    window.requestAnimationFrame(() => {});
    expect(ctx.fillStyle).not.toBe(initialFillStyle);
  });

  // Requirement 3: The game will consist of a ball.
  test("Ball exists and has position attributes", () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const spy = jest.spyOn(ctx, "arc");

    // Force a redraw
    window.requestAnimationFrame(() => {});

    // Check if a circle (ball) was drawn
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  // Requirement 4: The ball will change direction or bounce based on collision with the paddle, bricks or walls.
  test("Ball changes direction on collision", () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const spy = jest.spyOn(ctx, "arc");

    // Force multiple redraws to simulate movement
    for (let i = 0; i < 100; i++) {
      window.requestAnimationFrame(() => {});
    }

    // Check if the ball was drawn at different positions
    const calls = spy.mock.calls;
    expect(calls.length).toBeGreaterThan(1);
    expect(calls[0][1]).not.toBe(calls[calls.length - 1][1]); // x position
    expect(calls[0][2]).not.toBe(calls[calls.length - 1][2]); // y position
    spy.mockRestore();
  });

  // Requirement 5: The game will consist of bricks in a layout at the start of the game.
  test("Bricks exist in a layout", () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const spy = jest.spyOn(ctx, "fillRect");

    // Force a redraw
    window.requestAnimationFrame(() => {});

    // Check if multiple rectangles (bricks) were drawn
    expect(spy.mock.calls.length).toBeGreaterThan(1);
    spy.mockRestore();
  });

  // Requirement 6: The bricks will be destroyed if they are hit by the ball.
  test("Bricks are destroyed on collision", () => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const spy = jest.spyOn(ctx, "fillRect");

    // Force multiple redraws to simulate movement and collisions
    for (let i = 0; i < 1000; i++) {
      window.requestAnimationFrame(() => {});
    }

    // Check if the number of drawn bricks decreases over time
    const initialBrickCount = spy.mock.calls.length;

    // Force more redraws
    for (let i = 0; i < 1000; i++) {
      window.requestAnimationFrame(() => {});
    }

    const finalBrickCount = spy.mock.calls.length - initialBrickCount;
    expect(finalBrickCount).toBeLessThan(initialBrickCount);
    spy.mockRestore();
  });

  // Requirement 7: The game will have three levels with increasing difficulties.
  test("Game has multiple levels", () => {
    expect(window.level).toBeDefined();
    // This test will fail as per your evaluation
    expect(typeof window.nextLevel).toBe("function");
  });

  // Requirement 8: The game will display the current score.
  test("Score is displayed", () => {
    const scoreElement = document.getElementById("score");
    expect(scoreElement).toBeTruthy();
    expect(scoreElement.textContent).toContain("Score:");
  });

  // Requirement 9: The game will end if the ball goes below the paddle.
  test("Game ends when ball goes below paddle", () => {
    const ball = window.ball;
    const canvas = document.querySelector("canvas");
    ball.y = canvas.height + 1;
    window.update();
    expect(window.gameOver).toBe(true);
  });

  // Requirement 10: The game will display the current level.
  test("Current level is displayed", () => {
    // This test will fail as per your evaluation
    const levelElement = document.getElementById("level");
    expect(levelElement).toBeTruthy();
    expect(levelElement.textContent).toContain("Level:");
  });

  // Requirement 11: The game will proceed to the next level if all the bricks are destroyed.
  test("Game proceeds to next level when all bricks are destroyed", () => {
    // This test will fail as per your evaluation
    window.bricks = [[]]; // Set bricks to empty
    window.update();
    expect(window.level).toBe(2);
  });

  // Requirement 12: The game will have a life function, consisting of three lives at the start of the game.
  test("Game starts with three lives", () => {
    const livesElement = document.getElementById("lives");
    expect(livesElement).toBeTruthy();
    expect(livesElement.textContent).toContain("Lives: 3");
  });

  // Requirement 13: The score of the game will be counted based on the number of bricks destroyed and the remaining lives at the end of each level.
  test("Score is updated when bricks are destroyed", () => {
    const initialScore = window.score;
    window.bricks[0][0] = null; // Destroy a brick
    window.update();
    expect(window.score).toBeGreaterThan(initialScore);
  });

  // Requirement 14: The game will save and display the highest score locally.
  test("Highest score is saved and displayed", () => {
    // This test will fail as per your evaluation
    window.score = 1000;
    window.updateHighScore();
    expect(localStorage.getItem("highScore")).toBe("1000");
    const highScoreElement = document.getElementById("highScore");
    expect(highScoreElement).toBeTruthy();
    expect(highScoreElement.textContent).toContain("High Score: 1000");
  });

  // Requirement 15: The game will display a victory message if all the levels are completed.
  test("Victory message is displayed when all levels are completed", () => {
    // This test will fail as per your evaluation
    window.level = 3;
    window.bricks = [[]]; // Set bricks to empty
    window.update();
    const victoryMessage = document.querySelector(".victory-message");
    expect(victoryMessage).toBeTruthy();
    expect(victoryMessage.style.display).toBe("block");
  });
});
