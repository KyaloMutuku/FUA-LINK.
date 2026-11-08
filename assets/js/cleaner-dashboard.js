
"use strict";

/* ==========================================
   SAFI LINK — BLOCK 8
   CLEANER DASHBOARD FRONTEND LOGIC

   All data and actions are demonstrations.
   No backend, database or API is connected.
   ========================================== */

// ------------------------------------------
// 1. SAMPLE DATA
// ------------------------------------------

const serviceNames = {
    home: "Home Cleaning",
    office: "Office Cleaning",
    deep: "Deep Cleaning",
    vehicle: "Vehicle Cleaning",
    laundry: "Laundry Services",
    commercial: "Shop & Restaurant Cleaning",
    gardening: "Gardening & Outdoor Care"
};

const today = new Date();

function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function dateFromToday(days) {
    const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + days
    );

    return dateKey(date);
}

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

/* BLOCK 20 — SHARED BOOKING REQUESTS */

const dashboardParams = new URLSearchParams(
    window.location.search
);

const demoCleanerId = dashboardParams.get("cleaner");

function loadSharedCleanerRequests() {
    if (
        !demoCleanerId ||
        !window.SAFI_BOOKING_STORE
    ) {
        return [];
    }

    return window.SAFI_BOOKING_STORE
        .getCleanerBookings(demoCleanerId)
        .map(booking => ({
            id: booking.id,
            customer: booking.customerName,
            service: booking.service,
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
    const sharedRequests = loadSharedCleanerRequests();

    requests = demoCleanerId
        ? sharedRequests
        : [...originalSampleRequests];

    renderRequests();
    updateStatistics();
    renderMiniCalendar();
    renderFullCalendar();
}

window.addEventListener(
    "safi:bookings-updated",
    refreshSharedRequests
);

window.addEventListener(
    "storage",
    event => {
        if (event.key === "safiSharedBookingsV1") {
            refreshSharedRequests();
        }
    }
);

let myServices = [
    {
        id: "home",
        price: 1500
    },
    {
        id: "deep",
        price: 3000
    }
];

const unavailableDates = new Set();

// ------------------------------------------
// 2. DASHBOARD NAVIGATION
// ------------------------------------------

const sidebar = document.getElementById("cleanerSidebar");

const menuToggle =
    document.getElementById("cleanerMenuToggle");

const pages = document.querySelectorAll(".cleaner-page");

const navigationButtons =
    document.querySelectorAll("[data-page]");

function showPage(pageName) {
    const target = document.getElementById(
        `page-${pageName}`
    );

    if (!target) return;

    pages.forEach(page => {
        page.hidden = page !== target;
    });

    document.querySelectorAll(".cleaner-nav-link")
        .forEach(button => {
            const active = button.dataset.page === pageName;

            button.classList.toggle("active", active);

            if (active) {
                button.setAttribute("aria-current", "page");
            } else {
                button.removeAttribute("aria-current");
            }
        });

    sidebar.classList.remove("open");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

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

menuToggle.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(open)
    );
});

// ------------------------------------------
// 3. AVAILABILITY STATUS
// ------------------------------------------

const availabilitySelect =
    document.getElementById("availabilityStatus");

availabilitySelect.addEventListener("change", () => {
    const status = availabilitySelect.value;

    const labels = {
        available: "Available",
        busy: "Busy",
        offline: "Offline"
    };

    availabilitySelect.title =
        `Demo availability: ${labels[status]}`;
});

// ------------------------------------------
// 4. DASHBOARD STATISTICS
// ------------------------------------------

function updateStatistics() {
    const pending = requests.filter(
        request => request.status === "pending"
    ).length;

    const upcoming = requests.filter(
        request =>
            request.status === "confirmed" &&
            `${request.date}T${request.time}` >=
                `${dateKey(new Date())}T${new Date()
                    .toTimeString().slice(0, 5)}`
    ).length;

    const completed = requests.filter(
        request => request.status === "completed"
    ).length;

    document.getElementById("statRequests")
        .textContent = pending;

    document.getElementById("statUpcoming")
        .textContent = upcoming;

    document.getElementById("statCompleted")
        .textContent = completed;
}

// ------------------------------------------
// 5. BOOKING REQUEST CARDS
// ------------------------------------------

function createRequestCard(request, compact = false) {
    const card = document.createElement("article");
    card.className = "request-card";

    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = request.service;

    const customer = document.createElement("p");
    customer.textContent =
        `${request.customer} · ${request.location}`;

    const schedule = document.createElement("p");
    schedule.textContent =
        `${request.date} at ${request.time} · ${request.id}`;

    details.append(title, customer, schedule);

    const meta = document.createElement("div");
    meta.className = "request-meta";

    const price = document.createElement("span");
    price.className = "request-price";
    price.textContent =
        `KSh ${request.price.toLocaleString("en-KE")}`;

    const status = document.createElement("span");
    status.className =
        `request-status ${request.status}`;

    status.textContent = request.status;

    meta.append(price, status);

    if (!compact) {
        const actions = document.createElement("div");
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

function makeActionButton(label, className, callback) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = label;
    button.className = className;

    button.addEventListener("click", callback);

    return button;
}

function changeRequestStatus(id, newStatus) {
    const request = requests.find(
        item => item.id === id
    );

    if (!request) return;

    // Only valid demonstration transitions.
    const valid =
        (request.status === "pending" &&
            ["confirmed", "declined"].includes(newStatus)) ||
        (request.status === "confirmed" &&
            newStatus === "completed");

    if (!valid) return;

    if (newStatus === "confirmed") {
        if (unavailableDates.has(request.date)) {
            alert(
                "This date is marked unavailable in " +
                "your demonstration calendar."
            );
            return;
        }

        const conflict = requests.some(other =>
            other.id !== request.id &&
            other.status === "confirmed" &&
            other.date === request.date &&
            other.time === request.time
        );

        if (conflict) {
            alert(
                "A sample confirmed job already uses " +
                "this date and start time."
            );
            return;
        }
    }

    if (request.shared) {
   const result =
    window.SAFI_BOOKING_STORE.updateBookingStatus(
        request.id,
        demoCleanerId,
        newStatus
    );

if (!result.success) {
    alert(
        result.message ||
        "Unable to update booking status."
    );
    return;
}

refreshSharedRequests();
    return;
}

request.status = newStatus;

    renderRequests();
    updateStatistics();
    renderMiniCalendar();
    renderFullCalendar();
}

function renderRequestList(container, items, compact) {
    container.replaceChildren();

    if (items.length === 0) {
        const empty = document.createElement("p");

        empty.textContent =
            "No demonstration requests match this view.";

        container.appendChild(empty);
        return;
    }

    items.forEach(request => {
        container.appendChild(
            createRequestCard(request, compact)
        );
    });
}

const overviewRequests =
    document.getElementById("overviewRequests");

const allRequests =
    document.getElementById("allRequests");

const requestFilter =
    document.getElementById("requestFilter");

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

    const filter = requestFilter.value;

    const filtered = filter === "all"
        ? requests
        : requests.filter(
            request => request.status === filter
        );

    renderRequestList(
        allRequests,
        filtered,
        false
    );
}

requestFilter.addEventListener("change", renderRequests);

// ------------------------------------------
// 6. FULL CALENDAR
// ------------------------------------------

const calendarMonth =
    document.getElementById("calendarMonth");

const fullCalendar =
    document.getElementById("fullCalendar");

const miniCalendar =
    document.getElementById("miniCalendar");

const selectedDateLabel =
    document.getElementById("selectedDateLabel");

const scheduleMessage =
    document.getElementById("scheduleMessage");

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

function createCalendarDay(day, monthDate, interactive) {
    const date = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        day
    );

    const key = dateKey(date);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";
    button.textContent = day;

    if (key === dateKey(today)) {
        button.classList.add("today");
    }

    if (unavailableDates.has(key)) {
        button.classList.add("unavailable");
    }

    if (hasConfirmedJob(key)) {
        button.classList.add("has-job");
    }

    if (interactive && key === selectedDate) {
        button.classList.add("selected");
    }

    if (interactive) {
        button.setAttribute("aria-label", key);
        button.setAttribute(
            "aria-pressed",
            String(key === selectedDate)
        );

        button.addEventListener("click", () => {
            selectedDate = key;

            selectedDateLabel.textContent =
                new Intl.DateTimeFormat("en-KE", {
                    dateStyle: "full"
                }).format(date);

            scheduleMessage.textContent = "";

            renderFullCalendar();
        });
    } else {
        button.disabled = true;
    }

    return button;
}

