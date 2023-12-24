  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
  import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
  
  const firebaseConfig = {
    apiKey: "AIzaSyDp2tYL8hbsY3kHniw4x0Z9IHrWUYe3sOg",
    authDomain: "blogapp-d455a.firebaseapp.com",
    projectId: "blogapp-d455a",
    storageBucket: "blogapp-d455a.appspot.com",
    messagingSenderId: "80111573375",
    appId: "1:80111573375:web:5d49dc817241372e00624a"
  };

  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const storage = getStorage(app);
