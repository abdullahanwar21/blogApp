import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from "./config.js";
let latestBlogPost = document.querySelector(".latestBlogPost");
let navbarImg = document.querySelector(".navbarImg");
let latestBlogs = [];
let userImg;
let userUid;
let userName;
let activeUser = document.querySelector(".activeUser");
onAuthStateChanged(auth, async (user) => {
  let createBtn = document.querySelector(".getStartBtn");
  let dropdown = document.querySelector(".dropdown");
  let signUpbtn = document.querySelector(".signUpbtn");
  if (user) {
    const uid = user.uid;
    userUid = user.uid;
    
    createBtn.innerHTML = `<button type="button" class="createBtn">Create Post</button>`;
    const q = await query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot2 = await getDocs(q);
    querySnapshot2.forEach((doc) => {
      userImg = doc.data().profileUrl;
      activeUser.innerHTML = doc.data().fullNames;
      userName = doc.data().fullNames;
      // userUid = doc.data().uid;
      console.log(userName);
      navbarImg.innerHTML =`<img src="${doc.data().profileUrl}" alt="Profile" class="rounded-circle" width="40" height="40">`
       ;
    });
    createBtn.addEventListener("click", () => {
      window.location = "../dashboard.html";
    });
    activeUser.addEventListener("click", () => {
      window.location = "../profile.html";
    });

    activeUser.style.display = "block";
    // <<<<<<<<<<<<<<<<<<<<<<<- Get The New Blog From Db ->>>>>>>>>>>>>>>>>>>>>>>>
  } else {
    createBtn.innerHTML = `<button type="button" class="createBtn">Get Started</button>`;
    signUpbtn.style.display = "block";
    dropdown.style.display = "none";
    activeUser.style.display = "none";
    createBtn.addEventListener("click", () => {
      window.location = "../auth/signup.html";
    });
  }
  
  async function latestBlogRendering() {
  function formatTimestamp(timestamp) {
    const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
      );
    return formattedDate;
  }
  
  latestBlogPost.innerHTML = "";
  latestBlogs.map((item) => {
    latestBlogPost.innerHTML += `
    <div class="card my-3">
    <div class="card-body">
    <div class="profileImg d-flex align-items-center">
    <img src="${item.userImg}" alt="" width="100" height="100">
    <article>
    <h2 class="card-title fw-bold mx-3 mt-5">${item.title}</h2>
    <h5 class="card-subtitle fw-bold mx-3 mb-5" style="opacity: 0.5;">${item.userName} <span>${formatTimestamp(item.timestamp)}</span></h5>
    </div>
    <p class="card-text">${item.description}</p>                
    <a href="../allBlogs.html" class="text-decoration-none " id="seeMore">See All From This Author</a>
    
    </article>
</div>
</div>`;

let seeMore = document.querySelectorAll("#seeMore");
seeMore.forEach((btn, ind) => {
  btn.addEventListener("click", () => {
    localStorage.setItem("uid",JSON.stringify(latestBlogs[ind].uid))
  })
})

});

}

latestBlogRendering();





async function getLatestBlog() {
  const q = await query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    latestBlogs.push({ ...doc.data(), docId: doc.id });
  });
  latestBlogRendering();
}
getLatestBlog();

});
//  <<<<<<<<<<<<<<<<<-  Logout Function ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

let logOutBtn = document.querySelector(".logOutBtn");
logOutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location = "../auth/login.html";
    })
    .catch((error) => {
      Swal.fire({ icon: "error", text: error.message });

    });
});

//  <<<<<<<<<<<<<<<<<-  Logout Function Ended ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
