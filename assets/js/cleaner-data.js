
"use strict";

/* =====================================================
   FUA LINK — BLOCK 14
   PROFESSIONAL CLEANER DIRECTORY

   35 FICTIONAL WORKER PROFILES
   INDIVIDUAL SERVICE PRICES
   SPECIALIZATIONS AND AVAILABILITY

   Frontend demonstration only.
   Replace with verified backend/API data later.
   ===================================================== */

window.FUA_SERVICES = {
    home: "Home Cleaning",
    office: "Office Cleaning",
    deep: "Deep Cleaning",
    vehicle: "Vehicle Cleaning",
    laundry: "Laundry Services",
    commercial: "Shop & Restaurant Cleaning",
    gardening: "Gardening & Outdoor Care"
};

/*
   servicePrices:
   - laundry: starting price per standard clothing item
   - other services: starting service price in KSh

   The booking calculator applies additional job-specific
   pricing rules.

   "price" is retained for compatibility with the
   existing marketplace and profile pages.

   Names, biographies, availability and rates below
   are fictional demonstration data.
*/

const FUA_WORKER_RECORDS = [

    // ==========================================
    // HOME CLEANING SPECIALISTS
    // ==========================================

    {
        id: 1,
        name: "Grace Wanjiku",
        location: "Nairobi, Westlands",
        services: ["home", "deep"],
        servicePrices: {
            home: 1500,
            deep: 3500
        },
        status: "available",
        experience: 5,
        specialty: "Residential Cleaning",
        bio: "Specializes in residential cleaning, kitchens, bathrooms and detailed home care."
    },
    {
        id: 5,
        name: "Brian Otieno",
        location: "Nairobi, Kasarani",
        services: ["home", "laundry"],
        servicePrices: {
            home: 1300,
            laundry: 70
        },
        status: "available",
        experience: 3,
        specialty: "Home Cleaning and Laundry",
        bio: "Provides routine house cleaning, apartment care and laundry assistance."
    },
    {
        id: 6,
        name: "Mercy Njeri",
        location: "Nairobi, Kilimani",
        services: ["home", "deep"],
        servicePrices: {
            home: 1700,
            deep: 3800
        },
        status: "busy",
        experience: 6,
        specialty: "Apartment Cleaning",
        bio: "Focuses on apartment maintenance, bathroom sanitation and intensive residential cleaning."
    },
    {
        id: 7,
        name: "Faith Achieng",
        location: "Nairobi, South B",
        services: ["home", "laundry"],
        servicePrices: {
            home: 1400,
            laundry: 80
        },
        status: "available",
        experience: 4,
        specialty: "Domestic Cleaning",
        bio: "Offers reliable household cleaning, laundry and routine home maintenance."
    },
    {
        id: 8,
        name: "Peter Mwangi",
        location: "Kiambu, Ruiru",
        services: ["home", "deep"],
        servicePrices: {
            home: 1600,
            deep: 3600
        },
        status: "available",
        experience: 5,
        specialty: "House and Move-in Cleaning",
        bio: "Specializes in family homes, move-in preparation and thorough property cleaning."
    },

    // ==========================================
    // OFFICE CLEANING SPECIALISTS
    // ==========================================

    {
        id: 3,
        name: "Daniel Kiptoo",
        location: "Nairobi, Upper Hill",
        services: ["office", "commercial"],
        servicePrices: {
            office: 2500,
            commercial: 3200
        },
        status: "available",
        experience: 6,
        specialty: "Office Cleaning",
        bio: "Handles office floors, meeting rooms, workstations and professional cleaning schedules."
    },
    {
        id: 9,
        name: "Sharon Atieno",
        location: "Nairobi, CBD",
        services: ["office", "deep"],
        servicePrices: {
            office: 2200,
            deep: 3600
        },
        status: "available",
        experience: 4,
        specialty: "Workplace Hygiene",
        bio: "Specializes in workspace cleaning, office sanitation and detailed cleaning tasks."
    },
    {
        id: 10,
        name: "Kevin Mutua",
        location: "Nairobi, Industrial Area",
        services: ["office", "commercial"],
        servicePrices: {
            office: 2800,
            commercial: 3500
        },
        status: "busy",
        experience: 7,
        specialty: "Corporate Cleaning",
        bio: "Provides cleaning for larger offices, shared workspaces and commercial premises."
    },
    {
        id: 11,
        name: "Lydia Wambui",
        location: "Nairobi, Parklands",
        services: ["office", "home"],
        servicePrices: {
            office: 2400,
            home: 1600
        },
        status: "available",
        experience: 5,
        specialty: "Office and Residential Care",
        bio: "Offers organized cleaning for offices, workstations and residential properties."
    },
    {
        id: 12,
        name: "Samuel Maina",
        location: "Kiambu, Thika",
        services: ["office", "commercial"],
        servicePrices: {
            office: 3000,
            commercial: 3800
        },
        status: "available",
        experience: 8,
        specialty: "Large Office Cleaning",
        bio: "Focuses on larger workplaces, equipment surfaces and recurring office cleaning."
    },

    // ==========================================
    // DEEP CLEANING SPECIALISTS
    // ==========================================

    {
        id: 13,
        name: "Esther Nyambura",
        location: "Nairobi, Lavington",
        services: ["deep", "home"],
        servicePrices: {
            deep: 3500,
            home: 1800
        },
        status: "available",
        experience: 7,
        specialty: "Intensive Home Cleaning",
        bio: "Focuses on detailed cleaning of fixtures, corners, bathrooms, kitchens and difficult areas."
    },
    {
        id: 14,
        name: "David Ochieng",
        location: "Nairobi, Embakasi",
        services: ["deep", "commercial"],
        servicePrices: {
            deep: 3200,
            commercial: 3000
        },
        status: "available",
        experience: 5,
        specialty: "Post-renovation Cleaning",
        bio: "Specializes in intensive property cleaning and post-renovation cleanup."
    },
    {
        id: 15,
        name: "Irene Chebet",
        location: "Nairobi, Karen",
        services: ["deep", "office"],
        servicePrices: {
            deep: 3800,
            office: 2600
        },
        status: "busy",
        experience: 6,
        specialty: "Detailed Office Cleaning",
        bio: "Provides thorough cleaning of workplaces, fixtures and hard-to-reach surfaces."
    },
    {
        id: 16,
        name: "Joseph Kamau",
        location: "Kiambu, Kikuyu",
        services: ["deep", "home"],
        servicePrices: {
            deep: 3000,
            home: 1400
        },
        status: "available",
        experience: 4,
        specialty: "Deep Residential Cleaning",
        bio: "Handles intensive kitchen, bathroom, floor and residential surface cleaning."
    },
    {
        id: 17,
        name: "Caroline Muthoni",
        location: "Nairobi, Kileleshwa",
        services: ["deep", "commercial"],
        servicePrices: {
            deep: 4000,
            commercial: 3600
        },
        status: "available",
        experience: 9,
        specialty: "Premium Deep Cleaning",
        bio: "Specializes in detailed property cleaning and demanding commercial cleaning assignments."
    },

    // ==========================================
    // VEHICLE CLEANING SPECIALISTS
    // ==========================================

    {
        id: 2,
        name: "Collins Omondi",
        location: "Kajiado, Ongata Rongai",
        services: ["vehicle"],
        servicePrices: {
            vehicle: 800
        },
        status: "available",
        experience: 4,
        specialty: "Vehicle Washing",
        bio: "Offers exterior washing, interior cleaning and vehicle-care packages."
    },
    {
        id: 18,
        name: "Victor Njoroge",
        location: "Nairobi, Westlands",
        services: ["vehicle"],
        servicePrices: {
            vehicle: 1000
        },
        status: "available",
        experience: 5,
        specialty: "Vehicle Interior Cleaning",
        bio: "Focuses on vehicle interiors, upholstery surfaces and general car detailing."
    },
    {
        id: 19,
        name: "Allan Musyoka",
        location: "Machakos, Syokimau",
        services: ["vehicle"],
        servicePrices: {
            vehicle: 1200
        },
        status: "busy",
        experience: 6,
        specialty: "Vehicle Detailing",
        bio: "Provides detailed vehicle cleaning for sedans, SUVs and larger vehicles."
    },
    {
        id: 20,
        name: "Dennis Kiplangat",
        location: "Nairobi, South C",
        services: ["vehicle"],
        servicePrices: {
            vehicle: 900
        },
        status: "available",
        experience: 3,
        specialty: "Car Wash and Interior Care",
        bio: "Offers vehicle washing, cabin cleaning and maintenance detailing."
    },
    {
        id: 21,
        name: "Eric Wekesa",
        location: "Kiambu, Ruaka",
        services: ["vehicle"],
        servicePrices: {
            vehicle: 1500
        },
        status: "available",
        experience: 8,
        specialty: "Premium Auto Detailing",
        bio: "Specializes in comprehensive vehicle detailing and intensive interior cleaning."
    },

    // ==========================================
    // LAUNDRY SPECIALISTS
    // ==========================================

    {
        id: 22,
        name: "Mary Wairimu",
        location: "Nairobi, Kasarani",
        services: ["laundry", "home"],
        servicePrices: {
            laundry: 80,
            home: 1500
        },
        status: "available",
        experience: 5,
        specialty: "Laundry and Garment Care",
        bio: "Provides clothing washing, folding, ironing and everyday garment care."
    },
    {
        id: 23,
        name: "Ruth Moraa",
        location: "Nairobi, Roysambu",
        services: ["laundry"],
        servicePrices: {
            laundry: 90
        },
        status: "available",
        experience: 4,
        specialty: "Laundry and Ironing",
        bio: "Specializes in clothing washing, careful ironing and laundry organization."
    },
    {
        id: 24,
        name: "Alice Wambui",
        location: "Kiambu, Juja",
        services: ["laundry"],
        servicePrices: {
            laundry: 70
        },
        status: "busy",
        experience: 3,
        specialty: "Affordable Laundry Care",
        bio: "Offers routine laundry, folding and basic fabric-care services."
    },
    {
        id: 25,
        name: "Beatrice Jepkoech",
        location: "Nairobi, Kilimani",
        services: ["laundry", "home"],
        servicePrices: {
            laundry: 100,
            home: 1700
        },
        status: "available",
        experience: 6,
        specialty: "Garment and Home Care",
        bio: "Handles garment washing, ironing, household laundry and home cleaning."
    },
    {
        id: 26,
        name: "Nancy Akinyi",
        location: "Kajiado, Kitengela",
        services: ["laundry"],
        servicePrices: {
            laundry: 85
        },
        status: "available",
        experience: 5,
        specialty: "Household Laundry",
        bio: "Provides laundry washing, folding and garment-care services for households."
    },

    // ==========================================
    // GARDENING SPECIALISTS
    // ==========================================

    {
        id: 4,
        name: "John Kibet",
        location: "Kajiado, Ngong",
        services: ["gardening"],
        servicePrices: {
            gardening: 1800
        },
        status: "available",
        experience: 6,
        specialty: "Lawn and Garden Maintenance",
        bio: "Specializes in lawn mowing, trimming, weeding and routine outdoor care."
    },
    {
        id: 27,
        name: "Patrick Muriuki",
        location: "Kiambu, Limuru",
        services: ["gardening"],
        servicePrices: {
            gardening: 2000
        },
        status: "available",
        experience: 7,
        specialty: "Landscaping and Gardening",
        bio: "Provides landscaping, garden maintenance and outdoor space improvement."
    },
    {
        id: 28,
        name: "Felix Odhiambo",
        location: "Nairobi, Langata",
        services: ["gardening"],
        servicePrices: {
            gardening: 1600
        },
        status: "busy",
        experience: 4,
        specialty: "Garden Maintenance",
        bio: "Offers mowing, weeding, hedge care and residential garden upkeep."
    },
    {
        id: 29,
        name: "George Kimani",
        location: "Kiambu, Ruiru",
        services: ["gardening"],
        servicePrices: {
            gardening: 2200
        },
        status: "available",
        experience: 8,
        specialty: "Outdoor Landscaping",
        bio: "Specializes in landscaping projects, lawn preparation and garden maintenance."
    },
    {
        id: 30,
        name: "Simon Mutiso",
        location: "Machakos, Mlolongo",
        services: ["gardening"],
        servicePrices: {
            gardening: 1900
        },
        status: "available",
        experience: 5,
        specialty: "Lawn and Hedge Care",
        bio: "Provides lawn mowing, hedge trimming, weeding and general outdoor cleaning."
    },

    // ==========================================
    // COMMERCIAL CLEANING SPECIALISTS
    // ==========================================

    {
        id: 31,
        name: "Hellen Adhiambo",
        location: "Nairobi, CBD",
        services: ["commercial", "office"],
        servicePrices: {
            commercial: 3000,
            office: 2500
        },
        status: "available",
        experience: 6,
        specialty: "Retail Premises Cleaning",
        bio: "Specializes in shop floors, retail spaces and commercial premises cleaning."
    },
    {
        id: 32,
        name: "Francis Kariuki",
        location: "Nairobi, Industrial Area",
        services: ["commercial", "deep"],
        servicePrices: {
            commercial: 3500,
            deep: 3900
        },
        status: "available",
        experience: 8,
        specialty: "Commercial Deep Cleaning",
        bio: "Provides intensive cleaning for commercial premises and business facilities."
    },
    {
        id: 33,
        name: "Rebecca Wanjala",
        location: "Nairobi, Eastleigh",
        services: ["commercial", "office"],
        servicePrices: {
            commercial: 2800,
            office: 2300
        },
        status: "busy",
        experience: 5,
        specialty: "Shop and Office Cleaning",
        bio: "Offers shop cleaning, workplace sanitation and regular business premises care."
    },
    {
        id: 34,
        name: "Timothy Mwaura",
        location: "Kiambu, Thika",
        services: ["commercial", "deep"],
        servicePrices: {
            commercial: 4000,
            deep: 4200
        },
        status: "available",
        experience: 9,
        specialty: "Restaurant and Commercial Cleaning",
        bio: "Focuses on restaurant premises, intensive cleaning and commercial maintenance."
    },
    {
        id: 35,
        name: "Joyce Cherono",
        location: "Nairobi, South B",
        services: ["commercial", "office"],
        servicePrices: {
            commercial: 3200,
            office: 2600
        },
        status: "available",
        experience: 7,
        specialty: "Business Premises Cleaning",
        bio: "Provides scheduled cleaning for shops, offices and other commercial spaces."
    }

];

