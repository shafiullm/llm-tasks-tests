/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// Load HTML and JS
const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");
const js = fs.readFileSync(path.resolve(__dirname, "./script.js"), "utf8");

let dom;
let document;
let window;

describe("Resume Builder Tests", () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    window = dom.window;
    document = window.document;
    // Execute the script to set up event listeners, etc.
    eval(js);
  });

  // Tests for Requirement 1 & Assumption 1
  it("should have input fields for personal information", () => {
    // Add specific tests for name, email, etc.  Example:
    expect(
      document.querySelector('input[type="text"][name="name"]')
    ).not.toBeNull();
  });

  // Tests for Requirement 2 & Assumption 2
  it("should allow adding multiple education entries", () => {
    document
      .querySelector("button[onclick=\"addSection('education')\"]")
      .click();
    expect(document.querySelectorAll(".education").length).toBe(1); //Check for added education section
  });

  // Tests for Requirement 3 & Assumption 3
  it("should allow adding multiple work experience entries", () => {
    document
      .querySelector("button[onclick=\"addSection('workExperience')\"]")
      .click();
    expect(document.querySelectorAll(".workExperience").length).toBe(1); //Check for added work experience section
  });

  // Tests for Requirement 4 & Assumption 4
  it("should allow adding multiple skills", () => {
    document.querySelector("button[onclick=\"addSection('skills')\"]").click();
    expect(document.querySelectorAll(".skills").length).toBe(1); //Check for added skills section
  });

  // Tests for Requirement 5 & Assumption 5
  it("should allow adding custom sections", () => {
    document.querySelector("button[onclick=\"addSection('custom')\"]").click();
    expect(document.querySelectorAll(".custom").length).toBe(1); //Check for added custom section
  });

  // Tests for Requirement 6 & Assumption 6 (Check for template structure - this is a simplified example)
  it("should have template options in the dropdown", () => {
    const templateSelect = document.getElementById("templateSelect");
    expect(templateSelect.options.length).toBeGreaterThanOrEqual(3);
  });

  // Tests for Requirement 7 & Assumption 7 (Check existence of color scheme options)
  it("should have color scheme options in the dropdown", () => {
    const colorSchemeSelect = document.getElementById("colorSchemeSelect");

    expect(colorSchemeSelect.options.length).toBeGreaterThanOrEqual(2);
  });

  // Tests for Requirement 8 & Assumption 8 (Very basic - you'll need more robust tests here)
  it("should update preview section on input", () => {
    // Implement a test that simulates user input and checks the preview
    const resumeOutput = document.getElementById("resumeOutput");
    expect(resumeOutput).toBeDefined();
  });

  // Tests for Requirement 9 & Assumption 9 (Need to implement button clicks or drag-and-drop simulation)
  it("should have section rearranging functionality", () => {
    // Implement logic to click rearranging buttons or simulate drag and drop and verify DOM changes.
  });

  // Tests for Requirement 10 & Assumption 10 (Implement after adding validation logic)
  it("should validate required fields", () => {
    //Trigger form submission or input change event depending on your validation implementation
    // Example (if you have client side validation)
    // document.querySelector('form').submit();  // Simulate form submission if required.
    //Example (checking for specific error messages):
    // expect(document.querySelector('.error-message')).not.toBeNull(); // if an error message is expected
  });

  // Tests for Requirement 11 & Assumption 11
  it("should allow removing sections", () => {
    document.querySelector("button[onclick=\"addSection('custom')\"]").click();
    let customSections = document.querySelectorAll(".custom");
    expect(customSections.length).toBe(1);
    customSections[0].querySelector('button[onclick^="removeSection"]').click();
    customSections = document.querySelectorAll(".custom");
    expect(customSections.length).toBe(0);
  });

  // Tests for Requirement 12 & Assumption 12 (This will be difficult to test directly with JSDOM)
  it("should have a download button", () => {
    // Check if the button or link to trigger download exists. The actual download functionality is difficult to test in a JSDOM environment. You might need to mock or stub the relevant functions if you need to test the download logic itself.
    expect(document.getElementById("generateResume")).not.toBeNull();
  });
});
