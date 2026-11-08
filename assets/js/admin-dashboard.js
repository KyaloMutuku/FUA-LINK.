
"use strict";

/* ==========================================
   SAFI LINK — BLOCK 19
   ADMIN VERIFICATION DEMONSTRATION
   ========================================== */

const DRAFT_KEY = "safiWorkerOnboardingDraft";
const DECISIONS_KEY = "safiAdminDemoDecisions";

const services = {
    home: "Home Cleaning",
    office: "Office Cleaning",
    deep: "Deep Cleaning",
    vehicle: "Vehicle Cleaning",
    laundry: "Laundry Services",
    commercial: "Shop & Restaurant Cleaning",
    gardening: "Gardening & Outdoor Care"
};

const sampleApplications = [
    {
        id: "DEMO-001",
        name: "Sample Applicant A",
        location: "Westlands, Nairobi",
        experience: 4,
        specialty: "Residential Cleaning",
        bio: "Fictional professional profile for testing.",
        services: ["home", "deep"],
        servicePrices: {
            home: 1500,
            deep: 3500
        },
        status: "pending",
        demo: true
    },
    {
        id: "DEMO-002",
        name: "Sample Applicant B",
        location: "Kilimani, Nairobi",
        experience: 6,
        specialty: "Office Cleaning",
        bio: "Fictional professional profile for testing.",
        services: ["office", "commercial"],
        servicePrices: {
            office: 2500,
            commercial: 3500
        },
        status: "pending",
        demo: true
    },
    {
        id: "DEMO-003",
        name: "Sample Applicant C",
        location: "Karen, Nairobi",
        experience: 3,
        specialty: "Outdoor Maintenance",
        bio: "Fictional professional profile for testing.",
        services: ["gardening"],
        servicePrices: {
            gardening: 1800
        },
        status: "pending",
        demo: true
    }
];

function readJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

const decisions = readJSON(DECISIONS_KEY, {});

function loadApplications() {
    const items = [...sampleApplications];

    const draft = readJSON(DRAFT_KEY, null);

    if (
        draft &&
        draft.accountType === "cleaner" &&
        Array.isArray(draft.services)
    ) {
        items.push({
            ...draft,
            id: draft.draftId || "LOCAL-DRAFT",
            status: "pending",
            localDraft: true
        });
    }

    return items.map(item => ({
        ...item,
        status: ["pending", "approved", "rejected"]
            .includes(decisions[item.id])
            ? decisions[item.id]
            : item.status
    }));
}

let applications = loadApplications();
let selectedApplicationId = null;

const list = document.getElementById(
    "applicationsList"
);

const searchInput = document.getElementById(
    "applicationSearch"
);

const statusFilter = document.getElementById(
    "applicationStatus"
);

const dialog = document.getElementById(
    "applicationDialog"
);

const details = document.getElementById(
    "applicationDetails"
);

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function updateStats() {
    setText("totalCount", applications.length);

    ["pending", "approved", "rejected"].forEach(
        status => {
            const count = applications.filter(
                item => item.status === status
            ).length;

            setText(
                `${status}Count`,
                count
            );
        }
    );
}

function makeElement(tag, text, className = "") {
    const element = document.createElement(tag);

    element.textContent = text;

    if (className) {
        element.className = className;
    }

    return element;
}

function createApplicationCard(application) {
    const card = document.createElement("article");
    card.className = "application-card";

    const avatar = makeElement(
        "div",
        application.name.charAt(0).toUpperCase(),
        "application-avatar"
    );

    const info = document.createElement("div");
    info.className = "application-info";

    info.append(
        makeElement("h3", application.name),
        makeElement(
            "p",
            `${application.location} · ` +
            `${application.experience} years experience`
        ),
        makeElement(
            "small",
            application.services
                .map(id => services[id] || id)
                .join(" · ")
        )
    );

    const status = makeElement(
        "span",
        application.status,
        `application-status ${application.status}`
    );

    const button = makeElement(
        "button",
        "Review Application ↗",
        "application-review"
    );

    button.type = "button";

    button.addEventListener("click", () => {
        openApplication(application.id);
    });

    card.append(avatar, info, status, button);

    return card;
}

