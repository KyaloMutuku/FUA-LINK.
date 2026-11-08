
"use strict";

/* ==========================================
   SAFI LINK — BLOCK 9
   ADVANCED BOOKING EXPERIENCE

   FRONTEND DEMONSTRATION ONLY
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // --------------------------------------
    // 1. SERVICE INFORMATION
    // --------------------------------------

    const services = {
        home: {
            name: "Home Cleaning",
            icon: "⌂",
            description: "Fresh, comfortable living spaces.",
            price: 1500
        },
        office: {
            name: "Office Cleaning",
            icon: "▣",
            description: "A spotless professional workspace.",
            price: 2500
        },
        deep: {
            name: "Deep Cleaning",
            icon: "✧",
            description: "Detailed, intensive cleaning.",
            price: 3500
        },
        vehicle: {
            name: "Vehicle Cleaning",
            icon: "🚗",
            description: "Keep your vehicle looking fresh.",
            price: 800
        },
        laundry: {
            name: "Laundry Services",
            icon: "◈",
            description: "Care for your everyday fabrics.",
            price: 1200
        },
        commercial: {
            name: "Shop & Restaurant Cleaning",
            icon: "▤",
            description: "Clean and welcoming business spaces.",
            price: 3000
        },
        gardening: {
            name: "Gardening & Outdoor Care",
            icon: "🌿",
            description: "Beautiful, tidy outdoor spaces.",
            price: 1800
        }
    };

    
/* =====================================================
   BLOCK 21 — DEEP CLEANING TASK CATALOG
   ===================================================== */

