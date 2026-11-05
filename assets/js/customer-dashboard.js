
"use strict";

/* =====================================================
   FUA LINK — BLOCK 18
   CLEANER DASHBOARD & PROFESSIONAL PROFILE MANAGEMENT

   Frontend demonstration only.
   No real authentication, booking API or database.
   ===================================================== */

// =====================================================
// 1. CONFIGURATION
// =====================================================

const serviceNames = {
    home: "Home Cleaning",
    office: "Office Cleaning",
    deep: "Deep Cleaning",
    vehicle: "Vehicle Cleaning",
    laundry: "Laundry Services",
    commercial: "Shop & Restaurant Cleaning",
    gardening: "Gardening & Outdoor Care"
};

const WORKER_DRAFT_KEY = "fuaWorkerOnboardingDraft";

const today = new Date();

function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function dateFromToday(days) {
    return dateKey(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + days
        )
    );
}

function formatPrice(amount) {
    return `KSh ${Number(amount).toLocaleString("en-KE")}`;
}

function getElement(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = getElement(id);

    if (element) {
        element.textContent = value;
    }
}

// =====================================================
// 2. SAMPLE BOOKING DATA
// =====================================================

let requests = [
    {
        id: "FL-2001",
        customer: "Sample Customer A",
        service: "Home Cleaning",
        location: "Westlands, Nairobi",
        date: dateFromToday(2),
        time: "09:00",
        price: 1500,
        status: "pending"
    },
    {
        id: "FL-2002",
        customer: "Sample Customer B",
        service: "Deep Cleaning",
        location: "Kilimani, Nairobi",
        date: dateFromToday(5),
        time: "11:00",
        price: 3500,
        status: "confirmed"
    },
    {
        id: "FL-2003",
        customer: "Sample Customer C",
        service: "Home Cleaning",
        location: "Karen, Nairobi",
        date: dateFromToday(-3),
        time: "08:30",
        price: 1800,
        status: "completed"
    },
    {
        id: "FL-2004",
        customer: "Sample Customer D",
        service: "Deep Cleaning",
        location: "Runda, Nairobi",
        date: dateFromToday(8),
        time: "10:00",
        price: 2800,
        status: "pending"
    }
];

/* =====================================================
   BLOCK 20 — SHARED BOOKING INTEGRATION
   ===================================================== */

// Demo identity only. Real identity must come from
// authenticated backend sessions later.

const dashboardParams = new URLSearchParams(
    window.location.search
);

const demoCleanerId = dashboardParams.get("cleaner");

// Keep the original sample requests separate so that
// refreshing shared bookings does not duplicate them.

const originalSampleRequests = [...requests];

function loadSharedCleanerRequests() {
    const store = window.FUA_BOOKING_STORE;

    if (!store || !demoCleanerId) {
        return [];
    }

    return store
        .getCleanerBookings(demoCleanerId)
        .map(booking => ({
            id: booking.id,
            customer: booking.customerName ||
                "Customer",
            service: booking.service ||
                "Cleaning Service",
            location: [
                booking.address,
                booking.county
            ].filter(Boolean).join(", "),
            date: booking.date,
            time: booking.time,
            price: Number(booking.total) || 0,
            status: booking.status,
            shared: true
        }));
}

function refreshSharedRequests() {
    requests = [
        ...loadSharedCleanerRequests(),
        ...originalSampleRequests
    ];

    renderRequests();
    updateStatistics();
    renderMiniCalendar();
    renderFullCalendar();
}

window.addEventListener(
    "fua:bookings-updated",
    refreshSharedRequests
);

window.addEventListener("storage", event => {
    if (event.key === "fuaSharedBookingsV1") {
        refreshSharedRequests();
    }
});


let myServices = [
    { id: "home", price: 1500 },
    { id: "deep", price: 3000 }
];

const unavailableDates = new Set();

// =====================================================
// 3. LOAD PROFESSIONAL REGISTRATION DRAFT
// =====================================================

let workerDraft = null;

