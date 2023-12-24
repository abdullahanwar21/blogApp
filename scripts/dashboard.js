import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getDocs,
  collection,
  where,
  addDoc,
  Timestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./config.js";

//  <<<<<<<<<<<<<<<<<<<<<<<<<<<- Getting HTML Elements Started ->>>>>>>>>>>>>>>>>>>>>>>>

const postsForm = document.querySelector("form");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
let posts = document.querySelector(".posts");
let navbarImg = document.querySelector(".navbarImg img");
let profileName = document.querySelector(".profileName");
let postData = [];
let userData = [];
let userImg;
let userName;
let userUid;
let userArr;
//  <<<<<<<<<<<<<<<<<<<<<<<<<<<- Getting HTML Elements Ended ->>>>>>>>>>>>>>>>>>>>>>>>

// <<<<<<<<<<<<<<<<<<<<<<- function that checks user is Logged In Or Not ->>>>>>>>>>>>>>>>>>>>>>>>>
onAuthStateChanged(auth, async (user) => {
  const currentUser = auth.currentUser;
  if (user) {
    const uid = user.uid;
    userUid = currentUser.uid;
    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<- Getting User Data from Firebase db just specific user datas ->>>>>>>>>>>>>>>>>>>>
    const q = query(collection(db, "users"), where("uid", "==", uid));
    // console.log(q);
    const querySnapshot2 = await getDocs(q);
    querySnapshot2.forEach((doc) => {
      userArr = doc.data()
      userName = doc.data().fullNames;
      userImg = doc.data().profileUrl;
      navbarImg.src = doc.data().profileUrl;
      profileName.innerHTML = doc.data().fullNames
    });
    localStorage.setItem("uid", JSON.stringify(userUid))
    renderPosts();
    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<- Getting User Data from Firebase db just specific user Ended here ->>>>>>>>>>>>>>>>>>>>

    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<- Adding Blogs from dashboard Started ->>>>>>>>>>>>>>>>>>>>
    postsForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (title.value.length > 20) {
        Swal.fire({ icon: "error", text: "Title should be less then 20" });
        return;
      }
      // if(description.value.length > 100 && description.value.length < 300 ){
      //   Swal.fire({icon : "error", text: "Description Must be between 100 to 3000"});
      //   return
      // }
      // Add a new document with a generated id.
      try {
        const docRef = await addDoc(collection(db, "posts"), {
          title: title.value,
          description: description.value,
          timestamp: Timestamp.fromDate(new Date()),
          uid: auth.currentUser.uid,
          userImg : userImg,
          userName : userName
                });

        title.value = "";
        description.value = "";
        getData(userUid)
        // renderPosts()
      
      } catch (addPostError) {
        console.log(addPostError);
      }
    });

    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<- Adding Blogs from dashboard Ended ->>>>>>>>>>>>>>>>>>>>




    // <<<<<<<- Rendering Data to Html Elements Started ->>>>>>>>>>>>>>>>>
    function renderPosts() {
      function formatTimestamp(timestamp) {
        const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
        const options = { year: "numeric", month: "short", day: "numeric" };
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
          date
        );
        return formattedDate;
      }

      posts.innerHTML = "";
      postData.map((item) => {
        posts.innerHTML += `
        <div class="card my-2">
                  <div class="card-body">
                      <div class="profileImg d-flex align-items-center">
                          <img src="${userImg}" alt="" width="100" height="100">
                          <article>
                              <h2 class="card-title fw-bold mx-3 mt-5">${item.title.toUpperCase()}</h2>
                              <h5 class="card-subtitle fw-bold mx-3 mb-5" style="opacity: 0.5;">${item.userName} <span>-${formatTimestamp(
          item.timestamp
        )}</span></h5>
                              </div>
                              <p class="card-text">${
                                item.description
                              }</p>         
                          <button type="submit" class="btn btn-dark btn-sm ">Edit</button>            
                          <button type="submit" class="btn btn-danger btn-sm">Delete</button>            
                      </article>
                  </div>
                  </div>`;
                });
              }
              // <<<<<<<- Rendering Data to Html Elements Ended ->>>>>>>>>>>>>>>>>


              
              //  <<<<<<<<<- Getting Data From Db Started ->>>>>>
              async function getData(userUid){
                postData.length = 0
                const q =  await query(collection(db,"posts"), where("uid", "==", userUid),orderBy("timestamp","desc"))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc)=> {
                  console.log();
                  postData.push({...doc.data(), docId : doc.id})
                })
                renderPosts()
                console.log(postData);
              }
              getData(userUid)
              //  <<<<<<<<<- Getting Data From Db Ended Here ->>>>>>

      } 
      else {
    window.location = "../auth/login.html";
  }
});





















// Log Out Function
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
