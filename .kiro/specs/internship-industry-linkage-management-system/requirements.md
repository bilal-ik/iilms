# Requirements Document

## Introduction

The Internship & Industry Linkage Management System (IILMS) is a centralized, web-based platform that digitizes the full internship lifecycle for universities. It connects three actor types — Admin (university staff), Students, and Industry Partners (Companies) — through a structured, role-driven workflow. The system covers internship posting, application processing, supervisor assignment, evaluation, communication, and complaint handling. It replaces fragmented manual processes with a single platform enforcing consistent business rules and audit-friendly data retention.

## Glossary

- **System**: The IILMS web application as a whole (frontend + backend + database).
- **API**: The RESTful JSON API exposed by the Node.js/Express backend.
- **Admin**: A university staff user with role `admin`, responsible for overseeing applications, assigning supervisors, managing complaints, and generating recommendation letters.
- **Student**: A registered user with role `student` who browses internships, submits applications, and tracks progress.
- **Company**: A registered user with role `company` who posts internships and reviews/accepts/rejects applications.
- **Supervisor**: An Admin-role user designated to supervise a specific accepted intern.
- **Internship**: A placement opportunity posted by a Company, with a defined deadline and open/closed status.
- **Application**: A Student's submission of interest for a specific Internship.
- **SupervisorAssignment**: A record linking an accepted Application to a Supervisor.
- **Evaluation**: A scored assessment (0–100) submitted by a Company or Admin for a completed internship Application.
- **RecommendationLetter**: A generated document associated with an evaluated Application.
- **Complaint**: A formal issue submitted by a Student, tracked as a threaded conversation with Admin.
- **ComplaintMessage**: A single message within a Complaint thread, sent by either the Student or an Admin.
- **Notification**: An in-system message delivered to a User upon key lifecycle events.
- **JWT**: JSON Web Token used for stateless authentication.
- **AuthContext**: The React context that stores the current user's JWT and exposes login/logout functions.
- **ProtectedRoute**: A React Router wrapper that redirects unauthenticated users to the login page.
- **Validator**: The express-validator middleware layer that checks request body fields before they reach a controller.

---

## Requirements

### Requirement 1: User Registration and Authentication

**User Story:** As a visitor, I want to register an account and log in, so that I can access the features appropriate to my role.

#### Acceptance Criteria

1. THE System SHALL accept registration requests containing `email`, `password`, `full_name`, and `role` (one of `student`, `company`, `admin`).
2. WHEN a registration request is received with an email that already exists in the database, THE System SHALL return HTTP 409 and no new user record SHALL be created.
3. WHEN a valid registration request is received, THE System SHALL store the password as a bcrypt hash with a cost factor of at least 10 and return HTTP 201.
4. WHEN a login request is received with a valid email and matching password, THE System SHALL return HTTP 200 with a signed JWT and the user's `id`, `email`, `role`, and `full_name`.
5. WHEN a login request is received with a valid email and an incorrect password, THE System SHALL return HTTP 401 and no token.
6. WHEN a login request is received for an email that does not exist, THE System SHALL return HTTP 401 and no token.
7. THE Validator SHALL reject registration requests missing any required field with HTTP 422 and a field-level error array.

---

### Requirement 2: Role-Based Access Control

**User Story:** As a system operator, I want every API endpoint to enforce role-based authorization, so that users can only perform actions permitted by their role.

#### Acceptance Criteria

1. WHEN a request is made to a protected endpoint without an `Authorization: Bearer <token>` header, THE System SHALL return HTTP 401.
2. WHEN a request is made to a protected endpoint with an expired or malformed JWT, THE System SHALL return HTTP 401.
3. WHEN a request is made to an endpoint restricted to role R and the authenticated user's role is not R, THE System SHALL return HTTP 403.
4. THE System SHALL attach the decoded `{ id, email, role }` payload to the request context after successful JWT verification, so that downstream middleware and controllers can use it without re-decoding the token.

---

### Requirement 3: Internship Management

**User Story:** As a Company, I want to post, update, and manage internship listings, so that students can discover and apply to my opportunities.

#### Acceptance Criteria

1. WHEN a Company submits a valid internship creation request containing `title`, `description`, `location`, `duration_weeks`, and `deadline`, THE System SHALL create an Internship record with `status = open` and return HTTP 201.
2. WHEN a Company submits an update or delete request for an Internship it does not own, THE System SHALL return HTTP 403 and the Internship record SHALL remain unchanged.
3. WHEN a Company closes an Internship by setting `status = closed`, THE System SHALL persist the status change and return HTTP 200.
4. THE System SHALL expose a public (unauthenticated) endpoint that returns only Internships with `status = open`, paginated by `page` and `limit` query parameters.
5. WHEN a request is made to GET a single Internship by id and no matching record exists, THE System SHALL return HTTP 404.
6. THE Validator SHALL reject internship creation requests missing any required field with HTTP 422 and a field-level error array.

---

### Requirement 4: Application Processing

**User Story:** As a Student, I want to apply to open internships and track my application status, so that I can manage my internship search in one place.

