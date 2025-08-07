function initNavigationUnderline() {
  const navLinks = document.querySelectorAll(".main-menu ul li a");
  const navUl = document.querySelector(".main-menu ul");

  if (!navUl) return;

  const activeLink = document.querySelector(".main-menu ul li a.active");
  if (activeLink) {
    const linkRect = activeLink.getBoundingClientRect();
    const navRect = navUl.getBoundingClientRect();
    const left = linkRect.left - navRect.left;
    const width = linkRect.width;

    const style = document.createElement("style");
    style.textContent = `
            .main-header .main-menu ul::after {
                left: ${left}px;
                width: ${width}px;
                opacity: 1;
            }
            .main-header .main-menu ul:hover::after {
                opacity: 1;
            }
        `;
    document.head.appendChild(style);
  }

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      const linkRect = this.getBoundingClientRect();
      const navRect = navUl.getBoundingClientRect();
      const left = linkRect.left - navRect.left;
      const width = linkRect.width;
      const hoverStyle = document.createElement("style");
      hoverStyle.id = "hover-underline";
      hoverStyle.textContent = `
                .main-header .main-menu ul::after {
                    left: ${left}px !important;
                    width: ${width}px !important;
                    opacity: 1 !important;
                }
            `;

      const existingHover = document.getElementById("hover-underline");
      if (existingHover) existingHover.remove();

      document.head.appendChild(hoverStyle);
    });

    link.addEventListener("mouseleave", function () {
      const hoverStyle = document.getElementById("hover-underline");
      if (hoverStyle) hoverStyle.remove();
    });
  });
}

initNavigationUnderline();

const toggleBar = document.querySelector(".toggle-bar");
const navMenu = document.querySelector(".main-menu ul");
const mainMenu = document.querySelector(".main-menu");
const logo = document.querySelector(".main-menu .logo");

if (toggleBar && navMenu && mainMenu && logo) {
  const closeBtn = document.createElement("button");
  closeBtn.className = "mobile-close-btn";
  closeBtn.innerHTML = "&times;";
  closeBtn.setAttribute("aria-label", "Затвори менюто");

  toggleBar.addEventListener("click", function () {
    const isActive = navMenu.classList.contains("active");

    if (isActive) {
      navMenu.classList.remove("active");
      mainMenu.classList.remove("menu-active");
      logo.classList.remove("menu-active");
      toggleBar.classList.remove("menu-active");
      document.body.style.overflow = "auto";

      const existingCloseBtn = navMenu.querySelector(".mobile-close-btn");
      if (existingCloseBtn) existingCloseBtn.remove();
    } else {
      navMenu.classList.add("active");
      mainMenu.classList.add("menu-active");
      logo.classList.add("menu-active");
      toggleBar.classList.add("menu-active");
      document.body.style.overflow = "hidden";

      const existingCloseBtn = navMenu.querySelector(".mobile-close-btn");
      if (existingCloseBtn) existingCloseBtn.remove();

      const newCloseBtn = closeBtn.cloneNode(true);

      navMenu.appendChild(newCloseBtn);

      newCloseBtn.addEventListener("click", closeMenu);
    }

    toggleBar.classList.toggle("active");

    const bars = toggleBar.querySelectorAll(".bar");
    bars.forEach((bar, index) => {
      if (!isActive) {
        if (index === 0) {
          bar.style.transform = "rotate(45deg) translate(6px, 6px)";
          bar.style.transition = "all 0.3s ease";
        }
        if (index === 1) {
          bar.style.opacity = "0";
          bar.style.transition = "all 0.3s ease";
        }
        if (index === 2) {
          bar.style.transform = "rotate(-45deg) translate(6px, -6px)";
          bar.style.transition = "all 0.3s ease";
        }
      } else {
        bar.style.transform = "none";
        bar.style.opacity = "1";
        bar.style.transition = "all 0.3s ease";
      }
    });
  });

  function closeMenu() {
    navMenu.classList.remove("active");
    mainMenu.classList.remove("menu-active");
    logo.classList.remove("menu-active");
    toggleBar.classList.remove("menu-active");
    toggleBar.classList.remove("active");
    document.body.style.overflow = "auto";

    const existingCloseBtn = navMenu.querySelector(".mobile-close-btn");
    if (existingCloseBtn) existingCloseBtn.remove();

    const bars = toggleBar.querySelectorAll(".bar");
    bars.forEach((bar) => {
      bar.style.transform = "none";
      bar.style.opacity = "1";
      bar.style.transition = "all 0.3s ease";
    });
  }

  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  document.addEventListener("click", function (event) {
    if (!toggleBar.contains(event.target) && !navMenu.contains(event.target)) {
      if (navMenu.classList.contains("active")) {
        closeMenu();
      }
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navMenu.classList.contains("active")) {
      closeMenu();
    }
  });
}
 
