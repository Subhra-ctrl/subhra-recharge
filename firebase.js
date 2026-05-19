import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCRQZlxE4t99d7w4pPOtiFUFnkJCHvbtAM",
  authDomain: "subhra-recharge.firebaseapp.com",
  projectId: "subhra-recharge",
  storageBucket: "subhra-recharge.firebasestorage.app",
  messagingSenderId: "702685211510",
  appId: "1:702685211510:web:e9852e9eccfb04d94fa857"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase Connected Successfully");