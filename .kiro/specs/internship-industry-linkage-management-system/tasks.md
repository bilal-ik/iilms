# Implementation Plan: Internship & Industry Linkage Management System (IILMS)

## Overview

Full-stack implementation of IILMS using Node.js/Express (backend) and React (frontend) with MySQL. Tasks are ordered to build incrementally — infrastructure first, then modules, then UI, then tests.

## Tasks

- [x] 1. Project scaffolding
  - Create `server/` and `client/` directory structures matching the design
  - Initialise `server/package.json` with dependencies: `express`, `mysql2`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `express-validator`, `express-rate-limit`, `cors`
  - Initialise `server/package.json` devDependencies: `jest`, `supertest`, `fast-check`
  - Initialise `client/` with Vite + React template; add `axios`, `react-router-dom`; add Tailwind CSS
  - Create `server/.env.example` with all required variables: `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_COST_FACTOR`
  - Create `server/.env` (gitignored) populated with local dev values
  - Add `.gitignore` entries for `node_modules`, `.env`, `dist`
  - _Requirements: 14.1_

- [x] 2. Database schema and seed data
  - Write `server/db/schema.sql` with DDL for all 9 tables: `Users`, `Internships`, `Applications`, `SupervisorAssignments`, `Evaluations`, `RecommendationLetters`, `Complaints`, `ComplaintMessages`, `Notifications`
  - Include all PKs (AUTO_INCREMENT), FKs, UNIQUE constraints, ENUM types, DEFAULT values, and CHECK constraint on `Evaluations.score` (0–100) as specified in the design
  - Add RESTRICT FK rules on `Users → Internships`, `Users → Applications`, `Internships → Applications`
  - Add CASCADE FK rules on `Applications → SupervisorAssignments`, `Applications → Evaluations`, `Applications → RecommendationLetters`, `Complaints → ComplaintMessages`, `Users → Notifications`
  - Write `server/db/seed.sql` with sample rows: 2 admins, 3 students, 2 companies, 4 internships (mix of open/closed), 5 applications, 2 supervisor assignments, 2 evaluations, 1 recommendation letter, 2 complaints with messages, 5 notifications
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8_

- [x] 3. Backend infrastructure
  - [x] 3.1 Create `server/config/db.js` — export a `mysql2` connection pool reading all DB credentials from `process.env`; pool size ≥ 5
    - _Requirements: 14.1, 14.3_
  - [x] 3.2 Create `server/app.js` — initialise Express, register `cors`, `express.json()`, `express-rate-limit`, mount all route files under `/api`, register global error handler last
    - _Requirements: 12.3, 12.4_
  - [x] 3.3 Create `server/server.js` — load `dotenv`, import `app`, start HTTP server on `process.env.PORT`
    - _Requirements: 14.1_
  - [x] 3.4 Create `server/middleware/auth.js` — `verifyToken` middleware: extract `Authorization: Bearer` header, verify JWT with `JWT_SECRET`, attach `{ id, email, role }` to `req.user`, return 401 on missing/invalid/expired token
    - _Requirements: 2.1, 2.2, 2.4_
  - [x] 3.5 Create `server/middleware/roleGuard.js` — `requireRole(...roles)` factory: return 403 if `req.user.role` not in `roles`
    - _Requirements: 2.3_
  - [x] 3.6 Create `server/middleware/validate.js` — `handleValidationErrors`: call `validationResult(req)`, if errors exist return 422 with `{ success: false, message: "Validation failed", errors: [{field, message}] }`
    - _Requirements: 12.2_

- [x] 4. Authentication module
  - [x] 4.1 Create `server/models/user.model.js` — `findByEmail(email)`, `createUser({ email, password_hash, full_name, role })`, `findById(id)`
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 4.2 Create `server/validators/auth.validator.js` — registration rules: `email` isEmail, `password` minLength 6, `full_name` notEmpty, `role` isIn(['student','company','admin']); login rules: `email` isEmail, `password` notEmpty
    - _Requirements: 1.7_
  - [x] 4.3 Create `server/services/auth.service.js` — `register({ email, password, full_name, role })`: check duplicate email (409), hash password with `bcryptjs` using `BCRYPT_COST_FACTOR`, insert user, return 201; `login({ email, password })`: find user, compare hash, sign JWT with `{ id, email, role }` payload, return token + user object
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_
  - [x] 4.4 Create `server/controllers/auth.controller.js` — `register` and `login` handlers calling the service, returning JSON envelope responses
    - _Requirements: 12.1_
  - [x] 4.5 Create `server/routes/auth.routes.js` — `POST /register` (validator → handleValidationErrors → register), `POST /login` (validator → handleValidationErrors → login)
    - _Requirements: 1.1_
  - [ ]* 4.6 Write property test for unique email enforcement
    - **Property 1: Unique Email Enforcement**
    - **Validates: Requirements 1.2**
  - [ ]* 4.7 Write property test for JWT issued on valid login
    - **Property 2: JWT Issued on Valid Login**
    - **Validates: Requirements 1.4**
  - [ ]* 4.8 Write property test for 401 on wrong credentials
    - **Property 3: 401 on Wrong Credentials**
    - **Validates: Requirements 1.5**

