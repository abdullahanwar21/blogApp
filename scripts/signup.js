import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { addDoc , collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import{auth,db} from "./config.js";
const regForm = document.querySelector("form");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const email = document.querySelector("#email");
const password = document.querySelector("#password");


regForm.addEventListener("submit" , (e)=> {
    e.preventDefault()
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      addDoc(collection(db, "users"), {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
    }).then((res) =>{
        alert("successfully register")
        window.location = '../auth/login.html'

    }).catch((e) => {
        alert(e);
    })
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(errorCode);
        console.log(errorMessage);
    });
});
