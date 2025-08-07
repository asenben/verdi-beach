class LikesManager {
  constructor() {
    this.init();
  }

  init() {
    setTimeout(() => {
      this.setupLightboxLikeButton();
    }, 500);

    setTimeout(() => {
      this.attachGalleryLikeEvents();
    }, 800);
  }

  getCurrentItemId() {
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxVideo = document.getElementById("lightboxVideo");

    let currentSrc = "";
    if (lightboxImage && lightboxImage.style.display !== "none" && lightboxImage.src) {
      currentSrc = lightboxImage.src;
    } else if (lightboxVideo && lightboxVideo.style.display !== "none") {
      const source = lightboxVideo.querySelector("source");
      if (source && source.src) {
        currentSrc = source.src;
      }
    }

    if (currentSrc) {
      return btoa(currentSrc).replace(/[^a-zA-Z0-9]/g, "");
    }
    return null;
  }

  setupLightboxLikeButton() {
    const lightboxActions = document.querySelector(".lightbox-actions");
    if (!lightboxActions) {
      setTimeout(() => this.setupLightboxLikeButton(), 1000);
      return;
    }

    let likeButtonContainer = document.getElementById("lightbox-like-container");
    if (likeButtonContainer) return;

    likeButtonContainer = document.createElement("div");
    likeButtonContainer.id = "lightbox-like-container";

    const itemId = this.getCurrentItemId() || "temp";

    likeButtonContainer.innerHTML = `
      <button class="lightbox-like-btn" data-item-id="${itemId}">
        <i class="fa-regular fa-heart"></i>
      </button>
    `;

    const shareBtn = lightboxActions.querySelector("#shareBtn");
    if (shareBtn) {
      lightboxActions.insertBefore(likeButtonContainer, shareBtn);
    } else {
      lightboxActions.appendChild(likeButtonContainer);
    }

    this.attachLikeButtonEvent();
  }

  attachLikeButtonEvent() {
    const container = document.getElementById("lightbox-like-container");
    if (!container) return;

    const likeButton = container.querySelector(".lightbox-like-btn");
    if (likeButton) {
      likeButton.replaceWith(likeButton.cloneNode(true));
      const newLikeButton = container.querySelector(".lightbox-like-btn");

      newLikeButton.addEventListener("click", (e) => {
        const itemId = newLikeButton.getAttribute("data-item-id");
        if (itemId && itemId !== "temp") {
          this.handleLikeClick(itemId, e);
        }
      });
    }
  }

  async handleLikeClick(itemId, event) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const response = await fetch(`/api/gallery/like/${itemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Failed to like");

      const data = await response.json();
      const newLikeCount = data.likes;

      this.updateLightboxLikeButton(itemId);
      this.updateSingleGalleryCounter(itemId, newLikeCount);
      this.showLikeAnimation(event.target);
      this.showNotification("Харесано!", "info");

    } catch (error) {
      console.error("Error liking item:", error);
      this.showNotification("Грешка при харесване", "error");
    }
  }

  updateLightboxLikeButton(itemId) {
    const container = document.getElementById("lightbox-like-container");
    if (!container || !itemId) return;

    container.innerHTML = `
      <button class="lightbox-like-btn liked" data-item-id="${itemId}">
        <i class="fa-solid fa-heart"></i>
      </button>
    `;

    this.attachLikeButtonEvent();
  }

  updateSingleGalleryCounter(itemId, newCount) {
    const likesCounter = document.querySelector(`.likes-counter[data-item-id="${itemId}"]`);
    if (!likesCounter) return;

    const countSpan = likesCounter.querySelector(".like-count");
    if (countSpan) {
      countSpan.textContent = newCount;
    }

    const heartIcon = likesCounter.querySelector("i");
    if (heartIcon) {
      heartIcon.classList.remove("fa-regular");
      heartIcon.classList.add("fa-solid");
    }
  }

  attachGalleryLikeEvents() {
    const counters = document.querySelectorAll(".likes-counter");

    counters.forEach(counter => {
      counter.addEventListener("click", (e) => {
        const itemId = counter.getAttribute("data-item-id");
        if (itemId) {
          this.handleLikeClick(itemId, e);
        }
      });
    });
  }

  showLikeAnimation(target) {
    const button = target.closest(".lightbox-like-btn") || target.closest(".likes-counter");
    if (!button) return;

    const heart = document.createElement("div");
    heart.className = "like-animation";
    heart.innerHTML = `<i class="fa-solid fa-heart" style="color: #ff4757;"></i>`;

    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + rect.width / 2 + "px";
    heart.style.top = rect.top - 10 + "px";

    document.body.appendChild(heart);

    requestAnimationFrame(() => heart.classList.add("float"));
    setTimeout(() => heart.remove(), 1000);
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    requestAnimationFrame(() => notification.classList.add("show"));

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
}

let likesManager;

setTimeout(() => {
  likesManager = new LikesManager();
  window.likesManager = likesManager;
}, 100);
