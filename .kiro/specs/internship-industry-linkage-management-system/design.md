# Design Document — Internship & Industry Linkage Management System (IILMS)

## Overview

IILMS is a three-tier web application that digitizes the full internship lifecycle for universities. It replaces manual, fragmented processes with a structured, role-driven workflow covering internship posting, application processing, supervisor assignment, evaluation, communication, and complaint handling.

The system serves three actor types — Admin, Student, and Company — each with a dedicated portal. All business logic is enforced server-side; the React frontend is a thin client that communicates exclusively through a RESTful JSON API.

Key design goals:
- Strict role-based access control enforced at the middleware layer
- Stateless authentication via JWT (no server-side sessions)
- All state persisted in a normalized MySQL database (3NF)
- Idempotent operations where re-submission is a valid user action (e.g., recommendation letters)
- Audit-friendly: no hard deletes on complaints, notifications, or evaluations

---

## Architecture

### Three-Tier Overview

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Tier                       │
│           React.js SPA (React Router + Axios)           │
│  Public | Student Portal | Company Portal | Admin Dash  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / JSON REST API
┌────────────────────────▼────────────────────────────────┐
│                  Application Tier                        │
│            Node.js + Express.js (MVC)                   │
│  Auth Middleware → Route → Controller → Service → Model │
└────────────────────────┬────────────────────────────────┘
                         │ mysql2 / connection pool
┌────────────────────────▼────────────────────────────────┐
│                    Data Tier                             │
│                  MySQL 8.x Database                     │
│         Normalized schema (3NF), FK constraints         │
└─────────────────────────────────────────────────────────┘
```

### Request Lifecycle

```
Client Request
  → Express Router
    → Rate Limiter Middleware
    → JWT Auth Middleware (verifyToken)
    → Role Guard Middleware (requireRole)
    → Input Validation Middleware (express-validator)
    → Controller
      → Service Layer (business logic)
        → Model Layer (SQL queries via mysql2)
          → MySQL
        ← Result / Error
      ← Formatted response
    ← JSON envelope { success, data | message }
```

### Environment Configuration

All secrets and connection strings are loaded from `.env` via `dotenv`. No credentials are hardcoded. Required variables:

```
PORT
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
JWT_SECRET, JWT_EXPIRES_IN
BCRYPT_COST_FACTOR   # ≥ 10
```

---

## Components and Interfaces

### Backend Directory Structure

```
server/
├── app.js                  # Express app setup, middleware registration
├── server.js               # HTTP server entry point
├── config/
│   └── db.js               # mysql2 connection pool
├── middleware/
│   ├── auth.js             # verifyToken — decodes JWT, attaches req.user
│   ├── roleGuard.js        # requireRole(...roles) factory
│   └── validate.js         # express-validator error handler
├── routes/
│   ├── auth.routes.js
│   ├── internship.routes.js
│   ├── application.routes.js
│   ├── supervisor.routes.js
│   ├── evaluation.routes.js
│   ├── recommendation.routes.js
│   ├── complaint.routes.js
│   ├── notification.routes.js
│   └── dashboard.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── internship.controller.js
│   ├── application.controller.js
│   ├── supervisor.controller.js
│   ├── evaluation.controller.js
│   ├── recommendation.controller.js
│   ├── complaint.controller.js
│   ├── notification.controller.js
│   └── dashboard.controller.js
├── services/
│   ├── auth.service.js
│   ├── internship.service.js
│   ├── application.service.js
│   ├── supervisor.service.js
│   ├── evaluation.service.js
│   ├── recommendation.service.js
│   ├── complaint.service.js
│   ├── notification.service.js
│   └── dashboard.service.js
├── models/
│   ├── user.model.js
│   ├── internship.model.js
│   ├── application.model.js
│   ├── supervisor.model.js
│   ├── evaluation.model.js
│   ├── recommendation.model.js
│   ├── complaint.model.js
│   ├── notification.model.js
│   └── dashboard.model.js
└── validators/
    ├── auth.validator.js
    ├── internship.validator.js
    ├── application.validator.js
    ├── evaluation.validator.js
    └── complaint.validator.js
