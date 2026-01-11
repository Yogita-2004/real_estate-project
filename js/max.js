function toggleMenu(){
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


function openBrochure(){
  document.getElementById("brochurePopup").style.display = "flex";
}

function closeBrochure(){
  document.getElementById("brochurePopup").style.display = "none";
}

function submitBrochure(e){
  e.preventDefault();
  closeBrochure();
  window.location.href = "/max361/brochure/max361.pdf";
}

/* =====================================
   APEX LANDBASE – POPUP + LEAD FORM JS
   Supabase + EmailJS Connected
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  const popupBg  = document.getElementById("apexPopupBg");
  const closeBtn = document.getElementById("apexPopupClose");
  const form     = document.getElementById("apexLeadForm");

  if (!popupBg || !closeBtn || !form) return;

  /* ===== PAGE TRACKING ===== */
  const pageField = document.getElementById("apex-page");
  if (pageField) {
    pageField.value = document.title || window.location.pathname;
  }

  /* ===== SHOW POPUP UNTIL FORM SUBMITTED ===== */
  if (!localStorage.getItem("apexFormSubmitted")) {
    setTimeout(() => {
      popupBg.classList.add("active");
      document.body.style.overflow = "hidden";
    }, 3500);
  }

  /* ===== CLOSE POPUP (will reappear on refresh) ===== */
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

    const submitBtn = form.querySelector(".apex-submit-btn");
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const name  = document.getElementById("apex-name").value.trim();
    const email = document.getElementById("apex-email").value.trim();
    const phone = document.getElementById("apex-phone").value.trim();
    const page  = pageField ? pageField.value : "";

    if (!name || !email || !phone) {
      alert("Please fill all fields");
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
      return;
    }

    /* ===== SUPABASE INSERT ===== */
    const { error } = await window.supabase
      .from("leads")
      .insert([{ name, email, phone, page }]);

    if (error) {
      console.error("Supabase Error:", error);
      alert("Something went wrong. Try again.");
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
      return;
    }

    /* ===== EMAILJS SEND ===== */
    emailjs.send(
      "service_kabl40s",
      "template_hm3z1bq",
      { name, email, phone, page }
    )
    .then(() => {
      localStorage.setItem("apexFormSubmitted", "yes");

      form.reset();
      popupBg.classList.remove("active");
      document.body.style.overflow = "auto";

      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
    })
    .catch(() => {
      alert("Saved, but email failed.");
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
    });
  });

});