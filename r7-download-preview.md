---
outline: [2, 3]
pageClass: project-case
---

# R7 Office: Download Preview Landing & Early Access <Badge type="tip" text="WordPress" /> <Badge type="warning" text="PHP 8" /> <Badge type="info" text="RBAC & Security" />

![R7 Office Preview Versions Download Landing Interface](/images/r7-download-preview.png)

::: info <SolarIcon name="clipboard" /> Project Card

| Parameter | Value |
|---|---|
| **Stack** | WordPress 6+, PHP 8, ACF Pro, JavaScript (ES6+), CSS3 (Grid/Flexbox), SVG Sprites |
| **Duration** | 2 weeks (architecture, layout, mu-plugin, ACF integration, QA) |
| **Role** | Full-stack Developer / Solutions Architect |
| **Scope** | 8 product lines · 14 operating systems · 2 target landing pages |
| **Website** | <SolarIcon name="link" /> [support.r7-office.ru — Early Access Program](https://support.r7-office.ru/preview) |
| **Result** | Modular preview landing template with interactive 14-OS selector, custom granular RBAC mu-plugin, and safe ACF JSON data pipeline |

:::

---

## <SolarIcon name="pin" /> Project Overview & Specification

As part of the **R7 Office** ecosystem expansion and the launch of the **“First in Line” (Early Access)** program, a dedicated landing page was needed to distribute pre-release, alpha, and beta builds across the product family before their general availability in the main catalog.

### Initial Problem & Context

1. **Broad Multi-Platform Matrix:** 8 key products (Document Editor, R7-Assistant Server, Organizer PRO, Graphics, Corporate Server, Document Server, Mail Server, File Express) ship for 14 different operating systems and CPU architectures (Windows, macOS, RedOS, CentOS, Astra Linux, Ubuntu, ROSA, Alt Linux, SUSE, iOS, Android, Aurora, Docker containers, and patches). Users required an intuitive, frictionless OS selector displaying exact package versions, file sizes, and MD5 checksums.
2. **Child Theme Isolation:** The primary theme `themes/r7` is continuously updated. All new page templates, client-side scripts, stylesheets, and SVG sprites had to reside strictly within `themes/r7-child` without impacting production pages.
3. **Delegated Content Management & Granular RBAC:** Updating build download links and checksums is handled by designated content managers. These managers **must not access unrelated site pages**, yet must seamlessly edit the target landing page created by an administrator, including saving structured JSON payloads in ACF without tag stripping or quotes escaping.
4. **Legal Compliance:** Downloading pre-release software requires mandatory confirmation of the preview license terms prior to downloading.

### Technical Specification

- **Page Template:** Implement a custom PHP template `template-download-preview.php` featuring a Hero banner with a 7-slide product carousel, responsive product cards, OS tabs, and a modal agreement dialog.
- **Asset Optimization:** Enqueue CSS and JS strictly when `is_page_template()` matches, preventing any performance degradation across the rest of the site.
- **Must-Use RBAC Plugin:** Develop `preview-landing-role-manager.php` introducing the `preview_landing_editor` role with granular access scoped strictly to target landing page IDs via `map_meta_cap`, `acf/allow_unfiltered_html`, and `admin_menu`.
- **Parent Template Enhancement:** Provide an optional ACF-controlled alpha release banner in the standard download template (`template-download.php`).

---

## <SolarIcon name="clipboard" /> Complete Registry of Project Tasks (`.tasks`)

::: details <SolarIcon name="clipboard" /> View the Complete List of Tasks and Milestones

### <SolarIcon name="rocket" /> 1. Completed Development Tasks (`.tasks/done/`)

#### 01 — Create “Download Preview” Page Template in Child Theme <Badge type="tip" text="Done" />
> **Goal:** Create the starter PHP template `template-download-preview.php` in `themes/r7-child`, register it in WordPress via the `theme_page_templates` filter, integrate layout wrappers (header, footer, navigation, breadcrumbs), and configure conditional asset loading in `functions.php`.

#### 02 — Frontend Implementation of the Download Preview Page <Badge type="tip" text="Done" />
> **Goal:** Build the responsive user interface: Hero section with a 7-image product carousel, 8 product cards, interactive 14-OS switching tabs backed by an SVG sprite, instant MD5 clipboard copying with visual feedback, and a license agreement modal.

#### 03 — Develop Must-Use Access Control Plugin (RBAC) <Badge type="tip" text="Done" />
> **Goal:** Build `preview-landing-role-manager.php` to establish the `preview_landing_editor` role, intercept Classic Editor authorization checks via `map_meta_cap`, allow raw JSON in ACF via `acf/allow_unfiltered_html`, and declutter the administration dashboard using `admin_menu`.

#### 04 — Integrate Alpha Versions Banner into Download Template <Badge type="tip" text="Done" />
> **Goal:** Extend the parent template `template-download.php` and ACF field configuration (`group_download_page.json`) to render an optional alpha version banner after related products, maintaining backward compatibility and field key integrity.

---

### <SolarIcon name="magnifier" /> 2. Code Review & Performance Audits (`.review/` & `.report/`)

#### CR-01 — Resolve Child Theme Loader Fatal Error <Badge type="info" text="Code Review" />
> **Goal:** Fix a critical PHP Fatal Error during child theme initialization caused by parent theme core referencing `get_stylesheet_directory()` instead of `get_template_directory()`. Implemented a proxy loader and upstream patch.

#### SEC-01 — Security Audit: Harden ACF Save Hooks <Badge type="info" text="Security" />
> **Goal:** Eliminate arbitrary code execution risks during JSON saves by adding strict `_acf_nonce` verification, explicit `current_user_can()` capabilities, `page_template` sanitization, and `LOCK_EX` file locking.

#### PERF-01 — Optimize Server Response Time & DOM Size <Badge type="info" text="Performance" />
> **Goal:** Replace repetitive disk I/O when reading the 82 KB product matrix on every page view with in-memory `wp_cache_*` storage and invalidation on `acf/save_post`, saving 5–15 ms per request.

:::

---

## <SolarIcon name="lightbulb" /> Deep Dive: Most Complex Task

### Developing the Granular RBAC Must-Use Plugin (`preview-landing-role-manager.php`)

One of the standout challenges was implementing an isolated editor role adhering to the Principle of Least Privilege:

```text
Requirement: Content managers must edit landing page ID 55188 (authored by Admin),
             save raw JSON arrays with quotes and links via ACF,
             yet remain strictly barred from 500+ knowledge base articles and WordPress settings.
```

::: details <SolarIcon name="code" /> View Key RBAC Hook Implementations

```php:line-numbers [mu-plugins/preview-landing-role-manager.php]
<?php
/**
 * Plugin Name: Preview Landing Role Manager
 * Description: Creates a dedicated editor role scoped to specific preview landing pages.
 * Version: 1.1.0
 */

if (!defined('ABSPATH')) {
    exit;
}

define('TARGET_LANDING_IDS', array(55188, 55197));
define('CUSTOM_ROLE_SLUG', 'preview_landing_editor');
define('CUSTOM_ROLE_NAME', 'Preview Landing Editor');

/**
 * 1. Idempotent role creation on init
 */
add_action('init', function () {
    if (null !== get_role(CUSTOM_ROLE_SLUG)) {
        return;
    }

    add_role(
        CUSTOM_ROLE_SLUG,
        CUSTOM_ROLE_NAME,
        array(
            'read'                 => true,
            'upload_files'         => true,
            'edit_pages'           => true,
            'edit_published_pages' => true,
            'publish_pages'        => true,
        )
    );
});

/**
 * 2. Granular capability mapping via map_meta_cap
 * Bypasses Classic Editor locks for other authors' pages without granting global edit_others_pages
 */
add_filter('map_meta_cap', function ($caps, $cap, $user_id, $args) {
    static $role_cache = array();
    if (!isset($role_cache[$user_id])) {
        $user = get_userdata($user_id);
        $role_cache[$user_id] = $user && in_array(CUSTOM_ROLE_SLUG, (array) $user->roles, true);
    }
    if (!$role_cache[$user_id]) {
        return $caps;
    }

    $post_id = isset($args[0]) ? absint($args[0]) : 0;

    // For target landing pages, map edit_post directly to the role's edit_pages capability // [!code ++]
    if (in_array($post_id, TARGET_LANDING_IDS, true) && in_array($cap, array('edit_post', 'edit_page'), true)) { // [!code ++]
        return array('edit_pages'); // [!code ++]
    } // [!code ++]

    // Deleting pages is strictly forbidden
    if (in_array($cap, array('delete_post', 'delete_page', 'delete_others_pages', 'delete_published_pages'), true)) {
        return array('do_not_allow');
    }

    // Block access to any other page or post
    if (in_array($cap, array('edit_others_pages', 'edit_others_posts'), true) || in_array('edit_others_pages', $caps, true)) {
        if ($post_id && in_array($post_id, TARGET_LANDING_IDS, true)) {
            return array('edit_pages');
        }
        return array('do_not_allow'); // [!code highlight]
    }

    return $caps;
}, 10, 4);

/**
 * 3. Permit raw JSON structures in ACF fields
 */
add_filter('acf/allow_unfiltered_html', function ($allowed) {
    $user = wp_get_current_user();
    if ($user && in_array(CUSTOM_ROLE_SLUG, (array) $user->roles, true)) {
        return true; // Prevents escaping quotes and links in custom JSON fields // [!code ++]
    }
    return $allowed;
});

/**
 * 4. Remove unnecessary admin menus
 */
add_action('admin_menu', function () {
    $user = wp_get_current_user();
    if (!$user || !in_array(CUSTOM_ROLE_SLUG, (array) $user->roles, true)) {
        return;
    }

    // Retain only Pages, Media Library, and User Profile
    remove_menu_page('edit.php');                   // Posts
    remove_menu_page('edit-comments.php');          // Comments
    remove_menu_page('tools.php');                  // Tools
    remove_menu_page('options-general.php');        // Settings
    remove_menu_page('wpcf7');                      // Contact Form 7
}, 999);
```

:::

---

## <SolarIcon name="bolt" /> Technical Challenges & Solutions

### 1. Theme Architecture: Fatal Error during Child Theme Loading <Badge type="danger" text="Critical Bug" />

::: warning Problem
Activating `r7-child` caused a fatal breakdown: `Fatal Error: require_once(): Failed opening required .../themes/r7-child/inc/category-templates/loader.php`.

**Root Cause:** Parent theme core (`r7/functions.php`) included foundational modules via `get_stylesheet_directory()`, which resolves to the child theme folder when a child theme is active.
:::

::: tip <SolarIcon name="lightbulb" /> Solution: Two-Pronged Resolution
1. **Immediate Proxy Recovery:** Created a lightweight proxy loader at `themes/r7-child/inc/category-templates/loader.php` routing requests safely to `get_template_directory()`.
2. **Core Upstream Fix:** Updated parent theme `r7/functions.php` to utilize `get_template_directory()` for all internal system components not intended for child overrides.
:::

---

### 2. High-Performance Server Response: In-Memory Caching <Badge type="tip" text="wp_cache" />

::: warning Problem
The product catalog data array (8 product suites across 14 OS variations) is an **82 KB** data structure. Loading it via un-cached disk reads and parsing on every visitor request added unnecessary CPU and I/O cycles.
:::

::: tip <SolarIcon name="rocket" /> Solution: In-Memory Object Caching with Hook Invalidation
Implemented caching via the WordPress Object Cache API (`wp_cache_get` / `wp_cache_set` in group `r7_preview`):

```php
function r7_get_preview_products_data() {
    $cached = wp_cache_get('preview_products_data', 'r7_preview');
    if (false !== $cached) {
        return $cached; // Instant RAM retrieval // [!code ++]
    }

    if (is_array($data)) {
        wp_cache_set('preview_products_data', $data, 'r7_preview');
        return $data;
    }
    return [];
}

// Invalidate cache immediately when content is saved in ACF
add_action('acf/save_post', function ($post_id) {
    wp_cache_delete('preview_products_data', 'r7_preview'); // [!code highlight]
}, 20);
```
:::

---

### 3. Interactive UX: 14-OS Selector & Agreement Modal <Badge type="info" text="JavaScript ES6" />

::: warning Problem
The interface needed to seamlessly support 14 OS options with custom architecture tags (`WIN 64 ZIP`, `RPM`, `DEB`, `Docker`), file sizes, and MD5 hashes. Downloads had to be strictly intercepted until legal terms were accepted.
:::

::: tip <SolarIcon name="palette" /> Solution: SVG Sprites, Clipboard API, and Modal Interceptor
- **Unified Vector Sprite:** Assembled `preview-sprite.svg` containing all OS emblems, eliminating multiple HTTP requests.
- **Client-Side Tabs:** Responsive OS switching without full page reloads using CSS Grid and clean data-attributes.
- **Visual Clipboard Feedback:** MD5 copy triggers `navigator.clipboard.writeText()` with an animated “Copied!” indicator.
- **Interception Dialog:** Clicks on download buttons store the target URL in state, enabling the download action only once the license acceptance checkbox is toggled.
:::

---

## <SolarIcon name="trophy" /> Final Results & Key Metrics

::: tip 🏆 Project Milestones & Technical Outcomes

| Metric | Before | After | Result |
|---|---|---|:---:|
| **Platform Matrix** | Fragmented links | **8 Products × 14 OS** unified catalog | **100% Coverage** |
| **Theme Isolation** | Risk of parent theme regressions | 100% isolated in `themes/r7-child` | **0 Conflicts** |
| **Security & RBAC** | Admin access required | `preview_landing_editor` scoped to 2 pages | **Least Privilege Standard** |
| **Server Response** | 82 KB file read per hit | In-memory `wp_cache` layer | **−15 ms TTFB** |
| **License Compliance** | Direct unconfirmed downloads | Mandatory interactive agreement modal | **Fully Compliant** |
| **Asset Overhead** | 0 KB across other pages | Scoped strictly to preview template | **Zero Bloat** |

:::
