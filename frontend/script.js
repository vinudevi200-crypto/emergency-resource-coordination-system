const API_URL = "http://localhost:8080/api/resources";

const form = document.getElementById("resourceForm");
const tableBody = document.getElementById("resourceTableBody");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Load all resources when page opens
document.addEventListener("DOMContentLoaded", loadResources);

// Fetch all resources and display them in the table
function loadResources() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => renderTable(data))
        .catch(error => console.error("Error loading resources:", error));
}

// Render the table rows
function renderTable(resources) {
    tableBody.innerHTML = "";

    resources.forEach(resource => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${resource.id}</td>
            <td>${resource.resourceType}</td>
            <td>${resource.quantityAvailable}</td>
            <td>${resource.unit}</td>
            <td>${resource.location}</td>
            <td class="status-${resource.status}">${resource.status}</td>
            <td>${new Date(resource.lastUpdated).toLocaleString()}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editResource(${resource.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteResource(${resource.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Handle form submit (Create or Update)
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("resourceId").value;
    const resourceData = {
        resourceType: document.getElementById("resourceType").value,
        quantityAvailable: parseInt(document.getElementById("quantityAvailable").value),
        unit: document.getElementById("unit").value,
        location: document.getElementById("location").value,
        status: document.getElementById("status").value
    };

    if (id) {
        // Update existing resource
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resourceData)
        })
        .then(response => {
            if (!response.ok) throw new Error("Update failed");
            return response.json();
        })
        .then(() => {
            resetForm();
            loadResources();
        })
        .catch(error => alert("Error updating resource: " + error.message));
    } else {
        // Create new resource
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resourceData)
        })
        .then(response => {
            if (!response.ok) throw new Error("Create failed");
            return response.json();
        })
        .then(() => {
            resetForm();
            loadResources();
        })
        .catch(error => alert("Error creating resource: " + error.message));
    }
});

// Fill the form with existing data for editing
function editResource(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(resource => {
            document.getElementById("resourceId").value = resource.id;
            document.getElementById("resourceType").value = resource.resourceType;
            document.getElementById("quantityAvailable").value = resource.quantityAvailable;
            document.getElementById("unit").value = resource.unit;
            document.getElementById("location").value = resource.location;
            document.getElementById("status").value = resource.status;

            formTitle.textContent = "Edit Resource";
            submitBtn.textContent = "Update Resource";
            cancelBtn.style.display = "inline-block";
        })
        .catch(error => alert("Error loading resource: " + error.message));
}

// Delete a resource
function deleteResource(id) {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) throw new Error("Delete failed");
            loadResources();
        })
        .catch(error => alert("Error deleting resource: " + error.message));
}

// Reset form back to "Add" mode
function resetForm() {
    form.reset();
    document.getElementById("resourceId").value = "";
    formTitle.textContent = "Add New Resource";
    submitBtn.textContent = "Add Resource";
    cancelBtn.style.display = "none";
}

cancelBtn.addEventListener("click", resetForm);

const REQUEST_API_URL = "http://localhost:8080/api/requests";
const requestForm = document.getElementById("requestForm");
const requestTableBody = document.getElementById("requestTableBody");

document.addEventListener("DOMContentLoaded", loadRequests);

function loadRequests() {
    fetch(REQUEST_API_URL)
        .then(response => response.json())
        .then(data => renderRequestTable(data))
        .catch(error => console.error("Error loading requests:", error));
}

function renderRequestTable(requests) {
    requestTableBody.innerHTML = "";

    requests.forEach(req => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="status-${req.status}">${req.status}</td>
            <td>${req.requestedBy}</td>
            <td>${req.resource.resourceType} (ID: ${req.resource.id})</td>
            <td>${req.quantityNeeded}</td>
            <td>${req.urgency}</td>
            <td>${req.status}</td>
            <td>${new Date(req.requestDate).toLocaleString()}</td>
            <td>
                ${req.status === "PENDING" ? `
                    <button class="action-btn edit-btn" onclick="fulfillRequest(${req.id})">Fulfill</button>
                    <button class="action-btn delete-btn" onclick="rejectRequest(${req.id})">Reject</button>
                ` : ""}
                <button class="action-btn delete-btn" onclick="deleteRequest(${req.id})">Delete</button>
            </td>
        `;
        requestTableBody.appendChild(row);
    });
}

requestForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const resourceId = document.getElementById("reqResourceId").value;
    const requestData = {
        requestedBy: document.getElementById("requestedBy").value,
        quantityNeeded: parseInt(document.getElementById("quantityNeeded").value),
        urgency: document.getElementById("urgency").value
    };

    fetch(`${REQUEST_API_URL}/resource/${resourceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) return response.json().then(err => { throw new Error(err.message); });
        return response.json();
    })
    .then(() => {
        requestForm.reset();
        loadRequests();
        loadResources(); // refresh resource table too, in case stock changes later
    })
    .catch(error => alert("Error creating request: " + error.message));
});

function fulfillRequest(id) {
    fetch(`${REQUEST_API_URL}/${id}/fulfill`, { method: "PUT" })
        .then(response => {
            if (!response.ok) return response.json().then(err => { throw new Error(err.message); });
            return response.json();
        })
        .then(() => {
            loadRequests();
            loadResources(); // refresh resource stock display
        })
        .catch(error => alert("Error fulfilling request: " + error.message));
}

function rejectRequest(id) {
    fetch(`${REQUEST_API_URL}/${id}/reject`, { method: "PUT" })
        .then(response => response.json())
        .then(() => loadRequests())
        .catch(error => alert("Error rejecting request: " + error.message));
}

function deleteRequest(id) {
    if (!confirm("Are you sure you want to delete this request?")) return;

    fetch(`${REQUEST_API_URL}/${id}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) throw new Error("Delete failed");
            loadRequests();
        })
        .catch(error => alert("Error deleting request: " + error.message));
}

const SHELTER_API = "http://localhost:8080/api/shelters";
const shelterForm = document.getElementById("shelterForm");
const shelterTableBodyAdmin = document.getElementById("shelterTableBodyAdmin");

document.addEventListener("DOMContentLoaded", loadShelters);

function loadShelters() {
    fetch(SHELTER_API)
        .then(response => response.json())
        .then(data => renderShelterTable(data))
        .catch(error => console.error("Error loading shelters:", error));
}

function renderShelterTable(shelters) {
    shelterTableBodyAdmin.innerHTML = "";
    shelters.forEach(shelter => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${shelter.id}</td>
            <td>${shelter.name}</td>
            <td>${shelter.location}</td>
            <td>${shelter.capacity}</td>
            <td>${shelter.occupancy}</td>
            <td class="status-${shelter.status}">${shelter.status}</td>
            <td>
                <button class="action-btn delete-btn" onclick="deleteShelter(${shelter.id})">Delete</button>
            </td>
        `;
        shelterTableBodyAdmin.appendChild(row);
    });
}

shelterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const shelterData = {
        name: document.getElementById("shelterName").value,
        location: document.getElementById("shelterLocation").value,
        capacity: parseInt(document.getElementById("capacity").value),
        occupancy: parseInt(document.getElementById("occupancy").value)
    };

    fetch(SHELTER_API, {
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

function deleteShelter(id) {
    if (!confirm("Are you sure you want to delete this shelter?")) return;

    fetch(`${SHELTER_API}/${id}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) throw new Error("Delete failed");
            loadShelters();
        })
        .catch(error => alert("Error deleting shelter: " + error.message));
}