const heroButtons = document.querySelectorAll(".hero-btn");
heroButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    rippleButton(button, event);
  });
});

window.addEventListener("resize", initNavigationUnderline);

function initHeroAnimation() {
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add("loaded");
    }, 100);
  }
}

document.addEventListener("DOMContentLoaded", initHeroAnimation);

class JSAnimationController {
  constructor() {
    this.activeAnimations = new Map();
    this.animationCounter = 0;
  }

  slideDown(element, options = {}) {
    if (!element) return;

    const config = {
      count: options.count || 1,
      duration: options.duration || 500,
      delay: options.delay || 0,
      direction: options.direction || "normal",
      timing: options.timing || "ease-out",
      onComplete: options.onComplete || null,
    };

    const animationId = ++this.animationCounter;
    this.activeAnimations.set(element, animationId);

    return new Promise((resolve) => {
      const animate = (iteration = 0) => {
        if (this.activeAnimations.get(element) !== animationId) {
          resolve();
          return;
        }

        element.style.opacity = "0";
        element.style.transform = "translateY(-10px)";
        element.style.transition = `all ${config.duration}ms ${config.timing}`;

        setTimeout(() => {
          if (this.activeAnimations.get(element) !== animationId) {
            resolve();
            return;
          }

          element.style.opacity = "1";
          element.style.transform = "translateY(0)";

          setTimeout(() => {
            if (this.activeAnimations.get(element) !== animationId) {
              resolve();
              return;
            }

            iteration++;

            if (config.count === "infinite") {
              setTimeout(() => animate(iteration), 100);
            } else if (iteration < config.count) {
              if (config.direction === "alternate" && iteration % 2 === 1) {
                element.style.opacity = "0";
                element.style.transform = "translateY(-10px)";
                setTimeout(() => animate(iteration), config.duration);
              } else {
                setTimeout(() => animate(iteration), 100);
              }
            } else {
              if (config.onComplete) config.onComplete();
              resolve();
            }
          }, config.duration);
        }, config.delay);
      };

      animate();
    });
  }

  ripple(element, options = {}) {
    if (!element) return;

    const config = {
      count: options.count || 1,
      duration: options.duration || 600,
      delay: options.delay || 0,
      scale: options.scale || 4,
      x: options.x || 0,
      y: options.y || 0,
      onComplete: options.onComplete || null,
    };

    const animationId = ++this.animationCounter;

    return new Promise((resolve) => {
      const animate = (iteration = 0) => {
        const ripple = document.createElement("span");
        ripple.style.position = "absolute";
        ripple.style.borderRadius = "50%";
        ripple.style.background = "rgba(255, 255, 255, 0.6)";
        ripple.style.left = config.x - 10 + "px";
        ripple.style.top = config.y - 10 + "px";
        ripple.style.width = "20px";
        ripple.style.height = "20px";
        ripple.style.transform = "scale(0)";
        ripple.style.opacity = "1";
        ripple.style.pointerEvents = "none";
        ripple.style.transition = `all ${config.duration}ms linear`;

        element.appendChild(ripple);

        setTimeout(() => {
          ripple.style.transform = `scale(${config.scale})`;
          ripple.style.opacity = "0";

          setTimeout(() => {
            ripple.remove();

            iteration++;
            if (config.count === "infinite") {
              setTimeout(() => animate(iteration), 100);
            } else if (iteration < config.count) {
              setTimeout(() => animate(iteration), 100);
            } else {
              if (config.onComplete) config.onComplete();
              resolve();
            }
          }, config.duration);
        }, config.delay);
      };

      animate();
    });
  }

