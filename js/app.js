// regex for validation
const strRegex = /^[a-zA-Z\s]*$/; // containing only letters
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
/* supports following number formats - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 */
const digitRegex = /^\d+$/;

/* ===========================================================
   Resume Draft Manager
=========================================================== */

const DRAFT_KEY = "resumeBuilderDraft";

function saveDraft(data) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

function loadDraft() {
  const draft = localStorage.getItem(DRAFT_KEY);

  if (!draft) return null;

  try {
    return JSON.parse(draft);
  } catch (error) {
    console.error("Draft Parse Error:", error);
    return null;
  }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

//new resume button actions

const newResumeBtn = document.getElementById("newResumeBtn");
const newResumeModal = document.getElementById("newResumeModal");
const cancelNewResume = document.getElementById("cancelNewResume");
const confirmNewResume = document.getElementById("confirmNewResume");

// Open modal
newResumeBtn.addEventListener("click", () => {
  newResumeModal.classList.add("active");
});

// Cancel
cancelNewResume.addEventListener("click", () => {
  newResumeModal.classList.remove("active");
});

// Temporary confirm action
confirmNewResume.addEventListener("click", () => {
  resetResumeBuilder();
  newResumeModal.classList.remove("active");
});
//reset all input datas :
function resetRepeater(repeaterClass) {
  const repeater = document.querySelector(`.${repeaterClass}`);

  if (!repeater) return;

  // Remove all rows except the first
  const deleteButtons = repeater.querySelectorAll("[data-repeater-delete]");

  for (let i = deleteButtons.length - 1; i > 0; i--) {
    deleteButtons[i].click();
  }

  // Clear first row
  const firstItem = repeater.querySelector("[data-repeater-item]");

  if (!firstItem) return;

  firstItem.querySelectorAll("input, textarea, select").forEach((field) => {
    field.value = "";
  });
}

function resetResumeBuilder() {
  // Clear LocalStorage
  clearDraft();

  // Reset all normal inputs
  document.querySelector("#cv-form").reset();

  // Reset every repeater
  resetRepeater("achievement-repeater");
  resetRepeater("experience-repeater");
  resetRepeater("education-repeater");
  resetRepeater("project-repeater");
  resetRepeater("skill-repeater");

  // Refresh preview
  displayCV(getUserInputs());
}

/* ===========================================================
   Restore Draft
=========================================================== */

function restoreRepeaterItems({ draftItems, repeaterClass, titleSelectors }) {
  if (!draftItems || draftItems.length === 0) return;

  const addBtn = document.querySelector(
    `.${repeaterClass} [data-repeater-create]`,
  );

  console.log("Repeater:", repeaterClass);
  console.log("Draft Count:", draftItems.length);
  console.log("Add Button:", addBtn);

  for (let i = 1; i < draftItems.length; i++) {
    addBtn.click();
  }
  console.log(document.querySelectorAll(".achieve_title").length);

  // Fill all inputs
  titleSelectors.forEach((selector) => {
    const inputs = document.querySelectorAll(selector);

    draftItems.forEach((item, index) => {
      const key = selector.replace(".", "");

      if (inputs[index]) {
        inputs[index].value = item[key] || "";
      }
    });
  });
}

function restoreDraft() {
  const draft = loadDraft();

  if (!draft) return;

  /* ===========================
     Personal Information
  =========================== */

  firstnameElem.value = draft.firstname || "";
  middlenameElem.value = draft.middlename || "";
  lastnameElem.value = draft.lastname || "";
  designationElem.value = draft.designation || "";
  addressElem.value = draft.address || "";
  emailElem.value = draft.email || "";
  phonenoElem.value = draft.phoneno || "";
  summaryElem.value = draft.summary || "";

  /* ===========================
     Achievement (First Row)
  =========================== */

  /* ===========================
   Achievement (All Rows)
=========================== */

  restoreRepeaterItems({
    draftItems: draft.achievements,
    repeaterClass: "achievement-repeater",
    titleSelectors: [".achieve_title", ".achieve_description"],
  });

  /* ===========================
     Experience (First Row)
  =========================== */

  restoreRepeaterItems({
    draftItems: draft.experiences,
    repeaterClass: "experience-repeater",
    titleSelectors: [
      ".exp_title",
      ".exp_organization",
      ".exp_location",
      ".exp_start_date",
      ".exp_end_date",
      ".exp_description",
    ],
  });

  /* ===========================
   Education (All Rows)
=========================== */

  restoreRepeaterItems({
    draftItems: draft.educations,
    repeaterClass: "education-repeater",
    titleSelectors: [
      ".edu_school",
      ".edu_degree",
      ".edu_city",
      ".edu_start_date",
      ".edu_graduation_date",
      ".edu_description",
    ],
  });
  /* ===========================
     Project (First Row)
  =========================== */

  /* ===========================
   Projects (All Rows)
=========================== */

  restoreRepeaterItems({
    draftItems: draft.projects,
    repeaterClass: "project-repeater",
    titleSelectors: [".proj_title", ".proj_link", ".proj_description"],
  });

  /* ===========================
   Skills (All Rows)
=========================== */

  restoreRepeaterItems({
    draftItems: draft.skills,
    repeaterClass: "skill-repeater",
    titleSelectors: [".skill"],
  });

  /* ===========================
     Update Preview
  =========================== */

  displayCV(getUserInputs());
}

const mainForm = document.getElementById("cv-form");
const validType = {
  TEXT: "text",
  TEXT_EMP: "text_emp",
  EMAIL: "email",
  DIGIT: "digit",
  PHONENO: "phoneno",
  ANY: "any",
};

// user inputs elements
let firstnameElem = mainForm.firstname,
  middlenameElem = mainForm.middlename,
  lastnameElem = mainForm.lastname,
  imageElem = mainForm.image,
  designationElem = mainForm.designation,
  addressElem = mainForm.address,
  emailElem = mainForm.email,
  phonenoElem = mainForm.phoneno,
  summaryElem = mainForm.summary;

// display elements
let nameDsp = document.getElementById("fullname_dsp"),
  imageDsp = document.getElementById("image_dsp"),
  phonenoDsp = document.getElementById("phoneno_dsp"),
  emailDsp = document.getElementById("email_dsp"),
  addressDsp = document.getElementById("address_dsp"),
  designationDsp = document.getElementById("designation_dsp"),
  summaryDsp = document.getElementById("summary_dsp"),
  projectsDsp = document.getElementById("projects_dsp"),
  achievementsDsp = document.getElementById("achievements_dsp"),
  skillsDsp = document.getElementById("skills_dsp"),
  educationsDsp = document.getElementById("educations_dsp"),
  experiencesDsp = document.getElementById("experiences_dsp");

// first value is for the attributes and second one passes the nodelists
const fetchValues = (attrs, ...nodeLists) => {
  let elemsAttrsCount = nodeLists.length;
  let elemsDataCount = nodeLists[0].length;
  let tempDataArr = [];

  // first loop deals with the no of repeaters value
  for (let i = 0; i < elemsDataCount; i++) {
    let dataObj = {}; // creating an empty object to fill the data
    // second loop fetches the data for each repeaters value or attributes
    for (let j = 0; j < elemsAttrsCount; j++) {
      // setting the key name for the object and fill it with data
      dataObj[`${attrs[j]}`] = nodeLists[j][i].value;
    }
    tempDataArr.push(dataObj);
  }

  return tempDataArr;
};

const getUserInputs = () => {
  // achivements
  let achievementsTitleElem = document.querySelectorAll(".achieve_title"),
    achievementsDescriptionElem = document.querySelectorAll(
      ".achieve_description",
    );

  // experiences
  let expTitleElem = document.querySelectorAll(".exp_title"),
    expOrganizationElem = document.querySelectorAll(".exp_organization"),
    expLocationElem = document.querySelectorAll(".exp_location"),
    expStartDateElem = document.querySelectorAll(".exp_start_date"),
    expEndDateElem = document.querySelectorAll(".exp_end_date"),
    expDescriptionElem = document.querySelectorAll(".exp_description");

  // education
  let eduSchoolElem = document.querySelectorAll(".edu_school"),
    eduDegreeElem = document.querySelectorAll(".edu_degree"),
    eduCityElem = document.querySelectorAll(".edu_city"),
    eduStartDateElem = document.querySelectorAll(".edu_start_date"),
    eduGraduationDateElem = document.querySelectorAll(".edu_graduation_date"),
    eduDescriptionElem = document.querySelectorAll(".edu_description");

  let projTitleElem = document.querySelectorAll(".proj_title"),
    projLinkElem = document.querySelectorAll(".proj_link"),
    projDescriptionElem = document.querySelectorAll(".proj_description");

  let skillElem = document.querySelectorAll(".skill");

  // event listeners for form validation
  firstnameElem.addEventListener("keyup", (e) =>
    validateFormData(e.target, validType.TEXT, "First Name"),
  );
  middlenameElem.addEventListener("keyup", (e) =>
    validateFormData(e.target, validType.TEXT_EMP, "Middle Name"),
  );
  lastnameElem.addEventListener("keyup", (e) =>
    validateFormData(e.target, validType.TEXT, "Last Name"),
  );
  phonenoElem.addEventListener("keyup", (e) =>
    validateFormData(e.target, validType.PHONENO, "Phone Number"),
  );
  emailElem.addEventListener("keyup", (e) =>
    validateFormData(e.target, validType.EMAIL, "Email"),
  );
  addressElem.addEventListener("keyup", (e) =>
    validateFormData(e.target, validType.ANY, "Address"),
  );
  designationElem.addEventListener("keyup", (e) =>
    validateFormData(e.target, validType.TEXT, "Designation"),
  );

  achievementsTitleElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "Title"),
    ),
  );
  achievementsDescriptionElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "Description"),
    ),
  );
  expTitleElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "Title"),
    ),
  );
  expOrganizationElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "Organization"),
    ),
  );
  expLocationElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "Location"),
    ),
  );
  expStartDateElem.forEach((item) =>
    item.addEventListener("blur", (e) =>
      validateFormData(e.target, validType.ANY, "End Date"),
    ),
  );
  expEndDateElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "End Date"),
    ),
  );
  expDescriptionElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "Description"),
    ),
  );
  eduSchoolElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "School"),
    ),
  );
  eduDegreeElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "Degree"),
    ),
  );
  eduCityElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "City"),
    ),
  );
  eduStartDateElem.forEach((item) =>
    item.addEventListener("blur", (e) =>
      validateFormData(e.target, validType.ANY, "Start Date"),
    ),
  );
  eduGraduationDateElem.forEach((item) =>
    item.addEventListener("blur", (e) =>
      validateFormData(e.target, validType.ANY, "Graduation Date"),
    ),
  );
  eduDescriptionElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "Description"),
    ),
  );
  projTitleElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "Title"),
    ),
  );
  projLinkElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "Link"),
    ),
  );
  projDescriptionElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "Description"),
    ),
  );
  skillElem.forEach((item) =>
    item.addEventListener("keyup", (e) =>
      validateFormData(e.target, validType.ANY, "skill"),
    ),
  );

  return {
    firstname: firstnameElem.value,
    middlename: middlenameElem.value,
    lastname: lastnameElem.value,
    designation: designationElem.value,
    address: addressElem.value,
    email: emailElem.value,
    phoneno: phonenoElem.value,
    summary: summaryElem.value,
    achievements: fetchValues(
      ["achieve_title", "achieve_description"],
      achievementsTitleElem,
      achievementsDescriptionElem,
    ),
    experiences: fetchValues(
      [
        "exp_title",
        "exp_organization",
        "exp_location",
        "exp_start_date",
        "exp_end_date",
        "exp_description",
      ],
      expTitleElem,
      expOrganizationElem,
      expLocationElem,
      expStartDateElem,
      expEndDateElem,
      expDescriptionElem,
    ),
    educations: fetchValues(
      [
        "edu_school",
        "edu_degree",
        "edu_city",
        "edu_start_date",
        "edu_graduation_date",
        "edu_description",
      ],
      eduSchoolElem,
      eduDegreeElem,
      eduCityElem,
      eduStartDateElem,
      eduGraduationDateElem,
      eduDescriptionElem,
    ),
    projects: fetchValues(
      ["proj_title", "proj_link", "proj_description"],
      projTitleElem,
      projLinkElem,
      projDescriptionElem,
    ),
    skills: fetchValues(["skill"], skillElem),
  };
};

