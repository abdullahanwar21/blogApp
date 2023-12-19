import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./config.js";


onAuthStateChanged(auth, (user) => {
    let createBtn = document.querySelector(".createBtn");
    let activeUser = document.querySelector(".activeUser");
    let usernameShow = document.querySelector(".dropdown");
    let signUpbtn = document.querySelector(".signUpbtn");
    if (user) {
    // const uid = user.uid;
    // console.log(uid);
    createBtn.innerHTML = "Create Post";
    signUpbtn.style.display = "none";
    createBtn.addEventListener("click", () => {
        window.location = "../dashboard.html";
    });
    activeUser.addEventListener("click", () => {
        window.location = "../profile.html";
    });
    // ...
} else {
      usernameShow.style.display = "none";
      activeUser.style.display = "none";
    createBtn.innerHTML = "Get Started";
    createBtn.addEventListener("click", () => {
      window.location = "../auth/signup.html";
    });
    // User is signed out
    // ...
  }
});

let logOutBtn = document.querySelector(".logOutBtn");
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
