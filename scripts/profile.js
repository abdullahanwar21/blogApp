import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./config.js";

let logOutBtn = document.querySelector(".logOutBtn");

onAuthStateChanged(auth, (user) => {
  //   console.log();
  if (!user) {
    //   const uid = user.uid;
    window.location = "../auth/login.html";
    console.log(uid);
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