function validateFormData(elem, elemType, elemName) {
  // checking for text string and non empty string
  if (elemType == validType.TEXT) {
    if (!strRegex.test(elem.value) || elem.value.trim().length == 0)
      addErrMsg(elem, elemName);
    else removeErrMsg(elem);
  }

  // checking for only text string
  if (elemType == validType.TEXT_EMP) {
    if (!strRegex.test(elem.value)) addErrMsg(elem, elemName);
    else removeErrMsg(elem);
  }

  // checking for email
  if (elemType == validType.EMAIL) {
    if (!emailRegex.test(elem.value) || elem.value.trim().length == 0)
      addErrMsg(elem, elemName);
    else removeErrMsg(elem);
  }

  // checking for phone number
  if (elemType == validType.PHONENO) {
    if (!phoneRegex.test(elem.value) || elem.value.trim().length == 0)
      addErrMsg(elem, elemName);
    else removeErrMsg(elem);
  }

  // checking for only empty
  if (elemType == validType.ANY) {
    if (elem.value.trim().length == 0) addErrMsg(elem, elemName);
    else removeErrMsg(elem);
  }
}

// adding the invalid text :
function addErrMsg(formElem, formElemName) {
  formElem.nextElementSibling.innerHTML = `${formElemName} is invalid`;
}

