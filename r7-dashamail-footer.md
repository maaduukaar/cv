# R7 Office: Footer Reskin and DashaMail Subscription Form Security <Badge type="tip" text="WordPress" /> <Badge type="warning" text="PHP 8 / AJAX" /> <Badge type="danger" text="Security Audit" />

![Footer reskin and DashaMail subscription form — R7 Support Center](/images/r7-dashamail-footer-preview.png)

::: info <SolarIcon name="clipboard" /> Project Card

| | |
|---|---|
| **Stack** | WordPress, PHP 8, JavaScript (AJAX), DashaMail API, CSS3 |
| **Role** | Full-stack Developer / Security Auditor |
| **Key files** | `footer.php`, `dashamail/init.php`, `dashamail/dm.js`, `dashamail/forms/footer.php` |
| **Website** | <SolarIcon name="link" /> [R7 Support Center](https://support.r7-office.ru/) |
| **Result** | Modernized footer, integrated a live AJAX form, and closed 4 security vulnerabilities |

:::

---

## <SolarIcon name="pin" /> Project Overview and Technical Specification

### Initial State and Problem

The [R7 Support Center](https://support.r7-office.ru/) website project had two parallel versions of the footer subscription form:

1. **Static HTML in `footer.php`:** Polished markup from the new brand design (current inputs, button design, and an inline subscription confirmation block). However, the “Subscribe” button was a mock-up—clicking it did not actually submit any data.
2. **Isolated `dashamail/` module:** Contained working backend logic in PHP and cURL that sent data to the DashaMail email service API. However, it used outdated Tilda markup and opened Tilda popups that broke the new design. The module inclusion in `functions.php` was commented out.

The module had also inherited several critical security problems: hardcoded API keys, no CSRF nonce, unlimited cURL timeouts, and no request rate limiting.

### Technical Specification

1. **Merge markup and logic:** Replace the obsolete Tilda template inside the `dashamail/` module with the current PHP template from the design.
2. **Remove Tilda popups:** Adjust the JavaScript logic so that a successful-subscription message appears inline (an animated overlay over the form).
3. **Security and audit:** Conduct a complete security review of the module, hide API keys, and add CSRF protection, timeouts, and IP-based limits.

---

## <SolarIcon name="clipboard" /> Complete Task List

| No. | Task | Description |
|:---:|---|---|
| 05 | **Footer and DashaMail integration architecture** | Prepare the technical migration plan |
| 05-1 | **Buffered PHP form template** | Move the markup to `dashamail/forms/footer.php` using `ob_start()` / `ob_get_clean()` |
| 05-2 | **Include the module in `functions.php`** | Replace the obsolete `OCEANWP_THEME_DIR` constant with `get_template_directory()` |
| 05-3 | **Refactor the JavaScript handler** | Remove Tilda popups; on success, apply `.is-active` and show the native overlay |
| 05-4 | **Complete security audit** | Prepare a detailed security report |
| 05-5 | **Remediate vulnerabilities** | API keys → `wp-config.php`, `wp_verify_nonce`, `CURLOPT_TIMEOUT`, IP rate limiting |

---

## <SolarIcon name="bolt" /> Technical Solutions and Key Challenges

### Challenge: Protection Against Spam Bots With IP Rate Limiting

::: warning Problem
Even with a `nonce`, bots can generate large volumes of subscription requests, exhausting the DashaMail API account limits and overloading the server with cURL requests.
:::

::: tip <SolarIcon name="lightbulb" /> Solution: Transient IP Rate Limiter
Before sending a cURL request to the DashaMail API, the backend checks the number of calls from the user’s current IP address using the fast WordPress cache (`transient`):

```php
function dm_check_rate_limit() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $transient_key = 'dm_rate_' . md5( $ip );
    $request_count = get_transient( $transient_key );

    if ( false === $request_count ) {
        set_transient( $transient_key, 1, 60 ); // 1 request, reset after 60 sec
    } elseif ( $request_count >= 3 ) {
        // [!code danger] More than 3 requests per minute — immediate block (429)
        wp_send_json( [
            'status' => 'error',
            'message' => 'Слишком много попыток. Пожалуйста, подождите минуту.'
        ] );
        exit;
    } else {
        set_transient( $transient_key, $request_count + 1, 60 );
    }
}
```
:::

---

## <SolarIcon name="shield" /> DashaMail Module Security Audit (`dashamail-security-review.md`)

::: details <SolarIcon name="clipboard" /> View the Full Source-Code Security Audit Report

### <SolarIcon name="check" /> What Was Already Correct in the Source Code
* **Protection against direct access to PHP files:** The `ABSPATH` check in `init.php` and `forms/footer.php`.
* **URL escaping in the template:** `esc_url()` is used for asset paths.
* **Server-side email validation:** `filter_var(..., FILTER_VALIDATE_EMAIL)` is used before passing the address to the API.
* **Safe AJAX response output:** `wp_send_json()` + `send_nosniff_header()`.

---

### <SolarIcon name="danger" /> Critical Vulnerabilities

#### 1. API Key Hardcoded in a Theme File <Badge type="danger" text="Critical" />
* **File:** `themes/r7/dashamail/init.php`
* **Problem:** The DashaMail API key was written directly in the theme source code. Compromising the repository would compromise the email service key.
* **Solution:** The key and list ID were moved to `wp-config.php`:
```php
// wp-config.php
define( 'DM_API_KEY', '...' );
define( 'DM_LIST_ID', 12345 );
```

---

### <SolarIcon name="danger" /> Medium-Severity Vulnerabilities

#### 1. No CSRF Protection (Nonce) on the AJAX Endpoint <Badge type="warning" text="Medium" />
* **Files:** `init.php`, `dm.js`
* **Problem:** The handler accepted POST requests without verifying their source. A third-party website could spam the database with junk addresses.
* **Solution:** A `wp_verify_nonce` check was added:
```php
// In dm_enqueue_assets():
'nonce' => wp_create_nonce( 'dm_subscribe' )

// In dmAjaxAction():
if ( ! wp_verify_nonce( $_POST['nonce'] ?? '', 'dm_subscribe' ) ) {
    wp_send_json( [ 'status' => 'error', 'code' => 'forbidden' ] );
}
```

#### 2. No IP Rate Limiting <Badge type="warning" text="Medium" />
* **Problem:** A bot could make thousands of requests per second, overloading the server with cURL requests to the external API.
* **Solution:** A Transient-based IP rate limit with a honeypot was added.

#### 3. Unlimited cURL Timeout <Badge type="warning" text="Medium" />
* **Problem:** `CURLOPT_TIMEOUT => 0`. If the DashaMail service hung, PHP workers remained blocked indefinitely.
* **Solution:** A reasonable 5-second timeout was set:
```php
curl_setopt( $ch, CURLOPT_TIMEOUT, 5 );
curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, 3 );
```

---

### <SolarIcon name="check" /> Minor Findings

#### 1. `$_POST['email']` Without a Key-Existence Check
* **Problem:** A request without the `email` parameter produced a `Warning` in server logs.
* **Solution:** Safe reading via `$_POST['email'] ?? ''`.

#### 2. Obsolete jQuery `.success()` API
* **Problem:** The `.success()` method was removed in jQuery 3.0+. The form worked only because of `jQuery Migrate`.
* **Solution:** Migrated to the native `.done()` method.

---

### <SolarIcon name="chart" /> Final Security Review Summary

| Finding | Risk Level | Remediation Status |
|---|---|:---:|
| API key in theme source code | 🔴 Critical | ✅ Resolved (`wp-config.php`) |
| Missing CSRF nonce | 🟡 Medium | ✅ Resolved (`wp_verify_nonce`) |
| Missing rate limiting | 🟡 Medium | ✅ Resolved (`Transient IP Limit`) |
| Unlimited cURL timeout | 🟡 Medium | ✅ Resolved (`CURLOPT_TIMEOUT = 5`) |
| `$_POST['email']` without isset | 🟢 Minor | ✅ Resolved |
| `.success()` instead of `.done()` | 🟢 Minor | ✅ Resolved |

:::

---

## <SolarIcon name="clipboard" /> Integration Results Report (`dashamail-footer-report.txt`)

::: details <SolarIcon name="clipboard" /> View the Full File and Testing Results Report

### List of Theme Files Changed
* `themes/r7/functions.php` — module inclusion for `dashamail` was activated via `get_template_directory()`.
* `themes/r7/footer.php` — the static form placeholder was replaced with a call to `dm_footer_shortcode()`.
* `themes/r7/dashamail/init.php` — initialization was updated, the duplicate `<?php` tag was fixed, and `dm_footer_shortcode()` was rewritten to use a buffered PHP template.
* `themes/r7/dashamail/dm.js` — the AJAX handler was updated: `.is-active` is now applied on success, obsolete `.success()` was replaced with `.done()` (for jQuery 3.7.1), and the Tilda popup was removed.
* `themes/r7/dashamail/dm.css` — obsolete Tilda form styles were removed.
* `themes/r7/dashamail/forms/footer.php` — a new PHP form template based on the current markup was created.

### Testing Results in the Dev Environment
* All interactive form states were tested:
  * On the first successful subscription, an attractive inline “Thank you for subscribing” block appears.
  * On a repeated attempt with the same email address, the message “You are already subscribed to the newsletter!” appears.
* Data transfer was confirmed: new subscribers are successfully added to the DashaMail list through the API.
:::

---

## <SolarIcon name="chart" /> Final Results

::: tip <SolarIcon name="trophy" /> Project Achievements
| Metric | Before the Changes | After the Changes |
|---|---|---|
| **Footer functionality** | Visual mock-up with no submission | **100% live DashaMail subscription via AJAX** |
| **Confirmation UX** | Obsolete Tilda popup | **Inline overlay with smooth CSS animation** |
| **API key security** | Keys exposed in repository code | **Isolated in `wp-config.php`** |
| **Spam resistance** | None | **CSRF nonce + rate limit (maximum 3 requests/min)** |
:::
