// script.js
document.addEventListener("DOMContentLoaded", () => {
  const sectionsContainer = document.getElementById("sectionsContainer");
  const generateButton = document.getElementById("generateResume");
  const resumeOutput = document.getElementById("resumeOutput");
  const templateSelect = document.getElementById("templateSelect");
  const colorSchemeSelect = document.getElementById("colorSchemeSelect");

  let resumeData = {};

  function addSection(sectionType) {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = `section ${sectionType}`;
    sectionDiv.innerHTML = `<h3>${sectionType.toUpperCase()}</h3> <button onclick="removeSection(this)">Remove</button> <hr>`; // Add a remove button

    // Input fields based on sectionType

    sectionsContainer.appendChild(sectionDiv);
  }

  function removeSection(button) {
    const sectionDiv = button.parentNode;
    sectionsContainer.removeChild(sectionDiv);
  }

  generateButton.addEventListener("click", () => {
    const template = templateSelect.value;
    const colorScheme = colorSchemeSelect.value;

    resumeOutput.innerHTML = generateHTML(resumeData, template, colorScheme); // Pass template and colorScheme
  });

  function generateHTML(data, template, colorScheme) {
    return `
      <div class="resume ${template} ${colorScheme}">
           <h2>Your Name</h2>
          </div>`;
  }
});