#### Acceptance Criteria

1. WHEN a Student submits an application to an Internship with `status = open` and no prior application exists for that (student_id, internship_id) pair, THE System SHALL create an Application record with `status = pending` and return HTTP 201.
2. WHEN a Student submits an application for an (student_id, internship_id) pair that already has an Application record, THE System SHALL return HTTP 409 and the Application count for that pair SHALL remain 1.
3. WHEN a Student submits an application to an Internship with `status = closed`, THE System SHALL return HTTP 400 and no Application record SHALL be created.
4. WHEN a Company updates an Application's status to `accepted` or `rejected`, THE System SHALL create a Notification record for the Application's `student_id` before returning HTTP 200.
5. THE System SHALL allow a Student to retrieve all of their own Applications, including the associated Internship title and current status.
6. THE System SHALL allow a Company to retrieve all Applications for an Internship it owns.
7. THE System SHALL allow an Admin to retrieve all Applications across all Internships, paginated.

---

### Requirement 5: Supervisor Assignment

**User Story:** As an Admin, I want to assign a supervisor to each accepted intern, so that every active internship has a designated point of contact.

#### Acceptance Criteria

1. WHEN an Admin submits a supervisor assignment for an Application with `status = accepted`, THE System SHALL create a SupervisorAssignment record linking the Application to the designated Supervisor and return HTTP 201.
2. WHEN an Admin submits a supervisor assignment for an Application with `status ≠ accepted`, THE System SHALL return HTTP 400 and no SupervisorAssignment record SHALL be created.
3. WHEN an Admin submits a supervisor assignment for an Application that already has a SupervisorAssignment record, THE System SHALL return HTTP 409 and the existing assignment SHALL remain unchanged.
4. WHEN a SupervisorAssignment is successfully created, THE System SHALL create a Notification record for the Student associated with the Application.
5. THE System SHALL allow a Supervisor (Admin-role user) to retrieve the list of Applications assigned to them.

---

### Requirement 6: Evaluation System

**User Story:** As a Company or Admin, I want to submit a scored evaluation for a completed internship, so that student performance is formally recorded.

#### Acceptance Criteria

1. WHEN an evaluation submission is received with a `score` in the range [0, 100] inclusive, THE System SHALL create an Evaluation record and return HTTP 201.
2. WHEN an evaluation submission is received with a `score` outside the range [0, 100], THE System SHALL return HTTP 400 and no Evaluation record SHALL be created.
3. WHEN an evaluation submission is received for an (application_id, evaluator_id) pair that already has an Evaluation record, THE System SHALL return HTTP 409 and the Evaluation count for that pair SHALL remain 1.
4. THE System SHALL allow a Student to retrieve all Evaluation records associated with their own Applications.
5. THE System SHALL allow an Admin to retrieve all Evaluation records, paginated.

---

### Requirement 7: Recommendation Letters

**User Story:** As an Admin, I want to generate a recommendation letter for an evaluated intern, so that students have a formal document to support future applications.

#### Acceptance Criteria

1. WHEN an Admin requests generation of a RecommendationLetter for an Application that has at least one Evaluation record, THE System SHALL create or return the existing RecommendationLetter record and return HTTP 201 or HTTP 200 respectively (idempotent operation).
2. WHEN an Admin requests generation of a RecommendationLetter for an Application that has no Evaluation record, THE System SHALL return HTTP 400 and no RecommendationLetter record SHALL be created.
3. FOR ALL Applications with an existing RecommendationLetter, generating the letter a second time SHALL return the same record (same `id` and `content`) and exactly one RecommendationLetter record SHALL exist for that Application.
4. THE System SHALL allow a Student to retrieve the RecommendationLetter associated with their own Application.
5. THE System SHALL allow an Admin to retrieve all RecommendationLetters, paginated.

---

### Requirement 8: Complaint and Communication System

**User Story:** As a Student, I want to submit complaints and receive responses from Admin, so that issues during my internship are formally tracked and resolved.

#### Acceptance Criteria

1. WHEN a Student submits a complaint containing a `subject` and an initial message, THE System SHALL create a Complaint record with `status = open` and a corresponding ComplaintMessage record, and return HTTP 201.
2. WHEN an Admin appends a reply to a Complaint with N existing ComplaintMessages, THE System SHALL create exactly one new ComplaintMessage record, resulting in N + 1 messages, and no existing ComplaintMessage SHALL be modified or deleted.
3. WHEN an Admin successfully appends a reply to a Complaint, THE System SHALL create a Notification record for the Complaint's `student_id`.
4. WHEN an Admin marks a Complaint as resolved, THE System SHALL update the Complaint's `status` to `resolved` and return HTTP 200.
5. THE System SHALL allow a Student to retrieve all of their own Complaints including the full message thread.
6. THE System SHALL allow an Admin to retrieve all Complaints, paginated, including each Complaint's current status.
7. THE Validator SHALL reject complaint submissions missing `subject` or the initial message with HTTP 422 and a field-level error array.

---

### Requirement 9: Notification System

**User Story:** As a User, I want to receive in-system notifications for key lifecycle events, so that I am informed of changes without checking every section manually.