- [ ] 5. Role-based access control tests
  - [ ]* 5.1 Write property test for role-based access rejection
    - **Property 4: Role-Based Access Rejection**
    - **Validates: Requirements 2.3**
  - [ ]* 5.2 Write property test for 401 on missing JWT
    - **Property 5: 401 on Missing JWT**
    - **Validates: Requirements 2.1**
  - [ ]* 5.3 Write unit test for bcrypt cost factor
    - Register a user, retrieve the stored `password_hash`, assert it starts with `$2b$10$` (cost factor ≥ 10)
    - _Requirements: 1.3, 14.2_

- [ ] 6. Checkpoint — auth and RBAC
  - Ensure all auth and RBAC tests pass, ask the user if questions arise.

- [x] 7. Internship module
  - [x] 7.1 Create `server/models/internship.model.js` — `create(data)`, `findById(id)`, `findAllOpen({ page, limit })`, `findByCompany(company_id)`, `update(id, data)`, `deleteById(id)`, `updateStatus(id, status)`
    - _Requirements: 3.1, 3.3, 3.4, 3.5_
  - [x] 7.2 Create `server/validators/internship.validator.js` — creation rules: `title`, `description`, `location` notEmpty; `duration_weeks` isInt min 1; `deadline` isISO8601
    - _Requirements: 3.6_
  - [x] 7.3 Create `server/services/internship.service.js` — enforce company ownership on update/delete (403), set `status = open` on create, delegate to model
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 7.4 Create `server/controllers/internship.controller.js` — handlers for all 7 internship endpoints, returning JSON envelope
    - _Requirements: 12.1_
  - [x] 7.5 Create `server/routes/internship.routes.js` — wire all 7 routes with correct auth/role guards and validators
    - _Requirements: 3.1, 3.4_
  - [ ]* 7.6 Write property test for company ownership enforcement
    - **Property 6: Company Ownership Enforcement**
    - **Validates: Requirements 3.2**
  - [ ]* 7.7 Write property test for public listing returns only open internships
    - **Property 7: Public Listing Returns Only Open Internships**
    - **Validates: Requirements 3.4**

- [x] 8. Application module
  - [x] 8.1 Create `server/models/application.model.js` — `create({ student_id, internship_id })`, `findByStudentId(student_id)`, `findByInternshipId(internship_id)`, `findAll({ page, limit })`, `findById(id)`, `updateStatus(id, status)`
    - _Requirements: 4.1, 4.5, 4.6, 4.7_
  - [x] 8.2 Create `server/services/application.service.js` — check internship is open (400), check no duplicate (409), create application with `status = pending`; on status update call `notification.service.createNotification` for the student
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 8.3 Create `server/controllers/application.controller.js` and `server/routes/application.routes.js` — wire `POST /applications`, `GET /applications/my`, `GET /applications` (admin), `GET /internships/:id/applications` (company), `PATCH /applications/:id/status` (company)
    - _Requirements: 4.5, 4.6, 4.7_
  - [ ]* 8.4 Write property test for new application status is pending
    - **Property 8: New Application Status is Pending**
    - **Validates: Requirements 4.1**
  - [ ]* 8.5 Write property test for duplicate application prevention
    - **Property 9: Duplicate Application Prevention**
    - **Validates: Requirements 4.2**
  - [ ]* 8.6 Write property test for closed internship application rejection
    - **Property 10: Closed Internship Application Rejection**
    - **Validates: Requirements 4.3**
  - [ ]* 8.7 Write property test for application status change triggers notification
    - **Property 11: Application Status Change Triggers Notification**
    - **Validates: Requirements 4.4**

