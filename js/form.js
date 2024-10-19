import {
  DATE_OF_BIRTH,
  EMAIL,
  findUser,
  GENDER,
  IMAGE_CONTAINER,
  EDIT,
  NUMBER,
  QUALIFICATION,
  SUBMIT_BUTTON,
  USERNAME,
} from "./global.js";

const inputEl = document.querySelectorAll("input");
const form = document.querySelector("#userdataForm");
const image = document.querySelector("#profileImg");
const messageEl = document.querySelector("#message");
const resetButton = document.querySelector("#resetBtn");
const submitBtn = document.querySelector("#submitBtn");
let imageUrl;

export function resetInput() {
  USERNAME.value = "";

  if (!EDIT.isEditing) {
    EMAIL.value = "";
    EMAIL.disabled = false;
  }

  NUMBER.value = "";
  DATE_OF_BIRTH.value = "";

  GENDER.forEach((btn) => (btn.checked = false));
  image.value = "";
  IMAGE_CONTAINER.removeAttribute("src");
  IMAGE_CONTAINER.style.display = "none";
}

function validateInput(name, email, number, qualification, dob) {
  if (!name || name.trim() === "") {
    return "Username can't be empty";
  } else if (name.length < 6) {
    return "Username must be at least 6 characters long.";
  } else if (!/^[a-zA-Z0-9]+$/.test(name)) {
    return "Username can only contain alphabets and numbers.";
  } else if (/^[0-9]+$/.test(name)) {
    return "Username cannot contain only numeric values.";
  } else if (!email || email.length <= 0) {
    return "Please enter email.";
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return "Email is not valid.";
  } else if (number.length !== 10 || number < 0) {
    return "Number should contain 10 positive digits.";
  } else if (!qualification) {
    return "Please select qualification.";
  } else if (dob.length <= 0) {
    return "Please enter your date of birth.";
  } else {
    return "success";
  }
}

function displayAlert(msg, className) {
  messageEl.classList.remove("error", "success");
  messageEl.classList.add(className);
  messageEl.textContent = msg;
  messageEl.style.opacity = 1;
}

function validateAndUploadImage(d) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(d);
    reader.onload = (e) => res(e.target.result);
  });
}

function saveUserInLocalStorage(userData) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const idx = users.findIndex((user) => user.email == EMAIL.value);

  if (idx != -1 && EDIT.isEditing) {
    users[idx] = userData;
  } else {
    users.push(userData);
  }

  localStorage.setItem("users", JSON.stringify(users));
}

export function setMaxDateToToday() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = today.getMonth() + 1;
  const dd = today.getDate();

  const formattedDate = `${yyyy}-${mm.toString().padStart(2, "0")}-${dd
    .toString()
    .padStart(2, "0")}`;

  DATE_OF_BIRTH.setAttribute("max", formattedDate);
}

inputEl.forEach((el) => {
  el.addEventListener("focus", () => {
    messageEl.style.opacity = 0;
  });
});

NUMBER.addEventListener("keypress", () => {
  const num = number.value;

  if (num.length === 0) {
    if (event.key >= "0" && event.key <= "4") {
      event.preventDefault();
      return;
    }
  }

  if (
    (isNaN(event.key) && event.key !== "Backspace" && event.key !== "Delete") ||
    (num.length >= 10 && event.key !== "Backspace" && event.key !== "Delete")
  ) {
    event.preventDefault();
  }
});

profileImg.addEventListener("change", async (e) => {
  if (e.target.files.length === 0) {
    displayAlert("Image is required", "error");
    return;
  }

  imageUrl = e.target.files[0];
  IMAGE_CONTAINER.style.display = "block";

  try {
    const base64 = await validateAndUploadImage(imageUrl);
    IMAGE_CONTAINER.setAttribute("src", base64);
  } catch (err) {
    displayAlert("Image is required", "error");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = validateInput(
    USERNAME.value,
    EMAIL.value,
    NUMBER.value,
    QUALIFICATION.options[QUALIFICATION.selectedIndex].value,
    DATE_OF_BIRTH.value
  );

  if (res !== "success") {
    displayAlert(res, "error");
    return;
  }

  let selectedGender;

  GENDER.forEach((gen) => {
    if (gen.checked) {
      selectedGender = gen.value;
    }
  });

  if (selectedGender === undefined) {
    displayAlert("Please select the gender.", "error");
    return;
  }

  const user = findUser(EMAIL.value);

  if (!EDIT.isEditing) {
    if (user) {
      displayAlert("User already exists.", "error");
      return;
    }
  }

  messageEl.style.opacity = 0;
  let base64Image;

  try {
    base64Image = await validateAndUploadImage(imageUrl);
  } catch (err) {
    displayAlert("Error uploading the image", "error");
    return;
  }

  let userData = {
    serial_no: null,
    username: USERNAME.value,
    email: EMAIL.value,
    gender: selectedGender,
    dateOfBirth: DATE_OF_BIRTH.value,
    qualification: QUALIFICATION.options[QUALIFICATION.selectedIndex].value,
    number: NUMBER.value,
    image: base64Image,
  };

  saveUserInLocalStorage(userData);
  displayAlert("Form submitted successfully", "success");

  setTimeout(() => {
    messageEl.textContent = "";
    messageEl.style.opacity = 0;
  }, 1500);

  SUBMIT_BUTTON.textContent = "Submit";
  resetInput();
});

resetButton.addEventListener("click", () => {
  resetInput();
});
