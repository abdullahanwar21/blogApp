import {
  onAuthStateChanged,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  query,
  where,
  collection,
  getDocs,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { auth, db , storage } from "./config.js";

let logOutBtn = document.querySelector(".logOutBtn");
let navbarImg = document.querySelector(".navbarImg");
let formImg = document.querySelector(".formImg");
let profileName = document.querySelector(".profileName");
const profileName2 = document.querySelector(".profileName2");
const newPass = document.querySelector("#newPassword");
const confPass = document.querySelector("#confPassword");
const oldPassword = document.querySelector("#oldPassword");
const updateProfileForm = document.querySelector("#updateProfileForm");

const errors = document.querySelector(".errors");
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;

    const q = await query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot2 = await getDocs(q);
    querySnapshot2.forEach((doc) => {
      profileName.innerHTML = doc.data().fullNames;
      navbarImg.innerHTML = `<img src="${
        doc.data().profileUrl
      }" alt="Profile" class="rounded-circle">`;
      formImg.innerHTML = `<img src="${doc.data().profileUrl}" alt="Profile">`;
      profileName2.innerHTML = `
        <td>
        <span class="fw-bold me-3">User Name : </span> ${doc
          .data()
          .fullNames.toUpperCase()}<i class="bi bi-pencil-square  mx-1 fs-4 m-sm-1" id="editName" data-bs-toggle="modal" data-bs-target="#userNameModal"></i>
          </td>
          `;
        });
        let editName = document.querySelector("#editName");
        editName.addEventListener("click", async () => {
          let newUser = document.querySelector("#newUser");

      document
        .querySelector(".saveChanges")
        .addEventListener("click", async () => {
          // here we update new user name
          let q = await query(collection(db, "users"), where("uid", "==", uid));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
              fullNames: newUser.value,
            });
          });

          $("#userNameModal").modal("hide");

          Swal.fire({
            title: "New User Name Updated",
            text: "New User Name  Has Been Updated",
            icon: "success",
          });
        });
    });

    // Update Password
    updateProfileForm.addEventListener("submit", (e) => {
      const user = auth.currentUser;
      e.preventDefault();

      let credential = EmailAuthProvider.credential(
        user.email,
        oldPassword.value
      );
      if (oldPassword.value.length === 0) {
        Swal.fire({
          title: "Old Password Field",
          text: "Old Password field is Empty :)",
          icon: "error",
        });
        return;
      }
      if (newPass.value.length === 0) {
        Swal.fire({
          title: "Password Field",
          text: "New Password field is Empty :)",
          icon: "error",
        });
        return;
      }

      if (newPass.value !== confPass.value) {
        Swal.fire({
          title: "Password And Confirm Password",
          text: "Password And Confirm Password Must Be Match",
          icon: "error",
        });
        return;
      }
      reauthenticateWithCredential(user, credential)
        .then(() => {
          updatePassword(user, newPass.value)
            .then(() => {
              Swal.fire({
                title: "New Password Updated",
                text: "New Password Has Been Updated",
                icon: "success",
              });
            })
            .catch((error) => {
              Swal.fire({
                title: error.code,
                text: error.message,
                icon: "error",
              });
            });
        })
        .catch((reAutherror) => {
          Swal.fire({
            title: "Old Password Is Not Match",
            icon: "error",
          });
        });
      updateProfileForm.reset();
      window.addEventListener("load", profileInfo);
      // ...
    });
  } else {
    window.location = "../auth/login.html";
  }
});

// Log Out function
logOutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location = "../auth/login.html";
    })
    .catch((error) => {
      Swal.fire({ icon: "error", text: error.message });
    });
});