const deepCleaningCatalog = {

    residential: {
        "Kitchen & Food Preparation": [
            "Degrease cooker and stovetop",
            "Clean oven interior",
            "Clean refrigerator interior",
            "Clean microwave interior",
            "Scrub kitchen sink and taps",
            "Clean cabinet interiors",
            "Clean cabinet exteriors",
            "Degrease extractor hood",
            "Scrub wall tiles and grout",
            "Clean behind movable appliances",
            "Disinfect kitchen countertops"
        ],

        "Bathrooms & Toilets": [
            "Remove limescale from taps",
            "Scrub toilet bowl and base",
            "Deep clean shower enclosure",
            "Scrub bathroom tiles and grout",
            "Remove soap scum",
            "Clean bathtub",
            "Clean bathroom cabinets",
            "Disinfect sinks and countertops",
            "Clean mirrors and glass",
            "Scrub bathroom floors"
        ],

        "Bedrooms & Living Areas": [
            "Move accessible furniture and clean underneath",
            "Vacuum upholstered furniture",
            "Clean skirting boards",
            "Dust ceilings and corners",
            "Clean interior doors",
            "Clean door frames and handles",
            "Clean wardrobes and drawers",
            "Remove cobwebs",
            "Clean switches and accessible fittings",
            "Deep clean floors"
        ],

        "Windows, Floors & Finishing": [
            "Clean accessible interior windows",
            "Clean window tracks",
            "Clean window frames",
            "Clean accessible window grills",
            "Scrub tile floors",
            "Deep clean carpeted areas",
            "Clean staircases",
            "Clean balconies",
            "Clean accessible light fittings",
            "Clean interior wall marks"
        ]
    },

    office: {
        "Workstations & Equipment": [
            "Clean desks and work surfaces",
            "Sanitize frequently touched surfaces",
            "Clean office chairs",
            "Clean accessible monitor exteriors",
            "Clean keyboard exteriors",
            "Clean telephone exteriors",
            "Clean storage cabinets",
            "Clean workstation partitions",
            "Clean conference tables"
        ],

        "Shared Office Spaces": [
            "Deep clean meeting rooms",
            "Clean reception area",
            "Clean staff kitchen",
            "Deep clean office washrooms",
            "Clean corridors and stairways",
            "Clean break rooms",
            "Clean interior glass partitions",
            "Clean accessible ventilation grilles"
        ],

        "Floors & Finishing": [
            "Deep vacuum carpets",
            "Scrub tiled floors",
            "Clean skirting boards",
            "Remove cobwebs",
            "Clean window tracks",
            "Clean interior doors",
            "Clean lift lobby surfaces",
            "Disinfect high-touch surfaces"
        ]
    },

    commercial: {
        "Retail & Customer Areas": [
            "Clean display shelves",
            "Clean merchandise display units",
            "Deep clean counters",
            "Clean fitting rooms",
            "Clean customer waiting areas",
            "Clean entrance glass",
            "Clean interior signage",
            "Disinfect frequently touched surfaces"
        ],

        "Storage & Operations": [
            "Clean stockroom floors",
            "Clean accessible storage shelving",
            "Clean staff rooms",
            "Deep clean washrooms",
            "Clean accessible storage cabinets",
            "Remove cobwebs",
            "Clean loading-area floors"
        ],

        "Floor & Surface Treatment": [
            "Machine scrub suitable floors",
            "Remove floor stains",
            "Deep clean tile grout",
            "Clean skirting boards",
            "Clean accessible interior windows",
            "Degrease suitable work surfaces",
            "Clean interior doors and frames"
        ]
    },

    hospitality: {
        "Commercial Kitchen": [
            "Degrease cooking surfaces",
            "Deep clean accessible extractor surfaces",
            "Clean oven interiors",
            "Clean preparation counters",
            "Clean kitchen wall tiles",
            "Clean kitchen floor drains externally",
            "Clean refrigerator exteriors",
            "Clean accessible refrigerator interiors",
            "Clean stainless-steel surfaces",
            "Deep clean kitchen floors"
        ],

        "Dining & Guest Areas": [
            "Deep clean dining tables",
            "Clean dining chairs",
            "Clean booth seating",
            "Clean service counters",
            "Clean accessible glass partitions",
            "Clean reception area",
            "Clean guest washrooms",
            "Clean entrance areas"
        ],

        "Back-of-House": [
            "Clean staff changing areas",
            "Clean storage room floors",
            "Clean accessible storage shelving",
            "Clean waste-bin exteriors",
            "Degrease suitable floors",
            "Clean staff washrooms",
            "Clean accessible non-food-contact equipment exteriors"
        ]
    },

    vehicle: {
        "Interior Detailing": [
            "Deep vacuum seats",
            "Deep vacuum carpets",
            "Clean dashboard",
            "Clean door panels",
            "Clean cup holders",
            "Clean seat rails",
            "Clean boot / trunk",
            "Clean interior windows",
            "Clean accessible air vents",
            "Clean floor mats"
        ],

        "Exterior Detailing": [
            "Thorough exterior wash",
            "Clean wheel rims",
            "Clean wheel arches",
            "Remove suitable surface contaminants",
            "Clean door jambs",
            "Clean exterior windows",
            "Clean exterior trim",
            "Clean number plate surrounds"
        ],

        "Special Treatments": [
            "Fabric seat shampoo",
            "Carpet shampoo",
            "Leather-safe surface cleaning",
            "Odour treatment",
            "Stain removal",
            "Interior steam cleaning where suitable",
            "Engine bay surface cleaning subject to assessment"
        ]
    },

    outdoor: {
        "Compound & Hard Surfaces": [
            "Scrub patios",
            "Clean walkways",
            "Clean driveways",
            "Clean exterior stairs",
            "Clean accessible boundary walls",
            "Clean outdoor furniture",
            "Remove cobwebs from accessible surfaces",
            "Clean outdoor bins"
        ],

        "Gardens & Outdoor Spaces": [
            "Remove accumulated leaves",
            "Clear loose debris",
            "Clean garden pathways",
            "Clean outdoor seating areas",
            "Clean accessible planters",
            "Clean outdoor storage surfaces",
            "Tidy designated garden areas"
        ],

        "Specialized Outdoor Cleaning": [
            "Pressure wash suitable paving",
            "Clean suitable exterior tiles",
            "Clean accessible exterior windows",
            "Clean balcony floors",
            "Remove suitable algae buildup",
            "Clean garage floors",
            "Clean outdoor drainage covers"
        ]
    }
};

/* =====================================================
   BLOCK 21 — DEEP CLEANING INTERACTIONS
   ===================================================== */

const deepTasksContainer = document.getElementById(
    "deepTasksContainer"
);

const deepSectorInputs = document.querySelectorAll(
    'input[name="deepSector"]'
);

const deepTaskSelections = {};

function getDeepSector() {
    return document.querySelector(
        'input[name="deepSector"]:checked'
    )?.value || "residential";
}

function createDeepTaskCheckbox(task, sector, groupName) {
    const label = document.createElement("label");
    label.className = "deep-task-option";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "deepTask";
    input.value = task;

    const selectionKey =
        `${sector}::${groupName}::${task}`;

    input.checked = Boolean(
        deepTaskSelections[selectionKey]
    );

    input.addEventListener("change", () => {
        deepTaskSelections[selectionKey] = input.checked;

        updateDeepEstimate();
        updateSummary();
    });

    const text = document.createElement("span");
    text.textContent = task;

    label.append(input, text);

    return label;
}

