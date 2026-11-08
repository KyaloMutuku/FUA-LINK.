
"use strict";

// NAVIGATION

const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, {
    passive: true
});

updateHeader();

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

// CLEANER SEARCH

const searchForm = document.getElementById("cleanerSearchForm");
const searchFeedback = document.getElementById("searchFeedback");
const dateInput = document.getElementById("date");

function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

dateInput.min = getLocalDate();


searchForm.addEventListener("submit", event => {
    event.preventDefault();

    const location =
        document.getElementById("location").value.trim();

    const service =
        document.getElementById("service").value;

    if (!location || !service) {
        searchFeedback.textContent =
            "Please enter your location and select a service.";
        return;
    }

    const params = new URLSearchParams({
        location: location,
        service: service
    });

    window.location.href =
        `find-cleaner.html?${params.toString()}`;
});


/* =========================================
   SAFI LINK — ANIMATION ENGINE
   BLOCK 2
========================================= */

function initializeAnimations() {

    if (typeof gsap === "undefined") {
        console.warn("GSAP could not be loaded.");
        return;
    }

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
        return;
    }

    // Prevent CSS entrance animations from
    // conflicting with GSAP transforms.

    gsap.set(
        [".hero-content", ".search-panel"],
        { animation: "none" }
    );

    // HERO CINEMATIC SEQUENCE

    const heroTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    heroTimeline
        .from(".hero-eyebrow", {
            y: 20,
            opacity: 0,
            duration: 0.6
        })
        .from(".hero h1", {
            y: 55,
            opacity: 0,
            duration: 1
        }, "-=0.3")
        .from(".hero-description", {
            y: 25,
            opacity: 0,
            duration: 0.7
        }, "-=0.55")
        .from(".hero-actions .btn", {
            y: 20,
            opacity: 0,
            stagger: 0.12,
            duration: 0.6
        }, "-=0.4")
        .from(".hero-note", {
            opacity: 0,
            duration: 0.5
        }, "-=0.2")
        .from(".search-panel", {
            x: 55,
            opacity: 0,
            duration: 1
        }, "-=1.1");

    // SCROLL-TRIGGERED FEATURE CARDS

    if (typeof ScrollTrigger !== "undefined") {

        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".feature-card", {
            scrollTrigger: {
                trigger: ".feature-grid",
                start: "top 90%",
                once: true
            },
            y: 65,
            opacity: 0,
            duration: 0.85,
            stagger: 0.15,
            ease: "power3.out",
            clearProps: "transform"
        });

        // REVEAL FOLLOWING SECTIONS

        document.querySelectorAll(
            ".placeholder-section"
        ).forEach(section => {

            gsap.from(section.children, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    once: true
                },
                y: 35,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: "power2.out"
            });

        });
    }

    // GLASS PANEL MOUSE GLOW

    const panel = document.querySelector(
        ".search-panel"
    );

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (panel && finePointer) {

        panel.addEventListener(
            "pointermove",
            event => {

                const rect =
                    panel.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                panel.style.setProperty(
                    "--mouse-x",
                    `${x}px`
                );

                panel.style.setProperty(
                    "--mouse-y",
                    `${y}px`
                );
            }
        );
    }
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeAnimations
    );
} else {
    initializeAnimations();
}

/* =========================================
   BLOCK 3 — SERVICES INTERACTIONS
========================================= */

function initializeBlock3() {

    // Clicking a service selects that service
    // in the existing hero search form.

    document.querySelectorAll(
        ".service-info a[data-service]"
    ).forEach(link => {

        link.addEventListener("click", () => {
            const selectedService = link.dataset.service;
            const serviceInput =
                document.getElementById("service");

            if (serviceInput) {
                serviceInput.value = selectedService;
            }
        });

    });

    // Respect reduced-motion preferences.

    if (window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches) {
        return;
    }

    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Animate each service card as it enters view.

    gsap.utils.toArray(".service-card").forEach(card => {

        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 92%",
                once: true
            },
            y: 55,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "transform"
        });

    });

    // Animate the Why SAFI LINK section.

    gsap.from(".why-visual", {
        scrollTrigger: {
            trigger: ".why-section",
            start: "top 80%",
            once: true
        },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".why-content > *", {
        scrollTrigger: {
            trigger: ".why-content",
            start: "top 85%",
            once: true
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out"
    });
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeBlock3
    );
} else {
    initializeBlock3();
}