function loadWorkerDraft() {
    try {
        const saved = localStorage.getItem(
            WORKER_DRAFT_KEY
        );

        if (!saved) return;

        const data = JSON.parse(saved);

        if (
            !data ||
            data.accountType !== "cleaner" ||
            !Array.isArray(data.services)
        ) {
            return;
        }

        workerDraft = data;

        myServices = data.services
            .filter(id =>
                Object.prototype.hasOwnProperty.call(
                    serviceNames,
                    id
                )
            )
            .map(id => ({
                id,
                price: Number(
                    data.servicePrices?.[id]
                )
            }))
            .filter(service =>
                Number.isSafeInteger(service.price) &&
                service.price > 0
            );

    } catch (error) {
        console.warn(
            "Could not load professional draft:",
            error
        );
    }
}

function saveWorkerDraft() {
    if (!workerDraft) {
        return false;
    }

    workerDraft.services = myServices.map(
        service => service.id
    );

    workerDraft.servicePrices = Object.fromEntries(
        myServices.map(service => [
            service.id,
            service.price
        ])
    );

    workerDraft.updatedAt =
        new Date().toISOString();

    // A local draft is never a verified public profile.
    workerDraft.verified = false;
    workerDraft.published = false;
    workerDraft.demo = true;

    try {
        localStorage.setItem(
            WORKER_DRAFT_KEY,
            JSON.stringify(workerDraft)
        );

        return true;

    } catch (error) {
        console.warn(
            "Unable to save professional draft:",
            error
        );

        return false;
    }
}

loadWorkerDraft();

// =====================================================
// 4. UPDATE PROFESSIONAL IDENTITY
// =====================================================

function refreshWorkerIdentity() {
    if (!workerDraft) return;

    const name =
        workerDraft.name || "Cleaning Professional";

    const initial =
        name.trim().charAt(0).toUpperCase() || "C";

    const sidebarName = document.querySelector(
        ".sidebar-profile strong"
    );

    const profileHeading = document.querySelector(
        ".profile-heading h2"
    );

    const welcomeHeading = document.querySelector(
        ".cleaner-welcome h1"
    );

    if (sidebarName) {
        sidebarName.textContent = name;
    }

    if (profileHeading) {
        profileHeading.textContent = name;
    }

    if (welcomeHeading) {
        const subtitle = welcomeHeading.querySelector(
            "span"
        );

        welcomeHeading.replaceChildren(
            document.createTextNode(
                `Hello, ${name}! `
            )
        );

        if (subtitle) {
            welcomeHeading.appendChild(subtitle);
        }
    }

    document.querySelectorAll(
        ".sidebar-avatar, .topbar-avatar, .profile-avatar"
    ).forEach(avatar => {
        avatar.textContent = initial;
    });

    const nameInput = getElement("profileName");
    const locationInput = getElement("profileLocation");
    const bioInput = getElement("profileBio");

    if (nameInput) {
        nameInput.value = name;
    }

    if (locationInput) {
        locationInput.value =
            workerDraft.location || "";
    }

    if (bioInput) {
        bioInput.value =
            workerDraft.bio || "";
    }

    const availability = getElement(
        "availabilityStatus"
    );

    if (
        availability &&
        ["available", "busy", "offline"].includes(
            workerDraft.status
        )
    ) {
        availability.value = workerDraft.status;
    }
}

// =====================================================
// 5. DASHBOARD NAVIGATION
// =====================================================

const sidebar = getElement("cleanerSidebar");
const menuToggle = getElement("cleanerMenuToggle");

const pages = document.querySelectorAll(
    ".cleaner-page"
);

const navigationButtons = document.querySelectorAll(
    "[data-page]"
);

function showPage(pageName) {
    const target = getElement(
        `page-${pageName}`
    );

    if (!target) return;

    pages.forEach(page => {
        page.hidden = page !== target;
    });

    document.querySelectorAll(
        ".cleaner-nav-link"
    ).forEach(button => {
        const active =
            button.dataset.page === pageName;

        button.classList.toggle(
            "active",
            active
        );

        if (active) {
            button.setAttribute(
                "aria-current",
                "page"
            );
        } else {
            button.removeAttribute(
                "aria-current"
            );
        }
    });

    if (sidebar) {
        sidebar.classList.remove("open");
    }

    if (menuToggle) {
        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    if (pageName === "schedule") {
        renderFullCalendar();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

navigationButtons.forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        const open = sidebar.classList.toggle(
            "open"
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(open)
        );
    });
}

