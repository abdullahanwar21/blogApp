import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { auth, db, storage } from "./config.js";
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<- Getting Elements From Html Start ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const regForm = document.querySelector("form");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confPassword = document.querySelector("#confPassword");
const profileImg = document.querySelector("#profileImg");
const allErrors = document.querySelector(".allErrors");

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<- Getting Elements From Html Ended ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// <<<<<<<<<<<<<<<<<<<<<<<<- Register User Data To FireBase Start ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

regForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let fullNames = `${firstName.value} ${lastName.value}`;
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<- Form Validation Start ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  allErrors.innerHTML = "";
  if (firstName.value.length < 3 || firstName.value.length === 0) {
    allErrors.innerHTML = "First Name length should be greater then 3";
    return;
  }
  if (lastName.value.length < 3 || lastName.value.length === 0) {
    allErrors.innerHTML = "Last Name length should be greater then 3";
    return;
  }
  const file = profileImg.files[0];

  if (!file) {
    allErrors.innerHTML = "Please Choose Profile Image";
    return;
  }
  if (email.value.length >= 25) {
    allErrors.innerHTML = "Email length should be less then 25";
    return;
  }
  if (password.value != confPassword.value) {
    allErrors.innerHTML = "Password  is Not Matched with confirm password";
    return;
  }
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<- Form Validation Ended->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      let displayName = fullNames;
      updateProfile(user, { displayName })
        .then(() => {
        })
        .catch((error) => {
          Swal.fire({ icon: "error", text: error.message });

        });

      const files = profileImg.files[0];
      const storageRef = ref(storage, email.value);
      uploadBytes(storageRef, files)
        .then((res) => {
          getDownloadURL(storageRef).then((url) => {
            addDoc(collection(db, "users"), {
              fullNames,
              email: email.value,
              profileUrl: url,
              uid: user.uid,
            }).then((res) => {
              window.location = "../auth/login.html";
            });
          });
        })
        .catch((getUrlErr) => {
          allErrors.innerHTML = getUrlErr.message;
        });
    })
    .catch((addDocErr) => {
      const errorCode = addDocErr.code;
      const errorMessage = addDocErr.message;
      allErrors.innerHTML = errorMessage;
    });
});

// <<<<<<<<<<<<<<<<<<<<<<<<- Register User Data To FireBase Ended ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
