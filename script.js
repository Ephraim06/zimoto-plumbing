document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");

  const setMenuIcon = (name) => {
    const icon = menuButton?.querySelector("svg");
    if (!icon) return;
    icon.setAttribute("data-lucide", name);
    window.lucide?.createIcons();
  };

  const closeMenu = () => {
    navigation?.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    setMenuIcon("menu");
  };

  menuButton?.addEventListener("click", () => {
    const willOpen = !navigation.classList.contains("open");
    navigation.classList.toggle("open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
    setMenuIcon(willOpen ? "x" : "menu");
  });

  navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 980) closeMenu(); });

  const whatsappFloat = document.querySelector(".whatsapp-float");
  const whatsappButton = whatsappFloat?.querySelector(".floating-whatsapp");
  const whatsappMenu = whatsappFloat?.querySelector(".whatsapp-menu");

  const closeWhatsappMenu = () => {
    if (!whatsappMenu || !whatsappButton) return;
    whatsappMenu.hidden = true;
    whatsappButton.setAttribute("aria-expanded", "false");
  };

  whatsappButton?.addEventListener("click", () => {
    const willOpen = whatsappMenu.hidden;
    whatsappMenu.hidden = !willOpen;
    whatsappButton.setAttribute("aria-expanded", String(willOpen));
  });

  whatsappMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeWhatsappMenu));
  document.addEventListener("click", (event) => {
    if (whatsappFloat && !whatsappFloat.contains(event.target)) closeWhatsappMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeWhatsappMenu();
      whatsappButton?.focus();
    }
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const serviceCards = document.querySelectorAll("[data-category]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-selected", String(item === button));
      });
      const filter = button.dataset.filter;
      serviceCards.forEach((card) => card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter));
    });
  });

  document.querySelectorAll(".comparison").forEach((comparison) => {
    const slider = comparison.querySelector("input[type='range']");
    const updateComparison = () => comparison.style.setProperty("--position", `${slider.value}%`);
    slider?.addEventListener("input", updateComparison);
    updateComparison();
  });

  const videos = document.querySelectorAll(".video-grid video");
  videos.forEach((video) => {
    video.addEventListener("play", () => {
      videos.forEach((other) => { if (other !== video) other.pause(); });
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach((item) => revealObserver.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add("visible"));
  }

  const pageSections = document.querySelectorAll("main section[id], header[id]");
  const navLinks = document.querySelectorAll(".main-nav a[href^='#']:not(.button)");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-30% 0px -60%", threshold: 0 });
  pageSections.forEach((section) => sectionObserver.observe(section));

  document.querySelectorAll(".area-list details").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;
      document.querySelectorAll(".area-list details").forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });

  const form = document.querySelector("#quote-form");
  const status = document.querySelector("#form-status");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const submitButton = form.querySelector("button[type='submit']");
    const buttonLabel = submitButton.querySelector("span");
    submitButton.disabled = true;
    buttonLabel.textContent = "Sending...";
    status.className = "form-status";
    status.textContent = "Sending your request securely...";

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Formspree rejected the submission");

      form.reset();
      status.classList.add("success");
      status.textContent = "Thank you. Your request has been sent to Zimoto Plumbing.";
    } catch (error) {
      status.classList.add("error");
      status.textContent = "We could not send your request. Please try again or use the WhatsApp button to contact Macdonald or Macmillan.";
    } finally {
      submitButton.disabled = false;
      buttonLabel.textContent = "Send quote request";
    }
  });

  document.querySelector("#year").textContent = new Date().getFullYear();
});