```

### Frontend Directory Structure

```
client/
├── public/
├── src/
│   ├── main.jsx
│   ├── App.jsx             # React Router root, protected route wrapper
│   ├── api/
│   │   └── axios.js        # Axios instance with base URL + JWT interceptor
│   ├── context/
│   │   └── AuthContext.jsx # JWT storage, login/logout, current user
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Pagination.jsx
│   │   └── ErrorMessage.jsx
│   ├── pages/
│   │   ├── public/
│   │   │   ├── InternshipListing.jsx
│   │   │   └── InternshipDetail.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── BrowseInternships.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   ├── MyEvaluations.jsx
│   │   │   ├── MyNotifications.jsx
│   │   │   └── MyComplaints.jsx
│   │   ├── company/
│   │   │   ├── CompanyDashboard.jsx
│   │   │   ├── ManageInternships.jsx
│   │   │   ├── InternshipForm.jsx
│   │   │   └── ReviewApplications.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AllApplications.jsx
│   │       ├── AssignSupervisor.jsx
│   │       ├── AllEvaluations.jsx
│   │       ├── RecommendationLetters.jsx
│   │       └── ManageComplaints.jsx
│   └── utils/
│       └── formatDate.js
```

### Middleware Interfaces

```js
// auth.js
verifyToken(req, res, next)
// Decodes Authorization: Bearer <token>
// Attaches { id, email, role } to req.user
// Returns 401 if missing or invalid

// roleGuard.js
requireRole(...roles) → middleware(req, res, next)
// Returns 403 if req.user.role not in roles

// validate.js
handleValidationErrors(req, res, next)
// Returns 422 with field errors if express-validator found issues
```

---

## Data Models

### Entity-Relationship Diagram

```
Users
  ├── id (PK)
  ├── email (UNIQUE, NOT NULL)
  ├── password_hash (NOT NULL)
  ├── role (ENUM: admin|student|company, NOT NULL)
  ├── full_name (NOT NULL)
  └── created_at

Internships
  ├── id (PK)
  ├── company_id (FK → Users.id, NOT NULL)
  ├── title (NOT NULL)
  ├── description (NOT NULL)
  ├── skills_required
  ├── location (NOT NULL)
  ├── duration_weeks (NOT NULL)
  ├── deadline (DATE, NOT NULL)
  ├── status (ENUM: open|closed, DEFAULT open)
  └── created_at

Applications
  ├── id (PK)
  ├── student_id (FK → Users.id, NOT NULL)
  ├── internship_id (FK → Internships.id, NOT NULL)
  ├── status (ENUM: pending|accepted|rejected, DEFAULT pending)
  ├── applied_at
  └── UNIQUE(student_id, internship_id)

SupervisorAssignments
  ├── id (PK)
  ├── application_id (FK → Applications.id, UNIQUE, NOT NULL)
  ├── supervisor_id (FK → Users.id, NOT NULL)
  └── assigned_at

Evaluations
  ├── id (PK)
  ├── application_id (FK → Applications.id, NOT NULL)
  ├── evaluator_id (FK → Users.id, NOT NULL)
  ├── score (INT, CHECK 0–100, NOT NULL)
  ├── feedback (TEXT)
  ├── evaluated_at
  └── UNIQUE(application_id, evaluator_id)

RecommendationLetters
  ├── id (PK)
  ├── application_id (FK → Applications.id, UNIQUE, NOT NULL)
  ├── content (TEXT, NOT NULL)
  └── generated_at

Complaints
  ├── id (PK)
  ├── student_id (FK → Users.id, NOT NULL)
  ├── subject (NOT NULL)
  ├── status (ENUM: open|resolved, DEFAULT open)
  └── created_at

