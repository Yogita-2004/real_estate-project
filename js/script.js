/* ================= TOAST ================= */
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.classList.remove("show", "error");
  toast.innerText = message;

  if (type === "error") toast.classList.add("error");

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show", "error"), 2500);
}
/* ================= HOME PAGE POPUP ================= */

document.addEventListener("DOMContentLoaded", function () {

  const popupBg = document.getElementById("formPopupBg");
  const closeBtn = document.getElementById("closeFormPopup");
  const form = document.getElementById("formPopup");

  if (!popupBg || !closeBtn || !form) return;

  const SUBMIT_GAP = 25 * 60 * 1000;   // 25 minutes (after submit)
  const REMIND_GAP = 2 * 60 * 1000;    // 2 minutes (if not submitted)

  const SUBMIT_KEY = "homeFormSubmittedTime";
  const REMIND_KEY = "homePopupLastShown";

  function shouldShowPopup() {
    const submittedAt = localStorage.getItem(SUBMIT_KEY);
    const lastShownAt = localStorage.getItem(REMIND_KEY);
    const now = Date.now();

    // Case 1: Form already submitted
    if (submittedAt) {
      return (now - Number(submittedAt)) > SUBMIT_GAP;
    }

    // Case 2: Form NOT submitted
    if (!lastShownAt) return true;
    return (now - Number(lastShownAt)) > REMIND_GAP;
  }

  function showPopup() {
    popupBg.classList.add("active");
    document.body.style.overflow = "hidden";
    localStorage.setItem(REMIND_KEY, Date.now());
  }

  /* ===== INITIAL POPUP CHECK ===== */
  setTimeout(() => {
    if (shouldShowPopup()) {
      showPopup();
    }
  }, 3500);

  /* ===== CLOSE POPUP ===== */
  closeBtn.addEventListener("click", () => {
    popupBg.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  popupBg.addEventListener("click", (e) => {
    if (e.target === popupBg) {
      popupBg.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  /* ===== FORM SUBMIT ===== */
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("fp-name")?.value.trim();
    const email = document.getElementById("fp-email")?.value.trim();
    const phone = document.getElementById("fp-phone")?.value.trim();

    if (!name || !email || !phone) {
      showToast("Please fill all fields", "error");
      return;
    }

    try {
      await window.supabase.from("leads").insert([{ name, email, phone }]);

      await emailjs.send(
        "service_kabl40s",
        "template_hm3z1bq",
        { name, email, phone }
      );

      // Save submit time (25 min gap starts)
      localStorage.setItem(SUBMIT_KEY, Date.now());

      form.reset();
      popupBg.classList.remove("active");
      document.body.style.overflow = "auto";

      showToast("Thank you! We will contact you shortly.");

    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    }
  });

});
/* =====================================
   PROPERTY SLIDER
   Home + Residential (Perfect)
===================================== */

const slider = document.querySelector(".property-grid");
const cards = document.querySelectorAll(".property-card");
const prevBtn = document.querySelector(".arrow.left");
const nextBtn = document.querySelector(".arrow.right");
const dotsContainer = document.querySelector(".slider-dots");

if (slider && cards.length && prevBtn && nextBtn && dotsContainer) {

  let index = 0;
  const GAP = 24;

  /* ---------- PAGE TYPE ---------- */
  const isResidential = document.body.classList.contains("residential-page");

  /* ---------- SLIDER ACTIVE ---------- */
  function isSliderActive() {
    if (isResidential) return window.innerWidth <= 768;
    return window.innerWidth <= 992;
  }

  /* ---------- CARDS PER VIEW ---------- */
  function cardsPerView() {
    if (isResidential) return 1;
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  /* ---------- MAX INDEX ---------- */
  function getMaxIndex() {
    if (isResidential) return cards.length - 1;
    return Math.max(Math.ceil(cards.length / cardsPerView()) - 1, 0);
  }

  /* ---------- DOTS ---------- */
  function createDots() {
    dotsContainer.innerHTML = "";

    if (!isSliderActive()) return;

    const totalDots = isResidential
      ? cards.length
      : Math.ceil(cards.length / cardsPerView());

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("span");
      if (i === index) dot.classList.add("active");

      dot.addEventListener("click", () => {
        index = i;
        updateSlider();
      });

      dotsContainer.appendChild(dot);
    }
  }

  /* ---------- UPDATE SLIDER ---------- */
  function updateSlider() {

    if (!isSliderActive()) {
      slider.style.transform = "translateX(0)";
      return;
    }

    const cardWidth = cards[0].offsetWidth + GAP;
    slider.style.transform = `translateX(-${index * cardWidth}px)`;

    dotsContainer.querySelectorAll("span").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  /* ---------- ARROWS ---------- */
  nextBtn.addEventListener("click", () => {
    const max = getMaxIndex();
    index = index < max ? index + 1 : 0;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    const max = getMaxIndex();
    index = index > 0 ? index - 1 : max;
    updateSlider();
  });

  /* ---------- RESIZE ---------- */
  window.addEventListener("resize", () => {
    index = 0;
    createDots();
    updateSlider();
  });

  /* ---------- INIT ---------- */
  createDots();
  updateSlider();
}

/* ================= MOBILE MENU ================= */
const menuBtn = document.querySelector(".menu-btn");
const navList = document.querySelector(".nav-list");

if (menuBtn && navList) {
  menuBtn.addEventListener("click", () => {
    navList.classList.toggle("show-menu");
  });
}

/* ================= CONTACT NOW ================= */
const contactBtn = document.querySelector(".contact-btn");
const contactChoice = document.getElementById("contactChoice");
const closeChoiceBtn = document.getElementById("closeChoiceBtn");

function isMobile() {
  return window.innerWidth <= 768;
}

if (contactBtn && contactChoice) {
  contactBtn.addEventListener("click", () => {
    if (isMobile()) {
      window.open("https://wa.me/919654465643", "_blank");
    } else {
      contactChoice.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  });
}

if (closeChoiceBtn && contactChoice) {
  closeChoiceBtn.addEventListener("click", () => {
    contactChoice.classList.remove("active");
    document.body.style.overflow = "auto";
  });
}

if (contactChoice) {
  contactChoice.addEventListener("click", (e) => {
    if (e.target === contactChoice) {
      contactChoice.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });
}
/* ================= CONTACT PAGE FORM
   THANK YOU MESSAGE (AUTO RESET AFTER 20s)
   EMAILJS ONLY
================= */

document.addEventListener("DOMContentLoaded", function () {

  const form = document.querySelector(".contact-form");
  if (!form) return;

  // Original form HTML save kar lo
  const originalFormHTML = form.innerHTML;

  const pageName = document.title || "Contact Page";
  const pageUrl  = window.location.href;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = form.querySelectorAll("input, textarea");

    const name    = inputs[0]?.value.trim();
    const email   = inputs[1]?.value.trim();
    const phone   = inputs[2]?.value.trim();
    const message = inputs[3]?.value.trim();

    if (!name || !email || !phone) {
      alert("Please fill all required fields");
      return;
    }

    emailjs.send(
      "service_kabl40s",
      "template_hm3z1bq",
      {
        name,
        email,
        phone,
        message,
        page_name: pageName,
        page_url: pageUrl
      }
    ).then(() => {

      // Show Thank You message
      form.innerHTML = `
        <div style="text-align:center; padding:40px;">
          <h3>Thank You!</h3>
          <p>Your enquiry has been submitted successfully.</p>
          <p>Our team will contact you shortly.</p>
        </div>
      `;

      // After 6 seconds, restore original form
      setTimeout(() => {
        form.innerHTML = originalFormHTML;
      }, 6000); // 6 seconds

    }).catch((err) => {
      console.error(err);
      alert("Something went wrong. Please try again.");
    });
  });

});