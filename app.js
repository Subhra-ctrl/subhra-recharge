import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyCRQZlxE4t99d7w4pPOtiFUFnkJCHvbtAM",
  authDomain: "subhra-recharge.firebaseapp.com",
  projectId: "subhra-recharge",
  storageBucket: "subhra-recharge.firebasestorage.app",
  messagingSenderId: "702685211510",
  appId: "1:702685211510:web:e9852e9eccfb04d94fa857"
};



const app = initializeApp(firebaseConfig);

const db = getFirestore(app);



// FORM SUBMIT

document
  .getElementById("rechargeForm")
  .addEventListener("submit", async function (e) {

    e.preventDefault();



    const mobile =
      document.getElementById("mobile").value;

    const operator =
      document.getElementById("operator").value;

    const amount =
      document.getElementById("amount").value;



    try {

      // SAVE TO FIREBASE

      await addDoc(collection(db, "recharges"), {

        mobile: mobile,
        operator: operator,
        amount: Number(amount),
        status: "pending",
        time: new Date()

      });



      console.log("Saved to Firebase");



      // HIDE FORM

      document
        .getElementById("rechargeForm")
        .style.display = "none";



      // SHOW PAYMENT SECTION

      document
        .getElementById("paymentSection")
        .style.display = "block";



    } catch (error) {

      console.error(error);

      alert(
        "Error saving recharge request!\nরিচার্জ রিকোয়েস্ট সেভ করতে সমস্যা হয়েছে!"
      );

    }

});




// PAYMENT COMPLETE BUTTON

document
  .getElementById("paidBtn")
  .addEventListener("click", function () {

    const answer = confirm(
      "Have you completed payment?\nপেমেন্ট সম্পূর্ণ করেছেন কি?"
    );



    if (answer) {

      document
        .getElementById("paymentSection")
        .innerHTML = `

        <div class="success-box">

            <h2>
                Thank You! ✅
            </h2>

            <p>

                Your recharge request has been submitted successfully.<br><br>

                Recharge usually completes within 5 minutes.<br><br>

                Please wait patiently.<br><br>

                আপনার রিচার্জ রিকোয়েস্ট সফলভাবে জমা হয়েছে।<br><br>

                সাধারণত ৫ মিনিটের মধ্যে রিচার্জ সম্পন্ন হয়।<br><br>

                অনুগ্রহ করে অপেক্ষা করুন।

            </p>

        </div>

        `;

    }

});