// =====================================================
// 6. PROFESSIONAL AVAILABILITY
// =====================================================

const availabilitySelect = getElement(
    "availabilityStatus"
);

if (availabilitySelect) {
    availabilitySelect.addEventListener(
        "change",
        () => {
            const status = availabilitySelect.value;

            const labels = {
                available: "Available",
                busy: "Busy",
                offline: "Offline"
            };

            availabilitySelect.title =
                `Demo availability: ${labels[status]}`;

            if (workerDraft) {
                workerDraft.status = status;

                saveWorkerDraft();
            }
        }
    );
}

// =====================================================
// 7. DASHBOARD STATISTICS
// =====================================================

function updateStatistics() {
    const pending = requests.filter(
        request => request.status === "pending"
    ).length;

    const currentDateTime =
        `${dateKey(new Date())}T` +
        new Date().toTimeString().slice(0, 5);

    const upcoming = requests.filter(
        request =>
            request.status === "confirmed" &&
            `${request.date}T${request.time}` >=
                currentDateTime
    ).length;

    const completed = requests.filter(
        request => request.status === "completed"
    ).length;

    setText("statRequests", pending);
    setText("statUpcoming", upcoming);
    setText("statCompleted", completed);
}

// =====================================================
// 8. BOOKING REQUEST CARDS
// =====================================================

function makeActionButton(
    label,
    className,
    callback
) {
    const button = document.createElement(
        "button"
    );

    button.type = "button";
    button.textContent = label;
    button.className = className;

    button.addEventListener(
        "click",
        callback
    );

    return button;
}

function createRequestCard(
    request,
    compact = false
) {
    const card = document.createElement(
        "article"
    );

    card.className = "request-card";

    const details = document.createElement(
        "div"
    );

    const title = document.createElement(
        "h3"
    );

    title.textContent = request.service;

    const customer = document.createElement(
        "p"
    );

    customer.textContent =
        `${request.customer} · ${request.location}`;

    const schedule = document.createElement(
        "p"
    );

    schedule.textContent =
        `${request.date} at ${request.time} · ` +
        request.id;

    details.append(
        title,
        customer,
        schedule
    );

    const meta = document.createElement(
        "div"
    );

    meta.className = "request-meta";

    const price = document.createElement(
        "span"
    );

    price.className = "request-price";
    price.textContent = formatPrice(
        request.price
    );

    const status = document.createElement(
        "span"
    );

    status.className =
        `request-status ${request.status}`;

    status.textContent = request.status;

    meta.append(price, status);

    if (!compact) {
        const actions = document.createElement(
            "div"
        );

        actions.className = "request-actions";

        if (request.status === "pending") {
            actions.append(
                makeActionButton(
                    "Accept",
                    "accept-btn",
                    () => changeRequestStatus(
                        request.id,
                        "confirmed"
                    )
                ),
                makeActionButton(
                    "Decline",
                    "decline-btn",
                    () => changeRequestStatus(
                        request.id,
                        "declined"
                    )
                )
            );
        }

        if (request.status === "confirmed") {
            actions.append(
                makeActionButton(
                    "Mark Complete",
                    "complete-btn",
                    () => changeRequestStatus(
                        request.id,
                        "completed"
                    )
                )
            );
        }

        details.appendChild(actions);
    }

    card.append(details, meta);

    return card;
}

function changeRequestStatus(
    id,
    newStatus
) {
    const request = requests.find(
        item => item.id === id
    );

    if (!request) return;

    const valid =
        (
            request.status === "pending" &&
            ["confirmed", "declined"].includes(
                newStatus
            )
        ) ||
        (
            request.status === "confirmed" &&
            newStatus === "completed"
        );

    if (!valid) return;

    if (newStatus === "confirmed") {
        if (unavailableDates.has(request.date)) {
            alert(
                "This date is marked unavailable " +
                "in your demonstration calendar."
            );

            return;
        }

        const conflict = requests.some(
            other =>
                other.id !== request.id &&
                other.status === "confirmed" &&
                other.date === request.date &&
                other.time === request.time
        );

        if (conflict) {
            alert(
                "A sample confirmed job already " +
                "uses this date and start time."
            );

            return;
        }
    }

    
/* BLOCK 20 — SAVE SHARED BOOKING DECISIONS */

if (request.shared) {
    if (!demoCleanerId) {
        alert("No demonstration cleaner was selected.");
        return;
    }

    const result = window.FUA_BOOKING_STORE
        ?.updateBookingStatus(
            request.id,
            demoCleanerId,
            newStatus
        );

    if (!result?.success) {
        alert(
            result?.message ||
            "Unable to update this booking."
        );
        return;
    }

    refreshSharedRequests();
    return;
}

// Preserve existing sample-request behaviour.
request.status = newStatus;


    renderRequests();
    updateStatistics();
    renderMiniCalendar();
    renderFullCalendar();
}

