"usestrict";

import { resetInput, setMaxDateToToday } from "./js/form.js";
import {
  EDIT,
  FORM_CONTAINER,
  SUBMIT_BUTTON,
  TABLE_CONTAINER,
} from "./js/global.js";
import {
  convertObjectsToArrays,
  insertUserInDataTable,
  onDelete,
  onEdit,
  onView,
} from "./js/table.js";

const navLink = document.querySelectorAll(".link");

window.addEventListener("DOMContentLoaded", () => {
  setMaxDateToToday();

  FORM_CONTAINER.classList.add("active");
  navLink[0].classList.add("active-link");
});

navLink.forEach((link) => {
  link.addEventListener("click", (e) => {
    
    resetInput();
    SUBMIT_BUTTON.textContent = "Submit";
    EDIT.isEditing = false;


    if (e.target.textContent === "Table") {
      // remove and add the active class manually
      navLink[0].classList.remove("active-link");
      navLink[1].classList.add("active-link");

      const storedData = localStorage.getItem("users");

      if (storedData) {
        const objects = JSON.parse(storedData);
        const arrays = convertObjectsToArrays(objects);
        insertUserInDataTable(arrays);
      }

      onEdit(document.querySelectorAll(".fa-pen-to-square"));
      onDelete(document.querySelectorAll(".fa-trash"));
      onView(document.querySelectorAll(".fa-eye"));

      FORM_CONTAINER.classList.remove("active");
      TABLE_CONTAINER.classList.add("active");
    } else {
      // remove and add the active class manually
      navLink[0].classList.add("active-link");
      navLink[1].classList.remove("active-link");
      TABLE_CONTAINER.classList.remove("active");
      FORM_CONTAINER.classList.add("active");
    }
  });
});