  fadeInUp(element, options = {}) {
    if (!element) return;

    const config = {
      count: options.count || 1,
      duration: options.duration || 600,
      delay: options.delay || 0,
      scale: options.scale || true,
      distance: options.distance || 50,
      timing: options.timing || "ease-out",
      onComplete: options.onComplete || null,
    };

    const animationId = ++this.animationCounter;
    this.activeAnimations.set(element, animationId);

    return new Promise((resolve) => {
      const animate = (iteration = 0) => {
        if (this.activeAnimations.get(element) !== animationId) {
          resolve();
          return;
        }

        element.style.opacity = "0";
        element.style.transform = `translateY(${config.distance}px)${
          config.scale ? " scale(0.9)" : ""
        }`;
        element.style.transition = `all ${config.duration}ms ${config.timing}`;

        setTimeout(() => {
          if (this.activeAnimations.get(element) !== animationId) {
            resolve();
            return;
          }

          element.style.opacity = "1";
          element.style.transform =
            "translateY(0)" + (config.scale ? " scale(1)" : "");

          setTimeout(() => {
            if (this.activeAnimations.get(element) !== animationId) {
              resolve();
              return;
            }

            iteration++;

            if (config.count === "infinite") {
              setTimeout(() => animate(iteration), 100);
            } else if (iteration < config.count) {
              setTimeout(() => animate(iteration), 100);
            } else {
              if (config.onComplete) config.onComplete();
              resolve();
            }
          }, config.duration);
        }, config.delay);
      };

      animate();
    });
  }

  shimmer(element, options = {}) {
    if (!element) return;

    const config = {
      count: options.count || "infinite",
      duration: options.duration || 2000,
      minOpacity: options.minOpacity || 0.3,
      maxOpacity: options.maxOpacity || 0.6,
      onComplete: options.onComplete || null,
    };

    const animationId = ++this.animationCounter;
    this.activeAnimations.set(element, animationId);

    return new Promise((resolve) => {
      const animate = (iteration = 0, direction = 1) => {
        if (this.activeAnimations.get(element) !== animationId) {
          resolve();
          return;
        }

        const startOpacity =
          direction === 1 ? config.minOpacity : config.maxOpacity;
        const endOpacity =
          direction === 1 ? config.maxOpacity : config.minOpacity;

        element.style.opacity = startOpacity;
        element.style.transition = `opacity ${
          config.duration / 2
        }ms ease-in-out`;

        setTimeout(() => {
          if (this.activeAnimations.get(element) !== animationId) {
            resolve();
            return;
          }

          element.style.opacity = endOpacity;

          setTimeout(() => {
            if (this.activeAnimations.get(element) !== animationId) {
              resolve();
              return;
            }

            const newDirection = direction * -1;

            if (newDirection === 1) {
              iteration++;
            }

            if (config.count === "infinite") {
              animate(iteration, newDirection);
            } else if (iteration < config.count) {
              animate(iteration, newDirection);
            } else {
              if (config.onComplete) config.onComplete();
              resolve();
            }
          }, config.duration / 2);
        }, 10);
      };

      animate();
    });
  }

  slideDownOnce(element, duration = 500) {
    return this.slideDown(element, { count: 1, duration });
  }

  slideDownTwice(element, duration = 500) {
    return this.slideDown(element, { count: 2, duration });
  }

  slideDownBounce(element, duration = 300) {
    return this.slideDown(element, {
      count: 2,
      duration,
      direction: "alternate",
    });
  }

