import { DATE_OF_BIRTH, EDIT, EMAIL, findUser, FORM_CONTAINER, GENDER, IMAGE_CONTAINER, NUMBER, QUALIFICATION, TABLE_CONTAINER, USERNAME } from "./global.js";

const tableContainer = document.querySelector(".table");
const navLink = document.querySelectorAll(".link");
const backdropContainer = document.querySelector(".backdrop");
const modal = document.querySelector("#modal");

export function insertUserInDataTable(dataSet) {
    $(".table").DataTable().clear().destroy();
    new DataTable(".table", {
      columns: [
        {
          title: "Sr. No",
          render: function (data, type, row, meta) {
            if (meta.row >= row.length) {
              return "N/A";
            }
            return meta.row + 1;
          },
        },
        { title: "Username" },
        { title: "Email" },
        {
          data: null,
          render: function (data, type, row) {
            return `
                 <i class="fa-regular fa-eye"></i><i class="fa-regular fa-pen-to-square"></i><i class="fa-solid fa-trash"></i>`;
          },
        },
      ],
      data: dataSet,
    });
  
    $(".table").DataTable();
  }

export function convertObjectsToArrays(objects) {
    if (!Array.isArray(objects)) {
      alert("Input must be an array of objects.");
    }
  
    const arrays = [];
    for (const obj of objects) {
      const array = Object.values(obj);
      arrays.push(array);
    }
    return arrays;
  }

function createModalContent(user) {
    const modalContent = `
       <div id="modalContent">
       <div id="modalLeft">
        <img src='${user.image}' alt="user-image" id="modalImg" />
      </div>
      <div id="modalRight">
          <p class="modal-username"><b>Name : </b>${user.username}</p>
          <p class="modal-email"><b>Email : </b>${user.email}</p>
          <p class="modal-gender"><b>Gender : </b>${user.gender || "N/A"}</p>
          <p class="modal-dob"><b>Date of Birth : </b>${
            user.dateOfBirth || "yyyy-mm-dd"
          }</p>
          <p class="modal-qualification"><b>Qualification : </b>${
            user.qualification
          }</p>
          <p class="contact"><b>Contact : </b>${user.number}</p>
      </div> 
      </div>
    `;
  
    // resetting the previous user data
    modal.textContent = "";
  
    modal.insertAdjacentHTML("afterbegin", modalContent);
  }

export function onView(viewButtons) {
    viewButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const emailAddress = e.target.closest("tr").cells[2].textContent;
        const user = findUser(emailAddress);
  
        if (!user) {
          alert("Couldn't find user.");
          return;
        }
  
        backdropContainer.classList.toggle("hidden-backdrop");
  
        createModalContent(user);
      });
    });
  }
  
 export function onDelete(trashButtons) {
    trashButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const confirm = window.confirm(
          "Are you sure you  want to delete this entry?"
        );
  
        if (!confirm) return;
  
        const users = JSON.parse(localStorage.getItem("users"));
        const emailAddress = btn.closest("tr").cells[2].textContent;
        const idx = users.findIndex((user) => user.email === emailAddress);
  
        // remove the the user from the array and save the updated users array in the local storage
        users.splice(idx, 1);
        localStorage.setItem("users", JSON.stringify(users));
  
        // display the changes in the table
        for (let i = 0; i < tableContainer.rows.length; i++) {
          const row = tableContainer.rows[i];
          for (let j = 0; j < row.cells.length; j++) {
            const cell = row.cells[j];
            if (cell.textContent == emailAddress) {
              cell.closest("tr").remove();
            }
          }
        }
      });
    });
  }
  
  export function onEdit(editButtons) {
    editButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        submitBtn.textContent = "Update";
        const emailAddress = btn.closest("tr").cells[2].textContent;
  
        const user = findUser(emailAddress);
  
        const confirm = window.confirm("Do you want to edit this entry?");
  
        if (!confirm) return;
  
        navLink[0].classList.add("active-link");
        navLink[1].classList.remove("active-link");
  
        EDIT.isEditing = true;
        TABLE_CONTAINER.classList.remove("active");
        FORM_CONTAINER.classList.add("active");
  
        USERNAME.value = user.username;
        EMAIL.value = user.email;
        EMAIL.setAttribute("disabled", true);
        NUMBER.value = user.number;
        DATE_OF_BIRTH.value = user.dateOfBirth;
        QUALIFICATION.value = user.qualification;
        IMAGE_CONTAINER.setAttribute("src", user.image);
        IMAGE_CONTAINER.style.display = "block";
  
        if (user.gender.toLowerCase() === "male") {
          GENDER[0].checked = true;
        } else if (user.gender.toLowerCase() === "female") {
          GENDER[1].checked = true;
        } else {
          GENDER[2].checked = true;
        }
  
      });
    });
  }
  
  window.addEventListener("click", (e) => {
    if (e.target == backdropContainer) {
      backdropContainer.classList.toggle("hidden-backdrop");
    }
  });