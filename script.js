/* =========================================================
   Jaipur Mehandi Special — Site Script
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Gallery data ---------- */
  /* category keys match filter buttons: bridal-full-arm | bridal-hand-palm | mini-personalized */
  var galleryImages = [];

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  for (var i = 1; i <= 20; i++) {
    galleryImages.push({
      src: "assets/bridal-full-arm-" + pad(i) + ".jpg",
      category: "bridal-full-arm",
      label: "Signature Bridal Mehandi"
    });
  }
  for (var j = 1; j <= 9; j++) {
    galleryImages.push({
      src: "assets/bridal-hand-palm-" + pad(j) + ".jpg",
      category: "bridal-hand-palm",
      label: "Bridal Hand & Palm Mehandi"
    });
  }
  for (var k = 1; k <= 5; k++) {
    galleryImages.push({
      src: "assets/mini-personalized-" + pad(k) + ".jpg",
      category: "mini-personalized",
      label: "Mini & Personalised Mehandi"
    });
  }

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    var pre = document.getElementById("preloader");
    if (pre) {
      setTimeout(function () { pre.classList.add("is-hidden"); }, 250);
    }
  });

  /* ---------- Sticky header ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
    var backBtn = document.getElementById("backToTop");
    if (backBtn) {
      if (window.scrollY > 600) backBtn.classList.add("is-visible");
      else backBtn.classList.remove("is-visible");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Build gallery grid ---------- */
  var galleryGrid = document.getElementById("galleryGrid");
  var currentFilter = "all";

  function buildGallery() {
    var frag = document.createDocumentFragment();
    galleryImages.forEach(function (item, index) {
      var fig = document.createElement("figure");
      fig.className = "gallery-item is-visible";
      fig.setAttribute("data-category", item.category);
      fig.setAttribute("data-index", index);
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", "View " + item.label);

      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.label + " by Jaipur Mehandi Special";
      img.loading = "lazy";
      fig.appendChild(img);

      var caption = document.createElement("figcaption");
      caption.className = "gallery-caption";
      caption.textContent = item.label;
      fig.appendChild(caption);

      fig.addEventListener("click", function () { openLightbox(index); });
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(index);
        }
      });

      frag.appendChild(fig);
    });
    galleryGrid.appendChild(frag);
  }
  buildGallery();

  /* ---------- Gallery filters ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      currentFilter = btn.getAttribute("data-filter");

      var items = galleryGrid.querySelectorAll(".gallery-item");
      items.forEach(function (item) {
        var cat = item.getAttribute("data-category");
        var show = currentFilter === "all" || cat === currentFilter;
        item.classList.toggle("is-hidden", !show);
        if (show) {
          item.classList.remove("is-visible");
          void item.offsetWidth; /* restart animation */
          item.classList.add("is-visible");
        }
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  var activeIndex = 0;

  function visibleIndexes() {
    return galleryImages
      .map(function (item, idx) { return idx; })
      .filter(function (idx) {
        return currentFilter === "all" || galleryImages[idx].category === currentFilter;
      });
  }

  function openLightbox(index) {
    activeIndex = index;
    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function renderLightbox() {
    var item = galleryImages[activeIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.label;
    lightboxCaption.textContent = item.label;
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function stepLightbox(dir) {
    var indexes = visibleIndexes();
    if (!indexes.length) return;
    var pos = indexes.indexOf(activeIndex);
    if (pos === -1) pos = 0;
    pos = (pos + dir + indexes.length) % indexes.length;
    activeIndex = indexes[pos];
    renderLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", function () { stepLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener("click", function () { stepLightbox(1); });
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  /* ---------- Enquiry form -> WhatsApp deep link ---------- */
  var enquiryForm = document.getElementById("enquiryForm");
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("fName").value.trim();
      var phone = document.getElementById("fPhone").value.trim();
      var date = document.getElementById("fDate").value;
      var occasion = document.getElementById("fOccasion").value;
      var message = document.getElementById("fMessage").value.trim();

      var lines = [
        "Hi Jaipur Mehandi Special, I'd like to enquire about booking mehandi.",
        "Name: " + name,
        "Phone: " + phone
      ];
      if (date) lines.push("Event Date: " + date);
      lines.push("Occasion: " + occasion);
      if (message) lines.push("Message: " + message);

      var text = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/919528542462?text=" + text, "_blank", "noopener");
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
