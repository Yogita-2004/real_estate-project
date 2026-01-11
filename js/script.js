function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) {
    console.error("Toast element not found");
    return;
  }

  toast.classList.remove("show", "error");
  toast.innerText = message;

  if (type === "error") {
    toast.classList.add("error");
  }

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show", "error");
  }, 2500);
}

document.addEventListener("DOMContentLoaded", function () {

  const popupBg = document.getElementById("formPopupBg");
  const closeBtn = document.getElementById("closeFormPopup");
  const form = document.getElementById("formPopup");

  if (!popupBg || !closeBtn || !form) {
    console.log("Popup / Form elements missing");
    return;
  }

  // POPUP //
  if (!localStorage.getItem("formSubmitted")) {
    setTimeout(() => {
      popupBg.classList.add("active");
      document.body.style.overflow = "hidden";
    }, 3500);
  }

  /* CLOSE (refresh pe popup phir aayega) */
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

  /* FORM SUBMIT */
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const name = document.getElementById("fp-name").value.trim();
    const email = document.getElementById("fp-email").value.trim();
    const phone = document.getElementById("fp-phone").value.trim();

    if (!name || !email || !phone) {
      showToast("Please fill all fields", "error");
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
      return;
    }

    const { error } = await window.supabase
      .from("leads")
      .insert([{ name, email, phone }]);

    if (error) {
      console.error(error);
      showToast("Database error. Try again.", "error");
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
      return;
    }

    emailjs.send(
      "service_kabl40s",
      "template_hm3z1bq",
      { name, email, phone }
    )
      .then(() => {
        showToast("Thank you! We will contact you shortly.");

        // IMPORTANT LINE//
        localStorage.setItem("formSubmitted", "yes");

        form.reset();
        popupBg.classList.remove("active");
        document.body.style.overflow = "auto";

        submitBtn.disabled = false;
        submitBtn.innerText = "Submit";
      })
      .catch(() => {
        showToast("Email failed, but data saved.", "error");
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit";
      });
  });

});
/* =====================================
   OUR PROPERTIES SLIDER – FINAL JS
===================================== */

const slider = document.querySelector(".property-grid");
const cards = document.querySelectorAll(".property-card");
const prevBtn = document.querySelector(".arrow.left");
const nextBtn = document.querySelector(".arrow.right");
const dotsContainer = document.querySelector(".slider-dots");

let index = 0;

/* Slider only for tablet & mobile */
function isSliderActive() {
  return window.innerWidth <= 992;
}

/* Cards per screen */
function cardsPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 992) return 2;
  return 3;
}

/* Create dots */
function createDots() {
  dotsContainer.innerHTML = "";

  if (!isSliderActive()) return;

  const totalDots = Math.ceil(cards.length / cardsPerView());

  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      index = i;
      updateSlider();
    });

    dotsContainer.appendChild(dot);
  }
}

/* Update slider */
function updateSlider() {
  if (!isSliderActive()) {
    slider.style.transform = "translateX(0)";
    return;
  }

  const gap = 24;
  const cardWidth = cards[0].getBoundingClientRect().width + gap;

  slider.style.transform =
    `translateX(-${index * cardWidth * cardsPerView()}px)`;

  document.querySelectorAll(".slider-dots span").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* Arrow buttons */
nextBtn.addEventListener("click", () => {
  if (!isSliderActive()) return;

  const maxIndex = Math.ceil(cards.length / cardsPerView()) - 1;
  index = index < maxIndex ? index + 1 : 0;
  updateSlider();
});

prevBtn.addEventListener("click", () => {
  if (!isSliderActive()) return;

  const maxIndex = Math.ceil(cards.length / cardsPerView()) - 1;
  index = index > 0 ? index - 1 : maxIndex;
  updateSlider();
});

/* Resize handling */
window.addEventListener("resize", () => {
  index = 0;
  createDots();
  updateSlider();
});

/* Init */
createDots();
updateSlider();


/* =====================================
   MOBILE MENU TOGGLE (3 LINE BUTTON)
===================================== */

const menuBtn = document.querySelector(".menu-btn");
const navList = document.querySelector(".nav-list");

menuBtn.addEventListener("click", () => {
  navList.classList.toggle("show-menu");
});
// ===== CONTACT NOW – MOBILE vs DESKTOP =====
const contactBtn = document.querySelector(".contact-btn");
const contactChoice = document.getElementById("contactChoice");
const closeChoiceBtn = document.getElementById("closeChoiceBtn");

function isMobile() {
  return window.innerWidth <= 768;
}

if (contactBtn) {
  contactBtn.addEventListener("click", function () {

    //  MOBILE → Direct WhatsApp
    if (isMobile()) {
      window.open("https://wa.me/919654465643", "_blank");
      return;
    }

    // DESKTOP → Popup
    contactChoice.classList.add("active");
    document.body.style.overflow = "hidden";
  });
}

if (closeChoiceBtn) {
  closeChoiceBtn.addEventListener("click", function () {
    contactChoice.classList.remove("active");
    document.body.style.overflow = "auto";
  });
}

// Outside click close
contactChoice.addEventListener("click", function (e) {
  if (e.target === contactChoice) {
    contactChoice.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});