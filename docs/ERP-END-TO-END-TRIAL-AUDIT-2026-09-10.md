# SLBL ERP End-to-End Trial & Development Audit

**Trial date:** 2026-09-10  
**Environment:** Local browser application at `http://localhost:5173`, NestJS API at `http://localhost:3000/api/v1`, PostgreSQL-connected backend  
**Operator:** Local administrator account  
**Method:** Live browser interaction using visible UI controls, supported by static controller/service review

## 1. Executive summary

The ERP has a working foundation for project, unit, client, booking, collection, receipt printing, and accounting reporting. However, it is **not yet end-to-end production ready**. The largest risks are:

1. Several frontend forms send fields that the backend DTO rejects.
2. Project creation is currently broken in the UI because `createProject` is not defined.
3. Installment creation and new collection submission do not complete visibly from the UI.
4. Booking agreements are browser-generated and are not persisted or server-authoritative.
5. Core accounting voucher mutation APIs used by the frontend are missing or mismatched.
6. Site advances and several dashboards are mock-only.
7. Role authorization is broad/inconsistent and lacks record-level scope controls.

**Overall result: PARTIAL / BLOCKED for production operations.**

## 2. Test records used

The trial used isolated QA records and existing live verification data:

- Existing project: `QA Trial Heights 2026`
- Existing unit: `QA-A-401`
- Browser-created project attempt: `Browser QA Riverside Residences`
- Existing client: `Live Verification Client`
- Browser-created client attempt: `Browser QA Client`
- Browser-created booking: `BK-2026-002`
- Existing installment records: `INS-2026-001`, `INS-2026-002`
- Existing money receipt: `MR-2026-0001`

The browser-created project attempt failed before persistence. The booking was created successfully and confirmed.

## 3. Live browser workflow results

| Workflow | Result | Evidence / issue |
|---|---|---|
| Open project master | PASS | Projects page loaded live project records. |
| Add project | FAIL | Clicking **Create Project** showed `createProject is not defined`; modal remained open and no project was created. |
| View project/unit inventory | PASS | Existing projects and units loaded from the backend. |
| Add client | FAIL | The UI collects `area`, `nid`, `dateOfBirth`, emergency contact, and notes, but backend returned `400`: `property area should not exist...` because the DTO rejects those fields. |
| Open booking form | PASS | Client, project, available property, booking money, and payment method controls loaded live. |
| Create booking | PASS | `BK-2026-002` was created for `QA Trial Heights 2026 / QA-A-401`. |
| Confirm booking | PASS | Booking status changed from `pending` to `confirmed`. |
| Create installment | FAIL / PARTIAL | The form accepted booking, title, amount, and date, but save did not close the modal or add the record visibly. Existing installment records remained unchanged. The UI does not surface a useful error. |
| Generate installment invoice | NOT VERIFIED | The installment creation failure prevented a complete browser invoice trial. Static routes exist, but UI/API compatibility requires verification. |
| Collect installment | FAIL / PARTIAL | The collection form populated an outstanding installment and amount, but **Issue Money Receipt** did not close or add a new receipt. No actionable error was shown. |
| Print money receipt | PASS | Existing `MR-2026-0001` opened a complete print preview with client, property, payment mode, reference, total, and signatures. |
| Booking agreement print | NOT AVAILABLE / HIGH RISK | No authoritative persisted agreement workflow was found. Existing browser agreement generation is client-only. |
| Trial balance | PASS | Authenticated Trial Balance API returned `200` with live data; report route compatibility was added previously. |
| Income entry | NOT VERIFIED | Dashboard debit/income actions are placeholders; dedicated complete income-entry UI was not demonstrated. |
| Expense entry | NOT VERIFIED | Vendor bill/procurement posting exists in backend, but a complete browser expense workflow was not completed. |
| Construction management | PARTIAL | Milestone APIs/UI exist, but dashboard data is mock and navigation has a broken labor route. |
| Vendor/procurement | PARTIAL | Core backend routes exist; site advances are mock-only and full browser lifecycle was not verified. |

## 4. Confirmed implementation gaps

### P0 — Blocking financial and operational gaps

#### 4.1 Project creation handler is missing

The project modal calls an undefined `createProject` function. This blocks project onboarding from the primary UI even though the backend project endpoint exists.

**Required fix:** wire the modal to the live project service, handle loading/error states, refresh the list after success, and show API validation errors.

#### 4.2 Client form and backend DTO are incompatible

The client form submits fields that the backend rejects:

`area`, `nid`, `dateOfBirth`, `emergencyContact`, `emergencyPhone`, and `notes`.

**Required fix:** either add these fields to the entity/DTO/migration and persist them, or remove them from the UI. The preferred solution is to persist them because they are required business data for real-estate clients.

#### 4.3 Installment save has no visible completion/error path

The browser form accepted valid-looking data but did not create a visible record or display an actionable error.

**Required fix:** inspect the exact network response, align the form payload with `CreateInstallmentDto`, surface errors, and refresh the schedule after creation. Add duplicate/idempotency protection.

#### 4.4 Collection submission has no visible completion/error path

The collection form populated a real installment and amount but did not create a new receipt visibly.

**Required fix:** align the frontend payload with the sales collection DTO, include payment date/reference fields required by the backend, show API errors, refresh receipts, and prevent duplicate submissions.

#### 4.5 Accounting mutation surface is incomplete

Static review found frontend calls for voucher create/update/delete/approve/reject and other accounting operations that do not have matching backend routes.

