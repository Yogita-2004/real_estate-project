// hamburger//
document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");
  const menuLinks = document.querySelectorAll(".menu a");

  if (!hamburger || !menu) return;

  //  Burger click → toggle menu
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation(); // important
    menu.classList.toggle("active");
  });

  // Menu ke andar click pe close (links)
  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  });

  // Menu ke bahar kahin bhi click → close
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove("active");
    }
  });

});
//floorplan//
document.addEventListener("DOMContentLoaded", function () {

  const track = document.querySelector(".fp-track");
  if (!track) return;

  const slides = track.querySelectorAll("img");
  let index = 0;

  setInterval(() => {
    index = (index + 1) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }, 4000);

});
/* ================================
   MASTER PLAN MODAL JS
================================ */

function openMasterPlan(){
  const modal = document.getElementById("masterModal");
  if(!modal) return;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden"; // background scroll stop
}

function closeMasterPlan(){
  const modal = document.getElementById("masterModal");
  if(!modal) return;

  modal.style.display = "none";
  document.body.style.overflow = ""; // scroll back
}

/* Close modal when clicking outside image */
document.addEventListener("click", function(e){
  const modal = document.getElementById("masterModal");
  if(!modal) return;

  if(e.target === modal){
    closeMasterPlan();
  }
});

/* Close modal on ESC key */
document.addEventListener("keydown", function(e){
  if(e.key === "Escape"){
    closeMasterPlan();
  }
});
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
  window.location.href = "/elan/brochure/elan.pdf";
}
/* =====================================
   APEX LANDBASE – ELAN THE STATEMENT
   POPUP + FOOTER FORM
   1 HOUR GAP AFTER SUBMIT
   SUPABASE + EMAILJS
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  const popupBg   = document.getElementById("apexPopupBg");
  const closeBtn  = document.getElementById("apexPopupClose");
  const popupForm = document.getElementById("apexLeadForm");

  if (!popupBg || !closeBtn || !popupForm) return;

  const pageKey =
    "apexSubmitted_" +
    window.location.pathname.replace(/\//g, "").replace(/[^a-zA-Z0-9]/g, "");

  const ONE_HOUR = 60 * 60 * 1000;

  const pageName = document.title || "Elan The Statement";
  const pageUrl  = window.location.href;

  const pageField = document.getElementById("apex-page");
  if (pageField) pageField.value = pageName;

  const lastSubmitTime = localStorage.getItem(pageKey);

  if (!lastSubmitTime || (Date.now() - Number(lastSubmitTime)) > ONE_HOUR) {
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
      await window.supabase.from("leads").insert([{
        name,
        email,
        phone,
        page_name: pageName,
        page_url: pageUrl
      }]);

      await emailjs.send(
        "service_kabl40s",
        "template_hm3z1bq",
        { name, email, phone, page_name: pageName, page_url: pageUrl }
      );

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
   ELAN – FOOTER FORM
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
        page_name: document.title || "Elan The Statement",
        page_url: window.location.href
      }]);

      await emailjs.send(
        "service_kabl40s",
        "template_hm3z1bq",
        { name, phone, email, page_name: document.title || "Elan The Statement", page_url: window.location.href }
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