function renderDeepCleaningTasks() {
    if (!deepTasksContainer) return;

    const sector = getDeepSector();

    const groups = deepCleaningCatalog[sector] || {};

    deepTasksContainer.replaceChildren();

    Object.entries(groups).forEach(
        ([groupName, tasks]) => {

            const group = document.createElement("section");
            group.className = "deep-task-group";

            const heading = document.createElement("h5");
            heading.textContent = groupName;

            const options = document.createElement("div");
            options.className = "deep-task-options";

            tasks.forEach(task => {
                options.appendChild(
                    createDeepTaskCheckbox(
                        task,
                        sector,
                        groupName
                    )
                );
            });

            group.append(heading, options);
            deepTasksContainer.appendChild(group);
        }
    );

    updateDeepEstimate();
}

function getDeepCleaningSelections() {
    const sector = getDeepSector();

    const tasks = Array.from(
        document.querySelectorAll(
            'input[name="deepTask"]:checked'
        )
    ).map(input => input.value);

    const extras = Array.from(
        document.querySelectorAll(
            'input[name="deepExtra"]:checked'
        )
    ).map(input => input.value);

    return {
        sector,
        tasks,
        extras,
        area: Number(
            document.getElementById("deepArea")?.value
        ) || 100,
        rooms: Number(
            document.getElementById("deepRooms")?.value
        ) || 3,
        floors: Number(
            document.getElementById("deepFloors")?.value
        ) || 1,
        condition:
            document.getElementById("deepCondition")?.value
            || "standard",
        notes:
            document.getElementById("deepNotes")?.value
                .trim() || ""
    };
}

function calculateDeepCleaningPrice() {
    const selection = getDeepCleaningSelections();

    const cleanerRate = Number(
        selectedCleaner?.servicePrices?.deep
    );

    const baseRate =
        Number.isFinite(cleanerRate) &&
        cleanerRate > 0
            ? cleanerRate
            : services.deep.price;

    const sectorFactors = {
        residential: 1,
        office: 1.3,
        commercial: 1.4,
        hospitality: 1.65,
        vehicle: 0.9,
        outdoor: 1.15
    };

    const conditionFactors = {
        standard: 1,
        heavy: 1.35,
        extreme: 1.8
    };

    const taskCount = selection.tasks.length;
    const extraCount = selection.extras.length;

    const sizeFactor =
        selection.sector === "vehicle"
            ? 1
            : Math.max(
                0.5,
                selection.area / 100
            );

    const roomFactor =
        selection.sector === "vehicle" ||
        selection.sector === "outdoor"
            ? 1
            : 1 + Math.max(
                0,
                selection.rooms - 3
            ) * 0.06;

    const floorFactor =
        selection.sector === "vehicle"
            ? 1
            : 1 + Math.max(
                0,
                selection.floors - 1
            ) * 0.08;

    const taskFactor =
        1 + taskCount * 0.055;

    const extraFactor =
        1 + extraCount * 0.09;

    const total = Math.round(
        baseRate *
        (sectorFactors[selection.sector] || 1) *
        (conditionFactors[selection.condition] || 1) *
        sizeFactor *
        roomFactor *
        floorFactor *
        taskFactor *
        extraFactor
    );

    return {
        base: Math.round(baseRate),
        adjustment: total - Math.round(baseRate),
        total
    };
}

function updateDeepEstimate() {
    const estimate = document.getElementById(
        "deepEstimatedTotal"
    );

    if (estimate) {
        estimate.textContent = formatMoney(
            calculateDeepCleaningPrice().total
        );
    }
}

deepSectorInputs.forEach(input => {
    input.addEventListener("change", () => {
        renderDeepCleaningTasks();
        updateSummary();
    });
});

document.querySelectorAll(
    ".deep-customization input, " +
    ".deep-customization select, " +
    ".deep-customization textarea"
).forEach(element => {
    element.addEventListener(
        "input",
        () => {
            updateDeepEstimate();
            updateSummary();
        }
    );

    element.addEventListener(
        "change",
        () => {
            updateDeepEstimate();
            updateSummary();
        }
    );
});

