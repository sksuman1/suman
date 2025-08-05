class TestimonialSlider {
    constructor() {
      this.container = document.getElementById("testimonialContainer");
      this.slides = document.querySelectorAll(".testimonialbc-slide");
      this.totalSlides = this.slides.length;
      this.currentIndex = 0;
      this.slidesPerView = this.getSlidesPerView();
      this.autoPlayInterval = null;
      this.isTransitioning = false;
    
      // Initialize sliderbp
      this.setupSlider();
      this.createDots();
      this.addEventListeners();
      this.startAutoPlay();
    }
    
    getSlidesPerView() {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      return 3;
    }
    
    setupSlider() {
      // Set up container for sliding
      this.container.style.display = "flex";
      this.container.style.transition =
        "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    
      // Set slide widths based on slidesPerView
      this.slides.forEach((slide) => {
        slide.style.flex = `0 0 ${100 / this.slidesPerView}%`;
      });
    
      this.updateSlider();
    }
    
    updateSlider() {
      const maxIndex = this.totalSlides - this.slidesPerView;
    
      // Ensure currentIndex is within bounds
      if (this.currentIndex > maxIndex) {
        this.currentIndex = 0; // Loop to beginning
      } else if (this.currentIndex < 0) {
        this.currentIndex = maxIndex; // Loop to end
      }
    
      // Calculate translateX - move by one slide width at a time
      const slideWidth = 100 / this.slidesPerView;
      const translateX = -(this.currentIndex * slideWidth);
    
      this.container.style.transform = `translateX(${translateX}%)`;
      this.updateDots();
    }
    
    nextSlide() {
      if (this.isTransitioning) return;
    
      this.isTransitioning = true;
      this.currentIndex++;
    
      // Handle looping
      const maxIndex = this.totalSlides - this.slidesPerView;
      if (this.currentIndex > maxIndex) {
        this.currentIndex = 0;
      }
    
      this.updateSlider();
    
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    }
    
    prevSlide() {
      if (this.isTransitioning) return;
    
      this.isTransitioning = true;
      this.currentIndex--;
    
      // Handle looping
      const maxIndex = this.totalSlides - this.slidesPerView;
      if (this.currentIndex < 0) {
        this.currentIndex = maxIndex;
      }
    
      this.updateSlider();
    
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    }
    
    goToSlide(index) {
      if (this.isTransitioning) return;
    
      this.currentIndex = index;
      this.updateSlider();
    }
    
    createDots() {
      const dotsContainer = document.getElementById("sliderDots");
      dotsContainer.innerHTML = "";
    
      const totalDots = Math.max(
        1,
        this.totalSlides - this.slidesPerView + 1
      );
    
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
    
        dot.addEventListener("click", () => {
          this.goToSlide(i);
          this.restartAutoPlay();
        });
    
        dotsContainer.appendChild(dot);
      }
    }
    
    updateDots() {
      const dots = document.querySelectorAll(".dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === this.currentIndex);
      });
    }
    
    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, 4000);
    }
    
    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    }
    
    restartAutoPlay() {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
    
    addEventListeners() {
      // Navigation buttons - Fixed event listeners
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
    
      if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", (e) => {
          e.preventDefault();
          console.log("Previous button clicked"); // Debug log
          this.prevSlide();
          this.restartAutoPlay();
        });
    
        nextBtn.addEventListener("click", (e) => {
          e.preventDefault();
          console.log("Next button clicked"); // Debug log
          this.nextSlide();
          this.restartAutoPlay();
        });
      }
    
      // Pause on hover
      this.container.addEventListener("mouseenter", () => {
        this.stopAutoPlay();
      });
    
      this.container.addEventListener("mouseleave", () => {
        this.startAutoPlay();
      });
    
      // Handle window resize
      window.addEventListener("resize", () => {
        const newSlidesPerView = this.getSlidesPerView();
        if (newSlidesPerView !== this.slidesPerView) {
          this.slidesPerView = newSlidesPerView;
          this.handleResize();
        }
      });
    
      // Touch events for mobile
      let startX = 0;
      let isDragging = false;
    
      this.container.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        this.stopAutoPlay();
      });
    
      this.container.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
      });
    
      this.container.addEventListener("touchend", (e) => {
        if (!isDragging) return;
    
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
    
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            this.nextSlide();
          } else {
            this.prevSlide();
          }
        }
    
        isDragging = false;
        this.restartAutoPlay();
      });
    }
    
    handleResize() {
      // Update slides per view
      this.slidesPerView = this.getSlidesPerView();
    
      // Reset current index to prevent out of bounds
      const maxIndex = this.totalSlides - this.slidesPerView;
      if (this.currentIndex > maxIndex) {
        this.currentIndex = Math.max(0, maxIndex);
      }
    
      // Update slide widths for new screen size
      this.slides.forEach((slide) => {
        slide.style.flex = `0 0 ${100 / this.slidesPerView}%`;
      });
    
      // Recreate dots for new slides per view
      this.createDots();
    
      // Update sliderbp position
      this.updateSlider();
    }
    }
    
    // Initialize sliderbp when DOM is loaded
    document.addEventListener("DOMContentLoaded", () => {
    new TestimonialSlider();
    });
    
    // Footer interactions
    document.addEventListener("DOMContentLoaded", () => {
    // Smooth scroll for footer links
    const footerLinks = document.querySelectorAll(
      ".footer-links a, .footer-bottom-links a"
    );
    footerLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        // Add smooth scroll behavior here if needed
      });
    });
    
    // Social media link tracking
    const socialLinks = document.querySelectorAll(".social-link");
    socialLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        // Add analytics tracking here if needed
        console.log(
          "Social link clicked:",
          link.getAttribute("aria-label")
        );
      });
    });
    
    // Contact item interactions
    const contactItems = document.querySelectorAll(".contact-item");
    contactItems.forEach((item) => {
      if (
        item.href &&
        (item.href.includes("tel:") || item.href.includes("mailto:"))
      ) {
        item.addEventListener("click", () => {
          // Add click tracking here if needed
          console.log("Contact clicked:", item.href);
        });
      }
    });
    });
    
    // Add animation on scroll for testimonialsbp
    const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    };
    
    const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
    }, observerOptions);
    
    // Observe testimonialbc cards
    document.addEventListener("DOMContentLoaded", () => {
    const testimonialCards =
      document.querySelectorAll(".testimonialbc-card");
    testimonialCards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(card);
    });
    });
    