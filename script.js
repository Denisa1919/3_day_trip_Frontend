```javascript
const API_URL = "http://127.0.0.1:8000/api/trip-planner";

const tripForm = document.getElementById("tripForm");

const loading = document.getElementById("loading");
const results = document.getElementById("results");
const errorBox = document.getElementById("errorBox");

const planButton = document.getElementById("planButton");

const rescueCard = document.getElementById("rescueCard");


tripForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Hide previous results/errors
    results.classList.add("hidden");
    errorBox.classList.add("hidden");
    rescueCard.classList.add("hidden");

    // Show loading
    loading.classList.remove("hidden");

    planButton.disabled = true;
    planButton.textContent = "Planning...";


    // Get preferences
    const preferenceText =
        document.getElementById("preferences").value.trim();

    let preferences = [];

    if (preferenceText !== "") {

        preferences = preferenceText
            .split(",")
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }


    // Create request data
    const tripData = {

        destination:
            document.getElementById("destination").value.trim(),

        starting_city:
            document.getElementById("starting_city").value.trim(),

        days:
            Number(document.getElementById("days").value),

        budget:
            Number(document.getElementById("budget").value),

        currency:
            document.getElementById("currency").value,

        travelers:
            Number(document.getElementById("travelers").value),

        travel_style:
            document.getElementById("travel_style").value,

        hotel_preference:
            document.getElementById("hotel_preference").value,

        must_have_activity:
            document.getElementById("must_have_activity").value.trim(),

        preferences:
            preferences
    };


    try {

        console.log("Sending request:", tripData);


        // Send request to FastAPI
        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(tripData)
        });


        // Read response
        const data = await response.json();


        // Handle backend error
        if (!response.ok) {

            throw new Error(
                data.detail || "Trip planning failed."
            );
        }


        console.log("Backend response:", data);


        // Display results
        displayResults(data);


    } catch (error) {

        console.error(error);

        errorBox.textContent =
            "❌ Error: " + error.message;

        errorBox.classList.remove("hidden");


    } finally {

        loading.classList.add("hidden");

        planButton.disabled = false;

        planButton.textContent = "✨ Plan My Trip";
    }

});


function displayResults(data) {

    const trip = data.trip;
    const workflow = data.workflow;


    // -----------------------------
    // Trip Summary
    // -----------------------------

    document.getElementById("tripSummary").innerHTML = `

        <p><strong>Starting City:</strong>
            ${escapeHTML(trip.starting_city)}
        </p>

        <p><strong>Destination:</strong>
            ${escapeHTML(trip.destination)}
        </p>

        <p><strong>Duration:</strong>
            ${trip.days} days
        </p>

        <p><strong>Budget:</strong>
            ${trip.currency} ${trip.budget}
        </p>

        <p><strong>Travelers:</strong>
            ${trip.travelers}
        </p>

        <p><strong>Travel Style:</strong>
            ${escapeHTML(trip.travel_style)}
        </p>

        <p><strong>Hotel:</strong>
            ${escapeHTML(trip.hotel_preference)}
        </p>

        <p><strong>Must-have Activity:</strong>
            ${escapeHTML(trip.must_have_activity || "None")}
        </p>
    `;


    // -----------------------------
    // Step 1
    // -----------------------------

    document.getElementById("constraints").textContent =
        workflow.step_1_constraints || "No constraint information.";


    // -----------------------------
    // Step 2
    // -----------------------------

    document.getElementById("options").textContent =
        workflow.step_2_options || "No options generated.";


    // -----------------------------
    // Step 3
    // -----------------------------

    document.getElementById("itinerary").textContent =
        workflow.step_3_itinerary || "No itinerary generated.";


    // -----------------------------
    // Step 4
    // -----------------------------

    document.getElementById("costCheck").textContent =
        workflow.step_4_cost_check || "No cost check available.";


    // -----------------------------
    // Budget Rescue
    // -----------------------------

    if (workflow.budget_rescue) {

        rescueCard.classList.remove("hidden");

        document.getElementById("budgetRescue").textContent =
            workflow.budget_rescue;

    }


    // -----------------------------
    // Final Status
    // -----------------------------

    const statusElement =
        document.getElementById("finalStatus");

    statusElement.textContent =
        data.final_status;


    if (data.final_status === "WITHIN BUDGET") {

        statusElement.style.background = "#dcfce7";
        statusElement.style.color = "#166534";

    } else {

        statusElement.style.background = "#fef3c7";
        statusElement.style.color = "#92400e";
    }


    // Show results
    results.classList.remove("hidden");


    // Scroll to results
    results.scrollIntoView({
        behavior: "smooth"
    });
}


// Prevent HTML injection when displaying user input
function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
```
