
"use strict";

/* =========================================================
   SAFILINK — BLOCK 25
   CUSTOMER DASHBOARD FRONTEND

   Frontend-only demonstration.
   No real authentication, database or payment processing.
   ========================================================= */

(() => {
    // -----------------------------------------------------
    // 1. CONFIGURATION
    // -----------------------------------------------------

    const BOOKING_STORAGE_KEY = "safiSharedBookingsV1";
    const PROFILE_STORAGE_KEY = "safiCustomerProfileV1";
    const SAVED_STORAGE_KEY = "safiSavedCleanersV1";

    const bookingStore = window.SAFI_BOOKING_STORE;

    const $ = id => document.getElementById(id);

    const today = new Date();

    let displayedMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    let selectedDate = formatDateKey(today);
    let activeBookingId = null;

    let customerBookings = [];
    let savedCleaners = [];

    const statusLabels = {
        preview: "Preview",
        pending: "Pending",
        confirmed: "Confirmed",
        completed: "Completed",
        cancelled: "Cancelled",
        declined: "Declined"
    };

    // -----------------------------------------------------
    // 2. UTILITIES
    // -----------------------------------------------------

    function formatDateKey(date) {
        const year = date.getFullYear();
        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function formatDate(value) {
        if (!value) return "Date not specified";

        const date = new Date(`${value}T12:00:00`);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("en-KE", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);
    }

    function formatCurrency(value) {
        return `KSh ${Number(value || 0)
            .toLocaleString("en-KE")}`;
    }

    function setText(id, value) {
        const element = $(id);

        if (element) {
            element.textContent = String(value);
        }
    }

    function readJSON(key, fallback) {
        try {
            const stored = localStorage.getItem(key);

            if (!stored) return fallback;

            return JSON.parse(stored);
        } catch (error) {
            console.warn(
                `Unable to read ${key}:`,
                error
            );

            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;
        } catch (error) {
            console.warn(
                `Unable to save ${key}:`,
                error
            );

            return false;
        }
    }

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = String(text);
        }

        return element;
    }

    function getCustomerEmail() {
        return String(
            $("customerProfileEmail")?.value || ""
        ).trim().toLowerCase();
    }

    function normalizeBooking(booking, source) {
        return {
            ...booking,
            id: String(booking.id || ""),
            cleanerId: booking.cleanerId ?? null,
            cleanerName:
                booking.cleanerName ||
                booking.cleaner ||
                "Cleaning Professional",
            service:
                booking.service ||
                booking.serviceName ||
                "Cleaning Service",
            date: booking.date || "",
            time: booking.time || "",
            total: Number(
                booking.total ??
                booking.price ??
                0
            ),
            status:
                source === "preview"
                    ? "preview"
                    : String(
                        booking.status || "pending"
                    ).toLowerCase(),
            source
        };
    }

    // -----------------------------------------------------
    // 3. NAVIGATION
    // -----------------------------------------------------

    const dashboardPages = document.querySelectorAll(
        ".customer-page"
    );

    const navigationButtons = document.querySelectorAll(
        "[data-page]"
    );

    function showPage(pageName) {
        const target =
            $(`page-${pageName}`) ||
            $(`customer-page-${pageName}`);

        if (!target) return;

        dashboardPages.forEach(page => {
            page.hidden = page !== target;
        });

        document.querySelectorAll(
            ".customer-nav-link"
        ).forEach(link => {
            const active =
                link.dataset.page === pageName;

            link.classList.toggle("active", active);

            if (active) {
                link.setAttribute(
                    "aria-current",
                    "page"
                );
            } else {
                link.removeAttribute("aria-current");
            }
        });

        const sidebar = $("customerSidebar");

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        const toggle = $("customerMenuToggle");

        if (toggle) {
            toggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        if (pageName === "calendar") {
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

    const sidebar = $("customerSidebar");
    const menuToggle = $("customerMenuToggle");

    if (sidebar && menuToggle) {
        menuToggle.addEventListener("click", () => {
            const isOpen =
                sidebar.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }

    // -----------------------------------------------------
    // 4. CUSTOMER PROFILE
    // -----------------------------------------------------

    function loadCustomerProfile() {
        const profile = readJSON(
            PROFILE_STORAGE_KEY,
            null
        );

        if (!profile) return;

        const fields = {
            customerProfileName: profile.name,
            customerProfileEmail: profile.email,
            customerProfilePhone: profile.phone,
            customerProfileLocation: profile.location
        };

        Object.entries(fields).forEach(
            ([id, value]) => {
                if ($(id) && value !== undefined) {
                    $(id).value = value;
                }
            }
        );

        updateCustomerIdentity();
    }

    function updateCustomerIdentity() {
        const name = String(
            $("customerProfileName")?.value ||
            "Customer"
        ).trim();

        const firstName =
            name.split(/\s+/)[0] || "Customer";

        document.querySelectorAll(
            "[data-customer-name]"
        ).forEach(element => {
            element.textContent = firstName;
        });

        document.querySelectorAll(
            "[data-customer-initial]"
        ).forEach(element => {
            element.textContent =
                firstName.charAt(0).toUpperCase();
        });
    }

    const profileForm = $("customerProfileForm");

    profileForm?.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            if (!profileForm.reportValidity()) {
                return;
            }

            const profile = {
                name: String(
                    $("customerProfileName")?.value || ""
                ).trim(),
                email: getCustomerEmail(),
                phone: String(
                    $("customerProfilePhone")?.value || ""
                ).trim(),
                location: String(
                    $("customerProfileLocation")?.value || ""
                ).trim(),
                updatedAt: new Date().toISOString()
            };

            if (!profile.name || !profile.email) {
                alert(
                    "Please provide your name and email."
                );
                return;
            }

            const saved = writeJSON(
                PROFILE_STORAGE_KEY,
                profile
            );

            if (!saved) {
                alert(
                    "Unable to save your profile locally."
                );
                return;
            }

            updateCustomerIdentity();
            refreshDashboard();

            alert(
                "Your demonstration profile was saved."
            );
        }
    );

    // -----------------------------------------------------
    // 5. LOAD CUSTOMER BOOKINGS
    // -----------------------------------------------------

    function loadSharedBookings() {
        if (
            !bookingStore ||
            typeof bookingStore.getCustomerBookings !==
                "function"
        ) {
            console.warn(
                "SAFILINK booking store is unavailable."
            );

            return [];
        }

        const email = getCustomerEmail();

        if (!email) return [];

        const bookings =
            bookingStore.getCustomerBookings(email);

        if (!Array.isArray(bookings)) return [];

        return bookings.map(booking =>
            normalizeBooking(booking, "shared")
        );
    }

    function loadPreviewBookings() {
        const previews = readJSON(
            "safiBookingPreviews",
            []
        );

        if (!Array.isArray(previews)) {
            return [];
        }

        const email = getCustomerEmail();

        if (!email) return [];

        return previews
            .filter(booking =>
                String(
                    booking.customerEmail || ""
                ).trim().toLowerCase() === email
            )
            .map(booking =>
                normalizeBooking(booking, "preview")
            );
    }

    function loadCustomerBookings() {
        const shared = loadSharedBookings();
        const previews = loadPreviewBookings();

        const sharedIds = new Set(
            shared.map(booking => booking.id)
        );

        const uniquePreviews = previews.filter(
            booking =>
                booking.id &&
                !sharedIds.has(booking.id)
        );

        customerBookings = [
            ...shared,
            ...uniquePreviews
        ].sort((a, b) => {
            const first =
                `${a.date}T${a.time}`;

            const second =
                `${b.date}T${b.time}`;

            return second.localeCompare(first);
        });
    }

    // -----------------------------------------------------
    // 6. DASHBOARD STATISTICS
    // -----------------------------------------------------

    function updateStatistics() {
        const total = customerBookings.length;

        const now = new Date();
        const currentTime =
            `${formatDateKey(now)}T` +
            now.toTimeString().slice(0, 5);

        const upcoming = customerBookings.filter(
            booking =>
                ["pending", "confirmed"].includes(
                    booking.status
                ) &&
                `${booking.date}T${booking.time}` >=
                    currentTime
        ).length;

        const completed = customerBookings.filter(
            booking =>
                booking.status === "completed"
        ).length;

        setText("customerStatTotal", total);
        setText("customerStatUpcoming", upcoming);
        setText("customerStatCompleted", completed);
        setText(
            "customerStatSaved",
            savedCleaners.length
        );
    }

    // -----------------------------------------------------
    // 7. BOOKING CARDS
    // -----------------------------------------------------

    function createBookingCard(booking) {
        const card = makeElement(
            "article",
            "customer-booking-card"
        );

        const content = makeElement(
            "div",
            "customer-booking-content"
        );

        const heading = makeElement(
            "h3",
            "",
            booking.service
        );

        const cleaner = makeElement(
            "p",
            "",
            `Cleaner: ${booking.cleanerName}`
        );

        const schedule = makeElement(
            "p",
            "",
            `${formatDate(booking.date)} at ` +
            `${booking.time || "Time not set"}`
        );

        const reference = makeElement(
            "small",
            "",
            `Booking: ${booking.id}`
        );

        content.append(
            heading,
            cleaner,
            schedule,
            reference
        );

        const meta = makeElement(
            "div",
            "customer-booking-meta"
        );

        const price = makeElement(
            "strong",
            "",
            formatCurrency(booking.total)
        );

        const status = makeElement(
            "span",
            `customer-booking-status ${booking.status}`,
            statusLabels[booking.status] ||
                booking.status
        );

        const detailsButton = makeElement(
            "button",
            "customer-booking-details",
            "View Details"
        );

        detailsButton.type = "button";

        detailsButton.addEventListener(
            "click",
            () => openBookingModal(booking.id)
        );

        meta.append(
            price,
            status,
            detailsButton
        );

        card.append(content, meta);

        return card;
    }

    function renderBookingList(container, bookings) {
        if (!container) return;

        container.replaceChildren();

        if (bookings.length === 0) {
            container.appendChild(
                makeElement(
                    "p",
                    "customer-empty-state",
                    "No bookings match this view."
                )
            );

            return;
        }

        bookings.forEach(booking => {
            container.appendChild(
                createBookingCard(booking)
            );
        });
    }

    function renderBookings() {
        const recent = customerBookings.slice(0, 3);

        renderBookingList(
            $("customerRecentBookings"),
            recent
        );

        const filter =
            $("customerBookingFilter")?.value ||
            "all";

        const filtered =
            filter === "all"
                ? customerBookings
                : customerBookings.filter(
                    booking =>
                        booking.status === filter
                );

        renderBookingList(
            $("customerAllBookings"),
            filtered
        );
    }

    $("customerBookingFilter")?.addEventListener(
        "change",
        renderBookings
    );

    // -----------------------------------------------------
    // 8. BOOKING DETAILS MODAL
    // -----------------------------------------------------

    function getBookingById(id) {
        return customerBookings.find(
            booking => booking.id === id
        );
    }

    function openBookingModal(id) {
        const booking = getBookingById(id);
        const modal = $("customerBookingModal");
        const details = $("customerModalDetails");

        if (!booking || !modal || !details) {
            return;
        }

        activeBookingId = booking.id;

        details.replaceChildren();

        const information = [
            ["Booking Reference", booking.id],
            ["Service", booking.service],
            ["Cleaning Professional", booking.cleanerName],
            ["Date", formatDate(booking.date)],
            ["Time", booking.time || "Not specified"],
            ["Amount", formatCurrency(booking.total)],
            [
                "Status",
                statusLabels[booking.status] ||
                    booking.status
            ],
            [
                "Location",
                [
                    booking.address,
                    booking.county
                ].filter(Boolean).join(", ") ||
                    "Not specified"
            ]
        ];

        information.forEach(([label, value]) => {
            const row = makeElement(
                "div",
                "customer-modal-detail-row"
            );

            const name = makeElement(
                "strong",
                "",
                label
            );

            const description = makeElement(
                "span",
                "",
                value
            );

            row.append(name, description);
            details.appendChild(row);
        });

        const rescheduleButton =
            $("customerModalReschedule");

        const cancelButton =
            $("customerModalCancel");

        const saveButton =
            $("customerModalSave");

        const removeButton =
            $("customerModalRemove");

        
        // BLOCK 26B — Customer booking management

        const canManage =
            booking.source === "shared" &&
            ["pending", "confirmed"].includes(
                booking.status
            );

        const storeReady =
            typeof bookingStore?.cancelBooking === "function" &&
            typeof bookingStore?.rescheduleBooking === "function";

        const scheduledTime = new Date(
            `${booking.date}T${booking.time}:00`
        );

        const isFuture =
            !Number.isNaN(scheduledTime.getTime()) &&
            scheduledTime.getTime() > Date.now();

        const showActions =
            canManage && storeReady && isFuture;

        if (rescheduleButton) {
            rescheduleButton.hidden = !showActions;
        }

        if (cancelButton) {
            cancelButton.hidden = !showActions;
        }

        if (saveButton) {
            saveButton.hidden = true;
        }

        if (removeButton) {
            removeButton.hidden = true;
        }

        const form = $("customerRescheduleForm");

        if (form) {
            form.hidden = true;
        }

        const dateInput = $("customerRescheduleDate");
        const timeInput = $("customerRescheduleTime");

        if (dateInput) {
            dateInput.value = booking.date;
            dateInput.min = formatDateKey(new Date());
        }

        if (timeInput) {
            timeInput.value = booking.time;
        }

        setText("customerModalMessage", "");


        modal.hidden = false;

        if (typeof modal.showModal === "function" &&
            modal.tagName === "DIALOG") {
            if (!modal.open) {
                modal.showModal();
            }
        }
    }

    
    // -----------------------------------------------------
    // BLOCK 26B — CUSTOMER BOOKING ACTIONS
    // -----------------------------------------------------

    function showBookingMessage(message) {
        setText("customerModalMessage", message);
    }

    function getActiveSharedBooking() {
        if (!activeBookingId) return null;

        const booking = getBookingById(activeBookingId);

        if (
            !booking ||
            booking.source !== "shared"
        ) {
            return null;
        }

        return booking;
    }

    // CANCEL BOOKING

    $("customerModalCancel")?.addEventListener(
        "click",
        () => {
            const booking = getActiveSharedBooking();

            if (!booking) {
                showBookingMessage(
                    "No submitted booking was selected."
                );
                return;
            }

            if (
                typeof bookingStore?.cancelBooking !==
                "function"
            ) {
                showBookingMessage(
                    "Booking cancellation is unavailable."
                );
                return;
            }

            const confirmed = window.confirm(
                "Are you sure you want to cancel this booking?"
            );

            if (!confirmed) return;

            const result = bookingStore.cancelBooking(
                booking.id,
                getCustomerEmail()
            );

            if (!result.success) {
                showBookingMessage(
                    result.message ||
                    "Unable to cancel the booking."
                );
                return;
            }

            refreshDashboard();
            closeBookingModal();

            alert(
                result.message ||
                "Booking cancelled successfully."
            );
        }
    );

    // SHOW RESCHEDULE FORM

    $("customerModalReschedule")?.addEventListener(
        "click",
        () => {
            const booking = getActiveSharedBooking();

            if (!booking) {
                showBookingMessage(
                    "Select a submitted booking first."
                );
                return;
            }

            const form = $("customerRescheduleForm");

            if (!form) {
                showBookingMessage(
                    "The rescheduling form was not found."
                );
                return;
            }

            form.hidden = false;

            const dateInput =
                $("customerRescheduleDate");

            const timeInput =
                $("customerRescheduleTime");

            if (dateInput) {
                dateInput.value = booking.date;
                dateInput.min =
                    formatDateKey(new Date());
            }

            if (timeInput) {
                timeInput.value = booking.time;
            }

            showBookingMessage(
                "Choose your preferred new date and time."
            );
        }
    );

    // SUBMIT RESCHEDULING REQUEST

    $("customerRescheduleForm")?.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            const booking = getActiveSharedBooking();

            if (!booking) {
                showBookingMessage(
                    "No active booking was selected."
                );
                return;
            }

            if (
                typeof bookingStore?.rescheduleBooking !==
                "function"
            ) {
                showBookingMessage(
                    "Booking rescheduling is unavailable."
                );
                return;
            }

            const dateInput =
                $("customerRescheduleDate");

            const timeInput =
                $("customerRescheduleTime");

            if (!dateInput || !timeInput) {
                showBookingMessage(
                    "Rescheduling fields are missing."
                );
                return;
            }

            const newDate = dateInput.value;
            const newTime = timeInput.value;

            if (!newDate || !newTime) {
                showBookingMessage(
                    "Please choose a date and time."
                );
                return;
            }

            const result =
                bookingStore.rescheduleBooking(
                    booking.id,
                    getCustomerEmail(),
                    newDate,
                    newTime
                );

            if (!result.success) {
                showBookingMessage(
                    result.message ||
                    "Unable to reschedule the booking."
                );
                return;
            }

            refreshDashboard();
            closeBookingModal();

            alert(
                result.message ||
                "Rescheduling request submitted."
            );
        }
    );

    
    // =====================================================
    // BLOCK 26B — CUSTOMER BOOKING ACTION HANDLERS
    // =====================================================

    function showBookingMessage(message) {
        setText("customerModalMessage", message);
    }

    function getActiveSharedBooking() {
        if (!activeBookingId) return null;

        const booking = getBookingById(activeBookingId);

        if (!booking || booking.source !== "shared") {
            return null;
        }

        return booking;
    }

    // -----------------------------------------------------
    // 1. CANCEL A BOOKING
    // -----------------------------------------------------

    $("customerModalCancel")?.addEventListener(
        "click",
        () => {
            const booking = getActiveSharedBooking();

            if (!booking) {
                showBookingMessage(
                    "No submitted booking was selected."
                );
                return;
            }

            if (
                typeof bookingStore?.cancelBooking !==
                "function"
            ) {
                showBookingMessage(
                    "Booking cancellation is unavailable."
                );
                return;
            }

            const confirmed = window.confirm(
                "Are you sure you want to cancel this booking?"
            );

            if (!confirmed) return;

            const result = bookingStore.cancelBooking(
                booking.id,
                getCustomerEmail()
            );

            if (!result.success) {
                showBookingMessage(
                    result.message ||
                    "Unable to cancel the booking."
                );
                return;
            }

            refreshDashboard();
            closeBookingModal();

            alert(
                result.message ||
                "Booking cancelled successfully."
            );
        }
    );

    // -----------------------------------------------------
    // 2. OPEN RESCHEDULING FORM
    // -----------------------------------------------------

    $("customerModalReschedule")?.addEventListener(
        "click",
        () => {
            const booking = getActiveSharedBooking();

            if (!booking) {
                showBookingMessage(
                    "Select a submitted booking first."
                );
                return;
            }

            const form = $("customerRescheduleForm");

            if (!form) {
                showBookingMessage(
                    "The rescheduling form was not found."
                );
                return;
            }

            form.hidden = false;

            const dateInput =
                $("customerRescheduleDate");

            const timeInput =
                $("customerRescheduleTime");

            if (dateInput) {
                dateInput.value = booking.date;
                dateInput.min =
                    formatDateKey(new Date());
            }

            if (timeInput) {
                timeInput.value = booking.time;
            }

            showBookingMessage(
                "Choose your preferred new date and time."
            );
        }
    );

    // -----------------------------------------------------
    // 3. SUBMIT RESCHEDULING REQUEST
    // -----------------------------------------------------

    $("customerRescheduleForm")?.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            const booking = getActiveSharedBooking();

            if (!booking) {
                showBookingMessage(
                    "No active booking was selected."
                );
                return;
            }

            if (
                typeof bookingStore?.rescheduleBooking !==
                "function"
            ) {
                showBookingMessage(
                    "Booking rescheduling is unavailable."
                );
                return;
            }

            const dateInput =
                $("customerRescheduleDate");

            const timeInput =
                $("customerRescheduleTime");

            if (!dateInput || !timeInput) {
                showBookingMessage(
                    "Rescheduling fields are missing."
                );
                return;
            }

            const newDate = dateInput.value;
            const newTime = timeInput.value;

            if (!newDate || !newTime) {
                showBookingMessage(
                    "Please choose a date and time."
                );
                return;
            }

            const result =
                bookingStore.rescheduleBooking(
                    booking.id,
                    getCustomerEmail(),
                    newDate,
                    newTime
                );

            if (!result.success) {
                showBookingMessage(
                    result.message ||
                    "Unable to reschedule the booking."
                );
                return;
            }

            refreshDashboard();
            closeBookingModal();

            alert(
                result.message ||
                "Rescheduling request submitted."
            );
        }
    );

    // =====================================================
    // END BLOCK 26B BOOKING ACTION HANDLERS
    // =====================================================



    function closeBookingModal() {
        const modal = $("customerBookingModal");

        if (!modal) return;

        if (
            modal.tagName === "DIALOG" &&
            modal.open
        ) {
            modal.close();
        } else {
            modal.hidden = true;
        }

        activeBookingId = null;
    }

    $("customerModalClose")?.addEventListener(
        "click",
        closeBookingModal
    );

    $("customerBookingModal")?.addEventListener(
        "click",
        event => {
            if (
                event.target ===
                $("customerBookingModal")
            ) {
                closeBookingModal();
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Escape" &&
                activeBookingId
            ) {
                closeBookingModal();
            }
        }
    );

    // -----------------------------------------------------
    // 9. CALENDAR
    // -----------------------------------------------------

    function bookingsOnDate(date) {
        return customerBookings.filter(
            booking => booking.date === date
        );
    }

    function renderCalendar(container, month, interactive) {
        if (!container) return;

        container.replaceChildren();

        const year = month.getFullYear();
        const monthIndex = month.getMonth();

        const firstDay = new Date(
            year,
            monthIndex,
            1
        ).getDay();

        const daysInMonth = new Date(
            year,
            monthIndex + 1,
            0
        ).getDate();

        for (let i = 0; i < firstDay; i++) {
            container.appendChild(
                makeElement("span", "calendar-spacer")
            );
        }

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {
            const date = new Date(
                year,
                monthIndex,
                day
            );

            const key = formatDateKey(date);

            const button = makeElement(
                "button",
                "calendar-day",
                day
            );

            button.type = "button";

            if (key === formatDateKey(today)) {
                button.classList.add("today");
            }

            if (bookingsOnDate(key).length > 0) {
                button.classList.add("has-booking");
            }

            if (key === selectedDate && interactive) {
                button.classList.add("selected");
            }

            if (interactive) {
                button.setAttribute(
                    "aria-label",
                    key
                );

                button.addEventListener(
                    "click",
                    () => {
                        selectedDate = key;

                        renderFullCalendar();
                        renderDateBookings();
                    }
                );
            } else {
                button.disabled = true;
            }

            container.appendChild(button);
        }
    }

    function renderMiniCalendar() {
        const currentMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        renderCalendar(
            $("customerMiniCalendar"),
            currentMonth,
            false
        );

        setText(
            "customerMiniMonth",
            new Intl.DateTimeFormat("en-KE", {
                month: "long",
                year: "numeric"
            }).format(currentMonth)
        );
    }

    function renderFullCalendar() {
        renderCalendar(
            $("customerFullCalendar"),
            displayedMonth,
            true
        );

        setText(
            "customerCalendarMonth",
            new Intl.DateTimeFormat("en-KE", {
                month: "long",
                year: "numeric"
            }).format(displayedMonth)
        );
    }

    function renderDateBookings() {
        const container =
            $("customerDateBookings");

        if (!container) return;

        const date = new Date(
            `${selectedDate}T12:00:00`
        );

        setText(
            "customerSelectedDateLabel",
            new Intl.DateTimeFormat("en-KE", {
                dateStyle: "full"
            }).format(date)
        );

        renderBookingList(
            container,
            bookingsOnDate(selectedDate)
        );
    }

    function changeCalendarMonth(amount) {
        displayedMonth = new Date(
            displayedMonth.getFullYear(),
            displayedMonth.getMonth() + amount,
            1
        );

        renderFullCalendar();
    }

    [
        ["customerPrevMonth", -1],
        ["customerNextMonth", 1],
        ["customerPrevCalendarMonth", -1],
        ["customerNextCalendarMonth", 1]
    ].forEach(([id, amount]) => {
        $(id)?.addEventListener(
            "click",
            () => changeCalendarMonth(amount)
        );
    });

    // -----------------------------------------------------
    // 10. SAVED CLEANERS
    // -----------------------------------------------------

    function loadSavedCleaners() {
        const saved = readJSON(
            SAVED_STORAGE_KEY,
            []
        );

        savedCleaners = Array.isArray(saved)
            ? saved
            : [];
    }

    function renderSavedCleaners() {
        const container =
            $("customerSavedCleaners");

        if (!container) return;

        container.replaceChildren();

        if (savedCleaners.length === 0) {
            container.appendChild(
                makeElement(
                    "p",
                    "customer-empty-state",
                    "You have not saved any cleaners yet."
                )
            );

            return;
        }

        savedCleaners.forEach(cleaner => {
            const card = makeElement(
                "article",
                "customer-saved-cleaner"
            );

            const name = makeElement(
                "h3",
                "",
                cleaner.name ||
                    "Cleaning Professional"
            );

            const location = makeElement(
                "p",
                "",
                cleaner.location ||
                    "Location not specified"
            );

            const view = makeElement(
                "a",
                "customer-view-cleaner",
                "View Profile"
            );

            view.href =
                `cleaner-profile.html?id=` +
                encodeURIComponent(cleaner.id);

            const remove = makeElement(
                "button",
                "customer-remove-cleaner",
                "Remove"
            );

            remove.type = "button";

            remove.addEventListener(
                "click",
                () => {
                    savedCleaners =
                        savedCleaners.filter(
                            item =>
                                String(item.id) !==
                                String(cleaner.id)
                        );

                    writeJSON(
                        SAVED_STORAGE_KEY,
                        savedCleaners
                    );

                    renderSavedCleaners();
                    updateStatistics();
                }
            );

            card.append(
                name,
                location,
                view,
                remove
            );

            container.appendChild(card);
        });
    }

    // -----------------------------------------------------
    // 11. DASHBOARD REFRESH
    // -----------------------------------------------------

    function refreshDashboard() {
        loadCustomerBookings();

        renderBookings();
        updateStatistics();

        renderMiniCalendar();
        renderFullCalendar();
        renderDateBookings();
    }

    window.addEventListener(
        "safi:bookings-updated",
        refreshDashboard
    );

    window.addEventListener(
        "storage",
        event => {
            if (
                [
                    BOOKING_STORAGE_KEY,
                    PROFILE_STORAGE_KEY,
                    SAVED_STORAGE_KEY,
                    "safiBookingPreviews"
                ].includes(event.key)
            ) {
                if (
                    event.key === PROFILE_STORAGE_KEY
                ) {
                    loadCustomerProfile();
                }

                if (
                    event.key === SAVED_STORAGE_KEY
                ) {
                    loadSavedCleaners();
                    renderSavedCleaners();
                }

                refreshDashboard();
            }
        }
    );

    window.addEventListener(
        "focus",
        refreshDashboard
    );

    // -----------------------------------------------------
    // 12. INITIALIZATION
    // -----------------------------------------------------

    function initializeCustomerDashboard() {
        loadCustomerProfile();
        loadSavedCleaners();

        updateCustomerIdentity();
        renderSavedCleaners();

        refreshDashboard();

        const requestedPage =
            new URLSearchParams(
                window.location.search
            ).get("page");

        if (requestedPage) {
            showPage(requestedPage);
        }

        if (window.location.hash === "#bookings") {
            showPage("bookings");
        }
    }

    initializeCustomerDashboard();

})();
