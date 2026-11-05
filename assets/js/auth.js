
"use strict";

/* FUA LINK — BLOCK 6 FRONTEND AUTH LOGIC */

const authMessage = document.getElementById("authMessage");

function showMessage(text, type = "error") {
    if (!authMessage) return;

    authMessage.textContent = text;
    authMessage.className = `auth-message ${type}`;
}

// Show and hide password fields.

document.querySelectorAll("[data-toggle-password]")
    .forEach(button => {
        button.addEventListener("click", () => {
            const input = document.getElementById(
                button.dataset.togglePassword
            );

            if (!input) return;

            const visible = input.type === "password";

            input.type = visible ? "text" : "password";
            button.textContent = visible ? "Hide" : "Show";
            button.setAttribute(
                "aria-label",
                visible ? "Hide password" : "Show password"
            );
            button.setAttribute(
                "aria-pressed",
                String(visible)
            );
        });
    });

// Frontend registration validation.

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", event => {
        event.preventDefault();

        const firstName = document.getElementById("firstName")
            .value.trim();
        const lastName = document.getElementById("lastName")
            .value.trim();
        const email = document.getElementById("email");
        const phone = document.getElementById("phone")
            .value.replace(/[\s-]/g, "");
        const accountType = document.getElementById("accountType")
            .value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById(
            "confirmPassword"
        ).value;
        const agreeTerms = document.getElementById("agreeTerms")
            .checked;

        if (!firstName || !lastName) {
            showMessage("Please enter your full name.");
            return;
        }

        if (!email.validity.valid) {
            showMessage("Please enter a valid email address.");
            return;
        }

        if (!/^(?:\+254|0)[17]\d{8}$/.test(phone)) {
            showMessage("Enter a valid Kenyan phone number.");
            return;
        }

        if (!["customer", "cleaner"].includes(accountType)) {
            showMessage("Please select an account type.");
            return;
        }

        if (password.length < 8) {
            showMessage("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Your passwords do not match.");
            return;
        }

        if (!agreeTerms) {
            showMessage("Please accept the terms to continue.");
            return;
        }

        showMessage(
            "Form validated successfully. Account creation " +
            "will be enabled after backend integration.",
            "info"
        );
    });
}

// Frontend login validation.

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail");
        const password = document.getElementById(
            "loginPassword"
        ).value;

        if (!email.validity.valid) {
            showMessage("Please enter a valid email address.");
            return;
        }

        if (!password) {
            showMessage("Please enter your password.");
            return;
        }

        showMessage(
            "Login form validated. Authentication " +
            "will be enabled after backend integration.",
            "info"
        );
    });
}

// Forgot-password placeholder.

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {
    forgotPassword.addEventListener("click", event => {
        event.preventDefault();

        
if (accountType === "cleaner") {
    const draft = buildProfessionalDraft({
        firstName,
        lastName,
        email: email.value.trim(),
        phone
    });

    if (!draft) {
        return;
    }

    try {
        localStorage.setItem(
            "fuaWorkerOnboardingDraft",
            JSON.stringify(draft)
        );

        showMessage(
            "Professional profile draft saved in this browser. " +
            "Your account has not been created or verified.",
            "info"
        );
    } catch (error) {
        showMessage(
            "Unable to save your draft in this browser. " +
            "Check your storage settings and try again."
        );
    }

    return;
}

showMessage(
    "Customer form validated successfully. " +
    "Account creation requires backend integration.",
    "info"
);

    });
}

/* ==========================================
   FUA LINK — BLOCK 16
   PROFESSIONAL REGISTRATION FIELDS
   ========================================== */

const professionalFields =
    document.getElementById("professionalFields");

const accountTypeSelect =
    document.getElementById("accountType");

const workerServiceOptions =
    document.getElementById("workerServiceOptions");

const workerServiceCatalog = {
    home: {
        label: "Home Cleaning",
        unit: "starting service rate"
    },
    office: {
        label: "Office Cleaning",
        unit: "starting service rate"
    },
    deep: {
        label: "Deep Cleaning",
        unit: "starting service rate"
    },
    vehicle: {
        label: "Vehicle Cleaning",
        unit: "starting service rate"
    },
    laundry: {
        label: "Laundry Services",
        unit: "per standard clothing item"
    },
    commercial: {
        label: "Shop & Restaurant Cleaning",
        unit: "starting service rate"
    },
    gardening: {
        label: "Gardening & Outdoor Care",
        unit: "starting service rate"
    }
};