  slideDownInfinite(element, duration = 500) {
    return this.slideDown(element, { count: "infinite", duration });
  }

  rippleOnce(element, x = 0, y = 0, duration = 600) {
    return this.ripple(element, { count: 1, duration, x, y });
  }

  ripplePulse(element, duration = 800) {
    return this.ripple(element, { count: "infinite", duration });
  }

  fadeInUpOnce(element, duration = 600) {
    return this.fadeInUp(element, { count: 1, duration });
  }

  fadeInUpWithScale(element, duration = 600) {
    return this.fadeInUp(element, { count: 1, duration, scale: true });
  }

  fadeInUpNoScale(element, duration = 600) {
    return this.fadeInUp(element, { count: 1, duration, scale: false });
  }

  fadeInUpSlow(element) {
    return this.fadeInUp(element, { duration: 1000, scale: true });
  }

  fadeInUpFast(element) {
    return this.fadeInUp(element, { duration: 300, scale: true });
  }

  shimmerInfinite(element, duration = 2000) {
    return this.shimmer(element, { count: "infinite", duration });
  }

  stop(element) {
    this.activeAnimations.delete(element);
    if (element) {
      element.style.transition = "";
    }
  }

  slideDownById(id, options = {}) {
    const element = document.getElementById(id);
    return this.slideDown(element, options);
  }

  slideDownByClass(className, options = {}) {
    const elements = document.querySelectorAll(`.${className}`);
    const promises = [];

    elements.forEach((element, index) => {
      const elementOptions = { ...options };
      if (options.stagger) {
        elementOptions.delay = (options.delay || 0) + index * options.stagger;
      }
      promises.push(this.slideDown(element, elementOptions));
    });

    return Promise.all(promises);
  }

  fadeInUpByClass(className, options = {}) {
    const elements = document.querySelectorAll(`.${className}`);
    const promises = [];

    elements.forEach((element, index) => {
      const elementOptions = { ...options };
      if (options.stagger) {
        elementOptions.delay = (options.delay || 0) + index * options.stagger;
      }
      promises.push(this.fadeInUp(element, elementOptions));
    });

    return Promise.all(promises);
  }

  fadeInUpBySelector(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    const promises = [];

    elements.forEach((element, index) => {
      const elementOptions = { ...options };
      if (options.stagger) {
        elementOptions.delay = (options.delay || 0) + index * options.stagger;
      }
      promises.push(this.fadeInUp(element, elementOptions));
    });

    return Promise.all(promises);
  }

  rippleBySelector(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    const promises = [];

    elements.forEach((element, index) => {
      const elementOptions = { ...options };
      if (options.stagger) {
        elementOptions.delay = (options.delay || 0) + index * options.stagger;
      }
      promises.push(this.ripple(element, elementOptions));
    });

    return Promise.all(promises);
  }
}

const jsAnimationController = new JSAnimationController();

window.slideDownAnimation = {
  animate: (element, options) =>
    jsAnimationController.slideDown(element, options),

  once: (element, duration) =>
    jsAnimationController.slideDownOnce(element, duration),
  twice: (element, duration) =>
    jsAnimationController.slideDownTwice(element, duration),
  bounce: (element, duration) =>
    jsAnimationController.slideDownBounce(element, duration),
  infinite: (element, duration) =>
    jsAnimationController.slideDownInfinite(element, duration),

  byId: (id, options) => jsAnimationController.slideDownById(id, options),
  byClass: (className, options) =>
    jsAnimationController.slideDownByClass(className, options),

  stop: (element) => jsAnimationController.stop(element),
};

window.rippleAnimation = {
  animate: (element, options) => jsAnimationController.ripple(element, options),

  once: (element, x, y, duration) =>
    jsAnimationController.rippleOnce(element, x, y, duration),
  pulse: (element, duration) =>
    jsAnimationController.ripplePulse(element, duration),

  bySelector: (selector, options) =>
    jsAnimationController.rippleBySelector(selector, options),

  stop: (element) => jsAnimationController.stop(element),
};

