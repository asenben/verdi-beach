const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      if (entry.target.classList.contains("stat-item")) {
        animateCounter(entry.target);
      }
    }
  });
}, observerOptions);

const elementsToObserve = [
  ".story-section",
  ".team-member",
  ".value-item",
  ".location-section",
  ".cta-section",
  ".stat-item",
];

elementsToObserve.forEach((selector) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    observer.observe(el);
    el.classList.add("reveal-init");
  });
});

function animateCounter(element) {
  const numberElement = element.querySelector(".stat-number");
  if (!numberElement) return;

  const finalNumber = parseInt(numberElement.textContent);
  let currentNumber = 0;
  const increment = finalNumber / 50;

  const timer = setInterval(() => {
    currentNumber += increment;
    if (currentNumber >= finalNumber) {
      currentNumber = finalNumber;
      clearInterval(timer);
    }
    numberElement.textContent = Math.floor(currentNumber) + "+";
  }, 40);
}

document.querySelectorAll(".cta-btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector(".about-hero-image");
  if (heroImage) {
    heroImage.classList.add("parallax");
    heroImage.style.setProperty("--parallax", `${scrolled * -0.5}px`);
  }
});

document.querySelectorAll(".team-member").forEach((member) => {
  member.addEventListener("mouseenter", function () {
    this.classList.add("hovered");
  });
  member.addEventListener("mouseleave", function () {
    this.classList.remove("hovered");
  });
});

document.querySelectorAll(".value-item").forEach((item) => {
  item.addEventListener("mouseenter", function () {
    const icon = this.querySelector(".value-icon");
    if (icon) {
      icon.classList.add("hovered");
    }
  });
  item.addEventListener("mouseleave", function () {
    const icon = this.querySelector(".value-icon");
    if (icon) {
      icon.classList.remove("hovered");
    }
  });
});

function revealOnScroll() {
  document.querySelectorAll(".reveal-init").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add("js-slide-in-up");
    }
  });
  document.querySelectorAll(".reveal-init-left").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add("js-slide-in-left");
    }
  });
  document.querySelectorAll(".reveal-init-right").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add("js-slide-in-right");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("DOMContentLoaded", revealOnScroll);

const addVisibleClass = () => {};

setTimeout(addVisibleClass, 100);
