   // Initialize AOS
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
      });

      document.addEventListener("DOMContentLoaded", function () {
        // Typed.js feature text
        new Typed("#typed-features", {
          strings: [
            "Premium cotton fabrics.",
            "On-time global deliveries.",
            "Consistent shade and hand-feel.",
            "Smart, data-driven production.",
          ],
          typeSpeed: 45,
          backSpeed: 25,
          backDelay: 1600,
          loop: true,
        });

        // Current year
        document.getElementById("year").textContent = new Date().getFullYear();

        // Achievement counter animation
        function animateCounter() {
          const counters = document.querySelectorAll(".achievement-number");
          const speed = 200;

          counters.forEach((counter) => {
            const updateCount = () => {
              const target = +counter.getAttribute("data-count");
              const count = +counter.innerText;
              const inc = target / speed;

              if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 10);
              } else {
                counter.innerText = target;
              }
            };

            updateCount();
          });
        }

        // Start counter animation when section is in view
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animateCounter();
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 }
        );

        const achievementSection = document.querySelector(
          ".achievement-section"
        );
        if (achievementSection) {
          observer.observe(achievementSection);
        }

        // Scrollspy for summary sub navbar
        const subNavLinks = document.querySelectorAll(
          ".summary-subnav .nav-link"
        );
        const sectionIds = Array.from(subNavLinks)
          .map((link) => link.getAttribute("href"))
          .filter((href) => href && href.startsWith("#"));

        function onScrollSpy() {
          const scrollPos = window.scrollY || window.pageYOffset;
          let currentId = "#summary";

          sectionIds.forEach((id) => {
            const section = document.querySelector(id);
            if (!section) return;
            const offsetTop =
              section.getBoundingClientRect().top + window.pageYOffset - 130;
            if (scrollPos >= offsetTop) {
              currentId = id;
            }
          });

          subNavLinks.forEach((link) => {
            if (link.getAttribute("href") === currentId) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }

        window.addEventListener("scroll", onScrollSpy);
        onScrollSpy(); // initial
      });

      // Scroll behavior: hide main nav after hero, show before hero
      $(window).on("scroll", function () {
        var scrollTop = $(this).scrollTop();
        var heroHeight = $("#hero").outerHeight() || 300;

        if (scrollTop > heroHeight - 80) {
          $(".main-nav").addClass("nav-hidden");
        } else {
          $(".main-nav").removeClass("nav-hidden");
        }

        // Add scrolled class for navbar background
        if (scrollTop > 50) {
          $(".main-nav").addClass("scrolled");
        } else {
          $(".main-nav").removeClass("scrolled");
        }
      });

      // Smooth scroll for internal links (main nav + sub nav)
      $(document).on("click", 'a[href^="#"]', function (e) {
        var target = $($(this).attr("href"));
        if (target.length) {
          e.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top - 80,
            },
            500
          );
        }
      });