- [x] 9. Supervisor assignment module
  - [x] 9.1 Create `server/models/supervisor.model.js` — `create({ application_id, supervisor_id })`, `findByApplicationId(application_id)`, `findBySupervisorId(supervisor_id)`
    - _Requirements: 5.1, 5.5_
  - [x] 9.2 Create `server/services/supervisor.service.js` — verify application status is `accepted` (400), check no existing assignment (409), create `SupervisorAssignment`, call `notification.service.createNotification` for the student
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [x] 9.3 Create `server/controllers/supervisor.controller.js` and `server/routes/supervisor.routes.js` — wire `POST /supervisors/assign` (admin), `GET /supervisors/my-students` (admin)
    - _Requirements: 5.1, 5.5_
  - [ ]* 9.4 Write property test for supervisor assignment requires accepted application
    - **Property 12: Supervisor Assignment Requires Accepted Application**
    - **Validates: Requirements 5.2**
  - [ ]* 9.5 Write property test for duplicate supervisor assignment prevention
    - **Property 13: Duplicate Supervisor Assignment Prevention**
    - **Validates: Requirements 5.3**
  - [ ]* 9.6 Write property test for supervisor assignment triggers notification
    - **Property 14: Supervisor Assignment Triggers Notification**
    - **Validates: Requirements 5.4**

- [ ] 10. Checkpoint — application and supervisor modules
  - Ensure all application and supervisor tests pass, ask the user if questions arise.

- [x] 11. Evaluation module
  - [x] 11.1 Create `server/models/evaluation.model.js` — `create({ application_id, evaluator_id, score, feedback })`, `findByApplicationId(application_id)`, `findAll({ page, limit })`, `findByStudentApplications(student_id)`
    - _Requirements: 6.1, 6.4, 6.5_
  - [x] 11.2 Create `server/validators/evaluation.validator.js` — `score` isInt min 0 max 100, `application_id` notEmpty
    - _Requirements: 6.2_
  - [x] 11.3 Create `server/services/evaluation.service.js` — validate score range (400 if outside 0–100), check no duplicate (application_id, evaluator_id) pair (409), create evaluation
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 11.4 Create `server/controllers/evaluation.controller.js` and `server/routes/evaluation.routes.js` — wire `POST /evaluations` (admin or company), `GET /evaluations/my` (student), `GET /evaluations` (admin)
    - _Requirements: 6.4, 6.5_
  - [ ]* 11.5 Write property test for evaluation score boundary validation
    - **Property 15: Evaluation Score Boundary Validation**
    - **Validates: Requirements 6.1, 6.2**
  - [ ]* 11.6 Write property test for duplicate evaluation prevention
    - **Property 16: Duplicate Evaluation Prevention**
    - **Validates: Requirements 6.3**

- [x] 12. Recommendation letter module
  - [x] 12.1 Create `server/models/recommendation.model.js` — `findByApplicationId(application_id)`, `create({ application_id, content })`, `findAll({ page, limit })`
    - _Requirements: 7.1, 7.4, 7.5_
  - [x] 12.2 Create `server/services/recommendation.service.js` — check at least one evaluation exists for the application (400 if none), check for existing letter (return existing if found — idempotent), otherwise create new letter with generated content
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 12.3 Create `server/controllers/recommendation.controller.js` and `server/routes/recommendation.routes.js` — wire `POST /recommendations` (admin), `GET /recommendations` (admin), `GET /recommendations/:application_id` (student)
    - _Requirements: 7.4, 7.5_
  - [ ]* 12.4 Write property test for recommendation letter requires evaluation
    - **Property 17: Recommendation Letter Requires Evaluation**
    - **Validates: Requirements 7.2**
  - [ ]* 12.5 Write property test for recommendation letter generation is idempotent
    - **Property 18: Recommendation Letter Generation is Idempotent**
    - **Validates: Requirements 7.1, 7.3**