// removing the invalid text
function removeErrMsg(formElem) {
  formElem.nextElementSibling.innerHTML = "";
}

function previewImage() {
  console.log("previewImage called");
  const file = imageElem.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    imageDsp.src = e.target.result;
    imageDsp.classList.add("has-image");
  };

  reader.readAsDataURL(file);
}
// show the list data
function renderAchievements(achievements) {
  achievementsDsp.innerHTML = "";

  achievements.forEach((item) => {
    const achievement = document.createElement("div");
    achievement.className = "preview-item achievement-item";

    achievement.innerHTML = `
      <span class="achievement-title">
        ${item.achieve_title}
      </span>

      <p class="achievement-description">
        ${item.achieve_description}
      </p>
    `;

    achievementsDsp.appendChild(achievement);
  });
}
function renderSkills(skills) {
  skillsDsp.innerHTML = "";

  skills.forEach((item) => {
    const skill = document.createElement("div");
    skill.className = "preview-item skill-item";

    skill.innerHTML = `
      <span class="skill-name">${item.skill}</span>
    `;

    skillsDsp.appendChild(skill);
  });
}

function renderProjects(projects) {
  projectsDsp.innerHTML = "";

  projects.forEach((item) => {
    const project = document.createElement("div");
    project.className = "preview-item project-item";

    project.innerHTML = `
      <span class="project-title">
        ${item.proj_title}
      </span>

      <a
        href="${item.proj_link}"
        target="_blank"
        class="project-link"
      >
        ${item.proj_link}
      </a>

      <p class="project-description">
        ${item.proj_description}
      </p>
    `;

    projectsDsp.appendChild(project);
  });
}