ComplaintMessages
  ├── id (PK)
  ├── complaint_id (FK → Complaints.id, NOT NULL)
  ├── sender_id (FK → Users.id, NOT NULL)
  ├── message (TEXT, NOT NULL)
  └── sent_at

Notifications
  ├── id (PK)
  ├── user_id (FK → Users.id, NOT NULL)
  ├── message (NOT NULL)
  ├── is_read (BOOLEAN, DEFAULT false)
  └── created_at
```

### Relationships

```
Users ──< Internships          (one company posts many internships)
Users ──< Applications         (one student submits many applications)
Internships ──< Applications   (one internship receives many applications)
Applications ──| SupervisorAssignments  (one-to-one)
Applications ──< Evaluations   (one application, many evaluators)
Applications ──| RecommendationLetters (one-to-one)
Users ──< Complaints           (one student files many complaints)
Complaints ──< ComplaintMessages
Users ──< Notifications
```

### Cascade / Restrict Rules

| Parent deleted | Child action |
|---|---|
| Users (company) | RESTRICT Internships (preserve history) |
| Users (student) | RESTRICT Applications |
| Internships | RESTRICT Applications |
| Applications | CASCADE SupervisorAssignments, Evaluations, RecommendationLetters |
| Complaints | CASCADE ComplaintMessages |
| Users | CASCADE Notifications |

### 3NF Justification

- Every non-key attribute depends on the whole primary key (no partial dependencies — all PKs are single-column surrogate keys).
- No transitive dependencies: e.g., `Applications` stores only FKs; student name is not repeated — it is fetched via JOIN on `Users`.
- `ComplaintMessages` is separated from `Complaints` to avoid repeating group (thread history).
- `SupervisorAssignments` is a separate table (not a column on `Applications`) to keep `Applications` free of supervisor concerns and allow the assignment to carry its own timestamp.

---

## API Endpoint Design

All responses use the envelope:
```json
{ "success": true,  "data": { ... } }
{ "success": false, "message": "Human-readable error" }
```

Pagination parameters: `?page=1&limit=20`

### Authentication

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | None | Register new user |
| POST | /api/auth/login | None | Login, returns JWT |

**POST /api/auth/register** body:
```json
{ "email": "string", "password": "string", "full_name": "string", "role": "student|company|admin" }
```
Responses: `201 Created` | `409 Conflict` (duplicate email) | `422 Unprocessable` (validation)

**POST /api/auth/login** body:
```json
{ "email": "string", "password": "string" }
```
Responses: `200 OK { token, user }` | `401 Unauthorized`

### Internships

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/internships | None | List open internships (paginated) |
| GET | /api/internships/:id | None | Get single internship |
| POST | /api/internships | Company | Create internship |
| PUT | /api/internships/:id | Company | Update own internship |
| DELETE | /api/internships/:id | Company | Delete own internship |
| GET | /api/internships/my | Company | List own internships |
| PATCH | /api/internships/:id/status | Company | Open/close internship |

### Applications

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/applications | Student | Apply to internship |
| GET | /api/applications/my | Student | My applications |
| GET | /api/applications | Admin | All applications (paginated) |
| GET | /api/internships/:id/applications | Company | Applications for own internship |
| PATCH | /api/applications/:id/status | Company | Accept or reject |

### Supervisor Assignment

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/supervisors/assign | Admin | Assign supervisor to application |
| GET | /api/supervisors/my-students | Supervisor* | View assigned students |

*Supervisor is a User with role `admin` designated as supervisor — or a separate `supervisor` role value. See design decision note below.

> **Design Decision**: The requirements mention "Supervisor" as university staff. To keep the role enum minimal, supervisors are `admin`-role users. The `SupervisorAssignments.supervisor_id` FK points to a `Users` record with `role = admin`. The `/my-students` endpoint filters by `supervisor_id = req.user.id`. This avoids adding a fourth role while preserving the assignment relationship.

### Evaluations

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/evaluations | Admin or Company | Submit evaluation |
| GET | /api/evaluations/my | Student | My evaluations |
| GET | /api/evaluations | Admin | All evaluations (paginated) |

### Recommendation Letters

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/recommendations | Admin | Generate (idempotent) |
| GET | /api/recommendations | Admin | All letters (paginated) |
| GET | /api/recommendations/:application_id | Student | Own letter |

### Complaints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/complaints | Student | Submit complaint |
| GET | /api/complaints/my | Student | My complaints with thread |
| GET | /api/complaints | Admin | All complaints (paginated) |
| POST | /api/complaints/:id/reply | Admin | Append reply to thread |
| PATCH | /api/complaints/:id/resolve | Admin | Mark resolved |

### Notifications

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/notifications | Any auth | Unread notifications (desc timestamp) |
| PATCH | /api/notifications/:id/read | Any auth | Mark single as read |
| PATCH | /api/notifications/read-all | Any auth | Mark all as read |

### Dashboard

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/dashboard/summary | Admin | Counts summary |
| GET | /api/dashboard/applications-breakdown | Admin | Per-internship breakdown |
| GET | /api/dashboard/evaluation-stats | Admin | Avg score + count per internship |

---

## Internship Workflow Sequence

```
Company                  System                   Student               Admin
  │                        │                         │                    │
  │── POST /internships ──>│                         │                    │
  │<── 201 internship ─────│                         │                    │
  │                        │                         │                    │
  │                        │<── GET /internships ────│                    │
  │                        │─── open list ──────────>│                    │
  │                        │                         │                    │
  │                        │<── POST /applications ──│                    │
  │                        │── create Application ──>│                    │
  │                        │   (status: pending)     │                    │
  │                        │                         │                    │
  │<── GET /:id/applications│                         │                    │
  │─── application list ──>│                         │                    │
  │                        │                         │                    │
  │── PATCH /status ──────>│                         │                    │
  │   (accepted/rejected)  │── Notification ────────>│                    │
  │<── 200 ────────────────│                         │                    │
  │                        │                         │                    │
  │                        │                         │           │        │
  │                        │<────────────────────────────── POST /assign ─│
  │                        │── create SupervisorAssignment                │
  │                        │── Notification ────────>│                    │
  │                        │                         │                    │
  │── POST /evaluations ──>│                         │                    │
  │<── 201 evaluation ─────│                         │                    │
  │                        │                         │                    │
  │                        │<── GET /evaluations/my ─│                    │
  │                        │─── evaluations ────────>│                    │
  │                        │                         │                    │
  │                        │<────────────────────────────── POST /recommendations
  │                        │── generate letter (idempotent)               │
  │                        │<── GET /recommendations/:app_id ─────────────│
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

