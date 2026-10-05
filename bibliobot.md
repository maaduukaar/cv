---
outline: [2, 3]
pageClass: bibliobot-case
---

# BiblioBot — subscription-based book delivery in Telegram

<div class="case-tech-badges">
  <Badge type="tip" text="Python" />
  <Badge type="warning" text="aiogram" />
  <Badge type="info" text="SQLAlchemy & Alembic" />
  <Badge type="info" text="Docker Compose" />
</div>

::: info <SolarIcon name="clipboard" /> Project card

| Parameter | Value |
|---|---|
| **Product** | Telegram bot for subscription-based, paced book delivery |
| **Stack** | Python, aiogram, Sanic, SQLAlchemy, Alembic, SQLite, Google Drive API, CloudPayments, Docker Compose |
| **Role** | Backend integration development and maintenance of payment and background flows |
| **Architecture** | Eight independent services sharing one domain model |
| **Project history** | Repository in development since 2021; current improvements and documentation date to 2026 |
| **Access** | Telegram bot; its public link is intentionally not disclosed |
| **Outcome** | Content is uploaded to Google Drive, synchronized into a catalogue, delivered on schedule, and unlocked for paid access only after a confirmed payment |

:::

## <SolarIcon name="pin" /> Project overview and objective

**BiblioBot** distributes books through Telegram on a subscription basis. A reader selects a book and delivery frequency, then receives it in parts — for example, one fragment per day. The catalogue includes free and paid titles; paid titles offer demo fragments before a recurring subscription unlocks further reading.

The product deliberately avoids a separate custom CMS. A content manager works in Google Drive: a folder represents a book, its files are parts, and a properties file provides the title, category, delivery type, demo access, and delivery behaviour. A dedicated service turns that structure into data the bot can use.

### <SolarIcon name="target" /> Scope of the solution

- present the catalogue, book description, reading progress, and actions through Telegram inline keyboards;
- preserve delivery history and never send the same part twice;
- support PDF files and links as two content formats;
- synchronize catalogue entries, covers, and parts from Google Drive automatically;
- process first payments, recurring charges, failures, and subscription cancellation;
- run book delivery independently from incoming user messages;
- keep the user-facing bot alive when a separate service, a Drive file, or a Telegram chat is temporarily unavailable.

::: info <SolarIcon name="map" /> Case study source map

| Section | Repository sources | What they substantiate |
|:---:|---|---|
| **1** | `README.md`, `docs/ARCHITECTURE.md` | product purpose and service boundaries |
| **2** | `bibliobot/models.py`, `bibliobot/db_types/` | domain model, reading progress, and payment invariants |
| **3** | `gdrive_parsing_service/`, `books_mailer.py` | content synchronization and scheduled delivery |
| **4** | `payment_form/`, `payments_notifications/` | payment form and webhook handling |
| **5** | `migrations/`, `tests/`, `changelog/` | schema evolution, regression fixes, and contracts |

:::

## <SolarIcon name="layers" /> Product architecture

The product is decomposed by responsibility rather than run as a single process. Each integration can be restarted, developed, and diagnosed without making the bot's user interface wait for a long Drive synchronization or a temporary payment-provider failure.

```text
Telegram reader
       |
       v
 bibliobot — commands, menus, FSM, subscriptions
       |                         \
       v                          \-> payment_form — secure payment page
SQLite + SQLAlchemy + Alembic                 |
       ^                                      v
       |                         payments_notifications — Check / Pay / Fail
       |
       +--- gdrive_parsing_service <--- Google Drive: books, files, properties
       |
       +--- books_mailer — scheduled delivery of the next part
       +--- autopayments_notifications — charge reminders
       +--- mails_mailer — bulk messages
       +--- server_health_notifications — disk monitoring and maintenance mode
```

### <SolarIcon name="settings" /> Services and responsibilities

