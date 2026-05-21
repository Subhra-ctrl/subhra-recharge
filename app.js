import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



// =========================
// FIREBASE CONFIG
// =========================

const firebaseConfig = {

  apiKey: "AIzaSyCRQZlxE4t99d7w4pPOtiFUFnkJCHvbtAM",

  authDomain: "subhra-recharge.firebaseapp.com",

  projectId: "subhra-recharge",

  storageBucket: "subhra-recharge.firebasestorage.app",

  messagingSenderId: "702685211510",

  appId: "1:702685211510:web:e9852e9eccfb04d94fa857"

};



// =========================
// FIREBASE INIT
// =========================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);



// =========================
// ANTI SPAM PROTECTION
// =========================

let isSubmitting = false;



// =========================
// FORM SUBMIT
// =========================

document
  .getElementById("rechargeForm")
  .addEventListener("submit", async function (e) {

    e.preventDefault();



    // GET VALUES

    const mobile =
      document.getElementById("mobile").value.trim();

    const operator =
      document.getElementById("operator").value;

    const amount =
      document.getElementById("amount").value;



    // MOBILE VALIDATION

    if (mobile.length !== 10) {

      alert(
        "Please enter valid 10 digit mobile number.\nসঠিক ১০ সংখ্যার মোবাইল নম্বর লিখুন।"
      );

      return;

    }



    // AMOUNT VALIDATION

    if (Number(amount) <= 0) {

      alert(
        "Please enter valid recharge amount.\nসঠিক রিচার্জ পরিমাণ লিখুন।"
      );

      return;

    }



    try {

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
        "Something went wrong!\nকিছু সমস্যা হয়েছে!"
      );

    }

});



// =========================
// PAYMENT COMPLETE BUTTON
// =========================

document
  .getElementById("paidBtn")
  .addEventListener("click", async function () {

    // ANTI MULTIPLE CLICK

    if (isSubmitting) {

      return;

    }

    const answer = confirm(
      "Have you completed payment?\nপেমেন্ট সম্পূর্ণ করেছেন কি?"
    );

    if (!answer) {

      return;

    }

    isSubmitting = true;



    // BUTTON LOADING STATE

    const paidBtn =
      document.getElementById("paidBtn");

    paidBtn.disabled = true;

    paidBtn.innerHTML = `
      Processing Request...<br>
      অনুরোধ পাঠানো হচ্ছে...
    `;



    // GET VALUES

    const mobile =
      document.getElementById("mobile").value.trim();

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

        createdAt: new Date()

      });



      // SEND TELEGRAM MESSAGE

      await fetch("/api/notify", {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          mobile,
          operator,
          amount

        })

      });



      // SUCCESS SCREEN

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

            Please wait for recharge confirmation SMS.<br><br>

            আপনার রিচার্জ রিকোয়েস্ট সফলভাবে জমা হয়েছে।<br><br>

            সাধারণত ৫ মিনিটের মধ্যে রিচার্জ সম্পন্ন হয়।<br><br>

            রিচার্জ কনফার্মেশন SMS এর জন্য অপেক্ষা করুন।

          </p>

        </div>

      `;

    } catch (error) {

      console.error(error);

      alert(
        "Something went wrong!\nকিছু সমস্যা হয়েছে!"
      );



      // RESET BUTTON

      paidBtn.disabled = false;

      paidBtn.innerHTML = `
        I Have Completed Payment<br>
        আমি পেমেন্ট করেছি
      `;

      isSubmitting = false;

    }

});