- [x] 13. Complaint and communication module
  - [x] 13.1 Create `server/models/complaint.model.js` — `create({ student_id, subject })`, `createMessage({ complaint_id, sender_id, message })`, `findByStudentId(student_id)`, `findAll({ page, limit })`, `findById(id)`, `updateStatus(id, status)`, `countMessages(complaint_id)`
    - _Requirements: 8.1, 8.2, 8.5, 8.6_
  - [x] 13.2 Create `server/validators/complaint.validator.js` — `subject` notEmpty, `message` notEmpty
    - _Requirements: 8.7_
  - [x] 13.3 Create `server/services/complaint.service.js` — create complaint with `status = open` and initial message in one transaction; on admin reply append one new `ComplaintMessage` and call `notification.service.createNotification` for the student; on resolve update status to `resolved`
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 13.4 Create `server/controllers/complaint.controller.js` and `server/routes/complaint.routes.js` — wire `POST /complaints` (student), `GET /complaints/my` (student), `GET /complaints` (admin), `POST /complaints/:id/reply` (admin), `PATCH /complaints/:id/resolve` (admin)
    - _Requirements: 8.5, 8.6_
  - [ ]* 13.5 Write property test for new complaint status is open
    - **Property 19: New Complaint Status is Open**
    - **Validates: Requirements 8.1**
  - [ ]* 13.6 Write property test for complaint reply appends to thread
    - **Property 20: Complaint Reply Appends to Thread**
    - **Validates: Requirements 8.2**
  - [ ]* 13.7 Write property test for admin complaint reply triggers notification
    - **Property 21: Admin Complaint Reply Triggers Notification**
    - **Validates: Requirements 8.3**

- [ ] 14. Checkpoint — evaluation, recommendation, and complaint modules
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Notification module
  - [x] 15.1 Create `server/models/notification.model.js` — `create({ user_id, message })`, `findUnreadByUserId(user_id)` (ordered by `created_at DESC`), `markAsRead(id)`, `markAllAsRead(user_id)`, `findById(id)`
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [x] 15.2 Create `server/services/notification.service.js` — `createNotification(user_id, message)` (called internally by other services), `getUnread(user_id)`, `markRead(id, requesting_user_id)` (403 if owner mismatch), `markAllRead(user_id)`
    - _Requirements: 9.3, 9.5_
  - [x] 15.3 Create `server/controllers/notification.controller.js` and `server/routes/notification.routes.js` — wire `GET /notifications` (any auth), `PATCH /notifications/:id/read` (any auth), `PATCH /notifications/read-all` (any auth)
    - _Requirements: 9.2, 9.3, 9.4_
  - [ ]* 15.4 Write property test for unread notifications ordered by timestamp descending
    - **Property 22: Unread Notifications Ordered by Timestamp Descending**
    - **Validates: Requirements 9.2**
  - [ ]* 15.5 Write property test for mark-as-read round trip
    - **Property 23: Mark-as-Read Round Trip**
    - **Validates: Requirements 9.3**

- [x] 16. Admin dashboard module
  - [x] 16.1 Create `server/models/dashboard.model.js` — `getSummaryCounts()` (single query returning student count, company count, open internship count, pending application count, unresolved complaint count), `getApplicationsBreakdown()`, `getEvaluationStats()`
    - _Requirements: 10.1, 10.2, 10.3_
  - [x] 16.2 Create `server/services/dashboard.service.js` and `server/controllers/dashboard.controller.js` — delegate to model, return JSON envelope
    - _Requirements: 10.1, 10.2, 10.3_
  - [x] 16.3 Create `server/routes/dashboard.routes.js` — wire `GET /dashboard/summary` (admin), `GET /dashboard/applications-breakdown` (admin), `GET /dashboard/evaluation-stats` (admin)
    - _Requirements: 10.1, 10.2, 10.3_
  - [ ]* 16.4 Write property test for dashboard counts match actual data
    - **Property 24: Dashboard Counts Match Actual Data**
    - **Validates: Requirements 10.1**
  - [ ]* 16.5 Write unit test for dashboard aggregate queries
    - Seed known data, call each dashboard endpoint, assert exact counts and averages match seeded values
    - _Requirements: 10.1, 10.2, 10.3_

- [ ] 17. JSON envelope and global error handler tests
  - [ ]* 17.1 Write property test for JSON envelope on all responses
    - **Property 25: JSON Envelope on All Responses**
    - **Validates: Requirements 12.1**
  - [ ]* 17.2 Write unit test for HTTP 500 global error handler
    - Inject a route that throws an unhandled error; assert response is `{ success: false, message: "Internal server error" }` with status 500 and no stack trace in body
    - _Requirements: 12.3, 12.4_

