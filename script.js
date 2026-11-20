

let sosTimer = null;
let timeLeft = 10;
let currentLocation = null;
let sosActive = false;

// Scroll to accident report
function showReport() {
    document.getElementById("report").scrollIntoView({
        behavior: "smooth"
    });
}

// Get GPS location
function getLocation() {
    const locationInput = document.getElementById("location");

    if (!navigator.geolocation) {
        alert("GPS is not supported by this browser.");
        return;
    }

    locationInput.value = "Getting location...";

    navigator.geolocation.getCurrentPosition(
        function(position) {
            currentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            locationInput.value =
                currentLocation.latitude + ", " +
                currentLocation.longitude;
        },
        function() {
            locationInput.value = "";
            alert("Unable to get location. Please allow GPS permission.");
        },
        {
            enableHighAccuracy: true,
            timeout: 10000
        }
    );
}

// Activate SOS button
function activateSOS() {
    if (sosActive) return;

    sosActive = true;
    timeLeft = 10;
    currentLocation = null;

    const modal = document.getElementById("sosModal");

    modal.style.display = "flex";

    document.getElementById("countdown").innerText = timeLeft;
    document.getElementById("sosStatus").innerText = "";
    document.getElementById("gpsStatus").innerText =
        "Getting your GPS location...";

    // Automatically capture GPS
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                document.getElementById("gpsStatus").innerText =
                    "GPS location captured successfully.";
            },
            function() {
                document.getElementById("gpsStatus").innerText =
                    "GPS unavailable. Please enter your location manually.";
            }
        );
    } else {
        document.getElementById("gpsStatus").innerText =
            "GPS is not supported by this browser.";
    }

    // Start 10-second countdown
    sosTimer = setInterval(function() {
        timeLeft--;

        document.getElementById("countdown").innerText = timeLeft;

        if (timeLeft <= 0) {
            sendSOS();
        }
    }, 1000);
}

// Cancel SOS
function cancelSOS() {
    clearInterval(sosTimer);
    sosTimer = null;
    sosActive = false;

    document.getElementById("sosModal").style.display = "none";

    alert("SOS cancelled. This was a demo alert.");
}

// User confirms that help is needed
function sendSOS() {
    clearInterval(sosTimer);
    sosTimer = null;
    sosActive = false;

    // Close SOS popup
    document.getElementById("sosModal").style.display = "none";

    // Fill GPS location if available
    const locationInput = document.getElementById("location");

    if (currentLocation) {
        locationInput.value =
            currentLocation.latitude + ", " +
            currentLocation.longitude;
    }

    // Show next-step message
    const result = document.getElementById("result");

    result.innerHTML = `
        <h3>Emergency Help Requested</h3>
        <p>Please complete the accident report below.</p>
        <p>Your location: ${
            currentLocation
                ? escapeHTML(locationInput.value)
                : "Location unavailable. Please enter it manually."
        }</p>
        <p><strong>Demo only:</strong> No hospital or emergency service has been contacted.</p>
    `;

    // Move to accident report form
    showReport();
}

// Submit accident report
document.getElementById("accidentForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const location = document.getElementById("location").value;
        const severity = document.getElementById("severity").value;
        const details = document.getElementById("details").value;

        const result = document.getElementById("result");

        result.innerHTML = `
            <h3>Accident Report Created Successfully!</h3>
            <p><strong>Name:</strong> ${escapeHTML(name)}</p>
            <p><strong>Location:</strong> ${escapeHTML(location)}</p>
            <p><strong>Severity:</strong> ${escapeHTML(severity)}</p>
            <p><strong>Details:</strong> ${escapeHTML(details || "Not provided")}</p>
            <p>Your demo accident report has been created.</p>
            <p><strong>Note:</strong> This report has not been sent to a hospital or emergency service.</p>
        `;

        result.scrollIntoView({
            behavior: "smooth"
        });
    }
);

// Protect displayed user input
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character];
    });
}