const sizeMultipliers = {
        small: 1,
        medium: 1.4,
        large: 1.8
    };

    const sizeLabels = {
        small: "Small",
        medium: "Medium",
        large: "Large"
    };

    const frequencyLabels = {
        once: "One-Time",
        weekly: "Weekly",
        monthly: "Monthly"
    };

    // --------------------------------------
    // 2. ELEMENT REFERENCES
    // --------------------------------------

    const bookingForm =
        document.getElementById("bookingForm");

    const serviceContainer =
        document.getElementById("bookingServices");

    const previousButton =
        document.getElementById("bookingPrevious");

    const nextButton =
        document.getElementById("bookingNext");

    const confirmButton =
        document.getElementById("bookingConfirm");

    const bookingDate =
        document.getElementById("bookingDate");

    const selectedTimeInput =
        document.getElementById("selectedBookingTime");

    const timeButtons =
        document.querySelectorAll(".booking-time-slot");

    const bookingSuccess =
        document.getElementById("bookingSuccess");

    let currentStep = 1;
    let selectedService = null;
    let selectedTime = null;
    let selectedCleaner = null;
    let previewCompleted = false;

    
const requirementsPanel = document.getElementById(
    "bookingServiceRequirements"
);

const requirementGroups = document.querySelectorAll(
    "[data-requirement]"
);


function updateServiceRequirements() {
    if (!requirementsPanel) return;

    requirementsPanel.hidden = !selectedService;

    requirementGroups.forEach(group => {
        const type = group.dataset.requirement;

        const visible = type === "intensive"
            ? Boolean(selectedService && selectedService !== "deep")
            : type === selectedService;

        group.hidden = !visible;

        group.querySelectorAll("input, select, textarea")
            .forEach(field => {
                field.disabled = !visible;
            });
    });

    // Deep Cleaning may be inside a data-requirement group.
    // Do not override visibility when a parent group is hidden.
    const deepPanel = document.querySelector(".deep-customization");


    if (selectedService === "deep") {
        updateDeepEstimate();
    }
}