- [ ] 18. Checkpoint — notification, dashboard, and envelope tests
  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Frontend scaffolding
  - [x] 19.1 Create `client/src/api/axios.js` — Axios instance with `baseURL = import.meta.env.VITE_API_URL`; response interceptor: on 401 clear AuthContext token and redirect to `/login`
    - _Requirements: 13.3_
  - [x] 19.2 Create `client/src/context/AuthContext.jsx` — React context storing JWT and decoded user (`{ id, email, role, full_name }`); expose `login(token)`, `logout()`, `user`, `token`; persist token to `localStorage`
    - _Requirements: 13.1, 13.3_
  - [x] 19.3 Create `client/src/components/ProtectedRoute.jsx` — reads `token` from AuthContext; if absent redirect to `/login`; if `allowedRoles` prop provided and `user.role` not in list redirect to appropriate fallback page
    - _Requirements: 13.1, 13.2_
  - [x] 19.4 Create `client/src/App.jsx` — React Router root with all routes: public routes, auth routes, student routes (wrapped in ProtectedRoute role=student), company routes (role=company), admin routes (role=admin)
    - _Requirements: 13.4_
  - [x] 19.5 Create `client/src/components/Navbar.jsx`, `Pagination.jsx`, `ErrorMessage.jsx` — shared UI components
    - _Requirements: 13.4_
  - [ ]* 19.6 Write property test for protected frontend routes redirect to login
    - **Property 26: Protected Frontend Routes Redirect to Login**
    - **Validates: Requirements 13.1**

- [x] 20. Public pages and auth pages
  - [x] 20.1 Create `client/src/pages/public/InternshipListing.jsx` — fetch `GET /api/internships?page=&limit=`, render paginated cards with title, location, deadline, "View Details" link; no auth required
    - _Requirements: 3.4_
  - [x] 20.2 Create `client/src/pages/public/InternshipDetail.jsx` — fetch `GET /api/internships/:id`, render full details; show "Apply" button only when user is authenticated as student
    - _Requirements: 3.5_
  - [x] 20.3 Create `client/src/pages/auth/Login.jsx` — form with email + password; on submit call `POST /api/auth/login`, store token via `AuthContext.login()`, redirect to role-appropriate dashboard
    - _Requirements: 1.4, 13.1_
  - [x] 20.4 Create `client/src/pages/auth/Register.jsx` — form with email, password, full_name, role select; on submit call `POST /api/auth/register`, redirect to login on success; display field-level validation errors from 422 response
    - _Requirements: 1.1, 12.2_

- [x] 21. Student portal pages
  - [x] 21.1 Create `client/src/pages/student/StudentDashboard.jsx` — summary cards: number of applications, pending count, accepted count; links to other student pages
    - _Requirements: 13.4_
  - [x] 21.2 Create `client/src/pages/student/BrowseInternships.jsx` — paginated open internship list with apply button; on apply call `POST /api/applications`; handle 409 (already applied) and 400 (closed) gracefully
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 21.3 Create `client/src/pages/student/MyApplications.jsx` — fetch `GET /api/applications/my`, display internship title, status badge, applied date
    - _Requirements: 4.5_
  - [x] 21.4 Create `client/src/pages/student/MyEvaluations.jsx` — fetch `GET /api/evaluations/my`, display score, feedback, evaluator; link to recommendation letter if available
    - _Requirements: 6.4_
  - [x] 21.5 Create `client/src/pages/student/MyNotifications.jsx` — fetch `GET /api/notifications`, list unread notifications newest-first; "Mark as read" button per item and "Mark all read" button
    - _Requirements: 9.2, 9.3, 9.4_
  - [x] 21.6 Create `client/src/pages/student/MyComplaints.jsx` — fetch `GET /api/complaints/my`, list complaints with status badge and full message thread; form to submit new complaint
    - _Requirements: 8.1, 8.5_

- [x] 22. Company portal pages
  - [x] 22.1 Create `client/src/pages/company/CompanyDashboard.jsx` — summary: total internships posted, total applications received; links to manage internships and review applications
    - _Requirements: 13.4_
  - [x] 22.2 Create `client/src/pages/company/ManageInternships.jsx` — fetch `GET /api/internships/my`, list own internships with status; buttons to edit, delete, open/close
    - _Requirements: 3.1, 3.3_
  - [x] 22.3 Create `client/src/pages/company/InternshipForm.jsx` — create/edit form for internship fields (title, description, location, duration_weeks, deadline); calls `POST` or `PUT /api/internships/:id`; display 422 field errors
    - _Requirements: 3.1, 3.6_
  - [x] 22.4 Create `client/src/pages/company/ReviewApplications.jsx` — select internship, fetch `GET /api/internships/:id/applications`, list applicants with status; accept/reject buttons calling `PATCH /api/applications/:id/status`
    - _Requirements: 4.4, 4.6_

