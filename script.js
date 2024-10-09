'usestrict';

// const profileImg = document.querySelector('#profileImg');
// const img = document.querySelector('#img');

// profileImg.addEventListener('change', (e) => {
//     console.log(e.target.files[0]);
//     parseURI(e.target.files[0]);
// })

// async function parseURI(d) {
//   var reader = new FileReader();
//   reader.readAsDataURL(d);
  // return new Promise ((res, rej) => {
  //   reader.onload = (e) => {
  //       res(e.target.result);
  //       localStorage.setItem('image', e.target.result);
  //   };
  // });
// }

// document.addEventListener('DOMContentLoaded', () => {
//     img.setAttribute("src", localStorage.getItem('image'));
// })
const inputEl = document.querySelectorAll("input");
const form = document.querySelector("#userdataForm");
const gender = document.querySelectorAll(".gender");
const username = document.querySelector("#username");
const number = document.querySelector("#number");
const email = document.querySelector("#email");
const qualification = document.querySelector("#qualification");
const image = document.querySelector("#profileImg");
const errorEl = document.querySelector("#error");
const imageContainer = document.querySelector("#imageContainer");
const resetBtn = document.querySelector("#resetBtn");
const formContainer = document.querySelector('.form');
const tableContainer = document.querySelector('.table');
const navLink = document.querySelectorAll('.link');
// const trash = document.querySelector('.fa-pen-to');
const viewButtons = document.querySelectorAll('.fa-eye');

let errorMessage, imageUrl, trashButtons;

// --------------------------------------------------------

function validateInput(username, email, number, qualification) {
  if (!username || username.trim() === "") {
    return "Username can't be an empty string.";
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return "Email is not valid.";
  } else if (number.length !== 10 || number < 0) {
    return "Number should contain 10 positive digits.";
  } else if (!qualification) {
    return "Please select qualification.";
  }
  return "success";
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}


function validateAndUploadImage(d) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(d);
    reader.onload = (e) => res(e.target.result);
  });
}

function addUserInTheTable(user, index) {
  const html = `<tr>
                <td>${index}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.number}</td>
                <td><i class="fa-regular fa-eye"></i><i class="fa-regular fa-pen-to-square"></i><i class="fa-solid fa-trash"></i></td>
            </tr>`;
  
  tableContainer.insertAdjacentHTML('beforeend', html);
}

// --------------------------------------------

inputEl.forEach((el) => {
  el.addEventListener("focus", () => {
    errorEl.style.opacity = 0;
  });
});

profileImg.addEventListener("change", async (e) => {
  if (e.target.files.length === 0) {
    errorEl.textContent = "Image is required.";
    return;
  }

  errorEl.textContent = "";
  imageUrl = e.target.files[0];
  imageContainer.style.display = "block";

  try {
    const base64 = await validateAndUploadImage(imageUrl);
    imageContainer.setAttribute("src", base64);
  } catch (err) {
    errorEl.textContent = 'Error uploading the image.'
  }
});

// ------------------------------------------

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const validate = validateInput(
    username.value,
    email.value,
    number.value,
    qualification.options[qualification.selectedIndex].value
  );

  if (validate !== "success") {
    errorEl.style.opacity  =1;
    errorEl.textContent = validate;
    return;
  }

  errorEl.style.opacity  = 0;

  let base64Image;
  try {
    base64Image = await validateAndUploadImage(imageUrl);
    console.log(base64Image);
  } catch (err) {
    errorEl.textContent = "Error uploading the image.";
    errorEl.style.opacity = 1;
    return;
  }

  let userData = {
    username: username.value,
    number: number.value,
    email: email.value,
    qualification: qualification.options[qualification.selectedIndex].value,
    image: base64Image,
  };

  for (let i = 0; i < gender.length; i++) {
    if (gender[i].checked) {
      userData.gender = gender[i].value;
      break;
    }
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));
  console.log("Users saved:", users);
});

resetBtn.addEventListener("click", () => {
  // Clear form fields
  username.value = "";
  email.value = "";
  number.value = "";

  gender.forEach(btn => btn.checked = false); 
  console.log(qualification[qualification.selectedIndex]);
  image.value = "";
  imageContainer.removeAttribute("src");
  imageContainer.style.display = "none"; 
});

window.addEventListener('DOMContentLoaded', () => {
  tableContainer.classList.add('active');
  const users = JSON.parse(localStorage.getItem('users'));

  users.forEach((user, index) => { 
    addUserInTheTable(user, index)
  });

  trashButtons = document.querySelectorAll(".fa-trash");

  // add event listeners to all trash buttons
  trashButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const confirm = window.confirm('Are you sure you  want to delete this entry?');

      if (!confirm) return;

      const emailAddress = btn.closest('tr').cells[2].textContent;
      
      const idx = users.findIndex(user => user.email === emailAddress);

      // remove the the user from the array and save the updated users array in the local storage
      users.splice(idx, 1)
      localStorage.setItem('users', JSON.stringify(users));

      window.location.reload();

      // btn.parentElement.parentElement.remove()
      
      // remove from the local storage

    })
    // console.log(btn.parentElement.parentElement);
  })
})

navLink.forEach(link => {
  link.addEventListener('click', (e) => {
    // link.classList.remove("active");
    if (e.target.textContent === 'Table') {
      formContainer.classList.remove('active');
      tableContainer.classList.add('active');
    } else {
      tableContainer.classList.remove('active');
      formContainer.classList.add('active');
    }
  })
})