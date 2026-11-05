
"use strict";

/* ==========================================
   FUA LINK — BLOCK 20
   SHARED BOOKING STORE

   Frontend demonstration only.
   Not a real booking API or database.
   ========================================== */

window.FUA_BOOKING_STORE = (() => {

    const STORAGE_KEY = "fuaSharedBookingsV1";

    const ACTIVE_STATUSES = [
        "pending",
        "confirmed"
    ];

    function readBookings() {
        try {
            const data = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            return Array.isArray(data) ? data : [];

        } catch (error) {
            console.warn("Booking storage error:", error);
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
                new CustomEvent("fua:bookings-updated")
            );

            return true;

        } catch (error) {
            console.warn("Could not save bookings:", error);
            return false;
        }
    }

    function createBooking(details) {
        if (
            !details ||
            details.cleanerId === null ||
            details.cleanerId === undefined ||
            !details.serviceId ||
            !details.date ||
            !details.time ||
            !details.customerName
        ) {
            return {
                success: false,
                message: "Booking information is incomplete."
            };
        }

        const bookings = readBookings();

        const booking = {
            ...details,
            id: details.id ||
                `FUA-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        bookings.unshift(booking);

        if (!writeBookings(bookings)) {
            return {
                success: false,
                message: "Unable to save booking."
            };
        }

        return {
            success: true,
            booking
        };
    }

    function getCleanerBookings(cleanerId) {
        return readBookings().filter(
            booking =>
                String(booking.cleanerId) ===
                String(cleanerId)
        );
    }

    function getCustomerBookings(email) {
        const normalizedEmail = String(email || "")
            .trim()
            .toLowerCase();

        if (!normalizedEmail) return [];

        return readBookings().filter(
            booking =>
                String(booking.customerEmail || "")
                    .trim()
                    .toLowerCase() === normalizedEmail
        );
    }

    function hasConflict(cleanerId, date, time, excludeId) {
        return readBookings().some(booking =>
            String(booking.cleanerId) ===
                String(cleanerId) &&
            booking.id !== excludeId &&
            booking.date === date &&
            booking.time === time &&
            booking.status === "confirmed"
        );
    }

    function updateBookingStatus(
        bookingId,
        cleanerId,
        newStatus
    ) {
        const bookings = readBookings();

        const booking = bookings.find(
            item =>
                item.id === bookingId &&
                String(item.cleanerId) ===
                    String(cleanerId)
        );

        if (!booking) {
            return {
                success: false,
                message: "Booking not found."
            };
        }

        const allowed = {
            pending: ["confirmed", "declined"],
            confirmed: ["completed"],
            declined: [],
            completed: []
        };

        if (
            !allowed[booking.status]?.includes(newStatus)
        ) {
            return {
                success: false,
                message: "Invalid booking status change."
            };
        }

        if (
            newStatus === "confirmed" &&
            hasConflict(
                cleanerId,
                booking.date,
                booking.time,
                booking.id
            )
        ) {
            return {
                success: false,
                message: "Another confirmed booking already uses this time."
            };
        }

        booking.status = newStatus;
        booking.updatedAt = new Date().toISOString();

        if (!writeBookings(bookings)) {
            return {
                success: false,
                message: "Could not save status change."
            };
        }

        return {
            success: true,
            booking
        };
    }

    return {
        readBookings,
        createBooking,
        getCleanerBookings,
        getCustomerBookings,
        hasConflict,
        updateBookingStatus,
        ACTIVE_STATUSES
    };

})();
