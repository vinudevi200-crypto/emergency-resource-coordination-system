# Emergency Resource Coordination System

A full-stack CRUD web application for managing emergency resources, requests, and shelter availability during disaster response.

## Problem Statement

During emergencies, information about available supplies and shelter capacity is often scattered or manual, causing delays in relief efforts. This system centralizes resource tracking, request fulfillment, and shelter status in one place.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Java, Spring Boot, Spring Data JPA |
| Database | MySQL |
| API Testing | Postman |
| Version Control | Git / GitHub |

## System Architecture

User → HTML/CSS/JS Frontend → REST API (Spring Boot) → JPA/Hibernate → MySQL

Backend layers: Controller → Service → Repository → Database

## Entities

**Resource** — `resourceType`, `quantityAvailable`, `unit`, `location`, `status` (AVAILABLE / LOW / DEPLETED), `lastUpdated`

**Request** — `requestedBy`, `resource` (foreign key), `quantityNeeded`, `urgency` (LOW / MEDIUM / HIGH / CRITICAL), `status` (PENDING / FULFILLED / REJECTED), `requestDate`

**Shelter** — `name`, `location`, `capacity`, `occupancy`, `status` (OPEN / FULL / CLOSED)

## API Endpoints

### Resources
| Method | Endpoint |
|---|---|
| GET | `/api/resources` |
| GET | `/api/resources/{id}` |
| POST | `/api/resources` |
| PUT | `/api/resources/{id}` |
| DELETE | `/api/resources/{id}` |

### Requests
| Method | Endpoint |
|---|---|
| GET | `/api/requests` |
| GET | `/api/requests/{id}` |
| POST | `/api/requests/resource/{resourceId}` |
| PUT | `/api/requests/{id}/fulfill` |
| PUT | `/api/requests/{id}/reject` |
| DELETE | `/api/requests/{id}` |

### Shelters
| Method | Endpoint |
|---|---|
| GET | `/api/shelters` |
| GET | `/api/shelters/{id}` |
| POST | `/api/shelters` |
| PUT | `/api/shelters/{id}` |
| DELETE | `/api/shelters/{id}` |

## Validation Rules

- All quantities (quantityAvailable, quantityNeeded, capacity) must be positive
- Status and urgency restricted to fixed enum values
- A request cannot be fulfilled if quantity needed exceeds available stock
- Shelter occupancy cannot exceed capacity
- All validation enforced server-side, returning clear 400 / 404 JSON errors

## Setup Instructions

### Prerequisites
- JDK 17 or higher
- Maven
- MySQL Server 8.x
- VS Code with Live Server extension

### Backend
1. Create the database:
```sql
   CREATE DATABASE resource_coordination;
```
2. Open the `resource-coordination` backend folder
3. Update `src/main/resources/application.properties` with your MySQL username and password
4. Run the application (Run button in VS Code, or `mvn spring-boot:run`)
5. Backend starts at `http://localhost:8080` — tables are created automatically

### Frontend
1. Open the `frontend` folder
2. Right-click `index.html` → "Open with Live Server"
3. Runs at `http://127.0.0.1:5500`

### Pages
- `index.html` — Manage Resources and Requests
- `availability.html` — Shelter Availability (public view, no login)

## Project Structure
resource-coordination/
├── resource-coordination/ (Spring Boot backend)
├── frontend/ (HTML, CSS, JavaScript)
├── docs/ (project documentation report)
├── README.md
└── .gitignore


## Testing

All endpoints tested in Postman — successful CRUD operations, plus edge cases: negative quantities, missing fields, invalid enum values, over-fulfillment attempts, and occupancy exceeding capacity. All returned correct 200 / 400 / 404 responses.

## Future Enhancements

- Add login/authentication (currently both pages are open to anyone with the link)
- Add search and filter functionality
- Deploy live (frontend on Vercel/Netlify, backend on Render/Railway)
- Add automated unit tests with JUnit

## Author

VINUSHIKA M