// ==========================================
// BUILD COMPATIBLE WORKER PROFILES
// ==========================================

window.FUA_CLEANERS = FUA_WORKER_RECORDS.map(worker => {

    const primaryService = worker.services[0];

    return {
        ...worker,

        // Retained for older marketplace/profile code.
        price: worker.servicePrices[primaryService],

        // These are placeholder image assets.
        // Do not represent them as actual worker photos.
        image:
            `assets/images/cleaners/cleaner-${
                ((worker.id - 1) % 4) + 1
            }.jpg`,

        // Useful for expanded profile interfaces.
        yearsExperience: worker.experience,
        primaryService: primaryService,
        verified: false,
        demo: true
    };

});

// ==========================================
// SHARED HELPER FUNCTIONS
// ==========================================

// Find a worker by ID.
window.FUA_getCleanerById = function (id) {
    return window.FUA_CLEANERS.find(
        worker => String(worker.id) === String(id)
    ) || null;
};

// Get a worker's price for a selected service.
window.FUA_getServicePrice = function (worker, serviceId) {
    if (!worker || !worker.services.includes(serviceId)) {
        return null;
    }

    const price = Number(worker.servicePrices?.[serviceId]);

    return Number.isFinite(price) && price > 0
        ? price
        : null;
};

// Get all workers offering a specific service.
window.FUA_getCleanersByService = function (serviceId) {
    return window.FUA_CLEANERS.filter(
        worker => worker.services.includes(serviceId)
    );
};

// ==========================================
// DEVELOPMENT CHECK
// ==========================================

console.log(
    "FUA LINK: Loaded",
    window.FUA_CLEANERS.length,
    "fictional professional profiles."
);
