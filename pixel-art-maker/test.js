const fs = require("fs");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync("index.html", "utf8");
let dom;
let document;

beforeEach(() => {
  dom = new JSDOM(html, { runScripts: "dangerously" });
  document = dom.window.document;
});

test("Requirement 1: Functional custom canvas size input fields", () => {
  const widthInput = document.querySelector('input[placeholder="Width"]');
  const heightInput = document.querySelector('input[placeholder="Height"]');
  const resizeButton = document.querySelector('button:contains("Resize")');

  expect(widthInput).toBeTruthy();
  expect(heightInput).toBeTruthy();
  expect(resizeButton).toBeTruthy();
});

test("Requirement 2: Display grid canvas of specified dimensions", () => {
  const resizeButton = document.querySelector('button:contains("Resize")');
  const canvasContainer = document.getElementById("canvasContainer");

  expect(resizeButton).toBeTruthy();
  expect(canvasContainer).toBeTruthy();

  // Simulate resize button click
  resizeButton.click();

  // Check if a canvas is created in the container
  const canvas = canvasContainer.querySelector("canvas");
  expect(canvas).toBeTruthy();
});

test("Requirement 3: Brush tool for drawing individual pixels", () => {
  const brushButton = document.querySelector('button:contains("Brush")');
  expect(brushButton).toBeTruthy();

  // Simulate brush button click
  brushButton.click();

  // Check if the brush tool is activated (this might set a class or data attribute)
  expect(
    brushButton.classList.contains("active") ||
      brushButton.dataset.active === "true"
  ).toBeTruthy();
});

test("Requirement 4: Eraser tool to remove individual pixels' color", () => {
  const eraserButton = document.querySelector('button:contains("Eraser")');
  expect(eraserButton).toBeTruthy();

  // Simulate eraser button click
  eraserButton.click();

  // Check if the eraser tool is activated
  expect(
    eraserButton.classList.contains("active") ||
      eraserButton.dataset.active === "true"
  ).toBeTruthy();
});

test("Requirement 5: Shape tools (line, rectangle)", () => {
  const lineButton = document.querySelector('button:contains("Line")');
  const rectangleButton = document.querySelector(
    'button:contains("Rectangle")'
  );

  expect(lineButton).toBeTruthy();
  expect(rectangleButton).toBeTruthy();

  // Simulate line button click
  lineButton.click();
  expect(
    lineButton.classList.contains("active") ||
      lineButton.dataset.active === "true"
  ).toBeTruthy();

  // Simulate rectangle button click
  rectangleButton.click();
  expect(
    rectangleButton.classList.contains("active") ||
      rectangleButton.dataset.active === "true"
  ).toBeTruthy();
});

test("Requirement 6: Color palette", () => {
  const colorPalette = document.getElementById("colorPalette");
  expect(colorPalette).toBeTruthy();

  // Check if there are color options in the palette
  const colorOptions = colorPalette.querySelectorAll("div");
  expect(colorOptions.length).toBeGreaterThan(0);
});

test("Requirement 7: Fill bucket tool", () => {
  const fillBucketButton = document.querySelector(
    'button:contains("Fill Bucket")'
  );
  expect(fillBucketButton).toBeTruthy();

  // Simulate fill bucket button click
  fillBucketButton.click();

  // Check if the fill bucket tool is activated
  expect(
    fillBucketButton.classList.contains("active") ||
      fillBucketButton.dataset.active === "true"
  ).toBeTruthy();
});

test("Requirement 8: Undo feature", () => {
  // Check if undo functionality exists (e.g., a function or button)
  const undoButton = document.querySelector('button:contains("Undo")');
  const undoFunction = dom.window.undo;

  expect(undoButton || undoFunction).toBeTruthy();
});

test("Requirement 9: Redo feature", () => {
  // Check if redo functionality exists (e.g., a function or button)
  const redoButton = document.querySelector('button:contains("Redo")');
  const redoFunction = dom.window.redo;

  expect(redoButton || redoFunction).toBeTruthy();
});

test("Requirement 10: Download pixel art", () => {
  const downloadButton = document.querySelector('button:contains("Download")');
  expect(downloadButton).toBeTruthy();

  // Simulate download button click
  downloadButton.click();

  // Check if download functionality is triggered (this might set a class or data attribute)
  expect(
    downloadButton.classList.contains("downloading") ||
      downloadButton.dataset.downloading === "true"
  ).toBeTruthy();
});

test("Requirement 11: Upload file to edit pixel art", () => {
  const uploadButton = document.querySelector('button:contains("Upload")');
  expect(uploadButton).toBeTruthy();

  // Simulate upload button click
  uploadButton.click();

  // Check if upload functionality is triggered (this might set a class or data attribute)
  expect(
    uploadButton.classList.contains("uploading") ||
      uploadButton.dataset.uploading === "true"
  ).toBeTruthy();
});
