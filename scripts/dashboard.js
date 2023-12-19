import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./config.js";

let logOutBtn = document.querySelector(".logOutBtn");

console.log(auth.currentUser);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location = "../auth/login.html";
  }
});







logOutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location = "../auth/login.html";
      console.log("logout successfully ");
    })
    .catch((error) => {
      console.log(error.message);
    });
});