| Service | Responsibility | Why it is isolated |
|---|---|---|
| `bibliobot` | User commands, menus, callback events, and FSM | The interactive path must respond independently of background work |
| `gdrive_parsing_service` | Reads Drive folders, properties, PDFs, and covers | External synchronization does not affect bot response time |
| `books_mailer` | Finds due subscriptions and sends the next fragment | Scheduled delivery does not depend on a user message |
| `payment_form` | Renders a payment page with the CloudPayments widget | Card entry never passes through the bot interface |
| `payments_notifications` | Receives `Check`, `Pay`, and `Fail` webhooks | Payment integration has its own HTTP entry point |
| `autopayments_notifications` | Warns users about an upcoming recurring charge | Anti-spam communication stays out of the main flow |
| `mails_mailer` | Copies a prepared message to the audience | Administrative broadcasting is separate from book delivery |
| `server_health_notifications` | Tracks disk usage and enables a protective mode | Prevents the system from degrading when storage is scarce |

### <SolarIcon name="storage" /> Data model and invariants

| Entity | Responsibility | Key rule |
|---|---|---|
| `Book` / `BookPart` | Book metadata and individual fragments | A fragment has an index and comes from a file or URL |
| `GDriveFile` | Drive metadata and cached Telegram `file_id` | The Telegram cache is reset when the source file changes |
| `BookSubscription` | Per-reader delivery settings | Frequency, activity, and automatic delivery are independent flags |
| `BookSubscriptionPart` | History of fragments already delivered | This is the source of truth for reading progress |
| `PaidSubscription` | A reader's recurring paid access | Only one paid subscription is allowed per user |
| `PaidSubscriptionPayment` | First and recurring payments | The external transaction ID is unique and enables webhook idempotency |
| `Mail` | Administrative bulk-mail queue | Stores the source message and completion state |

## <SolarIcon name="clipboard" /> Engineering work register

The repository does not contain a separate `.tasks` directory. The register below is reconstructed from production modules, migrations, history, and technical documentation. It is not a list of formally created tickets; it is a complete overview of the workstreams represented in the codebase.

::: details <SolarIcon name="clipboard" /> Open nine development and maintenance workstreams

#### 01 — Telegram user interface and state flows <Badge type="tip" text="Done" />
> **Objective:** Implement menus, catalogue navigation, book cards, delivery-frequency selection, state transitions, and safe cancellation through `bibliobot/views/`, callback data, and inline keyboards

#### 02 — Book catalogue and Google Drive as a CMS <Badge type="tip" text="Done" />
> **Objective:** Turn a Google Drive folder structure, PDF files, covers, and a properties file into normalized catalogue entities without manual database editing

#### 03 — Fragment delivery and progress preservation <Badge type="tip" text="Done" />
> **Objective:** Support reading start, manual next-part delivery, jumping to a number, restarting a finished book, endless titles, and randomized part order

#### 04 — Scheduler and safe background delivery <Badge type="tip" text="Done" />
> **Objective:** Process only due active subscriptions while handling unreachable chats, Telegram errors, and temporarily missing fragments correctly

#### 05 — Demo access and the paid-content gate <Badge type="tip" text="Done" />
> **Objective:** Separate free, demo, and paid fragments, verify payment freshness, and limit paid fragments during a payment period

#### 06 — First payments and recurring webhooks <Badge type="tip" text="Done" />
> **Objective:** Create a pending payment before checkout, verify amount and account at `Check`, persist success or failure, and return the reader to the book after success

#### 07 — Administrative functions and communication <Badge type="tip" text="Done" />
> **Objective:** Provide analytics, bulk mail, editable texts, pre-charge alerts, and clear actions after an unsuccessful recurring charge

#### 08 — Migrations, backward compatibility, and data recovery <Badge type="tip" text="Done" />
> **Objective:** Manage the schema through Alembic, back up SQLite before migration, and preserve historical payment records after status changes

#### 09 — Regression safety and operational documentation <Badge type="tip" text="Done" />
> **Objective:** Fix critical payment branches with contract tests, diagnostic instructions, and a safe procedure for future changes

:::

## <SolarIcon name="lightbulb" /> Most complex task

### Restoring reliable paid access after a webhook regression

The most consequential scenario is not the checkout page itself, but the consistency of everything that follows. A successful webhook must update the right record, unlock access, avoid duplicating the business effect when delivered again, and return the reader to the book. A failure at any point becomes both a financial and UX issue: a payment is taken but the next part never arrives.