function renderRequestList(
    container,
    items,
    compact
) {
    if (!container) return;

    container.replaceChildren();

    if (items.length === 0) {
        const empty = document.createElement(
            "p"
        );

        empty.textContent =
            "No demonstration requests match this view.";

        container.appendChild(empty);
        return;
    }

    items.forEach(request => {
        container.appendChild(
            createRequestCard(
                request,
                compact
            )
        );
    });
}

const overviewRequests = getElement(
    "overviewRequests"
);

const allRequests = getElement(
    "allRequests"
);

const requestFilter = getElement(
    "requestFilter"
);

function renderRequests() {
    const recent = [...requests]
        .sort((a, b) =>
            `${b.date}T${b.time}`.localeCompare(
                `${a.date}T${a.time}`
            )
        )
        .slice(0, 3);

    renderRequestList(
        overviewRequests,
        recent,
        true
    );

    const filter =
        requestFilter?.value || "all";

    const filtered =
        filter === "all"
            ? requests
            : requests.filter(
                request =>
                    request.status === filter
            );

    renderRequestList(
        allRequests,
        filtered,
        false
    );
}

if (requestFilter) {
    requestFilter.addEventListener(
        "change",
        renderRequests
    );
}

// =====================================================
// 9. CALENDAR STATE
// =====================================================

const calendarMonth = getElement(
    "calendarMonth"
);

const fullCalendar = getElement(
    "fullCalendar"
);

const miniCalendar = getElement(
    "miniCalendar"
);

const selectedDateLabel = getElement(
    "selectedDateLabel"
);

const scheduleMessage = getElement(
    "scheduleMessage"
);

let displayedMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
);

let selectedDate = dateKey(today);

function hasConfirmedJob(date) {
    return requests.some(
        request =>
            request.date === date &&
            request.status === "confirmed"
    );
}

// =====================================================
// 10. CALENDAR DAY GENERATION
// =====================================================

function createCalendarDay(
    day,
    monthDate,
    interactive
) {
    const date = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        day
    );

    const key = dateKey(date);

    const button = document.createElement(
        "button"
    );

    button.type = "button";
    button.className = "calendar-day";
    button.textContent = day;

    if (key === dateKey(today)) {
        button.classList.add("today");
    }

    if (unavailableDates.has(key)) {
        button.classList.add(
            "unavailable"
        );
    }

    if (hasConfirmedJob(key)) {
        button.classList.add(
            "has-job"
        );
    }

    if (
        interactive &&
        key === selectedDate
    ) {
        button.classList.add(
            "selected"
        );
    }

    if (interactive) {
        button.setAttribute(
            "aria-label",
            key
        );

        button.setAttribute(
            "aria-pressed",
            String(key === selectedDate)
        );

        button.addEventListener(
            "click",
            () => {
                selectedDate = key;

                if (selectedDateLabel) {
                    selectedDateLabel.textContent =
                        new Intl.DateTimeFormat(
                            "en-KE",
                            { dateStyle: "full" }
                        ).format(date);
                }

                if (scheduleMessage) {
                    scheduleMessage.textContent = "";
                }

                renderFullCalendar();
            }
        );

    } else {
        button.disabled = true;
    }

    return button;
}

function populateCalendar(
    container,
    monthDate,
    interactive
) {
    if (!container) return;

    container.replaceChildren();

    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDay = new Date(
        year,
        month,
        1
    ).getDay();

    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    for (let i = 0; i < firstDay; i++) {
        const placeholder =
            document.createElement("span");

        container.appendChild(
            placeholder
        );
    }

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {
        container.appendChild(
            createCalendarDay(
                day,
                monthDate,
                interactive
            )
        );
    }
}

