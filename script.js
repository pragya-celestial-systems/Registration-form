'usestrict';

const inputEl = document.querySelectorAll("input");
const form = document.querySelector("#userdataForm");
const gender = document.querySelectorAll(".gender");
const name = document.querySelector("#fullName");
const number = document.querySelector("#number");
const email = document.querySelector("#email");
const qualification = document.querySelector("#qualification");
const image = document.querySelector("#profileImg");
const messageEl = document.querySelector("#message");
const imageContainer = document.querySelector("#imageContainer");
const resetBtn = document.querySelector("#resetBtn");
const submitBtn = document.querySelector("#submitBtn");
const formContainer = document.querySelector('.form');
const tableContainer = document.querySelector('.table');
const navLink = document.querySelectorAll('.link');
const backdropContainer = document.querySelector('.backdrop');
const modal = document.querySelector('#modal');
const dateOfBirth = document.querySelector('#calender');

let errorMessage, imageUrl, trashButtons, editButtons, viewButtons, isEditing = false;

// --------------------------------------------------------

function validateInput(username, email, number, qualification, dob) {
  if (!username || username.trim() === "") {
    return "Please enter your full name.";
  }
  else if (!email || email.length <= 0) {
   return "Please enter email." 
  }
  else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return "Email is not valid.";
  }
  else if (number.length !== 10 || number < 0) {
    return "Number should contain 10 positive digits.";
  }
  else if (!qualification) {
    return "Please select qualification.";
  }
  else if (dob.length <= 0) {
    return 'Please enter your date of birth.';
  }
  else {
    return "success";
  }
}

function displayAlert(msg, className) {
  messageEl.classList.remove('error', 'success');
  messageEl.classList.add(className);
  messageEl.textContent = msg;
  messageEl.style.opacity = 1;
}

function deleteExistingData() {
  const rowsToDelete = tableContainer.rows.length - 1;

  for (let i = 0; i < rowsToDelete; i++) {
    tableContainer.deleteRow(1); // 
  }
}

// function blobToBase64(blob) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result);
//     reader.readAsDataURL(blob);
//   });
// }


function validateAndUploadImage(d) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(d);
    reader.onload = (e) => res(e.target.result);
  });
}

function addUserInTheTable(user, index) {
  const html = `<tr>
                <td>${index + 1}</td>
                <td>${user.name || "N/A"}</td>
                <td>${user.gender || "N/A"}</td>
                <td>${user.email || "N/A"}</td>
                <td>${user.dateOfBirth || "dd-mm-yyyy"}</td>
                <td>${user.qualification || "N/A"}</td>
                <td>${user.number || "N/A"}</td>
                <td><i class="fa-regular fa-eye"></i><i class="fa-regular fa-pen-to-square"></i><i class="fa-solid fa-trash"></i></td>
            </tr>`;

  tableContainer.insertAdjacentHTML('beforeend', html);
}

function resetInput() {

  name.value = "";
  email.value = "";
  number.value = "";
  calender.value = '';

  gender.forEach((btn) => (btn.checked = false));
  image.value = "";
  imageContainer.removeAttribute("src");
  imageContainer.style.display = "none";
  messageEl.textContent = '';
  messageEl.style.opacity = 0;
}

function findUser(email) {
  const users = JSON.parse(localStorage.getItem('users')) || [];

  if (users.length <= 0) return false;

  return users.find(user => user.email === email);
}

async function createModalContent(user) {
  const modalContent = `
     <div id="modalContent">
     <img src='${user.image}' alt="user-image" id="modalImg" />
        <p class="modal-name"><b>Name : </b>${user.name}</p>
        <p class="modal-email"><b>Email : </b>${user.email}</p>
        <p class="modal-gender"><b>Gender : </b>${user.gender || 'N/A'}</p>
        <p class="modal-dob"><b>Date of Birth : </b>${user.dateOfBirth || 'yyyy-mm-dd'}</p>
        <p class="modal-qualification"><b>Qualification : </b>${user.qualification}</p>
        <p class="contact"><b>Contact : </b>${user.number}</p>
    </div>
  `;

  // resetting the previous user data
  modal.textContent = '';

  modal.insertAdjacentHTML('afterbegin', modalContent);
}

function setMaxDateToToday() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();

    const formattedDate = `${yyyy}-${mm.toString().padStart(2, "0")}-${dd
      .toString()
      .padStart(2, "0")}`;

    dateOfBirth.setAttribute("max", formattedDate);
}

// --------------------------------------------

inputEl.forEach((el) => {
  el.addEventListener("focus", () => {
    messageEl.style.opacity = 0;
  });
});

profileImg.addEventListener("change", async (e) => {
  if (e.target.files.length === 0) {
    displayAlert('Image is required', 'error');
    return;
  }

  imageUrl = e.target.files[0];
  imageContainer.style.display = "block";

  try {
    const base64 = await validateAndUploadImage(imageUrl);
    imageContainer.setAttribute("src", base64);
  } catch (err) {
    displayAlert('Image is required', 'error');
  }
});

