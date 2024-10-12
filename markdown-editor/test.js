const fs = require("fs");
const { JSDOM } = require("jsdom");
const html = fs.readFileSync("index.html", "utf8");
let dom;
let document;
let window;

beforeEach(() => {
  dom = new JSDOM(html, { runScripts: "dangerously" });
  document = dom.window.document;
  window = dom.window;
});

describe("Markdown Editor", () => {
  // Test case for Requirement 1 and Assumption 1
  test("should have an input section for writing Markdown text", () => {
    const textarea = document.querySelector("textarea");
    expect(textarea).not.toBeNull();
    expect(textarea.id).toBeTruthy();
  });

  // Test case for Requirement 2 and Assumption 2
  test("should have a preview section to display the Markdown text", () => {
    const previewDiv = document.getElementById("preview");
    expect(previewDiv).not.toBeNull();
  });

  // Test case for Requirement 3 and Assumption 3
  test("should support live preview for the preview section", () => {
    const textarea = document.querySelector("textarea");
    const previewDiv = document.getElementById("preview");

    // Simulate typing in the textarea
    textarea.value = "# Hello, World!";
    const inputEvent = new window.Event("input");
    textarea.dispatchEvent(inputEvent);

    // Check if the preview is updated
    expect(previewDiv.innerHTML).toContain("<h1>Hello, World!</h1>");
  });

  // Test case for Requirement 4 and Assumption 4
  test("should have a toolbar with formatting options", () => {
    const toolbar = document.querySelector(".toolbar");
    expect(toolbar).not.toBeNull();

    const buttons = toolbar.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(5);

    const expectedButtons = ["Bold", "Italic", "Header", "Link", "List"];
    expectedButtons.forEach((buttonText) => {
      const button = Array.from(buttons).find(
        (btn) => btn.textContent === buttonText
      );
      expect(button).not.toBeUndefined();
    });
  });

  // Test case for Requirement 5 and Assumption 5
  test("should add Markdown syntax at cursor position when toolbar button is clicked", () => {
    const textarea = document.querySelector("textarea");
    const boldButton = Array.from(document.querySelectorAll("button")).find(
      (btn) => btn.textContent === "Bold"
    );

    textarea.value = "Hello World";
    textarea.selectionStart = 6;
    textarea.selectionEnd = 6;

    const clickEvent = new window.MouseEvent("click");
    boldButton.dispatchEvent(clickEvent);

    expect(textarea.value).toBe("Hello ** World");
    expect(textarea.selectionStart).toBe(7);
    expect(textarea.selectionEnd).toBe(7);
  });

  // Test case for Requirement 6 and Assumption 6
  test("should save user's input to local storage", () => {
    const textarea = document.querySelector("textarea");
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    textarea.value = "Test content";
    const inputEvent = new window.Event("input");
    textarea.dispatchEvent(inputEvent);

    // Simulate time passing
    jest.advanceTimersByTime(5000);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "markdownContent",
      "Test content"
    );
  });

  // Test case for Requirement 7 and Assumption 7
  test("should load previously saved content on page load", () => {
    const localStorageMock = {
      getItem: jest.fn(() => "Saved content"),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // Simulate page load
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;

    const textarea = document.querySelector("textarea");
    expect(textarea.value).toBe("Saved content");
  });

  // Test case for Requirement 8 and Assumption 8
  test("should support common Markdown syntaxes", () => {
    const textarea = document.querySelector("textarea");
    const previewDiv = document.getElementById("preview");

    textarea.value =
      "# Header\n**Bold**\n*Italic*\n[Link](https://example.com)\n- List item";
    const inputEvent = new window.Event("input");
    textarea.dispatchEvent(inputEvent);

    expect(previewDiv.innerHTML).toContain("<h1>Header</h1>");
    expect(previewDiv.innerHTML).toContain("<strong>Bold</strong>");
    expect(previewDiv.innerHTML).toContain("<em>Italic</em>");
    expect(previewDiv.innerHTML).toContain(
      '<a href="https://example.com">Link</a>'
    );
    expect(previewDiv.innerHTML).toContain("<li>List item</li>");
  });

  // Test case for Requirement 9 and Assumption 9
  test("should support undo/redo functionality", () => {
    const textarea = document.querySelector("textarea");

    // Mock the undo and redo methods
    textarea.undo = jest.fn();
    textarea.redo = jest.fn();

    // Simulate undo (Ctrl+Z)
    const undoEvent = new window.KeyboardEvent("keydown", {
      key: "z",
      ctrlKey: true,
    });
    textarea.dispatchEvent(undoEvent);

    // Check if undo method was called
    expect(textarea.undo).toHaveBeenCalled();

    // Simulate redo (Ctrl+Y)
    const redoEvent = new window.KeyboardEvent("keydown", {
      key: "y",
      ctrlKey: true,
    });
    textarea.dispatchEvent(redoEvent);

    // Check if redo method was called
    expect(textarea.redo).toHaveBeenCalled();
  });

  // Test case for Requirement 10 and Assumption 10
  test("should have a scrollbar on the input section when necessary", () => {
    const textarea = document.querySelector("textarea");

    // Set a fixed height to the textarea
    textarea.style.height = "100px";
    textarea.style.overflowY = "auto";

    // Add content that exceeds the height
    textarea.value =
      "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10";

    expect(textarea.scrollHeight).toBeGreaterThan(textarea.clientHeight);
    expect(window.getComputedStyle(textarea).overflowY).toBe("auto");
  });
});
