
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./config.js";

const logForm = document.querySelector("#logInForm");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const allErrors = document.querySelector(".allErrors");

logForm.addEventListener("submit" , (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email.value, password.value )
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        window.location = "../dashboard.html";
        // ...
    })
    .catch((error) => {
          allErrors.innerHTML = error.message
    });
});