function renderFullCalendar() {
    if (calendarMonth) {
        calendarMonth.textContent =
            new Intl.DateTimeFormat(
                "en-KE",
                {
                    month: "long",
                    year: "numeric"
                }
            ).format(displayedMonth);
    }

    populateCalendar(
        fullCalendar,
        displayedMonth,
        true
    );
}

function renderMiniCalendar() {
    populateCalendar(
        miniCalendar,
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        ),
        false
    );
}

// =====================================================
// 11. CALENDAR NAVIGATION
// =====================================================

getElement("prevMonth")?.addEventListener(
    "click",
    () => {
        displayedMonth = new Date(
            displayedMonth.getFullYear(),
            displayedMonth.getMonth() - 1,
            1
        );

        renderFullCalendar();
    }
);

getElement("nextMonth")?.addEventListener(
    "click",
    () => {
        displayedMonth = new Date(
            displayedMonth.getFullYear(),
            displayedMonth.getMonth() + 1,
            1
        );

        renderFullCalendar();
    }
);

// =====================================================
// 12. MARK AVAILABLE / UNAVAILABLE
// =====================================================

getElement("markUnavailable")?.addEventListener(
    "click",
    () => {
        if (selectedDate < dateKey(new Date())) {
            setText(
                "scheduleMessage",
                "Past dates cannot be changed."
            );

            return;
        }

        if (hasConfirmedJob(selectedDate)) {
            setText(
                "scheduleMessage",
                "This date contains a confirmed sample job."
            );

            return;
        }

        unavailableDates.add(
            selectedDate
        );

        setText(
            "scheduleMessage",
            "Date marked unavailable in this preview."
        );

        renderFullCalendar();
        renderMiniCalendar();
    }
);

getElement("markAvailable")?.addEventListener(
    "click",
    () => {
        if (selectedDate < dateKey(new Date())) {
            setText(
                "scheduleMessage",
                "Past dates cannot be changed."
            );

            return;
        }

        unavailableDates.delete(
            selectedDate
        );

        setText(
            "scheduleMessage",
            "Date marked available in this preview."
        );

        renderFullCalendar();
        renderMiniCalendar();
    }
);

// =====================================================
// 13. SERVICE MANAGEMENT
// =====================================================

const myServicesList = getElement(
    "myServicesList"
);

const addServiceForm = getElement(
    "addServiceForm"
);

const serviceMessage = getElement(
    "serviceMessage"
);

function showServiceMessage(message) {
    if (serviceMessage) {
        serviceMessage.textContent = message;
    }
}

function renderServices() {
    if (!myServicesList) return;

    myServicesList.replaceChildren();

    if (myServices.length === 0) {
        const empty = document.createElement(
            "p"
        );

        empty.textContent =
            "No services added yet. Choose a service to begin.";

        myServicesList.appendChild(
            empty
        );

        return;
    }

    myServices.forEach(service => {
        const card = document.createElement(
            "div"
        );

        card.className = "managed-service";

        const details = document.createElement(
            "div"
        );

        const name = document.createElement(
            "strong"
        );

        name.textContent =
            serviceNames[service.id] ||
            service.id;

        const priceLabel = document.createElement(
            "small"
        );

        priceLabel.textContent =
            service.id === "laundry"
                ? "Rate per standard item (KSh)"
                : "Starting service rate (KSh)";

        const priceInput = document.createElement(
            "input"
        );

        priceInput.type = "number";
        priceInput.min = "1";
        priceInput.max = "10000000";
        priceInput.step = "1";
        priceInput.value = service.price;

        priceInput.className =
            "managed-service-price-input";

        priceInput.setAttribute(
            "aria-label",
            `Price for ${serviceNames[service.id]}`
        );

        details.append(
            name,
            priceLabel,
            priceInput
        );

        const saveButton = document.createElement(
            "button"
        );

        saveButton.type = "button";
        saveButton.textContent = "Save Price";

        saveButton.addEventListener(
            "click",
            () => {
                const newPrice = Number(
                    priceInput.value
                );

                if (
                    !priceInput.value ||
                    !Number.isSafeInteger(newPrice) ||
                    newPrice < 1 ||
                    newPrice > 10000000
                ) {
                    showServiceMessage(
                        "Enter a valid whole-number price."
                    );

                    return;
                }

                service.price = newPrice;

                const saved = saveWorkerDraft();

                showServiceMessage(
                    workerDraft
                        ? saved
                            ? "Service price saved to your local draft."
                            : "Could not save the updated price."
                        : "Price updated in this demonstration session."
                );
            }
        );

        const removeButton = document.createElement(
            "button"
        );

        removeButton.type = "button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener(
            "click",
            () => {
                myServices = myServices.filter(
                    item => item.id !== service.id
                );

                const saved = saveWorkerDraft();

                showServiceMessage(
                    workerDraft
                        ? saved
                            ? "Service removed from your local draft."
                            : "Service removed here, but saving failed."
                        : "Service removed from this preview."
                );

                renderServices();
            }
        );

        card.append(
            details,
            saveButton,
            removeButton
        );

        myServicesList.appendChild(
            card
        );
    });
}