function renderWorkerServices() {
    if (!workerServiceOptions) return;

    workerServiceOptions.replaceChildren();

    Object.entries(workerServiceCatalog).forEach(
        ([serviceId, service]) => {

            const card = document.createElement("div");
            card.className = "worker-service-option";

            const label = document.createElement("label");
            label.className = "worker-service-label";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = serviceId;
            checkbox.className = "worker-service-check";

            const name = document.createElement("span");
            name.textContent = service.label;

            label.append(checkbox, name);

            const priceWrapper = document.createElement("div");
            priceWrapper.className = "worker-price-wrapper";
            priceWrapper.hidden = true;

            const priceLabel = document.createElement("label");
            priceLabel.textContent =
                `Price (KSh) — ${service.unit}`;

            const price = document.createElement("input");
            price.type = "number";
            price.min = "1";
            price.max = "10000000";
            price.step = "1";
            price.placeholder = "Enter your rate";
            price.className = "worker-service-rate";

            priceWrapper.append(priceLabel, price);

            checkbox.addEventListener("change", () => {
                priceWrapper.hidden = !checkbox.checked;
                price.required = checkbox.checked;

                if (!checkbox.checked) {
                    price.value = "";
                }
            });

            card.append(label, priceWrapper);
            workerServiceOptions.appendChild(card);
        }
    );
}

function toggleProfessionalFields() {
    if (!professionalFields || !accountTypeSelect) {
        return;
    }

    const isCleaner =
        accountTypeSelect.value === "cleaner";

    professionalFields.hidden = !isCleaner;

    professionalFields
        .querySelectorAll(
            "#workerLocation, #workerExperience, " +
            "#workerSpecialty, #workerBio"
        )
        .forEach(field => {
            field.required = isCleaner;
        });

    professionalFields
        .querySelectorAll(".worker-service-rate")
        .forEach(input => {
            const card = input.closest(
                ".worker-service-option"
            );

            const checkbox = card?.querySelector(
                ".worker-service-check"
            );

            input.required =
                isCleaner && Boolean(checkbox?.checked);
        });
}

function buildProfessionalDraft(personal) {
    const location =
        document.getElementById("workerLocation")
            .value.trim();

    const experienceField =
        document.getElementById("workerExperience");

    const specialty =
        document.getElementById("workerSpecialty")
            .value.trim();

    const bio =
        document.getElementById("workerBio")
            .value.trim();

    if (
        !location ||
        experienceField.value === "" ||
        !specialty ||
        !bio
    ) {
        showMessage(
            "Please complete all professional information."
        );
        return null;
    }

    const experience = Number(experienceField.value);

    if (
        !Number.isInteger(experience) ||
        experience < 0 ||
        experience > 60
    ) {
        showMessage(
            "Experience must be between 0 and 60 years."
        );
        return null;
    }

    const selectedServices = [];
    const servicePrices = {};

    const cards = workerServiceOptions.querySelectorAll(
        ".worker-service-option"
    );

    for (const card of cards) {
        const checkbox = card.querySelector(
            ".worker-service-check"
        );

        if (!checkbox.checked) continue;

        const serviceId = checkbox.value;
        const priceInput = card.querySelector(
            ".worker-service-rate"
        );

        const rate = Number(priceInput.value);

        if (
            !priceInput.value ||
            !Number.isInteger(rate) ||
            rate < 1 ||
            rate > 10000000
        ) {
            showMessage(
                "Enter a valid whole-number price " +
                "for every selected service."
            );
            return null;
        }

        selectedServices.push(serviceId);
        servicePrices[serviceId] = rate;
    }

    if (selectedServices.length === 0) {
        showMessage(
            "Select at least one cleaning service."
        );
        return null;
    }

    // Never store passwords in localStorage.
    // This is a profile draft, not an account.

    return {
        draftId: `draft-${Date.now()}`,
        name: `${personal.firstName} ${personal.lastName}`,
        email: personal.email,
        phone: personal.phone,
        accountType: "cleaner",
        location,
        experience,
        yearsExperience: experience,
        specialty,
        bio,
        services: selectedServices,
        servicePrices,
        status: "offline",
        verified: false,
        published: false,
        demo: true,
        createdAt: new Date().toISOString()
    };
}

if (accountTypeSelect) {
    renderWorkerServices();

    accountTypeSelect.addEventListener(
        "change",
        toggleProfessionalFields
    );

    toggleProfessionalFields();
}
