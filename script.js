
let sosTimer;
let timeLeft = 10;
let currentLocation = null;
let sosActive = false;

// Open accident report
function showReport() {
    document.getElementById("report").scrollIntoView({
        behavior: "smooth"
    });
}

// Get GPS location
function getLocation() {
    if (!navigator.geolocation) {
        alert("GPS is not supported by this browser.");
        return;
    }

    const locationInput = document.getElementById("location");
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
            alert("Unable to get location. Allow location permission.");
        }
    );
}

// Activate SOS
function activateSOS() {
    if (sosActive) return;

    sosActive = true;
    timeLeft = 10;
    currentLocation = null;

    const modal = document.getElementById("sosModal");

    modal.style.display = "flex";

    document.getElementById("countdown").innerText = timeLeft;
    document.getElementById("gpsStatus").innerText =
        "Getting your GPS location...";

    document.getElementById("sosStatus").innerText = "";

    // Automatically request GPS
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
                    "GPS unavailable. Location was not captured.";
            }
        );
    } else {
        document.getElementById("gpsStatus").innerText =
            "GPS is not supported by this browser.";
    }

    // Start countdown
    sosTimer = setInterval(function() {
        timeLeft--;

        document.getElementById("countdown").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(sosTimer);
            sendSOS();
        }

    }, 1000);
}

// Cancel SOS
function cancelSOS() {
    clearInterval(sosTimer);

    sosActive = false;

    document.getElementById("sosModal").style.display = "none";

    alert("Demo emergency alert cancelled.");
}

// Confirm emergency
function sendSOS() {
    clearInterval(sosTimer);

    document.getElementById("countdown").innerText = "!";

    const status = document.getElementById("sosStatus");

    if (currentLocation) {
        status.innerText =
            "Demo SOS activated. GPS: " +
            currentLocation.latitude + ", " +
            currentLocation.longitude +
            ". No emergency service has been contacted.";
    } else {
        status.innerText =
            "Demo SOS activated, but GPS location is unavailable. " +
            "No emergency service has been contacted.";
    }

    sosActive = false;
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
            <h3>Accident Report Created!</h3>
            <p><strong>Name:</strong> ${escapeHTML(name)}</p>
            <p><strong>Location:</strong> ${escapeHTML(location)}</p>
            <p><strong>Severity:</strong> ${escapeHTML(severity)}</p>
            <p><strong>Details:</strong> ${escapeHTML(details || "Not provided")}</p>
            <p>Demo report generated successfully.</p>
            <p>This report has not been sent to a hospital or emergency service.</p>
        `;
    }
);

// Protect displayed user input
function escapeHTML(value) {
    return value.replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character];
    });
}
