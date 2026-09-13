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