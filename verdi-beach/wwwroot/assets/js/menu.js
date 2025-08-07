initAnimations();
initHoverEffects();

function initAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "50px",
    }
  );

  const header = document.querySelector(".menu-header");
  const sections = document.querySelectorAll(".menu-section");

  if (header) observer.observe(header);
  sections.forEach((section) => observer.observe(section));
}

function initHoverEffects() {
  const menuRows = document.querySelectorAll(".menu-item-row");

  menuRows.forEach((row) => {
    row.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(10px)";
      this.style.color = "#d4af37";
    });

    row.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
      this.style.color = "#ffffff";
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    console.log("Window resized, layout updated");
  }, 250);
});