The regression analysis uncovered three connected causes: the new handler saved success in a legacy status format, the first-payment ID was extracted from only one payload variant, and confirmation messages referred to non-existent text keys. As a result, some genuinely paid subscriptions were considered unpaid, while a reader could receive neither confirmation nor the next fragment.

::: details <SolarIcon name="code" /> Open the payment-flow analysis and key solution

<div class="case-source-path"><span>Sources</span><code>changelog/2026-02-25_SUBSCRIPTION_REGRESSION_ANALYSIS.md · payment_webhook_utils.py · payments_notifications/handlers/</code></div>

#### First payment versus recurring charge

For a first payment, a `pending` record is created in the database beforehand. The webhook carries both the expected record identifier and an account identifier. A recurring charge may not have a pending record; it is matched to an existing subscription through its external `subscription_id`.

| Step | First payment | Recurring charge |
|---:|---|---|
| **1** | A `pending` record is created | An existing `PaidSubscription` is used |
| **2** | `Check` verifies the amount, account, and payment ID | An event without an invoice is accepted only with `subscription_id` |
| **3** | `Pay` changes the record to a successful status | A record is created or reused by external transaction ID |
| **4** | The bot confirms payment and unlocks delivery | The user receives a successful auto-payment notification |

#### Resilient identifier extraction

The provider can place an expected payment ID in `data.payment_id`, `invoice_id`, or `invoiceId`. One helper converts those variants into an integer and returns `None` for an invalid value. Both `Check` and `Pay` handlers therefore rely on one contract rather than different assumptions.

```python [payment_webhook_utils.py]
SUCCESS_PAYMENT_STATUSES = ("succeeded", "payed")

def extract_payment_id(notification) -> int | None:
    data = notification.data if isinstance(notification.data, dict) else {}
    value = (
        data.get("payment_id")
        or getattr(notification, "invoice_id", None)
        or getattr(notification, "invoiceId", None)
    )
    try:
        return int(str(value).strip()) if value not in (None, "") else None
    except Exception:
        return None
```

#### Compatibility without losing historical payments

New successful payments are normalized to `succeeded`, while reads temporarily accept both `succeeded` and the historical `payed`. Fixing the code alone would be insufficient: data written by the older version still participates in the access check. A separate backfill helper aligns historical rows rather than silently changing data during an ordinary user request.

#### Regression protection

- a contract asserts that the handler no longer writes `payed` as a new status;
- tests exercise three payload locations for the ID and reject invalid values;
- amount rounding and comparison are tested against `float` representation issues;
- the paid gate, analytics, and last-successful-payment lookup all support the legacy status;
- an additional contract ensures a deactivated paid subscription does not cause recurring mailer notifications.

:::

## <SolarIcon name="bolt" /> Key solutions and engineering challenges

### Google Drive as a content CMS <Badge type="tip" text="Integration" />

::: warning Problem

Books, parts, and covers change more often than application code. Manually loading files into a separate admin interface would duplicate the content team's workflow, while an updated PDF could leave Telegram serving an obsolete cached version.

:::

::: tip <SolarIcon name="lightbulb" /> Solution

The parser treats a folder as a book, a properties file as metadata, and PDFs or `url.N` keys as parts. It derives the number from the filename, deterministically shifts duplicate indexes, and logs invalid files without stopping the catalogue. When a file's modification date changes, the saved Telegram `file_id` is cleared so the next delivery fetches the current document.

:::

### Background delivery without duplicates or spam <Badge type="warning" text="Scheduling" />

::: warning Problem

The background service must deliver a book on schedule without treating every failure as final. A reader may block the bot, a file may not be available after synchronization yet, Telegram may rate-limit calls, or a paid subscription may have been manually deactivated.

:::

::: tip <SolarIcon name="lightbulb" /> Solution

`books_mailer` selects only active subscriptions with automatic delivery enabled and checks their state again before sending. An unreachable chat disables mail only for that subscription; a missing part gets a short retry delay; a transient Telegram error does not stop the whole loop. For paid books, an `is_active` guard is evaluated before an unpaid reminder can be sent, avoiding recurring messages to a user who has opted out.

:::

