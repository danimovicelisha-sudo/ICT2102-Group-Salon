/* =========================
   SALON BILL CALCULATOR
========================== */
function calculateBill() {
    let serviceElement = document.getElementById("service");
    let quantityElement = document.getElementById("quantity");
    let discountElement = document.getElementById("discount");
    let depositElement = document.getElementById("deposit");
    let resultElement = document.getElementById("result");

    // Guard clause to prevent errors if elements are missing
    if (!serviceElement || !quantityElement || !discountElement || !depositElement || !resultElement) {
        return;
    }

    let price = Number(serviceElement.value);
    let quantity = Number(quantityElement.value);
    let discount = Number(discountElement.value);
    let deposit = Number(depositElement.value);

    if (quantity < 1) {
        alert("Please enter a quantity of at least 1.");
        return;
    }

    let total = price * quantity;
    let finalTotal = total - discount;
    let balance = finalTotal - deposit;

    if (balance < 0) {
        balance = 0;
    }

    resultElement.innerHTML =
        "Total Service Cost: UGX " + total.toLocaleString() +
        "<br>Discount: UGX " + discount.toLocaleString() +
        "<br>Amount After Discount: UGX " + finalTotal.toLocaleString() +
        "<br>Deposit: UGX " + deposit.toLocaleString() +
        "<br><strong>Balance: UGX " + balance.toLocaleString() + "</strong>";
}


/* =========================
   AUTOMATIC IMAGE GALLERY
========================== */
let images = [
    "images/braiding.jpg",
    "images/wig.jpg",
    "images/nails.jpg",
    "images/manicure.jpg",
    "images/styling.jpg",
    "images/salon.jpg"
];

let currentImage = 0;

function showImage() {
    let sliderImg = document.getElementById("sliderImage");
    if (sliderImg) {
        sliderImg.src = images[currentImage];
    }
}

function nextImage() {
    currentImage++;
    if (currentImage >= images.length) {
        currentImage = 0;
    }
    showImage();
}

function previousImage() {
    currentImage--;
    if (currentImage < 0) {
        currentImage = images.length - 1;
    }
    showImage();
}

/* Change image automatically every 3 seconds */
setInterval(function () {
    nextImage();
}, 3000);


/* =========================
   DATE VALIDATION (APPOINTMENT)
========================== */
document.addEventListener("DOMContentLoaded", function () {
    const appointmentDateField = document.getElementById("bookingDate");

    if (appointmentDateField) {
        const now = new Date();
        const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0];

        appointmentDateField.min = localDate;
    }
});
// ======================================
// SALON SERVICES AND APPOINTMENT ESTIMATE
// ======================================

// Store the salon services in an array of objects.
const salonServices = [
    {
        name: "Wig Installation",
        price: 50000,
        description: "Professional wig fitting and installation."
    },
    {
        name: "Hair Braiding",
        price: 30000,
        description: "Beautiful and creative hair braiding styles."
    },
    {
        name: "Hair Styling",
        price: 25000,
        description: "Professional hair styling for different occasions."
    },
    {
        name: "Hair Treatment",
        price: 20000,
        description: "Hair care and treatment services."
    },
    {
        name: "Manicure",
        price: 20000,
        description: "Quality nail care and manicure services."
    },
    {
        name: "Pedicure",
        price: 25000,
        description: "Relaxing foot and nail care."
    },
    {
        name: "Makeup",
        price: 35000,
        description: "Makeup for events and special occasions."
    },
    {
        name: "Wig Making",
        price: 80000,
        description: "Custom wig making services."
    },
    {
        name: "Wig Customisation",
        price: 40000,
        description: "Custom styling and adjustment of wigs."
    },
    {
        name: "Nail Art",
        price: 30000,
        description: "Creative nail art and nail designs."
    }
];

// Get the HTML elements.
const serviceList = document.getElementById("serviceList");
const mainService = document.getElementById("mainService");
const serviceDetails = document.getElementById("serviceDetails");
const appointmentEstimate = document.getElementById("appointmentEstimate");

// Store the currently selected service price.
let selectedServicePrice = 0;
let extraServiceCost = 0;

// Function to calculate the appointment cost.
// The extra-service cost is optional and defaults to zero.
function calculateAppointmentCost(servicePrice, extraCost = 0) {
    return Number(servicePrice) + Number(extraCost);
}

// Display the services and their prices.
if (serviceList && mainService) {

    salonServices.forEach(function(service) {

        // Create a service card.
        const serviceCard = document.createElement("div");
        serviceCard.className = "service-card";

        serviceCard.innerHTML = `
            <h3>${service.name}</h3>
            <p>Price: UGX ${service.price.toLocaleString()}</p>
            <p>${service.description}</p>
            <button type="button" class="choose-service"
                    data-service="${service.name}">
                Choose Service
            </button>
        `;

        serviceList.appendChild(serviceCard);

        // Add the service to the appointment dropdown.
        const option = document.createElement("option");
        option.value = service.name;
        option.textContent = service.name;
        mainService.appendChild(option);
    });
}