---

### Property 1: Unique Email Enforcement

*For any* two registration requests that share the same email address, the second request SHALL return HTTP 409, and only one user record SHALL exist in the database for that email.

**Validates: Requirements 1.1**

---

### Property 2: JWT Issued on Valid Login

*For any* registered user, submitting a login request with the correct email and password SHALL return HTTP 200 with a non-empty JWT token string.

**Validates: Requirements 1.1**

---

### Property 3: 401 on Wrong Credentials

*For any* registered user, submitting a login request with an incorrect password SHALL return HTTP 401 and no token.

**Validates: Requirements 1.1**

---

### Property 4: Role-Based Access Rejection

*For any* protected endpoint that requires role R, a request authenticated with a JWT whose role is not R SHALL receive HTTP 403.

**Validates: Requirements 2.1, 2.2**

---

### Property 5: 401 on Missing JWT

*For any* protected endpoint, a request with no Authorization header SHALL receive HTTP 401.

**Validates: Requirements 2.2**

---

### Property 6: Company Ownership Enforcement

*For any* internship owned by Company A, a modification or deletion request authenticated as Company B (where B ≠ A) SHALL return HTTP 403, and the internship record SHALL remain unchanged.

**Validates: Requirements 3.1, 3.2**

---

### Property 7: Public Listing Returns Only Open Internships

