
          // Typewriter effect for hero title
          const titles = [
            "Elite Legal Representation",
            "Your Justice, My Mission",
            "Trusted Criminal & Civil Lawyer",
            "Expert in Legal Advisory",
          ];

          let index = 0;
          let charIndex = 0;
          let isDeleting = false;
          const typeSpeed = 100;
          const eraseSpeed = 50;
          const delay = 1500;

          const typewriter = document.getElementById("typewriter");

          function type() {
            const currentText = titles[index];
            if (isDeleting) {
              typewriter.textContent = currentText.substring(0, charIndex--);
              if (charIndex < 0) {
                isDeleting = false;
                index = (index + 1) % titles.length;
                setTimeout(type, 400);
              } else {
                setTimeout(type, eraseSpeed);
              }
            } else {
              typewriter.textContent = currentText.substring(0, charIndex++);
              if (charIndex > currentText.length) {
                isDeleting = true;
                setTimeout(type, delay);
              } else {
                setTimeout(type, typeSpeed);
              }
            }
          }

          document.addEventListener("DOMContentLoaded", () => {
            setTimeout(type, 600);
          });

          // Services Slider Implementation
          class ServicesSlider {
            constructor() {
              this.slider = document.getElementById("servicesSlider");
              this.prevBtn = document.getElementById("prevBtn");
              this.nextBtn = document.getElementById("nextBtn");
              this.dotsContainer = document.getElementById("sliderDots");
              this.originalCards = Array.from(
                this.slider.querySelectorAll(".service-card")
              );
              this.currentSlide = 0;
              this.totalCards = this.originalCards.length;
              this.cardsPerView = this.getCardsPerView();
              this.isTransitioning = false;

              this.init();
            }

            getCardsPerView() {
              if (window.innerWidth >= 1024) return 4; // Desktop
              if (window.innerWidth >= 768) return 3; // Tablet
              return 2; // Mobile
            }

            init() {
              this.createInfiniteLoop();
              this.createDots();
              this.bindEvents();
              this.updateSlider();

              // Handle window resize
              window.addEventListener("resize", () => {
                this.handleResize();
              });
            }

            createInfiniteLoop() {
              // Clear existing cards
              this.slider.innerHTML = "";

              // Create enough clones for smooth infinite loop
              const totalClones = this.cardsPerView * 3; // Show current + next + prev sets
              const clonedCards = [];

              // Create clones by repeating the original cards
              for (let i = 0; i < totalClones; i++) {
                const cardIndex = i % this.totalCards;
                const clonedCard =
                  this.originalCards[cardIndex].cloneNode(true);
                clonedCards.push(clonedCard);
                this.slider.appendChild(clonedCard);
              }

              // Set initial position to show the "first" set (which is actually the middle set)
              this.currentSlide = this.cardsPerView;
              this.slider.style.transform = `translateX(-${
                (100 / this.cardsPerView) * this.currentSlide
              }%)`;
            }

            createDots() {
              this.dotsContainer.innerHTML = "";

              // Create dots based on original cards, not clones
              for (let i = 0; i < this.totalCards; i++) {
                const dot = document.createElement("div");
                dot.classList.add("dot");
                if (i === 0) dot.classList.add("active");
                dot.addEventListener("click", () => this.goToSlide(i));
                this.dotsContainer.appendChild(dot);
              }
            }

            bindEvents() {
              this.prevBtn.addEventListener("click", () =>
                this.previousSlide()
              );
              this.nextBtn.addEventListener("click", () => this.nextSlide());

              // Touch/swipe support
              let startX = 0;
              let endX = 0;

              this.slider.addEventListener("touchstart", (e) => {
                startX = e.touches[0].clientX;
              });

              this.slider.addEventListener("touchend", (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe(startX, endX);
              });

              // Listen for transition end to handle infinite loop reset
              this.slider.addEventListener("transitionend", () => {
                this.handleInfiniteLoop();
              });
            }

            handleSwipe(startX, endX) {
              const difference = startX - endX;
              const threshold = 50;

              if (Math.abs(difference) > threshold && !this.isTransitioning) {
                if (difference > 0) {
                  this.nextSlide();
                } else {
                  this.previousSlide();
                }
              }
            }

            nextSlide() {
              if (this.isTransitioning) return;

              this.isTransitioning = true;
              this.currentSlide++;
              this.updateSliderPosition();
              this.updateDots("next");
            }

            previousSlide() {
              if (this.isTransitioning) return;

              this.isTransitioning = true;
              this.currentSlide--;
              this.updateSliderPosition();
              this.updateDots("prev");
            }

            goToSlide(slideIndex) {
              if (this.isTransitioning) return;

              this.isTransitioning = true;
              // Calculate the closest clone of the target slide
              const currentLogicalSlide =
                (this.currentSlide - this.cardsPerView) % this.totalCards;
              const targetSlide = slideIndex;
              const diff = targetSlide - currentLogicalSlide;

              this.currentSlide += diff;
              this.updateSliderPosition();
              this.updateDots("direct", slideIndex);
            }

            updateSliderPosition() {
              const translateX = -(
                (100 / this.cardsPerView) *
                this.currentSlide
              );
              this.slider.style.transform = `translateX(${translateX}%)`;
            }

            updateDots(direction, targetIndex = null) {
              const dots = this.dotsContainer.querySelectorAll(".dot");
              let activeIndex;

              if (targetIndex !== null) {
                activeIndex = targetIndex;
              } else {
                // Calculate logical position based on original cards
                const logicalSlide =
                  (this.currentSlide - this.cardsPerView) % this.totalCards;
                activeIndex =
                  logicalSlide < 0
                    ? this.totalCards + logicalSlide
                    : logicalSlide;
              }

              dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === activeIndex);
              });
            }

            handleInfiniteLoop() {
              this.isTransitioning = false;

              // Check if we need to reset position for infinite loop
              const totalClones = this.cardsPerView * 3;

              if (this.currentSlide >= totalClones - this.cardsPerView) {
                // We're at the end, jump back to the beginning (without animation)
                this.slider.style.transition = "none";
                this.currentSlide = this.cardsPerView;
                this.updateSliderPosition();
                // Force reflow and restore transition
                this.slider.offsetHeight;
                this.slider.style.transition = "transform 0.5s ease";
              } else if (this.currentSlide <= 0) {
                // We're at the beginning, jump to the end (without animation)
                this.slider.style.transition = "none";
                this.currentSlide = totalClones - this.cardsPerView * 2;
                this.updateSliderPosition();
                // Force reflow and restore transition
                this.slider.offsetHeight;
                this.slider.style.transition = "transform 0.5s ease";
              }
            }

            handleResize() {
              const oldCardsPerView = this.cardsPerView;
              this.cardsPerView = this.getCardsPerView();

              if (oldCardsPerView !== this.cardsPerView) {
                // Recreate infinite loop with new cards per view
                this.createInfiniteLoop();
                this.createDots();
                this.updateSlider();
              }
            }

            updateSlider() {
              this.updateDots("direct", 0);
            }
          }

          // Initialize services slider
          new ServicesSlider();

          // Header scroll effect
          window.addEventListener("scroll", () => {
            const header = document.querySelector("header");
            if (window.scrollY > 100) {
              header.style.background = "rgba(10, 10, 10, 0.98)";
              header.style.borderBottom = "1px solid rgba(212, 175, 55, 0.3)";
            } else {
              header.style.background = "rgba(10, 10, 10, 0.95)";
              header.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
            }
          });

          // Smooth scrolling for anchor links
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

          // Intersection Observer for animations
          const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -100px 0px",
          };

          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.style.animationPlayState = "running";
              }
            });
          }, observerOptions);

          // Observe animated elements
          document.querySelectorAll('[style*="animation"]').forEach((el) => {
            el.style.animationPlayState = "paused";
            observer.observe(el);
          });

          // Parallax effect for floating cards
          window.addEventListener("scroll", () => {
            const scrolled = window.pageYOffset;
            const parallaxElements =
              document.querySelectorAll(".floating-card");

            parallaxElements.forEach((element, index) => {
              const speed = 0.1 + index * 0.05;
              const yPos = -(scrolled * speed);
              element.style.transform = `translateY(${yPos}px)`;
            });
          });
 



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
              this.container.style.display = "flex";
              this.container.style.transition =
                "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          
              this.slides.forEach((slide) => {
                slide.style.flex = `0 0 ${100 / this.slidesPerView}%`;
              });
          
              this.updateSlider();
            }
          
            updateSlider() {
              const maxIndex = this.totalSlides - this.slidesPerView;
          
              if (this.currentIndex > maxIndex) {
                this.currentIndex = 0;
              } else if (this.currentIndex < 0) {
                this.currentIndex = maxIndex;
              }
          
              const slideWidth = 100 / this.slidesPerView;
              const translateX = -(this.currentIndex * slideWidth);
          
              this.container.style.transform = `translateX(${translateX}%)`;
              this.updateDots();
            }
          
            nextSlide() {
              if (this.isTransitioning) return;
          
              this.isTransitioning = true;
              this.currentIndex++;
          
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
          
              const totalDots = Math.max(1, this.totalSlides - this.slidesPerView + 1);
          
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
              }, 1000);
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
              const prevBtn = document.getElementById("prevBtn");
              const nextBtn = document.getElementById("nextBtn");
          
              if (prevBtn && nextBtn) {
                prevBtn.addEventListener("click", (e) => {
                  e.preventDefault();
                  this.prevSlide();
                  this.restartAutoPlay();
                });
          
                nextBtn.addEventListener("click", (e) => {
                  e.preventDefault();
                  this.nextSlide();
                  this.restartAutoPlay();
                });
              }
          
              this.container.addEventListener("mouseenter", () => {
                this.stopAutoPlay();
              });
          
              this.container.addEventListener("mouseleave", () => {
                this.startAutoPlay();
              });
          
              window.addEventListener("resize", () => {
                const newSlidesPerView = this.getSlidesPerView();
                if (newSlidesPerView !== this.slidesPerView) {
                  this.slidesPerView = newSlidesPerView;
                  this.handleResize();
                }
              });
          
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
              this.slidesPerView = this.getSlidesPerView();
              const maxIndex = this.totalSlides - this.slidesPerView;
              if (this.currentIndex > maxIndex) {
                this.currentIndex = Math.max(0, maxIndex);
              }
          
              this.slides.forEach((slide) => {
                slide.style.flex = `0 0 ${100 / this.slidesPerView}%`;
              });
          
              this.createDots();
              this.updateSlider();
            }
          }
          
          // Initialize slider when DOM is ready
          document.addEventListener("DOMContentLoaded", () => {
            new TestimonialSlider();
          });
          
          // Footer interaction enhancements
          document.addEventListener("DOMContentLoaded", () => {
            const footerLinks = document.querySelectorAll(
              ".footer-links a, .footer-bottom-links a"
            );
            footerLinks.forEach((link) => {
              link.addEventListener("click", (e) => {
                e.preventDefault();
                // Add smooth scroll logic here if needed
              });
            });
          
            const socialLinks = document.querySelectorAll(".social-link");
            socialLinks.forEach((link) => {
              link.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("Social link clicked:", link.getAttribute("aria-label"));
              });
            });
          
            const contactItems = document.querySelectorAll(".contact-item");
            contactItems.forEach((item) => {
              if (
                item.href &&
                (item.href.includes("tel:") || item.href.includes("mailto:"))
              ) {
                item.addEventListener("click", () => {
                  console.log("Contact clicked:", item.href);
                });
              }
            });
          });
          
          // Add animation on scroll for testimonialsbp - Unique Observer
          const testimonialObserverOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
          };
          
          const testimonialObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
              }
            });
          }, testimonialObserverOptions);
          
          document.addEventListener("DOMContentLoaded", () => {
            const testimonialCards = document.querySelectorAll(".testimonialbc-card");
            testimonialCards.forEach((card) => {
              card.style.opacity = "0";
              card.style.transform = "translateY(30px)";
              card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
              testimonialObserver.observe(card);
            });
          });
          