function renderApplications() {
    const query = searchInput.value
        .trim()
        .toLowerCase();

    const selectedStatus = statusFilter.value;

    const filtered = applications.filter(
        application => {
            const searchable = [
                application.name,
                application.location,
                application.specialty,
                ...application.services.map(
                    id => services[id] || id
                )
            ].join(" ").toLowerCase();

            return (
                searchable.includes(query) &&
                (
                    selectedStatus === "all" ||
                    application.status === selectedStatus
                )
            );
        }
    );

    list.replaceChildren(
        ...filtered.map(createApplicationCard)
    );

    setText(
        "applicationCount",
        `Showing ${filtered.length} of ` +
        `${applications.length} applications`
    );

    document.getElementById(
        "applicationEmpty"
    ).hidden = filtered.length !== 0;

    updateStats();
}

function addDetailRow(container, label, value) {
    const row = document.createElement("div");
    row.className = "application-detail-row";

    row.append(
        makeElement("strong", label),
        makeElement("span", String(value ?? "Not provided"))
    );

    container.appendChild(row);
}

function openApplication(id) {
    const application = applications.find(
        item => item.id === id
    );

    if (!application) return;

    selectedApplicationId = id;
    details.replaceChildren();

    addDetailRow(
        details,
        "Full Name",
        application.name
    );

    addDetailRow(
        details,
        "Location",
        application.location
    );

    addDetailRow(
        details,
        "Experience",
        `${application.experience} years`
    );

    addDetailRow(
        details,
        "Specialization",
        application.specialty
    );

    addDetailRow(
        details,
        "Biography",
        application.bio
    );

    addDetailRow(
        details,
        "Application Status",
        application.status
    );

    const heading = makeElement(
        "h3",
        "Services & Starting Rates"
    );

    details.appendChild(heading);

    application.services.forEach(id => {
        const rate = Number(
            application.servicePrices?.[id]
        );

        const unit = id === "laundry"
            ? "per standard item"
            : "starting rate";

        addDetailRow(
            details,
            services[id] || id,
            Number.isFinite(rate)
                ? `KSh ${rate.toLocaleString("en-KE")} — ${unit}`
                : "Price unavailable"
        );
    });

    const isPending =
        application.status === "pending";

    document.getElementById(
        "approveApplication"
    ).disabled = !isPending;

    document.getElementById(
        "rejectApplication"
    ).disabled = !isPending;

    setText("adminActionMessage", "");

    dialog.showModal();
}

function saveDecision(status) {
    const application = applications.find(
        item => item.id === selectedApplicationId
    );

    if (
        !application ||
        application.status !== "pending"
    ) {
        return;
    }

    application.status = status;

    decisions[application.id] = status;

    try {
        localStorage.setItem(
            DECISIONS_KEY,
            JSON.stringify(decisions)
        );

        setText(
            "adminActionMessage",
            `Demonstration decision saved: ${status}. ` +
            "No real verification or publication occurred."
        );

    } catch {
        setText(
            "adminActionMessage",
            "Decision updated for this session, " +
            "but local storage failed."
        );
    }

    renderApplications();

    document.getElementById(
        "approveApplication"
    ).disabled = true;

    document.getElementById(
        "rejectApplication"
    ).disabled = true;
}

document.getElementById(
    "approveApplication"
).addEventListener("click", () => {
    saveDecision("approved");
});

document.getElementById(
    "rejectApplication"
).addEventListener("click", () => {
    saveDecision("rejected");
});

document.getElementById(
    "closeApplicationDialog"
).addEventListener("click", () => {
    dialog.close();
});

searchInput.addEventListener(
    "input",
    renderApplications
);

statusFilter.addEventListener(
    "change",
    renderApplications
);

renderApplications();