*For any* state of the internship table containing a mix of open and closed internships, the public GET /api/internships endpoint SHALL return only internships with status = open.

**Validates: Requirements 3.1**

---

### Property 8: New Application Status is Pending

*For any* student applying to an open internship for the first time, the created application SHALL have status = pending.

**Validates: Requirements 4.1**

---

### Property 9: Duplicate Application Prevention

*For any* (student_id, internship_id) pair, submitting a second application SHALL return HTTP 409, and the application count for that pair SHALL remain 1.

**Validates: Requirements 4.2**

---

### Property 10: Closed Internship Application Rejection

*For any* internship with status = closed, any student application attempt SHALL return HTTP 400, and no application record SHALL be created.

**Validates: Requirements 4.3**

---

### Property 11: Application Status Change Triggers Notification

*For any* application whose status is updated (to accepted or rejected), a notification record SHALL be created for the application's student_id before the response is returned.

**Validates: Requirements 4.4**

---

### Property 12: Supervisor Assignment Requires Accepted Application

*For any* application with status ≠ accepted, an attempt to assign a supervisor SHALL return HTTP 400, and no SupervisorAssignment record SHALL be created.

**Validates: Requirements 5.1**

---

### Property 13: Duplicate Supervisor Assignment Prevention

*For any* application that already has a SupervisorAssignment record, a second assignment attempt SHALL return HTTP 409, and the existing assignment SHALL remain unchanged.

**Validates: Requirements 5.2**

---

### Property 14: Supervisor Assignment Triggers Notification

*For any* successful supervisor assignment, a notification record SHALL be created for the student associated with the application.

**Validates: Requirements 5.1**

---

### Property 15: Evaluation Score Boundary Validation

*For any* evaluation submission, a score in the range [0, 100] (inclusive) SHALL be accepted (HTTP 201), and a score outside that range SHALL be rejected (HTTP 400) with no record created.

**Validates: Requirements 6.1, 6.2**

---

### Property 16: Duplicate Evaluation Prevention

*For any* (application_id, evaluator_id) pair, submitting a second evaluation SHALL return HTTP 409, and the evaluation count for that pair SHALL remain 1.

**Validates: Requirements 6.2**

---

### Property 17: Recommendation Letter Requires Evaluation

*For any* application that has no evaluation record, a request to generate a recommendation letter SHALL fail (HTTP 400 or 422), and no RecommendationLetter record SHALL be created.

**Validates: Requirements 7.1**

---

### Property 18: Recommendation Letter Generation is Idempotent

*For any* application that has an evaluation, generating a recommendation letter twice SHALL return the same letter record (same id and content) on both calls, and exactly one RecommendationLetter record SHALL exist for that application.

**Validates: Requirements 7.1**

---

### Property 19: New Complaint Status is Open

*For any* complaint submitted by a student, the created complaint record SHALL have status = open.

**Validates: Requirements 8.1**

---

### Property 20: Complaint Reply Appends to Thread

*For any* complaint with N messages, after an admin reply the complaint SHALL have exactly N + 1 messages, and no existing message SHALL be modified or deleted.

**Validates: Requirements 8.2**

---

### Property 21: Admin Complaint Reply Triggers Notification

*For any* admin reply to a complaint, a notification record SHALL be created for the complaint's student_id.

**Validates: Requirements 8.3**

---

### Property 22: Unread Notifications Ordered by Timestamp Descending

*For any* user with multiple unread notifications, the GET /api/notifications endpoint SHALL return them ordered by created_at descending (newest first).

**Validates: Requirements 9.1**

---

### Property 23: Mark-as-Read Round Trip

*For any* unread notification, after marking it as read via PATCH /api/notifications/:id/read, that notification SHALL NOT appear in subsequent GET /api/notifications responses for that user.

