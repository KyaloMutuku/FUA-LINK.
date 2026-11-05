
"use strict";

/* ==========================================
   FUA LINK — BLOCK 15
   PROFESSIONAL MARKETPLACE
   ========================================== */

const cleaners = Array.isArray(window.FUA_CLEANERS)
    ? window.FUA_CLEANERS
    : [];

const serviceNames = window.FUA_SERVICES || {};

const statusNames = {
    available: "Available",
    busy: "Busy",
    offline: "Offline"
};

const grid = document.getElementById("cleanerGrid");
const count = document.getElementById("resultsCount");
const empty = document.getElementById("emptyResults");

const locationFilter =
    document.getElementById("locationFilter");

const serviceFilter =
    document.getElementById("serviceFilter");

const availabilityFilter =
    document.getElementById("availabilityFilter");

const maxPrice =
    document.getElementById("maxPrice");

const sortFilter =
    document.getElementById("sortFilter");

const filterForm =
    document.getElementById("filterForm");

// ------------------------------------------
// PRICE HELPERS
// ------------------------------------------

function getPrimaryService(worker) {
    return worker.primaryService || worker.services[0];
}

function getWorkerPrice(worker, serviceId = "all") {
    const actualService = serviceId === "all"
        ? getPrimaryService(worker)
        : serviceId;

    const rate = Number(
        worker.servicePrices?.[actualService]
    );

    if (Number.isFinite(rate) && rate > 0) {
        return rate;
    }

    return Number(worker.price) || 0;
}

function formatPrice(amount) {
    return `KSh ${Math.round(amount).toLocaleString("en-KE")}`;
}

function getPriceUnit(serviceId) {
    return serviceId === "laundry"
        ? "per standard item"
        : "starting rate";
}

// ------------------------------------------
// CREATE WORKER CARD
// ------------------------------------------

function createCleanerCard(cleaner) {
    const selectedService = serviceFilter.value;

    const displayedService = selectedService === "all"
        ? getPrimaryService(cleaner)
        : selectedService;

    const displayedPrice = getWorkerPrice(
        cleaner,
        displayedService
    );

    const article = document.createElement("article");
    article.className = "cleaner-card";

    const photo = document.createElement("div");
    photo.className = "cleaner-photo";

    const image = document.createElement("img");
    image.src = cleaner.image;
    image.alt = `Illustrative image for ${cleaner.name}`;
    image.loading = "lazy";

    const status = document.createElement("span");
    status.className =
        `availability-pill ${cleaner.status}`;

    status.textContent =
        statusNames[cleaner.status] || "Unknown";

    photo.append(image, status);

    const details = document.createElement("div");
    details.className = "cleaner-details";

    const name = document.createElement("h3");
    name.textContent = cleaner.name;

    const specialty = document.createElement("p");
    specialty.className = "cleaner-specialty";
    specialty.textContent =
        cleaner.specialty ||
        serviceNames[displayedService] ||
        "Cleaning Professional";

    const location = document.createElement("p");
    location.className = "cleaner-location";
    location.textContent = `📍 ${cleaner.location}`;

    const experience = document.createElement("p");
    experience.className = "cleaner-experience";

    const years = Number(
        cleaner.experience || cleaner.yearsExperience
    );

    experience.textContent = years > 0
        ? `${years} years of experience`
        : "Cleaning service professional";

    const services = document.createElement("p");
    services.className = "cleaner-services";

    services.textContent = cleaner.services
        .map(id => serviceNames[id] || id)
        .join(" · ");

    const bottom = document.createElement("div");
    bottom.className = "cleaner-bottom";

    const price = document.createElement("div");
    price.className = "cleaner-price";

    const priceLabel = document.createElement("small");
    priceLabel.textContent =
        `${serviceNames[displayedService] || "Service"} · ` +
        getPriceUnit(displayedService);

    const priceValue = document.createElement("strong");
    priceValue.textContent = formatPrice(displayedPrice);

    const button = document.createElement("button");
    button.className = "profile-button";
    button.type = "button";
    button.textContent = "View Profile";

    button.addEventListener("click", () => {
        const query = new URLSearchParams({
            id: String(cleaner.id)
        });

        window.location.href =
            `cleaner-profile.html?${query.toString()}`;
    });

    const demoNote = document.createElement("small");
    demoNote.className = "cleaner-demo-note";
    demoNote.textContent = "Fictional demonstration profile";

    price.append(priceLabel, priceValue);
    bottom.append(price, button);

    details.append(
        name,
        specialty,
        location,
        experience,
        services,
        bottom,
        demoNote
    );

    article.append(photo, details);

    return article;
}

// ------------------------------------------
// FILTER AND SORT WORKERS
// ------------------------------------------

function renderCleaners() {
    if (!grid) return;

    const locationQuery =
        locationFilter.value.trim().toLowerCase();

    const selectedService = serviceFilter.value;
    const selectedStatus = availabilityFilter.value;
    const selectedPrice = maxPrice.value;

    let results = cleaners.filter(cleaner => {
        const matchesLocation =
            cleaner.location.toLowerCase()
                .includes(locationQuery);

        const matchesService =
            selectedService === "all" ||
            cleaner.services.includes(selectedService);

        const matchesStatus =
            selectedStatus === "all" ||
            cleaner.status === selectedStatus;

        const price = getWorkerPrice(
            cleaner,
            selectedService
        );

        const matchesPrice =
            selectedPrice === "all" ||
            price <= Number(selectedPrice);

        return (
            matchesLocation &&
            matchesService &&
            matchesStatus &&
            matchesPrice
        );
    });

    if (sortFilter.value === "price-low") {
        results.sort((a, b) =>
            getWorkerPrice(a, selectedService) -
            getWorkerPrice(b, selectedService)
        );
    }

    if (sortFilter.value === "price-high") {
        results.sort((a, b) =>
            getWorkerPrice(b, selectedService) -
            getWorkerPrice(a, selectedService)
        );
    }

    grid.replaceChildren(
        ...results.map(createCleanerCard)
    );

    if (count) {
        count.textContent =
            `${results.length} demonstration cleaner(s) found`;
    }

    if (empty) {
        empty.hidden = results.length !== 0;
    }
}

// ------------------------------------------
// FILTER EVENTS
// ------------------------------------------

filterForm.addEventListener("input", renderCleaners);
filterForm.addEventListener("change", renderCleaners);

filterForm.addEventListener("reset", () => {
    requestAnimationFrame(renderCleaners);
});

sortFilter.addEventListener("change", renderCleaners);

// ------------------------------------------
// HOMEPAGE SEARCH INTEGRATION
// ------------------------------------------

const params = new URLSearchParams(
    window.location.search
);

const requestedLocation = params.get("location");
const requestedService = params.get("service");

if (requestedLocation) {
    locationFilter.value = requestedLocation;
}

if (
    requestedService &&
    [...serviceFilter.options].some(
        option => option.value === requestedService
    )
) {
    serviceFilter.value = requestedService;
}

renderCleaners();
