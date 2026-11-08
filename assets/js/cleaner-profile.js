
"use strict";

/* ==========================================
   SAFI LINK — BLOCK 15
   PROFESSIONAL CLEANER PROFILE
   ========================================== */

const cleaners = window.SAFI_CLEANERS || [];
const services = window.SAFI_SERVICES || {};

const params = new URLSearchParams(
    window.location.search
);

const cleanerId = params.get("id");

if (!cleanerId) {
    window.location.replace("find-cleaner.html");
}

const cleaner = cleaners.find(
    item => String(item.id) === String(cleanerId)
);

const layout = document.getElementById("profileLayout");
const errorPanel = document.getElementById("profileError");

function formatPrice(amount) {
    return `KSh ${Math.round(amount).toLocaleString("en-KE")}`;
}

function getServiceRate(serviceId) {
    const rate = Number(
        cleaner?.servicePrices?.[serviceId]
    );

    if (Number.isFinite(rate) && rate > 0) {
        return rate;
    }

    return Number(cleaner?.price) || 0;
}

function getRateDescription(serviceId) {
    return serviceId === "laundry"
        ? "per standard clothing item"
        : "starting price";
}

function setProfileText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

if (!cleaner) {
    if (errorPanel) {
        errorPanel.hidden = false;
    }

    if (layout) {
        layout.hidden = true;
    }
} else {
    if (errorPanel) {
        errorPanel.hidden = true;
    }

    if (layout) {
        layout.hidden = false;
    }

    document.title = `${cleaner.name} | SAFI LINK`;

    setProfileText("cleanerName", cleaner.name);

    setProfileText(
        "cleanerLocation",
        `📍 ${cleaner.location}`
    );

    setProfileText("cleanerBio", cleaner.bio);

    const image = document.getElementById(
        "cleanerImage"
    );

    if (image) {
        image.src = cleaner.image;
        image.alt =
            `Illustrative image for ${cleaner.name}`;
    }

    const status = document.getElementById(
        "cleanerStatus"
    );

    const statusLabels = {
        available: "● Available",
        busy: "● Currently Busy",
        offline: "● Currently Offline"
    };

    if (status) {
        status.textContent =
            statusLabels[cleaner.status] || "Unknown";

        status.classList.add(cleaner.status);
    }

    // --------------------------------------
    // PROFESSIONAL INFORMATION
    // --------------------------------------

    const years = Number(
        cleaner.experience || cleaner.yearsExperience
    );

    const profileInfo = document.createElement("div");
    profileInfo.className = "profile-professional-info";

    const specialty = document.createElement("p");
    specialty.textContent =
        `Specialization: ${cleaner.specialty || "Cleaning Services"}`;

    const experience = document.createElement("p");
    experience.textContent = years > 0
        ? `Experience: ${years} years`
        : "Experience details not supplied";

    const disclaimer = document.createElement("small");
    disclaimer.textContent =
        "Fictional demonstration profile. " +
        "Identity, experience and availability are not verified.";

    profileInfo.append(
        specialty,
        experience,
        disclaimer
    );

    const bio = document.getElementById("cleanerBio");

    if (bio) {
        bio.insertAdjacentElement(
            "afterend",
            profileInfo
        );
    }

    // --------------------------------------
    // SERVICES AND INDIVIDUAL RATES
    // --------------------------------------

    const serviceList =
        document.getElementById("serviceList");

    const bookingService =
        document.getElementById("bookingService");

    if (serviceList) {
        serviceList.replaceChildren();
    }

    if (bookingService) {
        bookingService.replaceChildren();

        const placeholder =
            document.createElement("option");

        placeholder.value = "";
        placeholder.textContent = "Choose a service";

        bookingService.appendChild(placeholder);
    }

    cleaner.services.forEach(serviceId => {
        const label = services[serviceId] || serviceId;
        const rate = getServiceRate(serviceId);

        if (serviceList) {
            const item = document.createElement("div");
            item.className = "profile-service-price-item";

            const name = document.createElement("strong");
            name.textContent = label;

            const price = document.createElement("span");
            price.textContent =
                `${formatPrice(rate)} · ` +
                getRateDescription(serviceId);

            item.append(name, price);
            serviceList.appendChild(item);
        }

        if (bookingService) {
            const option = document.createElement("option");
            option.value = serviceId;

            option.textContent =
                `${label} — ${formatPrice(rate)}` +
                (serviceId === "laundry" ? " / item" : "");

            bookingService.appendChild(option);
        }
    });

    // --------------------------------------
    // DYNAMIC BOOKING PRICE
    // --------------------------------------

    function updateProfilePrice() {
        const selectedService =
            bookingService?.value ||
            cleaner.services[0];

        const rate = getServiceRate(selectedService);

        const formatted =
            `${formatPrice(rate)}` +
            (selectedService === "laundry"
                ? " / item"
                : " starting");

        setProfileText("bookingPrice", formatted);

        const primaryService = cleaner.services[0];
        const primaryRate = getServiceRate(primaryService);

        setProfileText(
            "profilePrice",
            `${formatPrice(primaryRate)}` +
            (primaryService === "laundry"
                ? " / item"
                : " starting")
        );
    }

    bookingService?.addEventListener(
        "change",
        updateProfilePrice
    );

    updateProfilePrice();

    // --------------------------------------
    // BOOKING PAGE INTEGRATION
    // --------------------------------------

    const bookingForm =
        document.getElementById("bookingForm");

    bookingForm?.addEventListener("submit", event => {
        event.preventDefault();

        const selectedService =
            bookingService?.value;

        if (
            !selectedService ||
            !cleaner.services.includes(selectedService)
        ) {
            if (bookingService) {
                bookingService.focus();
            }
            return;
        }

        const query = new URLSearchParams({
            cleaner: String(cleaner.id),
            service: selectedService
        });

        window.location.href =
            `booking.html?${query.toString()}`;
    });
}
