// import {
//     onAuthStateChanged,
//     signOut,
//   } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  query,
  where,
  getDocs,
  collection,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./config.js";




let getItem = localStorage.getItem("uid");
const userUid = JSON.parse(getItem);

let postData = [];
let postDiv = document.querySelector(".postDiv");
let heading = document.querySelector(".heading");

function allBlogsRendering() {
  function formatTimestamp(timestamp) {
    const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate;
  }
  postDiv.innerHTML = "";
  postData.map((data) => {
    heading.innerHTML = `All Blog's From <span class="text-danger">${data.userName}</span>`;
    postDiv.innerHTML += `
    <div class="card my-2">
    <div class="card-body">
        <div class="profileImg d-flex align-items-center">
            <img src="${data.userImg}" alt="" width="100" height="100">
            <article>
                <h2 class="card-title fw-bold mx-3 mt-5">${data.title}</h2>
                <h5 class="card-subtitle fw-bold mx-3 mb-5" style="opacity: 0.5;">${
                  data.userName
                }  <span>${formatTimestamp(data.timestamp)}</span></h5>
                </div>
            <p class="card-text">${data.description}</p>                     
        </article>
    </div>
  </div>
    `;
  });
}

async function getAllBlogs() {
  const q = await query(
    collection(db, "posts"),
    orderBy("timestamp", "desc"),
    where("uid", "==", userUid)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    postData.push({ ...doc.data(), docId: doc.id });
  });
  allBlogsRendering();
}

getAllBlogs();



