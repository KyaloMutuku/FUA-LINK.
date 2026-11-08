
"use strict";

/* =========================================================
   SAFILINK — BLOCK 26
   SHARED BOOKING STORE & COMPLETE BOOKING LIFECYCLE

   Frontend demonstration only.
   localStorage is not secure authentication or a database.
   ========================================================= */

window.SAFI_BOOKING_STORE = (() => {

    const STORAGE_KEY = "safiSharedBookingsV1";
    const UPDATE_EVENT = "safi:bookings-updated";

    const ACTIVE_STATUSES = [
        "pending",
        "confirmed"
    ];

    const FINAL_STATUSES = [
        "completed",
        "cancelled",
        "declined"
    ];

    // -----------------------------------------------------
    // 1. STORAGE
    // -----------------------------------------------------

    function readBookings() {
        try {
            const stored = localStorage.getItem(
                STORAGE_KEY
            );

            const bookings = JSON.parse(
                stored || "[]"
            );

            return Array.isArray(bookings)
                ? bookings
                : [];

        } catch (error) {
            console.warn(
                "Unable to read SAFILINK bookings:",
                error
            );

            return [];
        }
    }

    function writeBookings(bookings) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(bookings)
            );

            window.dispatchEvent(
                new CustomEvent(UPDATE_EVENT)
            );

            return true;

        } catch (error) {
            console.warn(
                "Unable to save SAFILINK bookings:",
                error
            );

            return false;
        }
    }

    function resultError(message) {
        return {
            success: false,
            message
        };
    }

    function normalizeEmail(email) {
        return String(email || "")
            .trim()
            .toLowerCase();
    }

    function dateKey(date) {
        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function validSchedule(date, time) {
        if (
            typeof date !== "string" ||
            typeof time !== "string"
        ) {
            return false;
        }

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
        ) {
            return false;
        }

        const parsed = new Date(
            `${date}T${time}:00`
        );

        if (
            Number.isNaN(parsed.getTime()) ||
            dateKey(parsed) !== date
        ) {
            return false;
        }

        return parsed.getTime() > Date.now();
    }

    function createBookingId() {
        const random = Math.random()
            .toString(36)
            .slice(2, 8)
            .toUpperCase();

        return `SAFI-${Date.now()}-${random}`;
    }

    // -----------------------------------------------------
    // 2. BOOKING QUERIES
    // -----------------------------------------------------

    function getCleanerBookings(cleanerId) {
        if (
            cleanerId === null ||
            cleanerId === undefined ||
            String(cleanerId).trim() === ""
        ) {
            return [];
        }

        return readBookings().filter(
            booking =>
                String(booking.cleanerId) ===
                String(cleanerId)
        );
    }

    function getCustomerBookings(email) {
        const normalized = normalizeEmail(email);

        if (!normalized) return [];

        return readBookings().filter(
            booking =>
                normalizeEmail(
                    booking.customerEmail
                ) === normalized
        );
    }

    function getBookingById(bookingId) {
        return readBookings().find(
            booking =>
                String(booking.id) ===
                String(bookingId)
        ) || null;
    }

    // -----------------------------------------------------
    // 3. CONFLICT DETECTION
    // -----------------------------------------------------

    function hasConflict(
        cleanerId,
        date,
        time,
        excludeId = null
    ) {
        return readBookings().some(booking => {

            const sameCleaner =
                String(booking.cleanerId) ===
                String(cleanerId);

            const differentBooking =
                String(booking.id) !==
                String(excludeId);

            const sameSchedule =
                booking.date === date &&
                booking.time === time;

            return (
                sameCleaner &&
                differentBooking &&
                sameSchedule &&
                booking.status === "confirmed"
            );
        });
    }

    // -----------------------------------------------------
    // 4. CREATE BOOKING
    // -----------------------------------------------------

    function createBooking(details) {
        if (
            !details ||
            details.cleanerId === null ||
            details.cleanerId === undefined ||
            String(details.cleanerId).trim() === "" ||
            !details.serviceId ||
            !String(details.customerName || "").trim() ||
            !normalizeEmail(details.customerEmail)
        ) {
            return resultError(
                "Please complete the required booking details."
            );
        }

        if (
            !validSchedule(
                details.date,
                details.time
            )
        ) {
            return resultError(
                "Choose a valid future booking date and time."
            );
        }

        if (
            hasConflict(
                details.cleanerId,
                details.date,
                details.time
            )
        ) {
            return resultError(
                "This cleaner already has a confirmed job at that time."
            );
        }

        const bookings = readBookings();

        let bookingId = createBookingId();

        while (
            bookings.some(
                item => String(item.id) === bookingId
            )
        ) {
            bookingId = createBookingId();
        }

        const booking = {
            ...details,
            id: bookingId,
            customerName:
                String(details.customerName).trim(),
            customerEmail:
                normalizeEmail(details.customerEmail),
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        bookings.unshift(booking);

        if (!writeBookings(bookings)) {
            return resultError(
                "Unable to save your booking."
            );
        }

        return {
            success: true,
            booking,
            message:
                "Booking submitted successfully. Awaiting cleaner confirmation."
        };
    }

    // -----------------------------------------------------
    // 5. CLEANER STATUS CHANGES
    // -----------------------------------------------------

    function updateBookingStatus(
        bookingId,
        cleanerId,
        newStatus
    ) {
        const bookings = readBookings();

        const booking = bookings.find(
            item =>
                String(item.id) ===
                    String(bookingId) &&
                String(item.cleanerId) ===
                    String(cleanerId)
        );

        if (!booking) {
            return resultError(
                "Booking not found for this cleaner."
            );
        }

        const allowedTransitions = {
            pending: ["confirmed", "declined"],
            confirmed: ["completed"],
            completed: [],
            cancelled: [],
            declined: []
        };

        if (
            !allowedTransitions[
                booking.status
            ]?.includes(newStatus)
        ) {
            return resultError(
                "This booking status change is not allowed."
            );
        }

        if (newStatus === "confirmed") {

            if (
                hasConflict(
                    cleanerId,
                    booking.date,
                    booking.time,
                    booking.id
                )
            ) {
                return resultError(
                    "Another confirmed booking already occupies this time."
                );
            }

            if (
                !validSchedule(
                    booking.date,
                    booking.time
                )
            ) {
                return resultError(
                    "This booking's scheduled time has already passed."
                );
            }
        }

        booking.status = newStatus;
        booking.updatedAt =
            new Date().toISOString();

        if (newStatus === "confirmed") {
            booking.confirmedAt =
                booking.updatedAt;
        }

        if (newStatus === "completed") {
            booking.completedAt =
                booking.updatedAt;
        }

        if (newStatus === "declined") {
            booking.declinedAt =
                booking.updatedAt;
        }

        if (!writeBookings(bookings)) {
            return resultError(
                "Unable to update the booking status."
            );
        }

        return {
            success: true,
            booking,
            message:
                `Booking status changed to ${newStatus}.`
        };
    }

    // -----------------------------------------------------
    // 6. CUSTOMER CANCELLATION
    // -----------------------------------------------------

    function cancelBooking(
        bookingId,
        customerEmail
    ) {
        const bookings = readBookings();

        const booking = bookings.find(
            item =>
                String(item.id) ===
                    String(bookingId) &&
                normalizeEmail(
                    item.customerEmail
                ) ===
                    normalizeEmail(customerEmail)
        );

        if (!booking) {
            return resultError(
                "Booking not found for this customer."
            );
        }

        if (
            !ACTIVE_STATUSES.includes(
                booking.status
            )
        ) {
            return resultError(
                "Only pending or confirmed bookings can be cancelled."
            );
        }

        booking.status = "cancelled";
        booking.cancelledAt =
            new Date().toISOString();
        booking.updatedAt =
            booking.cancelledAt;

        if (!writeBookings(bookings)) {
            return resultError(
                "Unable to cancel this booking."
            );
        }

        return {
            success: true,
            booking,
            message:
                "Your booking has been cancelled."
        };
    }

    // -----------------------------------------------------
    // 7. CUSTOMER RESCHEDULING
    // -----------------------------------------------------

    function rescheduleBooking(
        bookingId,
        customerEmail,
        newDate,
        newTime
    ) {
        const bookings = readBookings();

        const booking = bookings.find(
            item =>
                String(item.id) ===
                    String(bookingId) &&
                normalizeEmail(
                    item.customerEmail
                ) ===
                    normalizeEmail(customerEmail)
        );

        if (!booking) {
            return resultError(
                "Booking not found for this customer."
            );
        }

        if (
            !ACTIVE_STATUSES.includes(
                booking.status
            )
        ) {
            return resultError(
                "This booking cannot be rescheduled."
            );
        }

        if (
            !validSchedule(
                newDate,
                newTime
            )
        ) {
            return resultError(
                "Choose a valid future date and time."
            );
        }

        if (
            hasConflict(
                booking.cleanerId,
                newDate,
                newTime,
                booking.id
            )
        ) {
            return resultError(
                "The cleaner is already booked at that time."
            );
        }

        if (
            booking.date === newDate &&
            booking.time === newTime
        ) {
            return resultError(
                "Please choose a different date or time."
            );
        }

        booking.previousSchedule = {
            date: booking.date,
            time: booking.time
        };

        booking.date = newDate;
        booking.time = newTime;

        // The cleaner must approve the new schedule.
        booking.status = "pending";

        booking.rescheduledAt =
            new Date().toISOString();

        booking.updatedAt =
            booking.rescheduledAt;

        if (!writeBookings(bookings)) {
            return resultError(
                "Unable to reschedule your booking."
            );
        }

        return {
            success: true,
            booking,
            message:
                "Rescheduling request submitted. Awaiting cleaner confirmation."
        };
    }

    // -----------------------------------------------------
    // 8. EXPORTED PUBLIC INTERFACE
    // -----------------------------------------------------

    return {
        STORAGE_KEY,
        ACTIVE_STATUSES,
        FINAL_STATUSES,

        readBookings,
        createBooking,

        getCleanerBookings,
        getCustomerBookings,
        getBookingById,

        hasConflict,
        updateBookingStatus,

        cancelBooking,
        rescheduleBooking
    };

})();
