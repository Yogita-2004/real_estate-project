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
  window.location.href = "/shobha/brochure/shobha-aranya.pdf";
}
/* =====================================
   APEX LANDBASE – POPUP + LEAD FORM JS
   SOBHA (ID = 1)
   Supabase + EmailJS Connected
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  const popupBg = document.getElementById("apexPopupBg");
  const closeBtn = document.getElementById("apexPopupClose");
  const form = document.getElementById("apexLeadForm1");

  if (!popupBg || !closeBtn || !form) return;

  /* ===== PAGE TRACKING ===== */
  const pageField = document.getElementById("apex-page1");
  if (pageField) {
    pageField.value = document.title || window.location.pathname;
  }

  /* ===== SHOW POPUP UNTIL FORM SUBMITTED ===== */
  if (!localStorage.getItem("apexFormSubmitted1")) {
    setTimeout(() => {
      popupBg.classList.add("active");
      document.body.style.overflow = "hidden";
    }, 3500);
  }

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

  /* ===== FORM SUBMIT (POPUP) ===== */
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector(".apex-submit-btn");
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const name  = document.getElementById("apex-name1").value.trim();
    const email = document.getElementById("apex-email1").value.trim();
    const phone = document.getElementById("apex-phone1").value.trim();
    const page  = pageField ? pageField.value : "";

    if (!name || !email || !phone) {
      alert("Please fill all fields");
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
      return;
    }

    try {
      /* ===== SUPABASE INSERT ===== */
      const { error } = await window.supabase
        .from("leads")
        .insert([{ name, email, phone, page }]);

      if (error) throw error;

      /* ===== EMAILJS SEND ===== */
      await emailjs.send(
        "service_kabl40s",
        "template_hm3z1bq",
        { name, email, phone }
      );

      /* ===== SAVE FLAG ===== */
      localStorage.setItem("apexFormSubmitted1", "yes");

      /* ===== RESET & CLOSE POPUP ===== */
      form.reset();
      popupBg.classList.remove("active");
      document.body.style.overflow = "auto";

      /* ===== SUCCESS TOAST ===== */
      setTimeout(() => {
        const toast = document.getElementById("thankYouToast");
        if (toast) {
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 3000);
        }
      }, 200);

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
   CONTACT / ENQUIRE FORM – SOBHA
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  const contactForm = document.getElementById("contactForm1");
  if (!contactForm) return;

  const toast = document.getElementById("thankYouToast");

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name  = document.getElementById("contact-name1").value.trim();
    const phone = document.getElementById("contact-phone1").value.trim();
    const email = document.getElementById("contact-email1").value.trim();

    if (!name || !phone) {
      console.warn("Required fields missing");
      return;
    }

    try {
      /* ===== SUPABASE INSERT ===== */
      await window.supabase
        .from("leads")
        .insert([{ name, phone, email }]);

      /* ===== EMAILJS SEND ===== */
      await emailjs.send(
        "service_kabl40s",
        "template_hm3z1bq",
        { name, phone, email }
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