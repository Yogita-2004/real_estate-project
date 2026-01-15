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

/* ================= POPUP FORM (HOME ONLY) ================= */
document.addEventListener("DOMContentLoaded", function () {

  const popupBg = document.getElementById("formPopupBg");
  const closeBtn = document.getElementById("closeFormPopup");
  const form = document.getElementById("formPopup");

  if (popupBg && closeBtn && form) {

    if (!localStorage.getItem("formSubmitted")) {
      setTimeout(() => {
        popupBg.classList.add("active");
        document.body.style.overflow = "hidden";
      }, 3500);
    }

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

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("fp-name")?.value.trim();
      const email = document.getElementById("fp-email")?.value.trim();
      const phone = document.getElementById("fp-phone")?.value.trim();

      if (!name || !email || !phone) {
        showToast("Please fill all fields", "error");
        return;
      }

      await window.supabase.from("leads").insert([{ name, email, phone }]);

      emailjs.send("service_kabl40s", "template_hm3z1bq", { name, email, phone })
        .then(() => {
          showToast("Thank you! We will contact you shortly.");
          localStorage.setItem("formSubmitted", "yes");
          form.reset();
          popupBg.classList.remove("active");
          document.body.style.overflow = "auto";
        });
    });
  }

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