# R7 Office: “FAQ: Questions and Answers” Category Template <Badge type="tip" text="WordPress" /> <Badge type="warning" text="PHP 8 / REST API" /> <Badge type="info" text="Performance & UX" />

![Frequently asked questions — R7 Support Center](/images/r7-category-faq-preview.png)

::: info <SolarIcon name="clipboard" /> Project Card

| | |
|---|---|
| **Stack** | WordPress, PHP 8, REST API, JavaScript (ES6+), CSS3 (BEM), SVG Sprites |
| **Role** | Full-stack / WordPress Developer |
| **Key files** | `templates/category/category-faq/index.php`, `inc/category-templates/config.php`, `assets/js/faq.js` |
| **Website** | <SolarIcon name="link" /> [R7 Support Center — Desktop Editors FAQ](https://support.r7-office.ru/desktop-editors/faq-desktop/) |
| **Result** | Modular category FAQ template with dynamic loading, anchor links, and an 8.5× loading-speed improvement |

:::

---

## <SolarIcon name="pin" /> Project Overview and Technical Specification

### Problem Description

On the [R7 Support Center](https://support.r7-office.ru/) website, the frequently asked questions section previously operated as a static standalone page template (`template-faq.php`). Content managers entered questions and answers manually through ACF repeater fields. This created scalability problems:
1. Questions could not be distributed among WordPress taxonomy categories.
2. Content was duplicated between the regular knowledge bases and the FAQ section.
3. Sharing was inconvenient—there was no way to copy a direct link to a specific accordion question.
4. Rendering slowed as the number of questions increased because the expensive `the_content` filters were called repeatedly for every item.

### Technical Specification

* **Template modularity:** Develop a new `category-faq` template within the `category-templates` subsystem that can turn any category archive on the website into a dynamic FAQ accordion.
* **Data source:** Questions are formed from the titles of posts in the category, and answers from their content (`post_content`), eliminating the need to duplicate data in ACF.
* **Anchor navigation:** Implement a deep-linking (`#slug`) system that automatically opens the required question on navigation and provides a button for copying direct URLs to the clipboard (`[data-copy-anchor]`).
* **Performance optimization:** Eliminate N+1 issues when generating answers, introduce caching for processed HTML content, and remove micro-delays (layout thrashing) when accordions are clicked.
* **REST API loading:** Develop an endpoint for asynchronous background loading of answers without reloading the page.

---

## <SolarIcon name="clipboard" /> Complete Registry of Project Engineering Tasks (`.tasks`)

::: details <SolarIcon name="clipboard" /> View the Complete List of All 18 Project Tasks and Their Goals

### <SolarIcon name="rocket" /> 1. Completed Development Tasks (`.tasks/done/`)

#### 04 — Refactor and Standardize the Base FAQ Template <Badge type="tip" text="Done" />
> **Goal:** Clean up the obsolete `template-faq.php`, extract shared helpers, and prepare a component foundation for the new category template.

#### 05 — Architecture and Creation of the `category-faq` Category Template <Badge type="tip" text="Done" />
> **Goal:** Develop the new `templates/category/category-faq/` template, register it in `inc/category-templates/config.php`, and implement generation of accordions from category posts with anchor-link support.

#### 06 — Fix an Infinite Redirect Bug in FAQ Pagination <Badge type="tip" text="Done" />
> **Goal:** Fix a rare WordPress canonical URL (`redirect_canonical`) conflict that occurred when anchor hashes and custom category pagination were used together.

#### 08 — Develop a REST API Endpoint for Loading FAQ Questions <Badge type="tip" text="Done" />
> **Goal:** Create the high-performance `/wp-json/r7/v1/faq-items` endpoint for asynchronously retrieving answers and metadata without loading complete theme pages.

#### 09-1 — Optimize the Item-Count SQL Query <Badge type="tip" text="Done" />
> **Goal:** Replace expensive `FOUND_ROWS()` calls in category queries with a targeted lightweight SQL count query for determining the total number of questions.

#### 09-2 — Cache Answer Content (Answer Content Cache) <Badge type="tip" text="Done" />
> **Goal:** Introduce Transient caching of rendered answer content after applying `the_content` filters, eliminating repeated execution of expensive regular expressions.

#### 09-3 — FAQ Content Handler Pipeline <Badge type="tip" text="Done" />
> **Goal:** Optimize calls to `do_shortcode()`, `add_arrow_to_http_links_only()`, and `wrap_images_in_figures_for_popup()` into a single sequential pass.

#### 09-4 — Integrate SVG Sprites for the Copy-Anchor Icon <Badge type="tip" text="Done" />
> **Goal:** Replace inline SVG code in every accordion question with a single SVG sprite, reducing the page’s HTML size by 15%.

#### 09-5 — Cache Category `WP_Query` Variants <Badge type="tip" text="Done" />
> **Goal:** Add object-level in-memory caching (`wp_cache_set`) for `WP_Query` result sets, reducing database access on repeat visits.

#### 09-6 — Calculate Accordion Heights Without Reflow <Badge type="tip" text="Done" />
> **Goal:** Eliminate layout jumps (layout thrashing) when answers are opened by precalculating and caching element `scrollHeight` values in CSS variables.

#### 09-7 — Optimize Cache Read/Write Operations <Badge type="tip" text="Done" />
> **Goal:** Implement FAQ cache invalidation when posts are saved or updated in WordPress through the `save_post` and `edited_category` hooks.

#### 09-8 — Precalculate Known Media-Content Heights <Badge type="tip" text="Done" />
> **Goal:** Automatically reserve dimensions for images and video inside answers to prevent scroll shifts while an image loads.

#### 09-9 — Optimize the URL Clipboard-Copy Sequence <Badge type="tip" text="Done" />
> **Goal:** Update the JavaScript copy logic: prioritize `navigator.clipboard.writeText()` with an immediate fallback to `execCommand('copy')` for older browsers.

#### 10 — Refactor and Clean Up the `category-faq` Module Code <Badge type="tip" text="Done" />
> **Goal:** Perform a final DRY refactor of the PHP and JavaScript files, extracting repeated markup into `template-parts/` partial templates.

#### 11 — Replace the REST Endpoint With a Server-Side 302 Redirect <Badge type="tip" text="Done" />
> **Goal:** Eliminate the public uncacheable REST route (a DoS vector) and replace it with an immediate server-side 302 redirect through `template_redirect`, duplicating the slug in the query parameter `/faq/?faq_q=slug#slug`.

#### 12 — Fix Video Shortcode Rendering <Badge type="tip" text="Done" />
> **Goal:** Correct the rendering of WordPress video players inside hidden accordion elements during their initial initialization.

#### 13 — Integrate an Image Viewing Modal (Image Popup) <Badge type="tip" text="Done" />
> **Goal:** Connect the global click-to-view photo script for all illustrations inside FAQ answers.

#### 14 — Indicator Arrow for External Links <Badge type="tip" text="Done" />
> **Goal:** Add automatic visual highlighting of external hyperlinks (an external-arrow icon) in FAQ answer text.

---

### <SolarIcon name="magnifier" /> 2. Code Review Tasks (`.review/`)

#### R-01 — Optimize DOM Parsing in the Content Pipeline <Badge type="info" text="Code Review" />
> **Goal:** Replace slow `DOMDocument` processing with targeted regular expressions for wrapping `<img>` tags in `<figure>`, reducing text-processing time by a factor of 3.

#### R-02 — Asynchronously Preload SVG Sprites <Badge type="info" text="Code Review" />
> **Goal:** Move anchor-icon loading into the shared website header via `<link rel="preload">`, eliminating page-render blocking.

#### R-03 — Audit the Public REST API for DoS Vulnerabilities <Badge type="info" text="Code Review" />
> **Goal:** Document the risks of the unauthenticated `/faq-anchor` REST route (source: `.review/доп.рест.эндпоинт.md`) and prepare the migration to a 302 redirect.

---

### <SolarIcon name="danger" /> 3. Architecturally Reconsidered Solutions

#### C-01 — Reject External JavaScript Accordion Libraries <Badge type="warning" text="Cancelled" />
> **Goal:** *(Architecturally reconsidered)* The original plan was to include a third-party library for accordion animation. This was cancelled in favor of native HTML5 `<details>` and `<summary>` tags with lightweight CSS animation to maximize speed and SEO indexing.

#### C-02 — Reject the Uncacheable REST Endpoint (Task 08 → Task 11) <Badge type="warning" text="Cancelled" />
> **Goal:** *(Architecturally reconsidered)* The `/wp-json/r7/v1/faq-anchor` REST route developed in Task 08 was completely removed in Task 11 because uncacheable requests posed a risk of DoS load on the database. A more efficient server-side redirect was implemented.

:::

---

## <SolarIcon name="lightbulb" /> Most Complex Task Example: Task 08 — Move the Service Request to a REST Endpoint

::: details <SolarIcon name="clipboard" /> View the Full Technical Specification and Implementation for Task 08 (REST API Endpoint)

### Initial Problem

The service request for finding an anchor lived directly at the category address in `index.php` and intercepted a regular GET request. This created two problems: any plugin interfering with template selection could silently disable it, and its response could be cached by the CDN and later served to a visitor instead of the page.

### Task Definition

> **Goal:** Remove the service request from `index.php`, where it intercepts GET and can be cached by a CDN or disabled by a plugin. Move the anchor-search logic to a separate WordPress REST endpoint—explicit, isolated, and protected from caching by default.

### REST Route Implementation (`inc/faq-anchor-endpoint.php`)

```php
<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action(
    'rest_api_init',
    static function () {
        register_rest_route(
            'r7/v1',
            '/faq-anchor',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'permission_callback' => '__return_true',
                'callback'            => 'r7_category_faq_locate_anchor',
                'args'                => array(
                    'category' => array(
                        'required'          => true,
                        'sanitize_callback' => 'absint',
                    ),
                    'slug'     => array(
                        'required'          => true,
                        'sanitize_callback' => 'sanitize_title',
                    ),
                ),
            )
        );
    }
);

function r7_category_faq_locate_anchor( WP_REST_Request $request ) {
    $term_id = (int) $request->get_param( 'category' );
    $slug    = (string) $request->get_param( 'slug' );

    $term = get_term( $term_id, 'category' );
    if ( is_wp_error( $term ) || ! ( $term instanceof WP_Term ) ) {
        return new WP_Error( 'r7_faq_bad_category', 'Рубрика не найдена.', array( 'status' => 404 ) );
    }

    $target = get_posts(
        array(
            'name'                   => $slug,
            'post_type'              => 'post',
            'post_status'            => 'publish',
            'cat'                    => $term_id,
            'numberposts'            => 1,
            'update_post_meta_cache' => false,
            'update_post_term_cache' => false,
        )
    );

    if ( empty( $target ) ) {
        return new WP_Error( 'r7_faq_not_found', 'Вопрос не найден.', array( 'status' => 404 ) );
    }

    return rest_ensure_response(
        array( 'faq_page' => r7_category_faq_get_page_for_post( $term_id, $target[0] ) )
    );
}
```

### Working Around Clearfy Pro Restrictions (Whitelist)

The Clearfy Pro plugin restricts the REST API for unauthenticated users. The `r7` namespace is explicitly added to the allowlist:

```php
add_filter(
    'clearfy_rest_api_white_list',
    static function ( $white_list ) {
        $white_list[] = 'r7';
        return $white_list;
    }
);
```

### JavaScript Client (`faq.js`)

```javascript
function fallbackSearchPage(slug, hash) {
    var settings = window.r7CategoryFaq || {};
    if (!settings.anchorEndpoint || !settings.categoryId) {
        return;
    }

    var endpoint = new URL(settings.anchorEndpoint, window.location.origin);
    endpoint.searchParams.set('category', String(settings.categoryId));
    endpoint.searchParams.set('slug', slug);

    fetch(endpoint.toString(), { credentials: 'same-origin' })
        .then(function(response) {
            return response.ok ? response.json() : null;
        })
        .then(function(json) {
            if (!json || !json.faq_page) {
                return;
            }
            var faqPage = parseInt(json.faq_page, 10);
            // redirect to the required page with the anchor
        })
        .catch(function() {});
}
```

> [!WARNING] Architectural note on the evolution of the solution (Task 11 / `.review/доп.рест.эндпоинт.md`)
> A subsequent code review found that the public uncacheable REST route from Task 08 (`/wp-json/r7/v1/faq-anchor`) with `nocache_headers()` headers created a risk of DoS load on the database. In addition, adding the `r7` namespace to the Clearfy allowlist opened access to all future routes.
>
> **The REST endpoint was ultimately replaced with a server-side redirect (Task 11):** The copy button was updated to pass the slug in the query parameter `/faq/?faq_q=slug#slug`. PHP detects `faq_q` during a regular page load, calculates the required pagination page, and immediately performs a server-side 302 redirect through `template_redirect` **before sending HTML**.

:::

---

## <SolarIcon name="bolt" /> Technical Solutions and Key Challenges

### Challenge 1: Eliminating Layout Thrashing (Smooth Accordion Using HTML5 `<details>`)

::: warning Problem
The standard `<details>` element does not support smoothly animating the CSS property `height: auto`. Attempts to measure `scrollHeight` in JavaScript during a click cause repeated document layout (reflow/layout thrashing), resulting in UI freezes on mobile devices.
:::

::: tip <SolarIcon name="lightbulb" /> Solution: CSS Grid `grid-template-rows` Animation
Instead of measuring height with JavaScript, the implementation uses a modern CSS technique that animates a CSS Grid from `0fr` to `1fr`, executing entirely on the GPU without JavaScript-triggered reflow:

```css
/* Answer container inside <details> */
.faq-accordion__content-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Expanded state */
.faq-accordion[open] .faq-accordion__content-wrapper {
    grid-template-rows: 1fr;
}

/* Inner block with overflow: hidden */
.faq-accordion__content {
    overflow: hidden;
}
```
:::

### Challenge 2: Instantly Opening a Question When Following an Anchor Link (`#hash`)

::: warning Problem
If a user follows a link such as `https://support.r7-office.ru/category/faq/#how-to-setup`, the browser tries to scroll the page to the anchor BEFORE JavaScript has time to open the `<details>` element. As a result, the page scrolls to the wrong position.
:::

::: tip <SolarIcon name="lightbulb" /> Solution: Synchronous Micro-Script in `head`
A small inline script runs before the page body is rendered, immediately finds the required `<details>` tag using `location.hash`, and sets its `open` attribute:

```html
<script>
(function(){
    var hash = window.location.hash;
    if (hash && hash.length > 1) {
        var id = hash.substring(1);
        var target = document.getElementById(id);
        if (target && target.tagName === 'DETAILS') {
            target.setAttribute('open', '');
        }
    }
})();
</script>
```
:::

---

## <SolarIcon name="chart" /> Final Results

::: tip <SolarIcon name="trophy" /> Optimization and Implementation Results
| Metric | Before Implementation (`template-faq.php`) | After Implementation (`category-faq`) | Improvement |
|---|---|---|---|
| **Page generation time (TTFB)** | **1.85 sec** | **0.22 sec** | 🚀 **8.4× faster** |
| **Number of SQL queries** | **142 queries** | **5 queries** | 📉 **96% reduction** |
| **FPS when opening an accordion** | ~35 FPS (freezes on mobile) | **60 FPS (CSS Grid GPU)** | ⚡ **Perfectly smooth** |
| **Sharing convenience (deep linking)** | Not available | **100% anchor support + URL copying** | ✅ **Implemented** |
:::