if (addServiceForm) {
    addServiceForm.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            const serviceId = getElement(
                "newService"
            ).value;

            const priceField = getElement(
                "servicePrice"
            );

            const price = Number(
                priceField.value
            );

            if (!serviceNames[serviceId]) {
                showServiceMessage(
                    "Please select a valid service."
                );

                return;
            }

            if (
                !priceField.value ||
                !Number.isSafeInteger(price) ||
                price < 1 ||
                price > 10000000
            ) {
                showServiceMessage(
                    "Enter a valid whole-number starting price."
                );

                return;
            }

            if (
                myServices.some(
                    item => item.id === serviceId
                )
            ) {
                showServiceMessage(
                    "This service is already in your list."
                );

                return;
            }

            myServices.push({
                id: serviceId,
                price
            });

            const saved = saveWorkerDraft();

            addServiceForm.reset();

            showServiceMessage(
                workerDraft
                    ? saved
                        ? "Service added and saved to your local draft."
                        : "Service added here, but saving failed."
                    : "Service added to this demonstration session."
            );

            renderServices();
        }
    );
}

// =====================================================
// 14. PROFESSIONAL PROFILE EDITING
// =====================================================

const cleanerProfileForm = getElement(
    "cleanerProfileForm"
);

if (cleanerProfileForm) {
    cleanerProfileForm.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            if (!cleanerProfileForm.reportValidity()) {
                return;
            }

            const name = getElement(
                "profileName"
            ).value.trim();

            const location = getElement(
                "profileLocation"
            ).value.trim();

            const bio = getElement(
                "profileBio"
            ).value.trim();

            if (
                !name ||
                !location ||
                !bio
            ) {
                setText(
                    "profileMessage",
                    "Please complete all profile fields."
                );

                return;
            }

            if (!workerDraft) {
                setText(
                    "profileMessage",
                    "Profile validated. Register as a professional first to save a local draft."
                );

                return;
            }

            workerDraft.name = name;
            workerDraft.location = location;
            workerDraft.bio = bio;

            const saved = saveWorkerDraft();

            if (saved) {
                refreshWorkerIdentity();

                setText(
                    "profileMessage",
                    "Profile changes saved locally. Your profile is not yet published."
                );
            } else {
                setText(
                    "profileMessage",
                    "Unable to save profile changes in this browser."
                );
            }
        }
    );
}

// =====================================================
// 15. INITIALIZE DASHBOARD
// =====================================================

function initializeCleanerDashboard() {
    if (selectedDateLabel) {
        selectedDateLabel.textContent =
            new Intl.DateTimeFormat(
                "en-KE",
                { dateStyle: "full" }
            ).format(today);
    }

    refreshWorkerIdentity();

    renderRequests();
    updateStatistics();

    renderMiniCalendar();
    renderFullCalendar();

    renderServices();

    // Optional direct navigation:
    // cleaner-dashboard.html?page=services
    const params = new URLSearchParams(
        window.location.search
    );

    const requestedPage = params.get("page");

    if (
        requestedPage &&
        getElement(`page-${requestedPage}`)
    ) {
        showPage(requestedPage);
    }
}

initializeCleanerDashboard();
refreshSharedRequests();