**Required fix:** define one authoritative accounting API contract and implement:

- voucher draft/create/update/delete
- approval/rejection
- general-ledger account detail
- cash/bank balance
- receivables/payables
- accounting invoice CRUD
- reversal and audit events

### P1 — Serious correctness and control risks

#### 4.6 Booking agreements are not authoritative

The agreement modal generates a random agreement number in the browser and downloads plain text. There is no persisted agreement entity, server numbering, template version, document storage, or audit record.

**Required fix:** add a booking-agreement entity and API, transactional numbering, template snapshots, PDF generation, document storage, print/download endpoint, and audit trail.

#### 4.7 Booking print contains hard-coded company identity

The booking print component contains fallback company details rather than loading the active company settings.

**Required fix:** use live settings and save a document snapshot at issuance time.

#### 4.8 Dashboard financial actions are placeholders

Dashboard totals and actions contain hard-coded values/TODO handlers. Debit voucher, collection, and client actions do not consistently persist data.

**Required fix:** replace mock KPIs with aggregated APIs and route quick actions to the same validated forms used by the modules.

#### 4.9 Construction dashboard and labor route are incomplete

Construction dashboard statistics and activities are mock data. The dashboard links to `/construction/site-labor`, while routing defines `/construction/labor-payroll`.

**Required fix:** correct the route, load live construction metrics, and add milestone update/delete and progress audit history.

#### 4.10 Sale financial fields are client-authoritative

The sales create/update flow accepts totals, paid amounts, balances, and status values from the caller with insufficient server recalculation.

**Required fix:** calculate totals from unit price, area, parking, utilities, discounts, taxes, and payments on the server. Treat client financial totals as display hints only.

#### 4.11 State, concurrency, and duplicate controls are insufficient

Cancellation, collection, numbering, and payment mutations need stronger state checks, idempotency keys, database constraints, and transaction-safe number allocation.

**Required fix:** add state transition rules, unique constraints, request idempotency, row locking where necessary, and reversal workflows.

#### 4.12 Authorization is not least-privilege

Several controllers broadly use `ADMIN, VIEWER` while the global guard mainly makes Viewer read-only. Operational roles are not consistently granted the actions they need, and record-level project/tenant ownership checks are not evident.

**Required fix:** align backend permissions with the role matrix and enforce record-level scope checks on every mutation.

### P2 — Completeness and maintainability gaps

- Procurement site advances are mock-only; no entity/controller lifecycle exists.
- Vendor lifecycle coverage is incomplete from the frontend.
- Audit logs are retrievable but mutations do not consistently record actor/event details.
- Number generation based on counts/current totals is race-prone.
- Frontend table markup emits whitespace text nodes inside `<tr>`, producing hydration warnings.
- Browser forms should provide field-level backend validation messages rather than generic/silent failures.

## 5. Accounting and finance audit conclusion

The accounting reporting foundation is usable: authenticated Trial Balance data loads, and the backend contains ledger/report, tax, period, cash/bank, reconciliation, and reversal concepts.

The operational accounting lifecycle is not complete because the write path is inconsistent:

1. Sales booking and collection can create financial consequences.
2. Installment and collection UI submissions are not reliably completing.
3. Voucher mutation APIs used by the frontend are incomplete.
4. Generic income and expense entry is not proven end-to-end.
5. Audit attribution and reversal controls need strengthening.

Until these are corrected, Trial Balance, Profit & Loss, Balance Sheet, and Cash Flow cannot be certified as fully reconciled for all business workflows.

## 6. Recommended implementation roadmap

### Phase 1 — Stabilize live CRUD and error handling

1. Fix `createProject` wiring.
2. Reconcile client form/entity/DTO fields.
3. Fix installment and collection payloads.
4. Add visible loading, success, and error handling to every mutation.
5. Add targeted integration tests for project, client, booking, installment, invoice, and collection.

### Phase 2 — Make financial posting authoritative

1. Recalculate sale totals server-side.
2. Complete voucher CRUD and approval APIs.
3. Ensure booking, invoice, collection, vendor bill, and construction bill posting create balanced ledger entries.
4. Add idempotency, state transitions, reversal, and reconciliation controls.
5. Verify Trial Balance, GL, P&L, Balance Sheet, and Cash Flow after each posting.

### Phase 3 — Legal documents and auditability

1. Persist booking agreements and document versions.
2. Generate server-side PDFs and snapshots.
3. Use live company settings in all documents.
4. Record actor, timestamp, source, and before/after values in audit events.

### Phase 4 — Complete construction and procurement

1. Replace mock construction KPIs with live aggregations.
2. Fix labor route and complete milestone lifecycle.
3. Implement site advances.
4. Complete vendor, requisition, PO, GRN, bill, payment, and settlement screens.
5. Link construction/procurement costs to projects and accounting dimensions.

### Phase 5 — Security and production readiness

1. Align all endpoints to the role matrix.
2. Enforce project/record-level authorization.
3. Add database uniqueness and transactional sequence allocation.
4. Run full regression with separate Admin, Accounting Manager, Accountant, Cashier, and Viewer accounts.
5. Only then certify desktop/mobile packages for live operations.

## 7. Release recommendation

**Do not release this build as a production ERP yet.** It can be used for controlled demonstrations and limited QA, but project onboarding, client onboarding, installment collection, accounting mutation, agreement authority, and procurement/construction completeness remain insufficient for reliable financial operations.