#### Acceptance Criteria

1. THE System SHALL deliver Notification records to a User upon each of the following events: application status change (accepted/rejected), supervisor assignment, and admin reply to a complaint.
2. WHEN a User requests their notifications, THE System SHALL return only unread Notification records ordered by `created_at` descending (newest first).
3. WHEN a User marks a single Notification as read via the mark-as-read endpoint, THE System SHALL set `is_read = true` for that Notification, and that Notification SHALL NOT appear in subsequent unread notification responses for that User.
4. WHEN a User marks all notifications as read, THE System SHALL set `is_read = true` for all Notification records belonging to that User.
5. IF a User attempts to mark a Notification as read that belongs to a different User, THEN THE System SHALL return HTTP 403 and the Notification record SHALL remain unchanged.

---

### Requirement 10: Admin Dashboard

**User Story:** As an Admin, I want a summary dashboard with key metrics, so that I can monitor the health of the internship program at a glance.

#### Acceptance Criteria

1. WHEN an Admin requests the dashboard summary, THE System SHALL return counts of: total registered students, total registered companies, open internships, pending applications, and unresolved complaints — each matching the actual COUNT of the corresponding records in the database at the time of the request.
2. THE System SHALL provide a per-internship application breakdown endpoint returning the number of applications in each status (`pending`, `accepted`, `rejected`) for every Internship.
3. THE System SHALL provide an evaluation statistics endpoint returning the average score and total evaluation count per Internship.

---

### Requirement 11: Data Integrity and Persistence

**User Story:** As a system operator, I want the database schema to enforce referential integrity and prevent orphaned records, so that data remains consistent across all operations.

#### Acceptance Criteria

1. THE System SHALL enforce a UNIQUE constraint on `Users.email` at the database level.
2. THE System SHALL enforce a UNIQUE constraint on the (student_id, internship_id) pair in the Applications table at the database level.
3. THE System SHALL enforce a UNIQUE constraint on `application_id` in the SupervisorAssignments table (one supervisor per application).
4. THE System SHALL enforce a UNIQUE constraint on the (application_id, evaluator_id) pair in the Evaluations table.
5. THE System SHALL enforce a UNIQUE constraint on `application_id` in the RecommendationLetters table (one letter per application).
6. THE System SHALL enforce foreign key constraints with RESTRICT on deletion of Users referenced by Internships or Applications, preserving historical records.
7. THE System SHALL enforce CASCADE deletion of SupervisorAssignments, Evaluations, and RecommendationLetters when their parent Application is deleted.
8. THE System SHALL enforce CASCADE deletion of ComplaintMessages when their parent Complaint is deleted.
9. THE System SHALL NOT perform hard deletes on Complaint, Notification, or Evaluation records; these records SHALL be retained for audit purposes.

---

### Requirement 12: API Response Consistency

**User Story:** As a frontend developer, I want all API responses to follow a consistent envelope format, so that error handling and data parsing are uniform across the application.

#### Acceptance Criteria

1. THE API SHALL return every response body as a JSON object containing a boolean `success` field and either a `data` field (on success) or a `message` field (on failure).
2. WHEN a validation error occurs, THE API SHALL return HTTP 422 with `success: false`, a human-readable `message`, and an `errors` array where each element contains a `field` name and an error `message`.
3. WHEN an unhandled server exception occurs, THE API SHALL return HTTP 500 with `success: false` and the message `"Internal server error"`, and SHALL NOT expose stack traces or internal error details to the client.
4. THE System SHALL log the full stack trace of unhandled exceptions server-side without exposing it in the HTTP response.

---

### Requirement 13: Frontend Access Control

**User Story:** As a User, I want the frontend to enforce route-level access control, so that I cannot navigate to pages intended for other roles or unauthenticated users.

#### Acceptance Criteria

1. WHEN a User navigates to a ProtectedRoute without a valid JWT stored in AuthContext, THE System SHALL redirect the User to the `/login` page and SHALL NOT render the protected page content.
2. WHEN a User navigates to a role-specific route (e.g., Admin Dashboard) while authenticated with a different role, THE System SHALL redirect the User to an appropriate page and SHALL NOT render the restricted content.
3. WHEN the API returns HTTP 401, THE System's Axios interceptor SHALL automatically clear the stored JWT from AuthContext and redirect the User to `/login`.
4. THE System SHALL provide distinct portal interfaces for Admin, Student, and Company roles, each accessible only to users authenticated with the corresponding role.

---

### Requirement 14: Environment and Security Configuration

**User Story:** As a developer, I want all secrets and configuration values to be externalized from source code, so that the application can be deployed securely across environments.

#### Acceptance Criteria

1. THE System SHALL load all secrets and connection strings (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_COST_FACTOR`) exclusively from environment variables via a `.env` file, and no credentials SHALL be hardcoded in source files.
2. THE System SHALL use a `BCRYPT_COST_FACTOR` of at least 10 when hashing passwords.
3. THE System SHALL use a MySQL connection pool (not single connections) for all database queries to support concurrent requests.
