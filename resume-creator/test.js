const { JSDOM } = require("jsdom");
const fs = require("fs");

// Read the HTML file
const html = fs.readFileSync("./index.html", "utf8");

let dom;
let container;

beforeEach(() => {
  // Set up a new JSDOM environment before each test
  dom = new JSDOM(html);
  global.document = dom.window.document;
  global.window = dom.window;
  container = document.body;
});

describe("Resume Builder App", () => {
  // Requirement 1: The app will provide a UI for writing personal information.
  test("should have input fields for personal information", () => {
    expect(container.querySelector("#name")).toBeTruthy();
    expect(container.querySelector("#email")).toBeTruthy();
    expect(container.querySelector("#address")).toBeTruthy();
    expect(container.querySelector("#phone")).toBeTruthy();
  });

  // Requirement 2: The app will allow the user to input their educational background.
  test("should allow adding multiple education entries", () => {
    const addEducationButton = container.querySelector("#addEducation");
    const educationContainer = container.querySelector("#educationContainer");

    addEducationButton.click();
    addEducationButton.click();

    expect(educationContainer.children.length).toBe(2);
    expect(educationContainer.querySelector(".institution")).toBeTruthy();
    expect(educationContainer.querySelector(".degree")).toBeTruthy();
    expect(educationContainer.querySelector(".graduationDate")).toBeTruthy();
  });

  // Requirement 3: The app will allow the user to input their work experience.
  test("should allow adding multiple work experience entries", () => {
    const addWorkButton = container.querySelector("#addWork");
    const workContainer = container.querySelector("#workContainer");

    addWorkButton.click();
    addWorkButton.click();

    expect(workContainer.children.length).toBe(2);
    expect(workContainer.querySelector(".jobTitle")).toBeTruthy();
    expect(workContainer.querySelector(".company")).toBeTruthy();
    expect(workContainer.querySelector(".dateRange")).toBeTruthy();
    expect(workContainer.querySelector(".responsibilities")).toBeTruthy();
  });

  // Requirement 4: The app will allow the user to input their skills.
  test("should allow adding multiple skills", () => {
    const addSkillButton = container.querySelector("#addSkill");
    const skillsContainer = container.querySelector("#skillsContainer");

    addSkillButton.click();
    addSkillButton.click();

    expect(skillsContainer.children.length).toBe(2);
    expect(skillsContainer.querySelector(".skill")).toBeTruthy();
  });

  // Requirement 5: The app will offer a custom section option for the user.
  test("should allow creating custom sections", () => {
    const addCustomSectionButton = container.querySelector("#addCustomSection");
    const customSectionsContainer = container.querySelector(
      "#customSectionsContainer"
    );

    addCustomSectionButton.click();

    expect(customSectionsContainer.children.length).toBe(1);
    expect(
      customSectionsContainer.querySelector(".sectionHeader")
    ).toBeTruthy();
    expect(
      customSectionsContainer.querySelector(".sectionContent")
    ).toBeTruthy();
  });

  // Requirement 6: The app will provide at least three templates for the user.
  test("should have at least three resume templates", () => {
    const templateSelect = container.querySelector("#templateSelect");
    expect(templateSelect.options.length).toBeGreaterThanOrEqual(3);
  });

  // Requirement 7: The app will provide different color schemes.
  test("should have multiple color scheme options", () => {
    const colorSchemeSelect = container.querySelector("#colorSchemeSelect");
    expect(colorSchemeSelect.options.length).toBeGreaterThanOrEqual(2);
    expect(
      colorSchemeSelect.querySelector('option[value="blue"]')
    ).toBeTruthy();
    expect(
      colorSchemeSelect.querySelector('option[value="green"]')
    ).toBeTruthy();
  });

  // Requirement 8: The app will provide a preview section based on the input information.
  test("should update preview when input changes", () => {
    const nameInput = container.querySelector("#name");
    const previewSection = container.querySelector("#preview");

    nameInput.value = "John Doe";
    nameInput.dispatchEvent(new Event("input"));

    expect(previewSection.textContent).toContain("John Doe");
  });

  // Requirement 9: The app will allow the user to rearrange the section orders.
  test("should allow reordering of sections", () => {
    const sectionsContainer = container.querySelector("#sectionsContainer");
    const moveUpButtons = sectionsContainer.querySelectorAll(".moveUp");
    const initialOrder = Array.from(sectionsContainer.children).map(
      (child) => child.id
    );

    moveUpButtons[1].click();

    const newOrder = Array.from(sectionsContainer.children).map(
      (child) => child.id
    );
    expect(newOrder).not.toEqual(initialOrder);
  });

  // Requirement 10: The app will provide form validation for important information.
  test("should validate required fields", () => {
    const generateButton = container.querySelector("#generateResume");
    const nameInput = container.querySelector("#name");

    generateButton.click();

    expect(container.querySelector(".error")).toBeTruthy();
    expect(container.querySelector(".error").textContent).toContain(
      "Name is required"
    );

    nameInput.value = "John Doe";
    generateButton.click();

    expect(container.querySelector(".error")).toBeFalsy();
  });

  // Requirement 11: The app will allow the user to selectively remove non-essential information fields.
  test("should allow removal of non-essential fields", () => {
    const addCustomFieldButton = container.querySelector("#addCustomField");
    const customFieldsContainer = container.querySelector(
      "#customFieldsContainer"
    );

    addCustomFieldButton.click();
    expect(customFieldsContainer.children.length).toBe(1);

    const removeButton = customFieldsContainer.querySelector(".removeField");
    removeButton.click();

    expect(customFieldsContainer.children.length).toBe(0);
  });

  // Requirement 12: The app will allow the user to download the resume.
  test("should generate a downloadable PDF", () => {
    const downloadButton = container.querySelector("#downloadResume");
    const mockPdfGenerator = jest.fn();
    global.jsPDF = jest.fn(() => ({ save: mockPdfGenerator }));

    downloadButton.click();

    expect(mockPdfGenerator).toHaveBeenCalledWith("resume.pdf");
  });
});