window.shimmerAnimation = {
  infinite: (element, duration) =>
    jsAnimationController.shimmerInfinite(element, duration),
  stop: (element) => jsAnimationController.stop(element),
};

window.fadeInUpAnimation = {
  animate: (element, options) =>
    jsAnimationController.fadeInUp(element, options),

  once: (element, duration) =>
    jsAnimationController.fadeInUpOnce(element, duration),
  withScale: (element, duration) =>
    jsAnimationController.fadeInUpWithScale(element, duration),
  noScale: (element, duration) =>
    jsAnimationController.fadeInUpNoScale(element, duration),
  slow: (element) => jsAnimationController.fadeInUpSlow(element),
  fast: (element) => jsAnimationController.fadeInUpFast(element),

  byClass: (className, options) =>
    jsAnimationController.fadeInUpByClass(className, options),
  bySelector: (selector, options) =>
    jsAnimationController.fadeInUpBySelector(selector, options),

  stop: (element) => jsAnimationController.stop(element),
};

function animateHeader(count = 1) {
  const header = document.querySelector(".main-header");
  return slideDownAnimation.animate(header, { count, duration: 600 });
}

function animateLogo() {
  const logo = document.querySelector(".logo");
  return slideDownAnimation.bounce(logo, 300);
}

function animateMenuItems() {
  return slideDownAnimation.byClass("main-menu ul li", {
    count: 1,
    duration: 400,
    stagger: 100,
  });
}

function rippleButton(button, event) {
  if (!button || !event) return;

  const rect = button.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return rippleAnimation.once(button, x, y, 600);
}

window.testAnimations = {
  slideHeader: () => animateHeader(),
  slideLogo: () => animateLogo(),
  slideMenu: () => animateMenuItems(),

  fadeGalleryItems: () => {
    return fadeInUpAnimation.byClass("gallery-item", {
      duration: 600,
      scale: true,
      stagger: 150,
    });
  },

  fadeGalleryHeader: () => {
    const header = document.querySelector(".gallery-header");
    return fadeInUpAnimation.withScale(header, 800);
  },

  rippleButtons: () => {
    const buttons = document.querySelectorAll(".hero-btn");
    buttons.forEach((btn, index) => {
      setTimeout(() => {
        rippleAnimation.once(btn, 50, 25, 600);
      }, index * 200);
    });
  },

  shimmerLogo: () => {
    const logo = document.querySelector(".logo");
    return shimmerAnimation.infinite(logo, 2000);
  },

  stopAll: () => {
    document.querySelectorAll("*").forEach((element) => {
      jsAnimationController.stop(element);
    });
  },

  demoGallery: () => {
    console.log("🎬 Gallery Animation Demo");
    console.log("1. Resetting items...");
    galleryAnimations.resetItems();

    setTimeout(() => {
      console.log("2. Using JavaScript fadeInUp animation...");
      galleryAnimations.fadeAllItems();
    }, 1000);

    setTimeout(() => {
      console.log("3. Demo complete! You can also try:");
      console.log("   galleryAnimations.useCSS() - for CSS-based animations");
      console.log(
        "   galleryAnimations.useJS() - for JavaScript-based scroll animations"
      );
    }, 3000);
  },
};

function initGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return;

  if (typeof GalleryAPI === "undefined") return;

  const galleryItems = GalleryAPI.getAll();

  galleryItems.forEach((item, index) => {
    if (
      item.type === "image" &&
      (item.src.includes("1.jpg") ||
        item.src.includes("2.jpg") ||
        item.src.includes("3.jpg") ||
        item.src.includes("4.jpg") ||
        item.src.includes("5.jpg") ||
        item.src.includes("7.jpg") ||
        item.src.includes("8.jpg") ||
        item.src.includes("10.jpg") ||
        item.src.includes("11.jpg") ||
        item.src.includes("12.jpg") ||
        item.src.includes("13.jpg") ||
        item.src.includes("14.jpg") ||
        item.src.includes("15.jpg") ||
        item.src.includes("16.jpg") ||
        item.src.includes("17.jpg") ||
        item.src.includes("18.jpg") ||
        item.src.includes("19.jpg") ||
        item.src.includes("20.jpg"))
    ) {
      return;
    }

    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";
    galleryItem.setAttribute("data-category", item.category);

    const mediaWrapper = document.createElement("div");
    mediaWrapper.className = "media-wrapper";

    if (item.type === "image") {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      mediaWrapper.appendChild(img);
    } else if (item.type === "video") {
      const video = document.createElement("video");
      video.setAttribute("poster", item.poster);
      const source = document.createElement("source");
      source.src = item.src;
      source.type = "video/mp4";
      video.appendChild(source);
      mediaWrapper.appendChild(video);
    } else if (item.type === "double-image") {
      const img = document.createElement("img");
      img.src = item.images[0].src;
      img.alt = item.images[0].alt;
      img.className = "gallery-image";

      mediaWrapper.appendChild(img);
    } else if (item.type === "single-image") {
      const img = document.createElement("img");
      img.src = item.images[0].src;
      img.alt = item.images[0].alt;
      img.className = "gallery-image";

      mediaWrapper.appendChild(img);
    }

    const overlay = document.createElement("div");
    overlay.className = "media-overlay";

    const mediaTypeSpan = document.createElement("span");
    mediaTypeSpan.className = "media-type";
    const icon = document.createElement("i");
    if (item.type === "image") {
      icon.className = "fa-solid fa-camera";
    } else if (item.type === "video") {
      icon.className = "fa-solid fa-video";
    } else if (item.type === "double-image") {
      icon.className = "fa-solid fa-images";
    } else if (item.type === "single-image") {
      icon.className = "fa-solid fa-camera";
    }
    mediaTypeSpan.appendChild(icon);

    const title = document.createElement("h3");
    title.textContent = item.title;

    overlay.appendChild(mediaTypeSpan);
    overlay.appendChild(title);

    mediaWrapper.appendChild(overlay);
    galleryItem.appendChild(mediaWrapper);

    galleryItem.addEventListener("click", () => {
      if (item.type === "double-image") {
        const firstImageSrc = item.images[0].src;
        const firstImageIndex = galleryItems.findIndex(
          (galleryItem) =>
            galleryItem.type === "image" && galleryItem.src === firstImageSrc
        );
        if (firstImageIndex !== -1) {
          openLightbox(firstImageIndex);
        } else {
          openLightbox(index);
        }
      } else if (item.type === "single-image") {
        const imageSrc = item.images[0].src;
        const imageIndex = galleryItems.findIndex(
          (galleryItem) =>
            galleryItem.type === "image" && galleryItem.src === imageSrc
        );
        if (imageIndex !== -1) {
          openLightbox(imageIndex);
        } else {
          openLightbox(index);
        }
      } else {
        openLightbox(index);
      }
    });

    galleryGrid.appendChild(galleryItem);
  });

  setTimeout(() => {
    initGalleryScrollAnimation();
  }, 100);
}