function populateCalendar(container, monthDate, interactive) {
    container.replaceChildren();

    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const placeholder = document.createElement("span");
        container.appendChild(placeholder);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        container.appendChild(
            createCalendarDay(day, monthDate, interactive)
        );
    }
}

function renderFullCalendar() {
    calendarMonth.textContent =
        new Intl.DateTimeFormat("en-KE", {
            month: "long",
            year: "numeric"
        }).format(displayedMonth);

    populateCalendar(
        fullCalendar,
        displayedMonth,
        true
    );
}

function renderMiniCalendar() {
    populateCalendar(
        miniCalendar,
        new Date(today.getFullYear(), today.getMonth(), 1),
        false
    );
}

document.getElementById("prevMonth")
    .addEventListener("click", () => {
        displayedMonth = new Date(
            displayedMonth.getFullYear(),
            displayedMonth.getMonth() - 1,
            1
        );

        renderFullCalendar();
    });

document.getElementById("nextMonth")
    .addEventListener("click", () => {
        displayedMonth = new Date(
            displayedMonth.getFullYear(),
            displayedMonth.getMonth() + 1,
            1
        );

        renderFullCalendar();
    });

document.getElementById("markUnavailable")
    .addEventListener("click", () => {
        if (selectedDate < dateKey(new Date())) {
            scheduleMessage.textContent =
                "Past dates cannot be changed.";
            return;
        }

        if (hasConfirmedJob(selectedDate)) {
            scheduleMessage.textContent =
                "This date contains a confirmed sample job.";
            return;
        }

        unavailableDates.add(selectedDate);

        scheduleMessage.textContent =
            "Date marked unavailable in this preview.";

        renderFullCalendar();
        renderMiniCalendar();
    });