requirementsPanel?.addEventListener("input", updateSummary);
requirementsPanel?.addEventListener("change", updateSummary);


    // --------------------------------------
    // 3. HELPER FUNCTIONS
    // --------------------------------------

    function formatMoney(amount) {
        return `KSh ${Math.round(amount)
            .toLocaleString("en-KE")}`;
    }

    function localDateKey(date) {
        const year = date.getFullYear();
        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function formatDate(dateString) {
        if (!dateString) {
            return "Not selected";
        }

        const parts = dateString.split("-").map(Number);

        const date = new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        );

        return new Intl.DateTimeFormat("en-KE", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(date);
    }

    function formatTime(timeString) {
        if (!timeString) {
            return "Not selected";
        }

        const [hours, minutes] =
            timeString.split(":").map(Number);

        const date = new Date(
            2026, 0, 1, hours, minutes
        );

        return new Intl.DateTimeFormat("en-KE", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(date);
    }

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    function showError(id, message) {
        setText(id, message);
    }

    function clearErrors() {
        [
            "serviceError",
            "scheduleError",
            "detailsError",
            "reviewError"
        ].forEach(id => setText(id, ""));
    }

    // --------------------------------------
    // 4. LOAD SELECTED CLEANER
    // --------------------------------------

    function loadCleaner() {
        const params = new URLSearchParams(
            window.location.search
        );

        // Supports booking.html?cleaner=1
        // and booking.html?id=1
        const cleanerId =
            params.get("cleaner") || params.get("id");

        const cleanerList = Array.isArray(
            window.SAFI_CLEANERS
        ) ? window.SAFI_CLEANERS : [];

        selectedCleaner = cleanerList.find(
            cleaner =>
                String(cleaner.id) === String(cleanerId)
        ) || cleanerList[0] || null;

        if (!selectedCleaner) {
            setText(
                "bookingCleanerName",
                "Select a Cleaner"
            );

            setText(
                "bookingCleanerLocation",
                "Browse the marketplace"
            );

            return;
        }

        setText(
            "bookingCleanerName",
            selectedCleaner.name
        );

        setText(
            "bookingCleanerLocation",
            selectedCleaner.location
        );

        const image = document.getElementById(
            "bookingCleanerImage"
        );

        if (image && selectedCleaner.image) {
            image.src = selectedCleaner.image;
            image.alt =
                `Profile photo for ${selectedCleaner.name}`;
        }
    }

    // --------------------------------------
    // 5. RENDER SERVICE OPTIONS
    // --------------------------------------

    function renderServices() {
        serviceContainer.replaceChildren();

        const availableServices =
            selectedCleaner &&
            Array.isArray(selectedCleaner.services)
                ? selectedCleaner.services
                : Object.keys(services);

        availableServices.forEach(serviceId => {
            const service = services[serviceId];

            if (!service) return;

            const button = document.createElement("button");

            button.type = "button";
            button.className = "booking-service-option";
            button.dataset.service = serviceId;

            button.setAttribute(
                "aria-pressed",
                String(selectedService === serviceId)
            );

            const icon = document.createElement("span");
            icon.className = "service-icon";
            icon.textContent = service.icon;

            const title = document.createElement("strong");
            title.textContent = service.name;

            const description = document.createElement("small");
            description.textContent = service.description;

            const check = document.createElement("span");
            check.className = "service-check";
            check.textContent = "✓";

            button.append(
                icon,
                title,
                description,
                check
            );

            button.addEventListener("click", () => {
                selectedService = serviceId;

                document.querySelectorAll(
                    ".booking-service-option"
                ).forEach(option => {
                    const active =
                        option.dataset.service === serviceId;

                    option.classList.toggle(
                        "selected",
                        active
                    );

                    option.setAttribute(
                        "aria-pressed",
                        String(active)
                    );
                });

                showError("serviceError", "");
                updateServiceRequirements();
                updateSummary();
            });

            serviceContainer.appendChild(button);
        });
    }

    // --------------------------------------
    // 6. ESTIMATED PRICING
    // --------------------------------------

    
function calculatePrice() {
    if (!selectedService || !services[selectedService]) {
        return { base: 0, adjustment: 0, total: 0 };
    }
    if (selectedService === "deep") {
    return calculateDeepCleaningPrice();
}

    const fallback = services[selectedService].price;
    const workerRate = Number(
        selectedCleaner?.servicePrices?.[selectedService]
    );

    const rate = Number.isFinite(workerRate) && workerRate > 0
        ? workerRate
        : fallback;

    const numberValue = (id, fallbackValue, min, max) => {
        const element = document.getElementById(id);
        const raw = element ? Number(element.value) : fallbackValue;

        return Number.isFinite(raw)
            ? Math.min(max, Math.max(min, raw))
            : fallbackValue;
    };

    const value = (id, fallbackValue) =>
        document.getElementById(id)?.value || fallbackValue;

    const size = value("propertySize", "small");
    const sizeFactor = sizeMultipliers[size] || 1;

    let base = rate;

    switch (selectedService) {
        
case "laundry": {
    const clothes = numberValue("laundryItems", 10, 1, 500);
    const bedding = numberValue("laundryBedding", 0, 0, 50);
    const ironing = value("laundryIroning", "no") === "yes";

    // Demo rate: basic bundle of 10 clothing items.
    const perItemRate = rate / 10;

    base =
        clothes * perItemRate +
        bedding * perItemRate * 3 +
        (ironing ? clothes * perItemRate * 0.4 : 0);

    break;
}


        case "vehicle": {
            const vehicleFactor = {
                sedan: 1,
                suv: 1.5,
                van: 2
            }[value("vehicleType", "sedan")] || 1;

            const packageFactor = {
                exterior: 1,
                interior: 1.4,
                full: 1.8,
                detailing: 2.8
            }[value("vehiclePackage", "exterior")] || 1;

            base = rate * vehicleFactor * packageFactor;
            break;
        }

        case "office": {
            const area = numberValue("officeArea", 100, 1, 10000);
            const equipment = numberValue(
                "officeEquipment", 5, 0, 1000
            );

            base = rate * Math.max(0.5, area / 100)
                + equipment * 150;
            break;
        }

        case "gardening": {
            const area = numberValue("gardenArea", 100, 1, 10000);
            const taskFactor = {
                mowing: 1,
                hedges: 1.2,
                weeding: 0.9,
                landscaping: 2.2
            }[value("gardenTask", "mowing")] || 1;

            base = rate * Math.max(0.5, area / 100)
                * taskFactor;
            break;
        }

        default:
            base = rate * sizeFactor;
    }

    const intensive = selectedService === "deep" ||
        document.getElementById("intensiveCleaning")?.checked;

    const intensiveFactor = selectedService === "deep"
        ? 1
        : intensive
            ? 1.6
            : 1;

    const total = Math.round(base * intensiveFactor);

    return {
        base: Math.round(base),
        adjustment: total - Math.round(base),
        total
    };
}


    
function updateSummary() {
    const size =
        document.getElementById("propertySize")?.value || "small";

    const frequency =
        document.getElementById("cleaningFrequency")?.value || "once";

    const price = calculatePrice();

    setText(
        "summaryService",
        selectedService
            ? services[selectedService]?.name || "Not selected"
            : "Not selected"
    );

    setText("summarySize", sizeLabels[size] || size);

    setText(
        "summaryFrequency",
        frequencyLabels[frequency] || frequency
    );

    setText(
        "summaryDate",
        formatDate(bookingDate?.value || "")
    );

    setText("summaryTime", formatTime(selectedTime));

    setText("summaryBasePrice", formatMoney(price.base));

    setText("summaryAdjustment", formatMoney(price.adjustment));

    setText("summaryTotal", formatMoney(price.total));

    if (selectedService === "deep") {
        updateDeepEstimate();
    }
}



    bookingDate.addEventListener("change", () => {
        updateSummary();
        showError("scheduleError", "");
    });

    // --------------------------------------
    // 7. DATE AND TIME SELECTION
    // --------------------------------------

    const today = new Date();

    bookingDate.min = localDateKey(today);

    const maximumDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 90
    );

    bookingDate.max = localDateKey(maximumDate);

    timeButtons.forEach(button => {
        button.setAttribute("aria-pressed", "false");

        button.addEventListener("click", () => {
            selectedTime = button.dataset.time;

            selectedTimeInput.value = selectedTime;

            timeButtons.forEach(item => {
                const active =
                    item.dataset.time === selectedTime;

                item.classList.toggle(
                    "selected",
                    active
                );

                item.setAttribute(
                    "aria-pressed",
                    String(active)
                );
            });

            showError("scheduleError", "");
            updateSummary();
        });
    });

    // --------------------------------------
    // 8. STEP NAVIGATION
    // --------------------------------------

    function showStep(step) {
        currentStep = step;
        clearErrors();

        document.querySelectorAll(
            ".booking-step"
        ).forEach(section => {
            const active =
                Number(section.dataset.step) === step;

            section.hidden = !active;
            section.classList.toggle(
                "active",
                active
            );
        });

        document.querySelectorAll(
            ".booking-progress-step"
        ).forEach(progress => {
            const number =
                Number(progress.dataset.progress);

            progress.classList.toggle(
                "active",
                number === step
            );

            progress.classList.toggle(
                "completed",
                number < step
            );
        });

        previousButton.hidden = step === 1;
        nextButton.hidden = step === 4;
        confirmButton.hidden = step !== 4;

        if (step === 4) {
            renderReview();
        }

        updateSummary();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // --------------------------------------
    // 9. STEP VALIDATION
    // --------------------------------------

    function validateStep(step) {
        clearErrors();

        if (step === 1) {
            if (!selectedService) {
                showError(
                    "serviceError",
                    "Please select a cleaning service."
                );
                return false;
            }

            return true;
        }

        if (step === 2) {
            if (!bookingDate.value) {
                showError(
                    "scheduleError",
                    "Please select your preferred date."
                );
                return false;
            }

            if (
                bookingDate.value < localDateKey(new Date()) ||
                bookingDate.value > bookingDate.max
            ) {
                showError(
                    "scheduleError",
                    "Choose a date within the next 90 days."
                );
                return false;
            }

            if (!selectedTime) {
                showError(
                    "scheduleError",
                    "Please choose your preferred time."
                );
                return false;
            }

            const selectedDateTime = new Date(
                `${bookingDate.value}T${selectedTime}:00`
            );

            if (
                !Number.isFinite(selectedDateTime.getTime()) ||
                selectedDateTime <= new Date()
            ) {
                showError(
                    "scheduleError",
                    "Please select a future date and time."
                );
                return false;
            }

            return true;
        }

        if (step === 3) {
            const fieldIds = [
                "customerName",
                "customerPhone",
                "customerEmail",
                "bookingCounty",
                "bookingAddress"
            ];

            for (const id of fieldIds) {
                const field = document.getElementById(id);

                if (!field.value.trim() ||
                    !field.checkValidity()) {
                    showError(
                        "detailsError",
                        "Please complete all required " +
                        "customer details correctly."
                    );

                    field.focus();
                    return false;
                }
            }

            const phone = document.getElementById(
                "customerPhone"
            ).value.replace(/[\s()-]/g, "");

            if (!/^(?:\+254|0)[17]\d{8}$/.test(phone)) {
                showError(
                    "detailsError",
                    "Enter a valid Kenyan mobile number."
                );

                document.getElementById(
                    "customerPhone"
                ).focus();

                return false;
            }

            return true;
        }

        if (step === 4) {
            const agreement =
                document.getElementById(
                    "bookingAgreement"
                );

            if (!agreement.checked) {
                showError(
                    "reviewError",
                    "Please acknowledge that this is " +
                    "a demonstration booking."
                );

                return false;
            }

            return true;
        }

        return false;
    }

    nextButton.addEventListener("click", () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < 4) {
            showStep(currentStep + 1);
        }
    });

    previousButton.addEventListener("click", () => {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });

    // Prevent accidental form submission.
    bookingForm.addEventListener("submit", event => {
        event.preventDefault();
    });

    // --------------------------------------
    // 10. REVIEW DETAILS
    // --------------------------------------

    function getBookingDetails() {
        const price = calculatePrice();

        return {
            cleaner: selectedCleaner
                ? selectedCleaner.name
                : "Not selected",

            service: selectedService
                ? services[selectedService].name
                : "Not selected",

            size: sizeLabels[
                document.getElementById(
                    "propertySize"
                ).value
            ],

            frequency: frequencyLabels[
                document.getElementById(
                    "cleaningFrequency"
                ).value
            ],

            date: formatDate(bookingDate.value),
            time: formatTime(selectedTime),

            customer: document.getElementById(
                "customerName"
            ).value.trim(),

            phone: document.getElementById(
                "customerPhone"
            ).value.trim(),

            email: document.getElementById(
                "customerEmail"
            ).value.trim(),

            county: document.getElementById(
                "bookingCounty"
            ).value,

            address: document.getElementById(
                "bookingAddress"
            ).value.trim(),

            instructions: document.getElementById(
                "bookingInstructions"
            ).value.trim(),

            total: formatMoney(price.total)
        };
    }

    function createReviewRow(label, value) {
        const row = document.createElement("div");
        row.className = "booking-review-row";

        const title = document.createElement("span");
        title.textContent = label;

        const detail = document.createElement("strong");
        detail.textContent = value || "Not provided";

        row.append(title, detail);

        return row;
    }

    function renderDetailsInto(container) {
        container.replaceChildren();

        const details = getBookingDetails();

        const rows = [
            ["Cleaner", details.cleaner],
            ["Service", details.service],
            ["Job Size", details.size],
            ["Frequency", details.frequency],
            ["Date", details.date],
            ["Time", details.time],
            ["Customer", details.customer],
            ["Phone", details.phone],
            ["Email", details.email],
            ["County", details.county],
            ["Address", details.address],
            ["Instructions", details.instructions || "None"],
            ["Estimated Total", details.total]
        ];

        rows.forEach(([label, value]) => {
            container.appendChild(
                createReviewRow(label, value)
            );
        });
    }

    function renderReview() {
        renderDetailsInto(
            document.getElementById("bookingReview")
        );
    }

    // --------------------------------------
    // 11. DEMONSTRATION CONFIRMATION
    // --------------------------------------

    confirmButton.addEventListener("click", () => {
        if (previewCompleted) return;

        // Recheck the earlier steps.
        for (let step = 1; step <= 3; step++) {
            if (!validateStep(step)) {
                showStep(step);
                validateStep(step);
                return;
            }
        }

        if (!validateStep(4)) return;

        previewCompleted = true;

        
        // BLOCK 12 — SAVE LOCAL BOOKING PREVIEW

        const bookingPrice = calculatePrice();

        const localBooking = {
            customerEmail: document.getElementById(
    "customerEmail"
).value.trim(),

customerPhone: document.getElementById(
    "customerPhone"
).value.trim(),

instructions: document.getElementById(
    "bookingInstructions"
).value.trim(),


            id: `SAFI-${Date.now()}`,
            cleanerId: selectedCleaner
                ? selectedCleaner.id
                : null,
            cleanerName: selectedCleaner
                ? selectedCleaner.name
                : "Not selected",
            serviceId: selectedService,
            service: selectedService
                ? services[selectedService].name
                : "Not selected",
            date: bookingDate.value,
            time: selectedTime,
            size: document.getElementById(
                "propertySize"
            ).value,
            frequency: document.getElementById(
                "cleaningFrequency"
            ).value,
            customerName: document.getElementById(
                "customerName"
            ).value.trim(),
            county: document.getElementById(
                "bookingCounty"
            ).value,
            address: document.getElementById(
                "bookingAddress"
            ).value.trim(),
            total: bookingPrice.total,

            specifications: {
    laundryItems: document.getElementById("laundryItems")?.value,
    laundryBedding: document.getElementById("laundryBedding")?.value,
    laundryIroning: document.getElementById("laundryIroning")?.value,
    vehicleType: document.getElementById("vehicleType")?.value,
    vehiclePackage: document.getElementById("vehiclePackage")?.value,
    officeArea: document.getElementById("officeArea")?.value,
    officeEquipment: document.getElementById("officeEquipment")?.value,
    gardenTask: document.getElementById("gardenTask")?.value,
    gardenArea: document.getElementById("gardenArea")?.value,
    intensiveCleaning:
        document.getElementById("intensiveCleaning")?.checked || false
},

deepCleaning: selectedService === "deep"
    ? getDeepCleaningSelections()
    : null,
            
            status: "preview",
            createdAt: new Date().toISOString()
        };

        try {
            const existing = JSON.parse(
                localStorage.getItem("safiBookingPreviews")
                || "[]"
            );

            const previews = Array.isArray(existing)
                ? existing
                : [];

            previews.unshift(localBooking);

            localStorage.setItem(
                "safiBookingPreviews",
                JSON.stringify(previews)
            );
        } catch (error) {
            console.warn(
                "Could not save booking preview:",
                error
            );
        }
        // BLOCK 20 — CREATE SHARED DEMO BOOKING REQUEST


const bookingStore = window.SAFI_BOOKING_STORE;

if (!bookingStore ||
    typeof bookingStore.createBooking !== "function") {

    previewCompleted = false;

    showError(
        "reviewError",
        "Booking storage is unavailable. Please refresh and try again."
    );

    return;
}

let sharedResult;

try {
    sharedResult = bookingStore.createBooking({
        ...localBooking,
        status: "pending"
    });
} catch (error) {
    console.error("Booking storage error:", error);
}

if (!sharedResult?.success) {
    previewCompleted = false;

    showError(
        "reviewError",
        sharedResult?.message ||
        "Your booking could not be saved. Please try again."
    );

    return;
}

console.log(
    "SAFI LINK demo booking saved:",
    sharedResult.booking
);


        bookingForm.hidden = true;
        bookingSuccess.hidden = false;

        renderDetailsInto(
            document.getElementById(
                "bookingSuccessDetails"
            )
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    
// ==========================================
// BLOCK 22 — LIVE BOOKING PRICE UPDATES
// ==========================================

const bookingPriceFields = [
    "propertySize",
    "cleaningFrequency",
    "laundryItems",
    "laundryBedding",
    "laundryIroning",
    "vehicleType",
    "vehiclePackage",
    "officeArea",
    "officeEquipment",
    "gardenTask",
    "gardenArea",
    "intensiveCleaning",
    "deepArea",
    "deepRooms",
    "deepFloors",
    "deepCondition"
];

bookingPriceFields.forEach(id => {
    const field = document.getElementById(id);

    if (!field) return;

    field.addEventListener("input", updateSummary);
    field.addEventListener("change", updateSummary);
});


    // --------------------------------------
    // 12. INITIALIZE BOOKING PAGE
    // --------------------------------------

    
    // ==========================================
    // BLOCK 11 — PROFILE TO BOOKING INTEGRATION
    // ==========================================

    
// Load cleaner information first.
loadCleaner();

// Read selected service from the URL.
const bookingParams = new URLSearchParams(
    window.location.search
);

const requestedService = bookingParams.get("service");

// Only allow services offered by this cleaner.
const allowedServices =
    selectedCleaner &&
    Array.isArray(selectedCleaner.services)
        ? selectedCleaner.services
        : Object.keys(services);

if (
    requestedService &&
    services[requestedService] &&
    allowedServices.includes(requestedService)
) {
    selectedService = requestedService;
}

// Initialize service cards and Deep Cleaning tasks.
renderServices();
renderDeepCleaningTasks();
updateServiceRequirements();

// Highlight any service preselected from the profile.
if (selectedService) {
    const selectedButton = Array.from(
        document.querySelectorAll(".booking-service-option")
    ).find(button =>
        button.dataset.service === selectedService
    );

    if (selectedButton) {
        selectedButton.classList.add("selected");
        selectedButton.setAttribute("aria-pressed", "true");
    }
}

// Initialize pricing and booking navigation.
updateSummary();
showStep(1);


  

});
