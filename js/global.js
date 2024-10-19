export const FORM_CONTAINER = document.querySelector(".form");
export const DATE_OF_BIRTH = document.querySelector("#calender");
export const INPUT_EL = document.querySelectorAll("input");
export const FORM = document.querySelector("#userdataForm");
export const GENDER = document.querySelectorAll(".gender");
export const USERNAME = document.querySelector("#fullName");
export const NUMBER = document.querySelector("#number");
export const EMAIL = document.querySelector("#email");
export const QUALIFICATION = document.querySelector("#qualification");
export const MESSAGE_EL = document.querySelector("#message");
export const IMAGE_CONTAINER = document.querySelector("#imageContainer");
export const SUBMIT_BUTTON = document.querySelector("#submitBtn");
export const TABLE_CONTAINER = document.querySelector(".table");
export const EDIT = { isEditing: false };

export function findUser(email) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.length <= 0) return false;

  return users.find((user) => user.email === email);
}
