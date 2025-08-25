function initGalleryAnimation() {
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(50px) scale(0.9)";
    item.style.animation = "none";

    setTimeout(() => {
      item.style.animation = `fadeInUp 0.6s ease forwards`;
    }, index * 100);
  });
}

function initScrollAnimation() {
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

      element.style.opacity = "1";
      element.style.transform = "translateY(0) scale(1)";
      element.style.animation = "fadeInUp 0.6s ease forwards";

      setTimeout(() => {
        isAnimating = false;
        processQueue();
      }, 150);
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animationQueue.push(entry.target);
        processQueue();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item) => {
    observer.observe(item);
  });

  const animatedElements = document.querySelectorAll(".gallery-header");
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

class ModernLightbox {
  constructor() {
    this.lightbox = document.getElementById("lightbox");
    this.lightboxImage = document.getElementById("lightboxImage");
    this.lightboxVideo = document.getElementById("lightboxVideo");
    this.lightboxTitle = document.getElementById("lightboxTitle");
    this.currentIndexEl = document.getElementById("currentIndex");
    this.totalItemsEl = document.getElementById("totalItems");
    this.closeBtn = document.getElementById("closeLightbox");
    this.prevBtn = document.getElementById("prevItem");
    this.nextBtn = document.getElementById("nextItem");
    this.downloadBtn = document.getElementById("downloadBtn");
    this.shareBtn = document.getElementById("shareBtn");

    this.galleryItems = [];
    this.currentIndex = 0;
    this.isOpen = false;

    this.init();
  }

  init() {
    this.collectGalleryItems();
    this.bindEvents();
    this.updateCounter();
  }

  collectGalleryItems() {
    const items = document.querySelectorAll(".gallery-item");
    this.galleryItems = Array.from(items).map((item, index) => {
      const img = item.querySelector("img");
      const video = item.querySelector("video");
      const title =
        item.querySelector(".media-overlay h3")?.textContent || "Без заглавие";
      const isVideo = video !== null;

      item.addEventListener("click", () => this.openLightbox(index));

      return {
        src: isVideo ? video.querySelector("source").src : img.src,
        alt: isVideo ? "Видео" : img.alt,
        title: title,
        isVideo: isVideo,
      };
    });
  }

  bindEvents() {
    this.closeBtn.addEventListener("click", () => this.closeLightbox());
    this.lightbox.addEventListener("click", (e) => {
      if (
        e.target === this.lightbox ||
        e.target.classList.contains("lightbox-backdrop")
      ) {
        this.closeLightbox();
      }
    });

    this.lightbox.addEventListener("click", (e) => {
      if (e.target.closest("#prevItem")) {
        e.preventDefault();
        e.stopPropagation();
        this.previousItem();
      } else if (e.target.closest("#nextItem")) {
        e.preventDefault();
        e.stopPropagation();
        this.nextItem();
      }
    });

    this.downloadBtn.addEventListener("click", () => this.downloadCurrent());
    this.shareBtn.addEventListener("click", () => this.shareCurrent());

    document.addEventListener("keydown", (e) => {
      if (!this.isOpen) return;

      switch (e.key) {
        case "Escape":
          this.closeLightbox();
          break;
        case "ArrowLeft":
          this.previousItem();
          break;
        case "ArrowRight":
          this.nextItem();
          break;
        case " ":
          e.preventDefault();
          this.nextItem();
          break;
      }
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    this.isOpen = true;
    
    this.lightbox.classList.add("active");
    this.loadCurrentItem();

    setTimeout(() => {
      if (window.likesManager) {
        const item = this.galleryItems[this.currentIndex];
        if (item) {
          const itemId = btoa(item.src).replace(/[^a-zA-Z0-9]/g, "");
          if (!document.getElementById("lightbox-like-container")) {
            window.likesManager.setupLightboxLikeButton();
          }
          window.likesManager.updateLightboxLikeButton(itemId);
        }
      }
    }, 100);
  }

  closeLightbox() {
    this.isOpen = false;

    document.body.style.overflow = "";

    this.lightbox.classList.remove("active");

    if (this.lightboxVideo.style.display !== "none") {
      this.lightboxVideo.pause();
      this.lightboxVideo.currentTime = 0;
      this.lightboxVideo.removeAttribute("controls");
    }
  }

  loadCurrentItem() {
    const item = this.galleryItems[this.currentIndex];

    if (item.isVideo) {
      this.lightboxImage.style.display = "none";
      this.lightboxVideo.style.display = "block";
      this.lightboxVideo.setAttribute("controls", "");
      this.lightboxVideo.querySelector("source").src = item.src;
      this.lightboxVideo.load();
    } else {
      this.lightboxVideo.style.display = "none";
      this.lightboxImage.style.display = "block";
      this.lightboxImage.src = item.src;
      this.lightboxImage.alt = item.alt;
    }

    this.lightboxTitle.textContent = item.title;
    this.updateCounter();
    this.updateNavigationButtons();
    this.addLoadingAnimation();

    if (window.likesManager) {
      const itemId = btoa(item.src).replace(/[^a-zA-Z0-9]/g, "");
      window.likesManager.updateLightboxLikeButton(itemId);
    }
  }

  updateNavigationButtons() {
    if (this.currentIndex <= 0) {
      this.prevBtn.style.display = "none";
    } else {
      this.prevBtn.style.display = "flex";
    }

    if (this.currentIndex >= this.galleryItems.length - 1) {
      this.nextBtn.style.display = "none";
    } else {
      this.nextBtn.style.display = "flex";
    }
  }

  addLoadingAnimation() {
    const media =
      this.lightboxImage.style.display !== "none"
        ? this.lightboxImage
        : this.lightboxVideo;

    media.style.opacity = "0";
    media.style.transform = "scale(0.95)";
    media.style.transition = "none";

    const onLoad = () => {
      setTimeout(() => {
        media.style.transition =
          "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        media.style.opacity = "1";
        media.style.transform = "scale(1)";
      }, 50);
    };

    if (media === this.lightboxImage) {
      if (media.complete) {
        onLoad();
      } else {
        media.onload = onLoad;
      }
    } else {
      media.onloadeddata = onLoad;
    }
  }

  previousItem() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.loadCurrentItem();
    }
  }

  nextItem() {
    if (this.currentIndex < this.galleryItems.length - 1) {
      this.currentIndex++;
      this.loadCurrentItem();
    }
  }

  updateCounter() {
    this.currentIndexEl.textContent = this.currentIndex + 1;
    this.totalItemsEl.textContent = this.galleryItems.length;
  }

  downloadCurrent() {
    const item = this.galleryItems[this.currentIndex];
    const link = document.createElement("a");
    link.href = item.src;
    link.download = `verdi-beach-${this.currentIndex + 1}.${
      item.isVideo ? "mp4" : "jpg"
    }`;
    link.click();
  }

  shareCurrent() {
    const item = this.galleryItems[this.currentIndex];

    if (navigator.share) {
      navigator.share({
        title: `Verdi Beach - ${item.title}`,
        text: `Разгледайте тази снимка от Verdi Beach: ${item.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.showNotification("Линкът е копиран в клипборда!");
      });
    }
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = "gallery-notification";
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

new ModernLightbox();

initScrollAnimation();