function initGalleryScrollAnimation() {
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (galleryItems.length === 0) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  let animationQueue = [];
  let isAnimating = false;

  const processQueue = () => {
    if (animationQueue.length > 0 && !isAnimating) {
      isAnimating = true;
      const element = animationQueue.shift();

      element.classList.add("animate");

      setTimeout(() => {
        isAnimating = false;
        processQueue();
      }, 150);
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("animate")) {
        animationQueue.push(entry.target);
        processQueue();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  galleryItems.forEach((item) => {
    observer.observe(item);
  });
}

function initGalleryScrollAnimationJS() {
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (galleryItems.length === 0) return;

  galleryItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(50px) scale(0.9)";
    item.style.transition = "none";
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  let animationQueue = [];
  let isAnimating = false;

  const processQueue = () => {
    if (animationQueue.length > 0 && !isAnimating) {
      isAnimating = true;
      const element = animationQueue.shift();

      fadeInUpAnimation.withScale(element, 600).then(() => {
        isAnimating = false;
        processQueue();
      });
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.style.opacity === "1") {
        animationQueue.push(entry.target);
        processQueue();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  galleryItems.forEach((item) => {
    observer.observe(item);
  });
}

window.galleryAnimations = {
  useCSS: () => {
    initGalleryScrollAnimation();
  },

  useJS: () => {
    initGalleryScrollAnimationJS();
  },

  fadeAllItems: () => {
    return fadeInUpAnimation.byClass("gallery-item", {
      duration: 600,
      scale: true,
      stagger: 100,
    });
  },

  resetItems: () => {
    const items = document.querySelectorAll(".gallery-item");
    items.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(50px) scale(0.9)";
      item.classList.remove("animate");
    });
  },
};

document.addEventListener("DOMContentLoaded", function () {
  if (
    window.location.pathname.includes("gallery.html") ||
    document.getElementById("galleryGrid")
  ) {
    initGallery();

    setTimeout(() => {
      const header = document.querySelector(".gallery-header");
      if (header) {
        header.style.opacity = "1";
        header.style.transform = "translateY(0)";
      }
    }, 300);
  }
});

let currentLightboxIndex = 0;
let lightboxItems = [];

function openLightbox(index) {
  currentLightboxIndex = index;
  lightboxItems = GalleryAPI.getAll();

  const displayableItems = lightboxItems.filter(
    (item) => item.type === "image" || item.type === "video"
  );

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const currentIndexSpan = document.getElementById("currentIndex");
  const totalItemsSpan = document.getElementById("totalItems");

  if (!lightbox) return;

  const currentItem = lightboxItems[index];
  let currentDisplayIndex = 0;

  if (currentItem.type === "image" || currentItem.type === "video") {
    currentDisplayIndex = displayableItems.findIndex(
      (item) => item.src === currentItem.src && item.type === currentItem.type
    );
  }

  currentIndexSpan.textContent = currentDisplayIndex + 1;
  totalItemsSpan.textContent = displayableItems.length;

  showLightboxItem(currentLightboxIndex);
  lightbox.style.display = "flex";
  setTimeout(() => {
    lightbox.classList.add("active");
  }, 10);
  document.body.style.overflow = "hidden";
}

function showLightboxItem(index) {
  const item = lightboxItems[index];
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const prevBtn = document.getElementById("prevItem");
  const nextBtn = document.getElementById("nextItem");

  if (item.type === "image") {
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightboxImage.style.display = "block";
    lightboxVideo.style.display = "none";
  } else if (item.type === "video") {
    const source = lightboxVideo.querySelector("source");
    source.src = item.src;
    lightboxVideo.load();
    lightboxVideo.style.display = "block";
    lightboxImage.style.display = "none";
  } else if (item.type === "double-image" || item.type === "single-image") {
    let nextIndex = index + 1;
    while (
      nextIndex < lightboxItems.length &&
      (lightboxItems[nextIndex].type === "double-image" ||
        lightboxItems[nextIndex].type === "single-image")
    ) {
      nextIndex++;
    }
    if (nextIndex < lightboxItems.length) {
      currentLightboxIndex = nextIndex;
      showLightboxItem(nextIndex);
      return;
    }

    lightboxImage.src = item.images[0].src;
    lightboxImage.alt = item.images[0].alt;
    lightboxImage.style.display = "block";
    lightboxVideo.style.display = "none";
  }

  lightboxTitle.textContent = item.title;

  const displayableItems = lightboxItems.filter(
    (item) => item.type === "image" || item.type === "video"
  );
  const currentDisplayIndex = displayableItems.findIndex((displayItem) => {
    return displayItem.src === item.src && displayItem.type === item.type;
  });

  const currentIndexSpan = document.getElementById("currentIndex");
  if (currentDisplayIndex !== -1) {
    currentIndexSpan.textContent = currentDisplayIndex + 1;
  }

  const currentItemIsDisplayable =
    item.type === "image" || item.type === "video";
  if (prevBtn && currentItemIsDisplayable) {
    const prevDisplayableIndex = displayableItems.findIndex(
      (prevItem) => prevItem.src === item.src && prevItem.type === item.type
    );
    if (prevDisplayableIndex <= 0) {
      prevBtn.style.display = "none";
    } else {
      prevBtn.style.display = "flex";
    }
  }

  if (nextBtn && currentItemIsDisplayable) {
    const nextDisplayableIndex = displayableItems.findIndex(
      (nextItem) => nextItem.src === item.src && nextItem.type === item.type
    );
    if (nextDisplayableIndex >= displayableItems.length - 1) {
      nextBtn.style.display = "none";
    } else {
      nextBtn.style.display = "flex";
    }
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("active");

  setTimeout(() => {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
  }, 400);
}

function nextLightboxItem() {
  if (currentLightboxIndex < lightboxItems.length - 1) {
    currentLightboxIndex++;

    while (
      currentLightboxIndex < lightboxItems.length &&
      (lightboxItems[currentLightboxIndex].type === "double-image" ||
        lightboxItems[currentLightboxIndex].type === "single-image")
    ) {
      currentLightboxIndex++;
    }

    if (currentLightboxIndex < lightboxItems.length) {
      showLightboxItem(currentLightboxIndex);
    } else {
      currentLightboxIndex = lightboxItems.length - 1;
      while (
        currentLightboxIndex >= 0 &&
        (lightboxItems[currentLightboxIndex].type === "double-image" ||
          lightboxItems[currentLightboxIndex].type === "single-image")
      ) {
        currentLightboxIndex--;
      }
      if (currentLightboxIndex >= 0) {
        showLightboxItem(currentLightboxIndex);
      }
    }
  }
}

function prevLightboxItem() {
  if (currentLightboxIndex > 0) {
    currentLightboxIndex--;

    while (
      currentLightboxIndex >= 0 &&
      (lightboxItems[currentLightboxIndex].type === "double-image" ||
        lightboxItems[currentLightboxIndex].type === "single-image")
    ) {
      currentLightboxIndex--;
    }

    if (currentLightboxIndex >= 0) {
      showLightboxItem(currentLightboxIndex);
    } else {
      currentLightboxIndex = 0;
      while (
        currentLightboxIndex < lightboxItems.length &&
        (lightboxItems[currentLightboxIndex].type === "double-image" ||
          lightboxItems[currentLightboxIndex].type === "single-image")
      ) {
        currentLightboxIndex++;
      }
      if (currentLightboxIndex < lightboxItems.length) {
        showLightboxItem(currentLightboxIndex);
      }
    }
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const closeLightboxBtn = document.getElementById("closeLightbox");
  const nextBtn = document.getElementById("nextItem");
  const prevBtn = document.getElementById("prevItem");
  const lightboxBackdrop = document.querySelector(".lightbox-backdrop");
  const shareBtn = document.getElementById("shareBtn");

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener("click", closeLightbox);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", nextLightboxItem);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", prevLightboxItem);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener("click", closeLightbox);
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      const currentItem = lightboxItems[currentLightboxIndex];
      if (currentItem && navigator.share) {
        navigator.share({
          title: currentItem.title,
          text: `Разгледайте тази снимка от Verdi Beach: ${currentItem.title}`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert("Линкът е копиран в clipboard!");
        });
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    const lightbox = document.getElementById("lightbox");
    if (lightbox && lightbox.classList.contains("active")) {
      switch (event.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          if (currentLightboxIndex < lightboxItems.length - 1) {
            nextLightboxItem();
          }
          break;
        case "ArrowLeft":
          if (currentLightboxIndex > 0) {
            prevLightboxItem();
          }
          break;
      }
    }
  });
});
