// const profileImg = document.querySelector('#profileImg');
// const img = document.querySelector('#img');

// profileImg.addEventListener('change', (e) => {
//     console.log(e.target.files[0]);
//     parseURI(e.target.files[0]);
// })

// async function parseURI(d) {
//   var reader = new FileReader();
//   reader.readAsDataURL(d);
//   return new Promise((res, rej) => {
//     reader.onload = (e) => {
//         res(e.target.result);
//         localStorage.setItem('image', e.target.result);
//     };
//   });
// }

// document.addEventListener('DOMContentLoaded', () => {
//     img.setAttribute("src", localStorage.getItem('image'));
// })

const form = document.querySelector("#userdataForm");
const gender = document.querySelectorAll(".gender");
const username = document.querySelector('#username');
const number = document.querySelector('#number');
const email = document.querySelector('#email');
const qualification = document.querySelector('#qualification');
let errorMessage;

form.addEventListener("submit", (e) => {

    e.preventDefault();

    // validate input
    const validate = validateInput(username.value, email.value, number.value, qualification.options[qualification.selectedIndex].value)

    if (validate !== 'success') {
        console.log(validate);
        return;
    }
    
    let userData = {
      username: username.value,
      number: number.value,
      email: email.value,
      qualification: qualification.options[qualification.selectedIndex].value,
    };

  for (let i = 0; i < gender.length; i++) {
    if (gender[i].checked) {
        userData.gender = gender[i].value;
    } else {
        console.log(gender[i].value);
    }
  }
    
    localStorage.setItem('userData', userData);
});

function validateInput(username, email, number, qualification) {
    if (!username || username.trim() === " ") {
        return "Username can't be an empty string.";
    }
    else if (email.search('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')) {
        return 'email is not valid.';
    }
    else if (number.length !== 10) {
        return 'Number should contain 10 digits.';
    }
    else if (!qualification) {
        return 'Please select qualification.';
    } else {
        return 'success';
    }
}