// ------------------------------------------

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = validateInput(
    name.value,
    email.value,
    number.value,
    qualification.options[qualification.selectedIndex].value,
    dateOfBirth.value,
  );

    if (res !== "success") {
      displayAlert(res, 'error');
      return;
    }

  let selectedGender;
  
  gender.forEach(gen => {
    if (gen.checked) {
      selectedGender = gen.value;
    }
  })

  if (selectedGender === undefined) {
    displayAlert('Please select the gender.', 'error');
    return;
  }

  const user = findUser(email.value);
  if (!isEditing) {
    if (user) {
      displayAlert('User already exists.', 'error');
      return;
    }
  }

  messageEl.style.opacity = 0;

  let base64Image;
  try {
    base64Image = await validateAndUploadImage(imageUrl);
  } catch (err) {
    displayAlert('Error uploading the image', 'error');
    return;
  }

  let userData = {
    name: name.value,
    number: number.value,
    email: email.value,
    qualification: qualification.options[qualification.selectedIndex].value,
    image: base64Image,
    gender :  selectedGender,
    dateOfBirth: dateOfBirth.value
  };

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const idx = users.findIndex(user => user.email == email.value);
  // TODO - on edit, it must not create a new entry.
  if (idx != -1 && isEditing) {
    users[idx] = userData;
    console.log(isEditing, users, idx);
  } else {
    users.push(userData);
  }

  localStorage.setItem("users", JSON.stringify(users));

  displayAlert('Form submitted successfully', 'success');
  
  setTimeout(() => {
    submitBtn.textContent = "Submit";
    resetInput();
  }, 1500)
});

// ------------------------------------------------

resetBtn.addEventListener("click", () => {
  resetInput();
});

// ------------------------------------------------

window.addEventListener('DOMContentLoaded', () => {
  setMaxDateToToday();

  formContainer.classList.add("active");
  navLink[0].classList.add('active-link');
})

window.addEventListener('click', (e) => {
  if (e.target == backdropContainer) {
    backdropContainer.classList.toggle('hidden-backdrop');
  }
})

navLink.forEach(link => {
  link.addEventListener('click', (e) => {
    submitBtn.textContent = 'Submit';
    resetInput()
    if (e.target.textContent === 'Table') {
      deleteExistingData();
      // remove and add the active class manually
      navLink[0].classList.remove('active-link');
      navLink[1].classList.add('active-link');
      
      const users = JSON.parse(localStorage.getItem("users"));
      users?.forEach((user, index) => {
        addUserInTheTable(user, index);
      });

      trashButtons = document.querySelectorAll(".fa-trash");

      editButtons = document.querySelectorAll(".fa-pen-to-square");

      viewButtons = document.querySelectorAll(".fa-eye");

      // if user clicks on the edit button
      editButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
          submitBtn.textContent = "Update";
          const emailAddress = btn.closest("tr").cells[3].textContent;

          const user = findUser(emailAddress);

          const confirm = window.confirm("Do you want to edit this entry?");

          if (!confirm) return;

          navLink[0].classList.add("active-link");
          navLink[1].classList.remove("active-link");

          isEditing = true;
          tableContainer.classList.remove("active");
          formContainer.classList.add("active");

          name.value = user.name;
          email.value = user.email;
          email.setAttribute('disabled', true);
          number.value = user.number;
          dateOfBirth.value = user.dateOfBirth;
          qualification.value = user.qualification;
          imageContainer.setAttribute('src', user.image);
          imageContainer.style.display = 'block';

          if (user.gender.toLowerCase() === "male") {
            gender[0].checked = true;
          } else if (user.gender.toLowerCase() === "female") {
            gender[1].checked = true;
          } else {
            gender[2].checked = true;
          }
        });
      });

      // add event listeners to all trash buttons
      trashButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          console.log('btn clicked');
          const confirm = window.confirm(
            "Are you sure you  want to delete this entry?"
          );

          if (!confirm) return;

          const emailAddress = btn.closest("tr").cells[3].textContent;

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

      // show a modal if user clicks on the view button
      viewButtons.forEach((btn, index) => {
        btn.addEventListener("click", (e) => {
          const emailAddress = e.target.closest("tr").cells[3].textContent;
          const user = findUser(emailAddress);
          if (!user) {
            alert("Couldn't find user.");
            return;
          }

          backdropContainer.classList.toggle("hidden-backdrop");

          createModalContent(user);
        });
      });
      formContainer.classList.remove("active");
      tableContainer.classList.add("active");
    } else {
      // remove and add the active class manually
      navLink[0].classList.add("active-link");
      navLink[1].classList.remove("active-link");

      tableContainer.classList.remove("active");
      formContainer.classList.add("active");
    }
  })
})