document.getElementById("markAvailable")
    .addEventListener("click", () => {
        if (selectedDate < dateKey(new Date())) {
            scheduleMessage.textContent =
                "Past dates cannot be changed.";
            return;
        }

        unavailableDates.delete(selectedDate);

        scheduleMessage.textContent =
            "Date marked available in this preview.";

        renderFullCalendar();
        renderMiniCalendar();
    });

// ------------------------------------------
// 7. SERVICE MANAGEMENT
// ------------------------------------------

const myServicesList =
    document.getElementById("myServicesList");

const addServiceForm =
    document.getElementById("addServiceForm");

const serviceMessage =
    document.getElementById("serviceMessage");

function renderServices() {
    myServicesList.replaceChildren();

    if (!myServices.length) {
        const empty = document.createElement("p");

        empty.textContent =
            "No sample services added yet.";

        myServicesList.appendChild(empty);
        return;
    }

    myServices.forEach(service => {
        const card = document.createElement("div");
        card.className = "managed-service";

        const details = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = serviceNames[service.id];

        const price = document.createElement("small");
        price.textContent =
            `From KSh ${service.price.toLocaleString("en-KE")}`;

        details.append(name, price);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remove";

        remove.addEventListener("click", () => {
            myServices = myServices.filter(
                item => item.id !== service.id
            );

            serviceMessage.textContent =
                "Service removed from this preview.";

            renderServices();
        });

        card.append(details, remove);
        myServicesList.appendChild(card);
    });
}

addServiceForm.addEventListener("submit", event => {
    event.preventDefault();

    const serviceId =
        document.getElementById("newService").value;

    const price = Number(
        document.getElementById("servicePrice").value
    );

    if (!serviceNames[serviceId]) {
        serviceMessage.textContent =
            "Please select a valid service.";
        return;
    }

    if (!Number.isSafeInteger(price) || price <= 0) {
        serviceMessage.textContent =
            "Enter a valid whole-number starting price.";
        return;
    }

    if (myServices.some(item => item.id === serviceId)) {
        serviceMessage.textContent =
            "This service is already in your list.";
        return;
    }

    myServices.push({
        id: serviceId,
        price
    });

    addServiceForm.reset();

    serviceMessage.textContent =
        "Service added to this frontend preview.";

    renderServices();
});

// ------------------------------------------
// 8. PROFESSIONAL PROFILE PREVIEW
// ------------------------------------------

const cleanerProfileForm =
    document.getElementById("cleanerProfileForm");

cleanerProfileForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!cleanerProfileForm.reportValidity()) return;

    const name =
        document.getElementById("profileName").value.trim();

    const location =
        document.getElementById("profileLocation").value.trim();

    const bio =
        document.getElementById("profileBio").value.trim();

    const message =
        document.getElementById("profileMessage");

    if (!name || !location || !bio) {
        message.textContent =
            "Please complete all profile fields.";
        return;
    }

    message.textContent =
        "Profile validated successfully. " +
        "Changes are not saved or published. " +
        "Backend integration is still pending.";
});

// ------------------------------------------
// 9. INITIALIZE DASHBOARD
// ------------------------------------------

selectedDateLabel.textContent =
    new Intl.DateTimeFormat("en-KE", {
        dateStyle: "full"
    }).format(today);

renderRequests();
updateStatistics();
renderMiniCalendar();
renderFullCalendar();
renderServices();
refreshSharedRequests();