// Function to update the service details and estimated cost.
function updateAppointmentEstimate() {

    if (!mainService) {
        return;
    }

    const selectedService = salonServices.find(function(service) {
        return service.name === mainService.value;
    });

    if (!selectedService) {
        selectedServicePrice = 0;

        if (serviceDetails) {
            serviceDetails.textContent =
                "Select a service to view its details.";
        }

        if (appointmentEstimate) {
            appointmentEstimate.textContent =
                "Your estimated appointment cost will appear here.";
        }

        return;
    }

    selectedServicePrice = selectedService.price;

    // Calculate any additional-service costs.
    // Add data-cost values to the additional-service checkboxes
    // when their actual prices are available.
    extraServiceCost = 0;

    const selectedExtras = document.querySelectorAll(
        'input[name="additional_services[]"]:checked'
    );

    selectedExtras.forEach(function(extra) {
        extraServiceCost += Number(extra.dataset.cost || 0);
    });

    // Calculate the final estimated appointment cost.
    const totalCost = calculateAppointmentCost(
        selectedServicePrice,
        extraServiceCost
    );

    if (serviceDetails) {
        serviceDetails.textContent =
            selectedService.description +
            " Price: UGX " +
            selectedService.price.toLocaleString();
    }

    if (appointmentEstimate) {
        appointmentEstimate.textContent =
            "Estimated Appointment Cost: UGX " +
            totalCost.toLocaleString();
    }
}

// Allow visitors to choose a service using the service cards.
if (serviceList) {

    serviceList.addEventListener("click", function(event) {

        if (event.target.classList.contains("choose-service")) {

            const chosenService = event.target.dataset.service;

            if (mainService) {
                mainService.value = chosenService;
                updateAppointmentEstimate();
            }
        }
    });
}

// Update the estimate when the visitor changes the service.
if (mainService) {
    mainService.addEventListener("change", updateAppointmentEstimate);
}

// Update the estimate when an additional service is selected.
const additionalServiceInputs = document.querySelectorAll(
    'input[name="additional_services[]"]'
);

additionalServiceInputs.forEach(function(extra) {
    extra.addEventListener("change", updateAppointmentEstimate);
});
// Calculate the appointment estimate when the button is clicked.
const estimateButton = document.getElementById(
    "calculateAppointmentEstimate"
);

if (estimateButton) {
    estimateButton.addEventListener("click", function() {
        updateAppointmentEstimate();
    });
}
// ======================================
// APPOINTMENT FORM VALIDATION
// ======================================

const appointmentForm = document.querySelector("#appointment form");
const appointmentMessage = document.getElementById("appointmentMessage");

if (appointmentForm && appointmentMessage) {

    // Get the customer information fields.
    const customerName = document.getElementById("bookingFullName");
    const customerPhone = document.getElementById("bookingTelephone");
    const customerDate = document.getElementById("bookingDate");

    // Clear old messages when the customer edits their details.
    if (customerName) {
        customerName.addEventListener("input", function() {
            appointmentMessage.textContent = "";
        });
    }

    if (customerPhone) {
        customerPhone.addEventListener("input", function() {
            appointmentMessage.textContent = "";
        });
    }

    // Validate the form when the customer submits it.
    appointmentForm.addEventListener("submit", function(event) {

        // Prevent submission to a server because this is a demonstration website.
        event.preventDefault();

        // First check the HTML required fields.
        if (!appointmentForm.checkValidity()) {
            appointmentForm.reportValidity();
            return;
        }

        const name = customerName.value.trim();
        const phone = customerPhone.value.trim();
        const date = customerDate.value;
        const service = mainService.value;

        // Check the customer's name.
        if (name.length < 3) {
            appointmentMessage.textContent =
                "Please enter a valid full name.";
            customerName.focus();
            return;
        }

        // Check the Ugandan telephone number.
        const phonePattern = /^(?:\+256|0)\d{9}$/;

        if (!phonePattern.test(phone)) {
            appointmentMessage.textContent =
                "Please enter a valid Ugandan phone number.";
            customerPhone.focus();
            return;
        }

        // Check that a service has been selected.
        if (service === "") {
            appointmentMessage.textContent =
                "Please select a salon service.";
            mainService.focus();
            return;
        }

        // Check that the appointment date is not in the past.
        const today = new Date();
        const todayString = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().split("T")[0];

        if (date < todayString) {
            appointmentMessage.textContent =
                "Please choose today or a future appointment date.";
            customerDate.focus();
            return;
        }

        // Calculate the appointment estimate.
        updateAppointmentEstimate();

        const totalCost = calculateAppointmentCost(
            selectedServicePrice,
            extraServiceCost
        );

        // Display the appointment confirmation.
        appointmentMessage.innerHTML =
            "<strong>Appointment Request Prepared Successfully!</strong><br>" +
            "Customer Name: " + name + "<br>" +
            "Telephone: " + phone + "<br>" +
            "Selected Service: " + service + "<br>" +
            "Appointment Date: " + date + "<br>" +
            "Estimated Cost: UGX " + totalCost.toLocaleString() +
            "<br><br>Please contact the salon to confirm your appointment.";

    });
}
// ======================================
// MOBILE NAVIGATION MENU
// ======================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {

    // Open and close the navigation menu.
    menuToggle.addEventListener("click", function() {

        mainNav.classList.toggle("active");

        const menuIsOpen = mainNav.classList.contains("active");

        menuToggle.setAttribute(
            "aria-expanded",
            menuIsOpen
        );
    });

    // Close the menu after a visitor selects a navigation link.
    const navigationLinks = mainNav.querySelectorAll("a");

    navigationLinks.forEach(function(link) {

        link.addEventListener("click", function() {

            mainNav.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });
}