function formatResumeDate(dateString, isPresent = false) {
  if (isPresent) return "Present";
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date)) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function renderEducations(educations) {
  educationsDsp.innerHTML = "";

  educations.forEach((item) => {
    const education = document.createElement("div");
    education.className = "preview-item education-item";

    education.innerHTML = `
    <span class="education-college">
        ${item.edu_school}
    </span>

    <span class="education-degree">
        ${item.edu_degree}
    </span>

    <div class="education-meta">

        <span class="education-location">
            ${item.edu_city}
        </span>

        <span class="education-date">
            ${formatResumeDate(item.edu_start_date)}
–
${formatResumeDate(item.edu_graduation_date)}
        </span>

    </div>

    <p class="education-description">
    ${item.edu_description}
</p>
`;

    educationsDsp.appendChild(education);
  });
}
function renderExperiences(experiences) {
  experiencesDsp.innerHTML = "";

  experiences.forEach((item) => {
    const experience = document.createElement("div");
    experience.className = "preview-item experience-item";

    experience.innerHTML = `
      <span class="experience-role">
        ${item.exp_title}
      </span>

      <span class="experience-company">
        ${item.exp_organization}
      </span>

      <div class="experience-meta">

        <span class="experience-location">
          ${item.exp_location}
        </span>

        <span class="experience-date">
          ${formatResumeDate(item.exp_start_date)}
          –
          ${formatResumeDate(item.exp_end_date)}
        </span>

      </div>

      <p class="experience-description">
        ${item.exp_description}
      </p>
    `;

    experiencesDsp.appendChild(experience);
  });
}

const displayCV = (userData) => {
  nameDsp.innerHTML =
    userData.firstname + " " + userData.middlename + " " + userData.lastname;
  phonenoDsp.innerHTML = userData.phoneno;
  emailDsp.innerHTML = userData.email;
  addressDsp.innerHTML = userData.address;
  designationDsp.innerHTML = userData.designation;
  summaryDsp.innerHTML = userData.summary;
  renderProjects(userData.projects);

  renderAchievements(userData.achievements);

  renderSkills(userData.skills);

  renderEducations(userData.educations);

  renderExperiences(userData.experiences);
};

// generate CV
const generateCV = () => {
  console.log("GenerateCV Running");
  let userData = getUserInputs();

  saveDraft(userData);

  displayCV(userData);

  console.log(userData);
};

function previewImage() {
  const file = imageElem.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    imageDsp.src = e.target.result;

    imageDsp.classList.add("has-image");
  };

  reader.readAsDataURL(file);

  const fileName = document.querySelector(".upload-file-name");

  if (fileName) {
    fileName.textContent = file.name;
  }
}

// print CV
function printCV() {
  window.print();
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    restoreDraft();
  }, 0);
});
