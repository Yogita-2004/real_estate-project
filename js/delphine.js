/* =====================================
   CENTRAL PARK DELPHINE – FINAL JS
   SAFE | NO BREAK | LIGHTHOUSE FRIENDLY
===================================== */

/* ===============================
   HAMBURGER MENU
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");
  const menuLinks = document.querySelectorAll(".menu a");

  if (!hamburger || !menu) return;

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove("active");
    }
  });
});


/* ===============================
   FLOOR PLAN SLIDER
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".fp-track");
  if (!track) return;

  const slides = track.querySelectorAll("img");
  let index = 0;

  setInterval(() => {
    index = (index + 1) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  }, 4000);
});


/* ===============================
   MASTER PLAN MODAL
================================ */
function openMasterPlan() {
  const modal = document.getElementById("masterModal");
  if (!modal) return;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeMasterPlan() {
  const modal = document.getElementById("masterModal");
  if (!modal) return;

  modal.style.display = "none";
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  const modal = document.getElementById("masterModal");
  if (modal && e.target === modal) {
    closeMasterPlan();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMasterPlan();
  }
});


/* ===============================
   SCROLL SPY MENU
================================ */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".menu a");

function activateMenu() {
  const scrollPos = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => link.classList.remove("active"));
      const activeLink = document.querySelector(`.menu a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
    navLinks.forEach(link => link.classList.remove("active"));
    document.querySelector('.menu a[href="#contact"]')?.classList.add("active");
  }
}

window.addEventListener("scroll", activateMenu, { passive: true });


/* ===============================
   BROCHURE MODAL
================================ */
function openBrochure() {
  const popup = document.getElementById("brochurePopup");
  if (popup) popup.style.display = "flex";
}

function closeBrochure() {
  const popup = document.getElementById("brochurePopup");
  if (popup) popup.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const brochureForm = document.getElementById("brochureForm");
  if (!brochureForm) return;

  brochureForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(brochureForm);

    const leadData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      source: formData.get("source") || "Brochure Download",
      project: formData.get("project") || "Central Park Delphine"
    };

    try {
      const { error } = await window.supabase.from("leads").insert([leadData]);
      if (error) throw error;
    } catch {
      alert("Lead save failed");
      return;
    }

    emailjs.send(
      "service_kabl40s",
      "template_hm3z1bq",
      {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        page_name: leadData.project,
        page_url: window.location.href,
        message: leadData.source
      }
    );

    window.open(
      "/delphine/brochure/delphine.pdf",
      "_blank",
      "noopener,noreferrer"
    );

    brochureForm.reset();
    closeBrochure();
  });
});


/* ===============================
   AUTO POPUP FORM
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const popupBg = document.getElementById("apexPopupBg");
  const closeBtn = document.getElementById("apexPopupClose");
  const popupForm = document.getElementById("apexLeadForm2");
  if (!popupBg || !closeBtn || !popupForm) return;

  const pageKey = "apexSubmitted_" + location.pathname.replace(/\W/g, "");
  const ONE_HOUR = 60 * 60 * 1000;

  const lastSubmit = localStorage.getItem(pageKey);
  if (!lastSubmit || Date.now() - Number(lastSubmit) > ONE_HOUR) {
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

  popupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = popupForm.querySelector(".apex-submit-btn");
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    try {
      await window.supabase.from("leads").insert([{
        name: apex-name2.value,
        email: apex-email2.value,
        phone: apex-phone2.value,
        page_name: document.title,
        page_url: window.location.href
      }]);

      await emailjs.send("service_kabl40s", "template_hm3z1bq", {
        name: apex-name2.value,
        email: apex-email2.value,
        phone: apex-phone2.value,
        page_name: document.title,
        page_url: window.location.href
      });

      localStorage.setItem(pageKey, Date.now());
      popupForm.reset();
      popupBg.classList.remove("active");
      document.body.style.overflow = "auto";

      document.getElementById("thankYouToast")?.classList.add("show");
      setTimeout(() => {
        document.getElementById("thankYouToast")?.classList.remove("show");
      }, 3000);

    } catch {
      alert("Something went wrong");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
    }
  });
});


/* ===============================
   FOOTER CONTACT FORM
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm2");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      await window.supabase.from("leads").insert([{
        name: contact-name2.value,
        phone: contact-phone2.value,
        email: contact-email2.value,
        page_name: document.title,
        page_url: window.location.href
      }]);

      await emailjs.send("service_kabl40s", "template_hm3z1bq", {
        name: contact-name2.value,
        phone: contact-phone2.value,
        email: contact-email2.value,
        page_name: document.title,
        page_url: window.location.href
      });

      contactForm.reset();
      document.getElementById("thankYouToast")?.classList.add("show");
      setTimeout(() => {
        document.getElementById("thankYouToast")?.classList.remove("show");
      }, 3000);

    } catch {
      console.error("Footer form failed");
    }
  });
});