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
let navbarImg = document.querySelector(".navbarImg img");
let latestBlogs = [];
let userData = [];
let userImg;
let userUid;
let activeUser = document.querySelector(".activeUser");
onAuthStateChanged(auth, async (user) => {
  let createBtn = document.querySelector(".createBtn");
  let dropdown = document.querySelector(".dropdown");
  let signUpbtn = document.querySelector(".signUpbtn");
  if (user) {
    const uid = user.uid;
    userUid = user.uid;
    activeUser.innerHTML = user.displayName;

    const q = await query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot2 = await getDocs(q);
    querySnapshot2.forEach((doc) => {
      userImg = doc.data().profileUrl;
      // userUid = doc.data().uid;
      navbarImg.src = doc.data().profileUrl;
    });

    createBtn.addEventListener("click", () => {
      window.location = "../dashboard.html";
    });
    activeUser.addEventListener("click", () => {
      window.location = "../profile.html";
    });

    activeUser.style.display = "block";
    createBtn.innerHTML = "Create Post";

    // <<<<<<<<<<<<<<<<<<<<<<<- Get The New Blog From Db ->>>>>>>>>>>>>>>>>>>>>>>>
  } else {
    signUpbtn.style.display = "block";
    dropdown.style.display = "none";
    activeUser.style.display = "none";
    createBtn.innerHTML = "Get Started";
    createBtn.addEventListener("click", () => {
      window.location = "../auth/signup.html";
    });
    // User is signed out
    // ...
  }
});

// getLatestBlog();

async function latestBlogRendering() {
  // console.log(userUid);

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
<div class="card my-2">
<div class="card-body">
    <div class="profileImg d-flex align-items-center">
        <img src="${item.userImg}" alt="" width="100" height="100">
        <article>
            <h2 class="card-title fw-bold mx-3 mt-5">${item.title}</h2>
            <h5 class="card-subtitle fw-bold mx-3 mb-5" style="opacity: 0.5;">${
              item.userName
            } <span>${formatTimestamp(item.timestamp)}</span></h5>
            </div>
        <p class="card-text">${item.description}</p>                
        <a href="../allBlogs.html" class="text-decoration-none " id="seeMore">See All From This Author</a>

    </article>
</div>
</div>`;


let seeMore = document.querySelectorAll("#seeMore");
seeMore.forEach((btn, ind) => {
    btn.addEventListener("click", () => {
      console.log("click", ind);
      console.log(latestBlogs[ind].uid);
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

//  <<<<<<<<<<<<<<<<<-  Logout Function ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

//  <<<<<<<<<<<<<<<<<-  Logout Function Ended ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
