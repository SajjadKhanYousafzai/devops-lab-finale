const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const yearNode = document.getElementById("current-year");
const revealNodes = document.querySelectorAll(".reveal");
const countNodes = document.querySelectorAll("[data-count]");
const terminalLine = document.querySelector("[data-terminal-line]");
const navAnchors = document.querySelectorAll(".nav-links a");

const terminalMessages = [
  "_ provisioning secure runners",
  "_ checks passed across the pipeline",
  "_ telemetry streaming in real time",
  "_ release candidate marked stable"
];

yearNode.textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navAnchors.forEach((anchor) => {
  anchor.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px"
  }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.count || 0);
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(target * progress);
        element.textContent = `${value}${target >= 90 ? "%" : "+"}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(element);
    });
  },
  {
    threshold: 0.55
  }
);

countNodes.forEach((node) => countObserver.observe(node));

let terminalIndex = 0;

const rotateTerminal = () => {
  if (!terminalLine) {
    return;
  }

  terminalLine.textContent = terminalMessages[terminalIndex];
  terminalIndex = (terminalIndex + 1) % terminalMessages.length;
};

rotateTerminal();
setInterval(rotateTerminal, 2200);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const currentId = entry.target.getAttribute("id");

      navAnchors.forEach((anchor) => {
        const isActive = anchor.getAttribute("href") === `#${currentId}`;
        anchor.classList.toggle("active", isActive);
      });
    });
  },
  {
    threshold: 0.3
  }
);

document.querySelectorAll("section[id]").forEach((section) => sectionObserver.observe(section));

document.addEventListener("click", (event) => {
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});