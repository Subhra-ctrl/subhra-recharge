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
let lastSubmissionTime = 0;


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

    if (!/^[6-9]\d{9}$/.test(mobile)) {

      alert(
        "Please enter valid mobile number.\nসঠিক মোবাইল নম্বর লিখুন।"
      );

      return;

    }



    // OPERATOR VALIDATION

    if (operator === "") {

      alert(
        "Please select operator.\nঅপারেটর নির্বাচন করুন।"
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



    // SHOW PAYMENT SECTION

    document
      .getElementById("rechargeForm")
      .style.display = "none";

    document
      .getElementById("paymentSection")
      .style.display = "block";

});
// AUTO SCROLL TO PAYMENT SECTION

document
  .getElementById("paymentSection")
  .scrollIntoView({

    behavior: "smooth"

  });


// =========================
// PAYMENT COMPLETE BUTTON
// =========================

document
  .getElementById("paidBtn")
  .addEventListener("click", async function () {

    // STOP MULTIPLE CLICKS

    if (isSubmitting) return;



    // PAYMENT CONFIRM

    const answer = confirm(
      "Have you completed payment?\nপেমেন্ট সম্পূর্ণ করেছেন কি?"
    );

    if (!answer) return;

// COOLDOWN PROTECTION

const now = Date.now();

if (now - lastSubmissionTime < 30000) {

  alert(
    "Please wait 30 seconds before another request.\nআরেকটি রিকোয়েস্টের আগে ৩০ সেকেন্ড অপেক্ষা করুন।"
  );

  return;

}

lastSubmissionTime = now;
    isSubmitting = true;




    // BUTTON LOADING

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

        mobile,
        operator,
        amount: Number(amount),
        status: "pending",
        createdAt: Date.now()

      });



      // SEND TELEGRAM MESSAGE

      fetch("/api/notify", {

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



// =========================
// SERVICE WORKER
// =========================

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("/service-worker.js")

      .then(() => {

        console.log("Service Worker Registered");

      })

      .catch((error) => {

        console.log(error);

      });

  });

}

// =========================
// INSTALL APP BUTTON
// =========================

let deferredPrompt;

const installBtn =
document.getElementById("installBtn");



// SAVE INSTALL PROMPT

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

});



// INSTALL BUTTON CLICK

installBtn.addEventListener("click", async () => {

    // INSTALL PROMPT AVAILABLE

    if (deferredPrompt) {

        deferredPrompt.prompt();

        const result =
        await deferredPrompt.userChoice;

        if (result.outcome === "accepted") {

            installBtn.innerHTML =
            "✅ App Installed";

        }

    }

    // FALLBACK MESSAGE

    else {

        alert(
`To install app:

Chrome Menu (⋮)
→ Add to Home Screen

অ্যাপ ইনস্টল করতে:

Chrome Menu (⋮)
→ হোম স্ক্রিনে যোগ করুন`
        );

    }

});