- [x] 23. Admin dashboard pages
  - [x] 23.1 Create `client/src/pages/admin/AdminDashboard.jsx` — fetch `GET /api/dashboard/summary`, display metric cards; fetch `GET /api/dashboard/applications-breakdown` and `GET /api/dashboard/evaluation-stats` for tables
    - _Requirements: 10.1, 10.2, 10.3_
  - [x] 23.2 Create `client/src/pages/admin/AllApplications.jsx` — paginated table of all applications with student name, internship title, status; fetch `GET /api/applications`
    - _Requirements: 4.7_
  - [x] 23.3 Create `client/src/pages/admin/AssignSupervisor.jsx` — list accepted applications without supervisor; form to select supervisor (admin user) and submit `POST /api/supervisors/assign`; handle 409 gracefully
    - _Requirements: 5.1, 5.3_
  - [x] 23.4 Create `client/src/pages/admin/AllEvaluations.jsx` — paginated table of all evaluations; form to submit new evaluation for an application; fetch `GET /api/evaluations`
    - _Requirements: 6.5_
  - [x] 23.5 Create `client/src/pages/admin/RecommendationLetters.jsx` — list all letters; button to generate letter for an evaluated application calling `POST /api/recommendations`; display letter content
    - _Requirements: 7.1, 7.5_
  - [x] 23.6 Create `client/src/pages/admin/ManageComplaints.jsx` — paginated list of all complaints with status; expand to view thread; reply form calling `POST /api/complaints/:id/reply`; resolve button calling `PATCH /api/complaints/:id/resolve`
    - _Requirements: 8.2, 8.4, 8.6_

- [ ] 24. Checkpoint — all frontend pages
  - Ensure all frontend pages render without errors and ProtectedRoute redirects work correctly, ask the user if questions arise.

- [ ] 25. Integration tests for edge cases
  - [ ]* 25.1 Write integration test: GET /api/internships/:id returns 404 for non-existent id
    - _Requirements: 3.5_
  - [ ]* 25.2 Write integration test: PATCH /api/notifications/:id/read returns 403 when notification belongs to a different user
    - _Requirements: 9.5_
  - [ ]* 25.3 Write integration test: POST /api/recommendations returns 400 when application has no evaluations
    - _Requirements: 7.2_
  - [ ]* 25.4 Write integration test: POST /api/supervisors/assign returns 400 when application status is pending or rejected
    - _Requirements: 5.2_
  - [ ]* 25.5 Write integration test: POST /api/auth/register returns 422 with field-level errors array when required fields are missing
    - _Requirements: 1.7_
  - [ ]* 25.6 Write integration test: POST /api/complaints returns 422 with field-level errors when subject or message is missing
    - _Requirements: 8.7_
  - [ ]* 25.7 Write integration test: expired JWT returns 401 on any protected endpoint
    - _Requirements: 2.2_

- [ ] 26. Final checkpoint — full test suite
  - Run `jest --runInBand` (backend) and `vitest --run` (frontend); ensure all non-optional tests pass, ask the user if questions arise.

- [x] 27. README and setup documentation
  - Create `README.md` at the project root with:
    - Prerequisites (Node.js ≥ 18, MySQL 8.x)
    - Step-by-step setup: clone, `npm install` in `server/` and `client/`, create `.env` from `.env.example`, run `schema.sql` then `seed.sql`, start backend (`node server/server.js`), start frontend (`npm run dev` in `client/`)
    - Environment variable reference table
    - How to run tests: `jest --runInBand` and `vitest --run`
    - Common errors: MySQL connection refused, JWT_SECRET missing, CORS errors, port conflicts
  - _Requirements: 14.1_

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 6, 10, 14, 18, 24, and 26 ensure incremental validation
- Property tests (fast-check, `numRuns: 100`) cover all 26 correctness properties from the design
- Integration tests cover edge cases not exercised by property tests
- The notification service is a shared internal dependency — implement it as part of task 15 before any module that calls it (applications, supervisor, complaints)
