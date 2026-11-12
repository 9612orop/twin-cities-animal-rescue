/* ==========================================================================
   Twin Cities Animal Rescue - Interactive Script & Form Validation
   ========================================================================== */

// --- DATA STRUCTURES (Rubric: At least 2 arrays or 2 objects) ---
// 1. Array of Objects: Pet catalog data
const petsData = [
    {
        id: "pet-1",
        name: "Max",
        species: "dog",
        age: "2 years old",
        breed: "Golden Retriever Mix",
        description: "Energetic, loves outdoors, and plays well with children."
    },
    {
        id: "pet-2",
        name: "Luna",
        species: "cat",
        age: "1 year old",
        breed: "Domestic Shorthair",
        description: "Gentle and affectionate, enjoys warm sunbeams and purring."
    },
    {
        id: "pet-3",
        name: "Bella",
        species: "dog",
        age: "4 years old",
        breed: "Beagle",
        description: "Sweet temperament, loves long walks and sniffing trails."
    },
    {
        id: "pet-4",
        name: "Oliver",
        species: "cat",
        age: "3 years old",
        breed: "Tabby",
        description: "Quiet companion, fully house-trained and very calm."
    }
];

// 2. Array: Saved pet IDs in localStorage
let favoritePets = JSON.parse(localStorage.getItem("tcar_favorites")) || [];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    initPetFeature();
    initFormValidation();
});

// --- FEATURE 1: DYNAMIC PET FILTER & FAVORITES (services.html) ---
function initPetFeature() {
    const petContainer = document.getElementById("pets-container");
    const filterButtons = document.querySelectorAll(".filter-btn");

    if (!petContainer) return; // Exit if not on services.html

    // Render all pets initially
    renderPets(petsData, petContainer);

    // Filter event listeners
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterType = btn.getAttribute("data-filter");
            filterPets(filterType, petContainer);
        });
    });
}

function filterPets(category, container) {
    if (category === "all") {
        renderPets(petsData, container);
    } else {
        const filtered = petsData.filter(pet => pet.species === category);
        renderPets(filtered, container);
    }
}

function renderPets(list, container) {
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "<p>No animals found in this category.</p>";
        return;
    }

    list.forEach(pet => {
        const card = document.createElement("article");
        card.className = "pet-card";

        const isFavorited = favoritePets.includes(pet.id);

        card.innerHTML = `
            <h3>${pet.name} (${pet.breed})</h3>
            <p><strong>Age:</strong> ${pet.age} | <strong>Type:</strong> ${pet.species.toUpperCase()}</p>
            <p>${pet.description}</p>
            <button type="button" class="favorite-btn ${isFavorited ? 'saved' : ''}" data-id="${pet.id}">
                ${isFavorited ? "♥ Saved to Favorites" : "♡ Save as Favorite"}
            </button>
        `;

        const favBtn = card.querySelector(".favorite-btn");
        favBtn.addEventListener("click", () => toggleFavorite(pet.id, favBtn));

        container.appendChild(card);
    });
}

function toggleFavorite(petId, buttonElement) {
    if (favoritePets.includes(petId)) {
        favoritePets = favoritePets.filter(id => id !== petId);
        buttonElement.classList.remove("saved");
        buttonElement.textContent = "♡ Save as Favorite";
    } else {
        favoritePets.push(petId);
        buttonElement.classList.add("saved");
        buttonElement.textContent = "♥ Saved to Favorites";
    }
    // Save state to localStorage
    localStorage.setItem("tcar_favorites", JSON.stringify(favoritePets));
}

// --- FEATURE 2: FORM VALIDATION & STORAGE (contact.html) ---
function initFormValidation() {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return; // Exit if not on contact.html

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const interestSelect = document.getElementById("interest");
    const experienceInput = document.getElementById("experience");
    const availabilityInput = document.getElementById("availability");
    const successMsg = document.getElementById("form-success-msg");

    // Pre-fill previously remembered interest if saved in localStorage
    const savedInterest = localStorage.getItem("tcar_preferred_interest");
    if (savedInterest && interestSelect) {
        interestSelect.value = savedInterest;
    }

    // Save interest selection when user changes it
    if (interestSelect) {
        interestSelect.addEventListener("change", () => {
            localStorage.setItem("tcar_preferred_interest", interestSelect.value);
        });
    }

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Stop default submission to validate first
        clearErrors();

        let isValid = true;

        // Validation 1: Name minimum length (at least 3 characters)
        if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
            showError("name-error", "Full name is required and must be at least 3 characters long.");
            isValid = false;
        }

        // Validation 2: Valid email pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            showError("email-error", "Please provide a valid email address (e.g., name@example.com).");
            isValid = false;
        }

        // Validation 3: Selection requirement
        if (!interestSelect.value) {
            showError("interest-error", "Please select an interest type from the dropdown.");
            isValid = false;
        }

        // Validation 4: Experience description length
        if (!experienceInput.value.trim() || experienceInput.value.trim().length < 10) {
            showError("experience-error", "Please share a brief description (at least 10 characters) of your pet experience.");
            isValid = false;
        }

        if (isValid) {
            successMsg.textContent = "Thank you! Your inquiry has been submitted successfully.";
            successMsg.style.display = "block";
            contactForm.reset();
            // Retain the preferred interest setting even after reset
            if (savedInterest) {
                interestSelect.value = savedInterest;
            }
        }
    });
}

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = "block";
    }
}

function clearErrors() {
    const errors = document.querySelectorAll(".error-message");
    errors.forEach(err => {
        err.textContent = "";
        err.style.display = "none";
    });
    const successMsg = document.getElementById("form-success-msg");
    if (successMsg) successMsg.style.display = "none";
}
