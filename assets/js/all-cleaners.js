
"use strict";

/* ==========================================
   SAFI LINK — ALL CLEANERS DIRECTORY
   ========================================== */

const directoryCleaners =
    Array.isArray(window.SAFI_CLEANERS)
        ? window.SAFI_CLEANERS
        : [];

const directoryServices =
    window.SAFI_SERVICES || {};

const directoryGrid =
    document.getElementById("allCleanersGrid");

const directoryCount =
    document.getElementById("directoryCount");

const directoryEmpty =
    document.getElementById("directoryEmpty");

const directorySearch =
    document.getElementById("directorySearch");

const directoryService =
    document.getElementById("directoryService");

const directoryAvailability =
    document.getElementById("directoryAvailability");

const directorySort =
    document.getElementById("directorySort");

const directoryFilters =
    document.getElementById("directoryFilters");

const totalProfessionals =
    document.getElementById("totalProfessionals");

const directoryStatusLabels = {
    available: "Available",
    busy: "Busy",
    offline: "Offline"
};

function formatDirectoryPrice(value) {
    return `KSh ${Math.round(value).toLocaleString("en-KE")}`;
}

function getDirectoryService(cleaner) {
    const selected = directoryService.value;

    if (
        selected !== "all" &&
        cleaner.services.includes(selected)
    ) {
        return selected;
    }

    return cleaner.primaryService ||
           cleaner.services[0];
}

function getDirectoryRate(cleaner) {
    const service = getDirectoryService(cleaner);

    const rate = Number(
        cleaner.servicePrices?.[service]
    );

    return Number.isFinite(rate) && rate > 0
        ? rate
        : Number(cleaner.price) || 0;
}

function getDirectoryPriceLabel(cleaner) {
    const service = getDirectoryService(cleaner);
    const rate = getDirectoryRate(cleaner);

    return formatDirectoryPrice(rate) +
        (service === "laundry"
            ? " / item"
            : " starting");
}

// Populate the service dropdown.
Object.entries(directoryServices).forEach(
    ([id, label]) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = label;
        directoryService.appendChild(option);
    }
);

totalProfessionals.textContent =
    String(directoryCleaners.length);

// ------------------------------------------
// BUILD PROFESSIONAL CARD
// ------------------------------------------

function createDirectoryCard(cleaner) {
    const article = document.createElement("article");
    article.className = "directory-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "directory-card-image";

    const image = document.createElement("img");
    image.src = cleaner.image;
    image.alt = `Illustrative profile image for ${cleaner.name}`;
    image.loading = "lazy";

    const status = document.createElement("span");
    status.className =
        `directory-status ${cleaner.status}`;

    status.textContent =
        directoryStatusLabels[cleaner.status] ||
        "Status Unknown";

    imageWrap.append(image, status);

    const body = document.createElement("div");
    body.className = "directory-card-body";

    const specialty = document.createElement("span");
    specialty.className = "directory-card-specialty";
    specialty.textContent =
        cleaner.specialty || "Cleaning Professional";

    const name = document.createElement("h3");
    name.textContent = cleaner.name;

    const location = document.createElement("p");
    location.className = "directory-card-location";
    location.textContent = `📍 ${cleaner.location}`;

    const experience = document.createElement("p");
    experience.className = "directory-card-experience";

    const years = Number(
        cleaner.experience || cleaner.yearsExperience
    );

    experience.textContent =
        `${years || 0} years of experience`;

    const tags = document.createElement("div");
    tags.className = "directory-card-tags";

    cleaner.services.forEach(id => {
        const tag = document.createElement("span");
        tag.textContent = directoryServices[id] || id;
        tags.appendChild(tag);
    });

    const bottom = document.createElement("div");
    bottom.className = "directory-card-bottom";

    const price = document.createElement("div");
    price.className = "directory-card-price";

    const priceCaption = document.createElement("small");
    priceCaption.textContent =
        directoryServices[getDirectoryService(cleaner)] ||
        "Starting service";

    const priceValue = document.createElement("strong");
    priceValue.textContent =
        getDirectoryPriceLabel(cleaner);

    price.append(priceCaption, priceValue);

    const link = document.createElement("a");
    link.className = "directory-card-button";

    const query = new URLSearchParams({
        id: String(cleaner.id)
    });

    link.href =
        `cleaner-profile.html?${query.toString()}`;

    link.textContent = "View Profile ↗";

    bottom.append(price, link);

    body.append(
        specialty,
        name,
        location,
        experience,
        tags,
        bottom
    );

    article.append(imageWrap, body);

    return article;
}

// ------------------------------------------
// SEARCH, FILTER AND SORT
// ------------------------------------------

function renderDirectory() {
    const search = directorySearch.value
        .trim()
        .toLowerCase();

    const service = directoryService.value;
    const availability = directoryAvailability.value;

    let results = directoryCleaners.filter(cleaner => {
        const searchable = [
            cleaner.name,
            cleaner.location,
            cleaner.specialty,
            ...cleaner.services.map(
                id => directoryServices[id] || id
            )
        ].join(" ").toLowerCase();

        const matchesSearch =
            searchable.includes(search);

        const matchesService =
            service === "all" ||
            cleaner.services.includes(service);

        const matchesAvailability =
            availability === "all" ||
            cleaner.status === availability;

        return matchesSearch &&
               matchesService &&
               matchesAvailability;
    });

    if (directorySort.value === "name") {
        results.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    if (directorySort.value === "experience") {
        results.sort((a, b) =>
            Number(b.experience || b.yearsExperience || 0) -
            Number(a.experience || a.yearsExperience || 0)
        );
    }

    if (directorySort.value === "price-low") {
        results.sort((a, b) =>
            getDirectoryRate(a) - getDirectoryRate(b)
        );
    }

    if (directorySort.value === "price-high") {
        results.sort((a, b) =>
            getDirectoryRate(b) - getDirectoryRate(a)
        );
    }

    directoryGrid.replaceChildren(
        ...results.map(createDirectoryCard)
    );

    directoryCount.textContent =
        `Showing ${results.length} of ` +
        `${directoryCleaners.length} professionals`;

    directoryEmpty.hidden = results.length !== 0;
}

directoryFilters.addEventListener(
    "input",
    renderDirectory
);

directoryFilters.addEventListener(
    "change",
    renderDirectory
);

directoryFilters.addEventListener("reset", () => {
    requestAnimationFrame(renderDirectory);
});

// Optional links from other pages.
const directoryParams = new URLSearchParams(
    window.location.search
);

const initialService =
    directoryParams.get("service");

if (
    initialService &&
    [...directoryService.options].some(
        option => option.value === initialService
    )
) {
    directoryService.value = initialService;
}

renderDirectory();
