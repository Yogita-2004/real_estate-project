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
// ================= MASTER PLAN MODAL =================//

function openMasterPlan() {
  const modal = document.getElementById("masterModal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // background scroll lock
  }
}

function closeMasterPlan() {
  const modal = document.getElementById("masterModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = ""; // scroll unlock
  }
}

// Close modal on ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
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

/* ===== OPEN / CLOSE BROCHURE POPUP ===== */
function openBrochure() {
  document.body.style.overflow = "hidden";   // background scroll stop
  document.getElementById("brochurePopup").style.display = "flex";
}

function closeBrochure() {
  document.body.style.overflow = "";         // scroll back
  document.getElementById("brochurePopup").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {

  const brochureForm = document.getElementById("brochureForm");
  if (!brochureForm) return;

  brochureForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(brochureForm);

    const leadData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      source: formData.get("source") || "Brochure Download",
      project: formData.get("project") || "DLF"
    };

    /* ===== 1️⃣ SUPABASE ===== */
    try {
      const { error } = await supabase
        .from("leads")
        .insert([leadData]);

      if (error) throw error;
    } catch (err) {
      alert("Lead save failed");
      return;
    }

    /* ===== 2️⃣ EMAILJS ===== */
    emailjs.send(
      "service_kabl40s",
      "template_hm3z1bq",
      {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        page_name: leadData.project,   // DLF
        page_url: window.location.href,
        message: leadData.source
      }
    )
    .then(() => {
      console.log("✅ DLF Email sent");
    })
    .catch((error) => {
      console.error("❌ DLF Email failed:", error);
    });

    /* ===== 3️⃣ DLF BROCHURE DOWNLOAD ===== */
    window.open("/dlf/brochure/dlf.pdf", "_blank");

    brochureForm.reset();
    closeBrochure();
  });

});

/* ================= DLF LANDING PAGE ================= */

document.addEventListener("DOMContentLoaded", function () {

  const popupBg = document.getElementById("apexPopupBg");
  const closeBtn = document.getElementById("apexPopupClose");
  const popupForm = document.getElementById("apexLeadForm");

  if (!popupBg || !closeBtn || !popupForm) return;

  /* ===== PAGE KEY (1 HOUR GAP) ===== */
  const pageKey =
    "apexSubmitted_" +
    window.location.pathname.replace(/\W/g, "");

  /* ===== PAGE NAME ===== */
  const pageField = document.getElementById("apex-page");
  if (pageField) {
    pageField.value = document.title || "DLF Landing Page";
  }

  /* ===== SHOW POPUP ===== */
  if (!localStorage.getItem(pageKey)) {
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

  /* ===== POPUP FORM SUBMIT ===== */
  popupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("apex-name").value.trim();
    const email = document.getElementById("apex-email").value.trim();
    const phone = document.getElementById("apex-phone").value.trim();
    const page  = pageField.value;

    if (!name || !email || !phone) return;

    try {
      await window.supabase.from("leads").insert([
        { name, email, phone, page }
      ]);

      await emailjs.send(
        "service_kabl40s",
        "template_hm3z1bq",
        { name, email, phone, page }
      );

      localStorage.setItem(pageKey, "yes");

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
    }
  });

  /* ===== FOOTER FORM ===== */
  const contactForm = document.querySelector(".contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputs = contactForm.querySelectorAll("input");
    const name = inputs[0].value.trim();
    const phone = inputs[1].value.trim();
    const email = inputs[2].value.trim();

    if (!name || !phone) return;

    try {
      await window.supabase.from("leads").insert([
        { name, phone, email, page: pageField.value }
      ]);

      await emailjs.send(
        "service_kabl40s",
        "template_hm3z1bq",
        { name, phone, email, page: pageField.value }
      );

      contactForm.reset();

      const toast = document.getElementById("thankYouToast");
      if (toast) {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
      }

    } catch (err) {
      console.error(err);
    }
  });

});