### Idempotent webhooks and an honest status model <Badge type="danger" text="Payments" />

::: warning Problem

A webhook can be delivered more than once, and first-payment and recurring-charge payloads differ. Without one normalization point, a retry can duplicate the business effect; if the handler and paid gate disagree on statuses, access is denied to an already-paying reader.

:::

::: tip <SolarIcon name="lightbulb" /> Solution

The external transaction ID provides the idempotency key. Successful statuses are normalized on write, the legacy value is supported on read, and first and recurring events are distinguished by available identifiers. Contract tests cover not only the webhook response but also its relationship to texts, domain rules, and post-payment behaviour.

:::

### Operating a multi-process product <Badge type="info" text="Operations" />

::: warning Problem

Independent services share one SQLite file. This keeps a small product simple to deploy, but requires disciplined migrations, concurrent-write awareness, and storage monitoring.

:::

::: tip <SolarIcon name="lightbulb" /> Solution

The schema evolves through Alembic, with a SQLite backup before migration. Docker Compose declares services and shared volumes explicitly. A separate monitor observes disk usage, while the main mailer and middleware enter a protective mode at a threshold. The documented procedure is clear: backup, migrate, verify access invariants, then release.

:::

## <SolarIcon name="test" /> Verification and change readiness

| Area | What is codified | Practical value |
|---|---|---|
| **Data** | 14 Alembic migrations and a SQLite backup before application | Schema evolution does not become manual production-database editing |
| **Payments** | 25 unit and contract checks in `tests/` | Statuses, payloads, amounts, text keys, and mailer guards are verified |
| **Content** | Validation of indexes, metadata, and Drive file updates | One bad file does not break synchronization of the whole catalogue |
| **Delivery** | Handling for blocked users, Telegram limits, and an unavailable part | The background loop remains live and retries stay controlled |
| **Release** | A documented manual smoke-test path | Covers demo → payment → next part, auto-payments, failures, and cancellation |

::: details <SolarIcon name="document" /> Open the release checklist derived from project documentation

<div class="case-source-path"><span>Source</span><code>docs/OPERATIONS_AND_DEVELOPMENT.md</code></div>

1. Run unit and contract tests for critical logic.
2. Check start and subscription to a free book.
3. Complete the paid-book path: demo fragments, payment, and next-part access.
4. Verify successful and failed recurring charges, cancellation, and amount change.
5. Confirm synchronization and mailer services are live and writing expected logs.
6. Verify webhook registration after starting the payment service.
7. Before bulk status changes, back up the database and check invariants afterward.

:::

## <SolarIcon name="trophy" /> Outcome

::: tip <SolarIcon name="trophy" /> Results in product and engineering terms

| Need | Implementation | Result |
|---|---|---|
| Content without a custom admin panel | Google Drive as the catalogue source and a dedicated synchronizer | The content manager works with files and folders, not the database |
| Reading at a comfortable pace | `BookSubscription` plus delivery history | Parts are paced and progress is preserved |
| Monetization without manual reconciliation | Payment form, webhook path, demo gate, and recurrent charges | Access is unlocked from a confirmed payment event |
| Resilient background work | Eight services, failure handling, and maintenance mode | A local failure should not stop the entire user-facing path |
| Safe evolution of a legacy product | Migrations, backfill, documentation, and contract tests | Regression risk is reduced to verifiable invariants |

:::

::: details <SolarIcon name="info" /> Technical limitations noted in project documentation

<div class="case-source-path"><span>Sources</span><code>docs/ARCHITECTURE.md · docs/DOMAIN_AND_DATA.md · docs/OPERATIONS_AND_DEVELOPMENT.md</code></div>

- Multiple services write to a single SQLite database. This is appropriate for a small deployment, but substantial load would require evaluating lock contention and potentially moving to a server database.
- Legacy `payed` support remains a transitional measure for historical payments; new successful records are normalized to `succeeded`.
- Some older payment UX views contain temporarily disabled paths; they require end-to-end review before being enabled again.

:::

> <SolarIcon name="shield" /> The public case study contains no configuration files, keys, user identifiers, payment details, or internal addresses. The descriptions and short code example were sanitized from safe repository fragments.
