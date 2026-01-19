function toggleMenu() {
  document.querySelector(".menu").classList.toggle("show");
}


const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".menu a");

function activateMenu() {
  let scrollPos = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => link.classList.remove("active"));
      const activeLink = document.querySelector('.menu a[href="#' + id + '"]');
      if (activeLink) activeLink.classList.add("active");
    }
  });

  /* SPECIAL FIX FOR CONTACT (LAST SECTION) */
  const contact = document.querySelector("#contact");
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 5
  ) {
    navLinks.forEach(link => link.classList.remove("active"));
    document
      .querySelector('.menu a[href="#contact"]')
      ?.classList.add("active");
  }
}

window.addEventListener("scroll", activateMenu);


function openBrochure() {
  document.getElementById("brochurePopup").style.display = "flex";
}

function closeBrochure() {
  document.getElementById("brochurePopup").style.display = "none";
}

function submitBrochure(e) {
  e.preventDefault();
  closeBrochure();
  window.location.href = "/max361/brochure/max361.pdf";
}
/* =====================================
   APEX LANDBASE – POPUP + LEAD FORM JS
   PER PAGE POPUP | 1 HOUR GAP AFTER SUBMIT
   SUPABASE + EMAILJS
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  const popupBg   = document.getElementById("apexPopupBg");
  const closeBtn  = document.getElementById("apexPopupClose");
  const popupForm = document.getElementById("apexLeadForm");

  if (!popupBg || !closeBtn || !popupForm) return;

  /* ===== UNIQUE KEY PER LANDING PAGE ===== */
  const pageKey =
    "apexSubmitted_" +
    window.location.pathname.replace(/\//g, "").replace(/[^a-zA-Z0-9]/g, "");

  /* ===== TIME GAP (1 HOUR) ===== */
  const ONE_HOUR = 60 * 60 * 1000;

  /* ===== PAGE INFO ===== */
  const pageName = document.title;
  const pageUrl  = window.location.href;

  const pageField = document.getElementById("apex-page");
  if (pageField) pageField.value = pageName;

  /* ===== POPUP SHOW LOGIC =====
     - Never submitted → show popup
     - Submitted < 1 hr ago → do NOT show
     - Submitted > 1 hr ago → show again
  ============================== */
  const lastSubmitTime = localStorage.getItem(pageKey);

  if (
    !lastSubmitTime ||
    (Date.now() - Number(lastSubmitTime)) > ONE_HOUR
  ) {
    setTimeout(() => {
      popupBg.classList.add("active");
      document.body.style.overflow = "hidden";
    }, 3500);
  }

  /* ===== CLOSE POPUP (NO STORAGE CHANGE) ===== */
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

  /* ===== POPUP FORM SUBMIT ===== */
  popupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = popupForm.querySelector(".apex-submit-btn");
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const name  = document.getElementById("apex-name").value.trim();
    const email = document.getElementById("apex-email").value.trim();
    const phone = document.getElementById("apex-phone").value.trim();

    if (!name || !email || !phone) {
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
      return;
    }

    try {
      /* ===== SUPABASE ===== */
      await window.supabase.from("leads").insert([{
        name,
        email,
        phone,
        page_name: pageName,
        page_url: pageUrl
      }]);

      /* ===== EMAILJS ===== */
      await emailjs.send(
        "service_kabl40s",
        "template_hm3z1bq",
        {
          name,
          email,
          phone,
          page_name: pageName,
          page_url: pageUrl
        }
      );

      /* ===== SAVE SUBMIT TIME (IMPORTANT) ===== */
      localStorage.setItem(pageKey, Date.now());

      popupForm.reset();
      popupBg.classList.remove("active");
      document.body.style.overflow = "auto";

      const toast = document.getElementById("thankYouToast");
      if (toast) {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
    }
  });

});


/* =====================================
   FOOTER / CONTACT FORM
   SAME SUPABASE + EMAILJS
   (1 HOUR GAP LOGIC NOT AFFECTED)
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  const contactForm = document.querySelector(".contact-form");
  if (!contactForm) return;

  const toast = document.getElementById("thankYouToast");

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputs = contactForm.querySelectorAll("input");
    const name  = inputs[0]?.value.trim();
    const phone = inputs[1]?.value.trim();
    const email = inputs[2]?.value.trim();

    if (!name || !phone) return;

    try {
      await window.supabase.from("leads").insert([{
        name,
        phone,
        email,
        page_name: document.title,
        page_url: window.location.href
      }]);

      await emailjs.send(
        "service_kabl40s",
        "template_hm3z1bq",
        {
          name,
          phone,
          email,
          page_name: document.title,
          page_url: window.location.href
        }
      );

      contactForm.reset();

      if (toast) {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
      }

    } catch (err) {
      console.error(err);
    }
  });

});