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
  deleteDoc,
  doc,
  updateDoc,
  
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./config.js";

//  <<<<<<<<<<<<<<<<<<<<<<<<<<<- Getting HTML Elements Started ->>>>>>>>>>>>>>>>>>>>>>>>

const postsForm = document.querySelector("form");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
let posts = document.querySelector(".posts");
let navbarImg = document.querySelector(".navbarImg");
let profileName = document.querySelector(".profileName");

let postData = [];
let userImg;
let userName;
let userUid;
//  <<<<<<<<<<<<<<<<<<<<<<<<<<<- Getting HTML Elements Ended ->>>>>>>>>>>>>>>>>>>>>>>>



// <<<<<<<<<<<<<<<<<<<<<<- function that checks user is Logged In Or Not ->>>>>>>>>>>>>>>>>>>>>>>>>
onAuthStateChanged(auth, async (user) => {
  const currentUser = auth.currentUser;
  if (user) {
   
    const uid = user.uid;
    userUid = currentUser.uid;
    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<- Getting User Data from Firebase db just specific user datas ->>>>>>>>>>>>>>>>>>>>
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot2 = await getDocs(q);
    querySnapshot2.forEach((doc) => {
      userName = doc.data().fullNames;
      userImg = doc.data().profileUrl;
      profileName.innerHTML = doc.data().fullNames
      
    });
    navbarImg.innerHTML =`<img src="${userImg}" alt="Profile" class="rounded-circle" width="40" height="40">`

    localStorage.setItem("uid", JSON.stringify(userUid))
    renderPosts();
    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<- Getting User Data from Firebase db just specific user Ended here ->>>>>>>>>>>>>>>>>>>>
    


    //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<- Adding Blogs from dashboard Started ->>>>>>>>>>>>>>>>>>>>
    postsForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (title.value.length > 25 || title.value.length < 0) {
        Swal.fire({ icon: "error", text: "Title should be less then 20" });
        return;
      }
      if(description.value.length < 90) {
        Swal.fire({ icon: "error", title: "Small Description" });      
        return
      }
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
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Post Created Successfully',
          showConfirmButton: false,
          timer: 1500,
          width: '200px', 
        });
      } catch (addPostError) {
        Swal.fire({ icon: "error", title: addPostError.message });

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
                              <h5 class="card-subtitle fw-bold mx-3 mb-5" style="opacity: 0.5;">${userName} <span>-${formatTimestamp(
          item.timestamp
        )}</span></h5>
                              </div>
                              <p class="card-text">${
                                item.description
                              }</p>         
                          <button class="btn btn-dark btn-sm" id="editBtn"  data-bs-toggle="modal" data-bs-target="#editPostModal">Edit</button>            
                          <button class="btn btn-danger btn-sm" id="deleteBtn">Delete</button>            
                      </article>
                  </div>
                  </div>`;
                });


                let editBtn = document.querySelectorAll("#editBtn");
                
                let editTitle = document.querySelector("#editTitle")
                let editDesc = document.querySelector("#editDesc")
                editBtn.forEach((btn,ind) => {
                  btn.addEventListener("click", () => {
                    editTitle.value = postData[ind].title
                    editDesc.value = postData[ind].description
                    document.querySelector(".saveChanges").addEventListener("click", ()=> {
                      if(editTitle.value.length > 30) {
                        Swal.fire({ icon: "error", title: "Title Must be Less then 30 Character's" });      
                        return
                      }
                      if(description.value.length < 90) {
                        Swal.fire({ icon: "error", title: "Small Description" });      
                        return
                      }
                      
                      updateData(postData[ind].uid)
                      $("#editPostModal").modal("hide");
                      Swal.fire({ icon: "success", title: "Updated Successfully" });      
                      postData.title =  updateData(postData[ind].title)
                      postData.splice(ind , 1 ,{title : editTitle.value , description : editDesc.value,  timestamp : Timestamp.fromDate(new Date())});
                      renderPosts()
                      // postData.unshift({title : editTitle.value , description : editDesc, timestamp : Timestamp.fromDate(new Date())})                
                    });
                  });
                })


                // Deleting posts
                let del = document.querySelectorAll("#deleteBtn");
                del.forEach((btn,ind) => {
                  btn.addEventListener("click" , () => {
                    if(confirm("Are You Sure To delete This Post ??")){
                      deletePosts(postData[ind].docId)
                      postData.splice(ind,1);
                    } else {
                      return false
                    }
                  })
                })
              }
              // <<<<<<<- Rendering Data to Html Elements Ended ->>>>>>>>>>>>>>>>>
              
              
              

              
              //  Delete Function for post collection
              async function deletePosts(postDocId){
                try {
                  const postRef = await doc(db,"posts", postDocId)
                  await deleteDoc(postRef)
                  Swal.fire({ icon: "success", title: "Deleted Successfully" });
                  renderPosts()                  
                } catch (error) {
                  Swal.fire({ icon: "error", title: error.message });
                }
                renderPosts()
              }
              
              
              //  Update Function for post collection
              async function updateData(postId){
                try {
                  const q = await query(collection(db, "posts"), where("uid", "==", postId));
                  const querySnapshot = await getDocs(q)
                  querySnapshot.forEach((doc) => {
                    
                      updateDoc(doc.ref, {
                        title : editTitle.value,
                        description : editDesc.value
                      });  
                      
                    });
                  
                } catch (error) {
                  Swal.fire({ icon: "error", title: error.message });      
                }
                renderPosts();
              }









              
              //  <<<<<<<<<- Getting Data From Db Started ->>>>>>
              async function getData(userUid){
                postData.length = 0
                const q =  await query(collection(db,"posts"), where("uid", "==", userUid),orderBy("timestamp","desc"))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc)=> {
                  postData.push({...doc.data(), docId : doc.id})
                })
                renderPosts()
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
      Swal.fire({ icon: "success", text:"Successfully LogOut" });
      window.location = "../auth/login.html";      
    })
    .catch((error) => {
      Swal.fire({ icon: "error", text: error.message });
    });
});
