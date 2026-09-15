const SHELTER_API_URL = "http://localhost:8080/api/shelters";
const shelterTableBody = document.getElementById("shelterTableBody");

document.addEventListener("DOMContentLoaded", loadShelters);

function loadShelters() {
    fetch(SHELTER_API_URL)
        .then(response => response.json())
        .then(data => renderShelterTable(data))
        .catch(error => console.error("Error loading shelters:", error));
}

function renderShelterTable(shelters) {
    shelterTableBody.innerHTML = "";

    shelters.forEach(shelter => {
        const spotsAvailable = shelter.capacity - shelter.occupancy;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${shelter.name}</td>
            <td>${shelter.location}</td>
            <td>${shelter.capacity}</td>
            <td>${shelter.occupancy}</td>
            <td>${spotsAvailable}</td>
            <td class="status-${shelter.status}">${shelter.status}</td>
        `;
        shelterTableBody.appendChild(row);
    });
}

const shelterForm = document.getElementById("shelterForm");

shelterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const shelterData = {
        name: document.getElementById("shelterName").value,
        location: document.getElementById("shelterLocation").value,
        capacity: parseInt(document.getElementById("capacity").value),
        occupancy: parseInt(document.getElementById("occupancy").value)
    };

    fetch(SHELTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shelterData)
    })
    .then(response => {
        if (!response.ok) return response.json().then(err => { throw new Error(err.message); });
        return response.json();
    })
    .then(() => {
        shelterForm.reset();
        loadShelters();
    })
    .catch(error => alert("Error adding shelter: " + error.message));
});