**Validates: Requirements 9.1**

---

### Property 24: Dashboard Counts Match Actual Data

*For any* database state, the summary counts returned by GET /api/dashboard/summary SHALL equal the actual COUNT of each entity (students, companies, open internships, pending applications, unresolved complaints) as computed by direct queries.

**Validates: Requirements 10.1**

---

### Property 25: JSON Envelope on All Responses

*For any* API endpoint and any request (valid or invalid), the response body SHALL be a JSON object containing a boolean `success` field, and either a `data` field (on success) or a `message` field (on failure).

**Validates: Requirements 12.1**

---

### Property 26: Protected Frontend Routes Redirect to Login

*For any* React route marked as protected, rendering it without a valid JWT in AuthContext SHALL redirect the user to the /login page rather than rendering the protected content.

**Validates: Requirements 13.1**

---

## Error Handling

### HTTP Status Code Conventions

| Scenario | Status |
|---|---|
| Successful creation | 201 |
| Successful read/update | 200 |
| Validation failure (field errors) | 422 |
| Bad business logic input | 400 |
| Missing or invalid JWT | 401 |
| Insufficient role | 403 |
| Resource not found | 404 |
| Duplicate unique resource | 409 |
| Unhandled server exception | 500 |

### Error Response Shape

```json
{
  "success": false,
  "message": "Human-readable description of the error"
}
```

For validation errors (422), an additional `errors` array is included:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Must be a valid email address" }
  ]
}
```

### Global Error Middleware

A catch-all Express error handler is registered last in `app.js`. It:
1. Logs the full stack trace server-side (never exposed to client)
2. Returns `{ success: false, message: "Internal server error" }` with status 500
3. Distinguishes operational errors (known, thrown intentionally) from programmer errors (unexpected)

### Frontend Error Handling

- Axios response interceptor catches all non-2xx responses
- 401 responses trigger automatic logout and redirect to `/login`
- All other errors surface a user-readable `ErrorMessage` component
- No raw error objects or stack traces are shown to users

---

## Testing Strategy

### Dual Testing Approach

Both unit/integration tests and property-based tests are required. They are complementary:

- **Unit/integration tests** verify specific examples, edge cases, and integration points
- **Property-based tests** verify universal invariants across randomly generated inputs

### Property-Based Testing

**Library**: [fast-check](https://github.com/dubzzz/fast-check) (JavaScript/TypeScript, actively maintained, works with Jest/Vitest)

**Configuration**:
- Minimum **100 runs** per property test (`numRuns: 100` in `fc.assert`)
- Each test is tagged with a comment referencing the design property

**Tag format**:
```
// Feature: internship-industry-linkage-management-system, Property N: <property_text>
```

**Each correctness property (1–26) maps to exactly one property-based test.**

Example structure:
```js
// Feature: internship-industry-linkage-management-system, Property 9: Duplicate Application Prevention
it('duplicate application returns 409', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.record({ studentId: fc.uuid(), internshipId: fc.uuid() }),
      async ({ studentId, internshipId }) => {
        // seed DB, apply once (expect 201), apply again (expect 409)
        // assert application count === 1
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit / Integration Tests

Focus areas:
- Auth token generation and verification (specific examples)
- bcrypt cost factor verification (example: check hash prefix `$2b$10$`)
- HTTP 500 global error handler (simulate thrown error, verify response shape)
- Dashboard aggregate queries (seed known data, verify exact counts)
- Frontend `ProtectedRoute` component (render without token, assert redirect)

Avoid writing unit tests for behaviors already covered by property tests (e.g., do not write a single-example test for duplicate email if the property test already covers it).

### Test Runner

**Backend**: Jest with Supertest for HTTP integration tests against an in-memory or test MySQL database.

**Frontend**: Vitest + React Testing Library for component and route tests.

Run tests in single-execution mode (no watch):
```
# backend
jest --runInBand

# frontend
vitest --run
```
