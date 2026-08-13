# R7 Office: Document Builder API <Badge type="tip" text="WordPress" /> <Badge type="warning" text="PHP 8" /> <Badge type="info" text="JS ES6" />

![Document Builder API reference home page](/ru/images/r7-document-api/r7-api-main.png)

::: info <SolarIcon name="clipboard" /> Project Card

| | |
|---|---|
| **Stack** | WordPress, PHP 8, JavaScript ES6, HTML5/CSS3 |
| **Timeline** | Template development — **2 weeks**, content processing — **1 week** |
| **Role** | Full-stack Developer / Solution Architect |
| **Scale** | 107 API class categories · 1,656 method articles |
| **Live example** | <SolarIcon name="link" /> [support.r7-office.ru/…/api-text-document/](https://support.r7-office.ru/using-api-document-builder/api-text-document/) |

:::

## <SolarIcon name="pin" /> Project Overview

The task for the **R7 Office Support Center** knowledge base required designing a new category display template for the **Document Builder API** (text documents, spreadsheets, presentations) and bringing a vast body of disparate materials to a single standard.

The reference includes **107 API class categories** and **1,656 method articles**, which required a clear structure, fast search, and consistent styling.

> <SolarIcon name="link" /> **[View a live Text Document API example on support.r7-office.ru](https://support.r7-office.ru/using-api-document-builder/api-text-document/)**

---

## ⭐ Key Advantage: Bulk Processing of 1,656 Articles in 1 Week

After development of the category architecture module was completed (which took 2 weeks), the next sequential step was **content refinement and standardization**. In just **one week**, the entire set of 1,656 method articles was fully structured and brought to a unified format.

::: details <SolarIcon name="notes" /> Complete List of Content Work Across 1,656 Method Articles

- **Adding excerpts (`excerpt`)** — short descriptions were created for each article and are used to automatically build method tables in the accordion templates.
- **Cleaning up “junk” HTML** — unused `id`/`class` attributes on headings, broken `<div class="details">` wrappers, and `<dd>` tags that disrupted the layout were removed.
- **Correcting translation errors** — machine translations of data types were corrected (for example, `«левый» | «правильно»` → `"left" | "right" | "both" | "center" | undefined`, `Массив.<ApiShape>` → `Array.<ApiShape>`).
- **Brand terminology** — `Document Builder` names were standardized as **“Document Builder”**.
- **Syntax protection** — method headings were wrapped in `<code>`, preventing automatic replacement of `"` with `«»`.
- **JSDoc standardization** — `ApiFormBase#Clear` notation instead of a dot; the “Returns” section → clean `<ul>/<li>`.

:::

::: tip <SolarIcon name="layers" /> Additional Content Work
- **107 API categories** — data was migrated to custom meta fields (`api_constructor_syntax`, `api_class_description`, `api_example_code`, `api_characteristics`).
- **107 subcategories** — anchor redirects to sections in the primary templates were configured.
- **107 obsolete articles** — hidden from public display.
:::

---

## <SolarIcon name="bolt" /> Technical Solutions and Key Challenges

::: info <SolarIcon name="map" /> Sequential Project Stages
**Stage 1 → Stage 2 → Stage 3**

1. <SolarIcon name="settings" /> **Design and development of the `category-templates` module** <Badge type="tip" text="2 weeks" />
   - <SolarIcon name="palette" /> *Frontend*: Modular `template-parts` (`header`, `breadcrumbs`, `sidebar`, `getting-started`, `api-classes`)
   - <SolarIcon name="rocket" /> *Backend*: N+1 SQL query optimization (one batched `WP_Query` + relationship cache)
   - <SolarIcon name="target" /> *UX*: Synchronous `pre-open hash script` preventing screen jumps during anchor navigation
2. <SolarIcon name="bolt" /> **Content refinement and standardization** <Badge type="warning" text="1 week" />
   - Bulk HTML cleanup, translations, JSDoc, and `excerpt` generation for 1,656 articles
   - Migration of descriptions to custom meta fields for 107 category terms
3. <SolarIcon name="shield" /> **Successful release** <Badge type="info" text="Completed" />
   - Testing, DoD verification, and safe deployment to `support.r7-office.ru`
:::

### 1. Engineering Challenge: Layout Shift With Anchor Links <Badge type="danger" text="CLS" />

::: warning Problem
When a user follows a direct anchor link (for example, `.../#ApiWatermarkSettings`), the required section is inside a **collapsed accordion**. The standard asynchronous `DOMContentLoaded` caused a **height jump and screen jerk** (Cumulative Layout Shift), displacing the user’s focus point.
:::

::: tip <SolarIcon name="lightbulb" /> Solution: Synchronous Pre-open Hash Script
A special **synchronous micro-script** was designed and embedded directly where the accordion list is generated:

1. The script runs immediately during HTML parsing — **before native scroll and the first paint**
2. It instantly reads `window.location.hash` and finds the target class
3. It sets the `.active` / `.open` state **before rendering**
4. The browser scrolls directly to the already opened block — **without visual displacement**
:::

<figure>
  <img src="/ru/images/r7-document-api/r7-api-accordion.png" alt="API class method reference">
  <figcaption>Expanded ApiWatermarkSettings class accordion showing metadata and the method table</figcaption>
</figure>

### 2. Frontend Architecture and UX <Badge type="tip" text="Modular" />

To make layout management easier, the original 700-line monolithic template was split into independent `template-parts`:

```text
themes/r7-child/templates/category/api-index/
├── index.php                 # Template coordinator (~80 lines)
├── assets/
│   ├── css/style.css        # Accordion and method-table styles
│   └── js/accordion.js      # Delegated accordion JS controller
└── template-parts/
    ├── header.php           # Category heading and description
    ├── breadcrumbs.php      # Breadcrumbs
    ├── getting-started.php  # "Getting Started" section
    ├── api-classes.php      # Class accordion and table list
    ├── sidebar.php          # Navigation sidebar
    └── empty-state.php      # Empty state
```

All user click and interaction logic was moved to the external `accordion.js` script using efficient event delegation.

::: tip <SolarIcon name="settings" /> Administrator Convenience (Admin Quick Edit)
A **quick section-editing feature directly from the frontend** was implemented for content managers:
- Users with the `edit_terms` capability see a button in each accordion header linking directly to the WordPress admin panel (`get_edit_term_link()`)
- It provides instant **one-click** access to edit the class metadata
- The click event is isolated with `event.stopPropagation()` so navigating to the admin panel **does not collapse the accordion**
:::

### 3. Performance Optimization <Badge type="danger" text="N+1 → 1" />

::: danger Problem: N+1 SQL Queries
Calling a separate `WP_Query` for every class in a loop generated more than **201 SQL queries** to the database on pages with 20+ classes.
:::

**Solution** — all class methods are selected with **one batched `WP_Query`**, filtered through `tax_query` using an array of categories, and then grouped in PHP:

| Metric | Before | After | Improvement |
|---|---|---|---|
| SQL queries | 201 | 2 | **×100** |
| Generation time | 1.4 sec | 0.08 sec | **×17.5** |

---

## <SolarIcon name="lightbulb" /> Practical Examples

::: details <SolarIcon name="clipboard" /> Complete Real Technical Specification (No. 13 — Anchor Links)

Below is the original task specification from the project repository (`.tasks/done/13-anchor-links.md`):

### <SolarIcon name="target" /> Task Goal

Make anchor links in the “API Classes” section stable and predictable:
- the anchor (`id`) is attached to the accordion heading
- the button next to the heading **only copies** the link
- following `#hash` opens the accordion and displays its entire header below the fixed header

---

### <SolarIcon name="magnifier" /> Problems Identified

#### 1. The Anchor Is on `<summary>`, Not the Heading
The `id` is assigned to `<summary class="r7-api-class__accordion-summary">`.
The task requires the anchor to be on `<span class="r7-api-class__accordion-heading">`.

#### 2. The Button Is an `<a>` Link, Not a `<button>`
The `.r7-api-class__anchor-btn` element is `<a href="#...">`. It must be replaced with `<button>` to prevent native navigation.

#### 3. The Accordion Header Slides Under the Header
The CSS `scroll-margin-top` values are hardcoded and do not account for the WordPress admin bar.

---

### <SolarIcon name="settings" /> Work Breakdown

#### 13.1 — Move `id` to the Heading <Badge type="info" text="index.php" />

```php
// Before: id on <summary>
<summary id="<?= $accordion_id ?>">  // [!code --]

// After: id on the heading <span>
<span class="r7-api-class__accordion-heading" id="<?= $accordion_id ?>">  // [!code ++]
```

#### 13.2 — Replace `<a>` With `<button>` <Badge type="info" text="index.php" />

```html
<button
    class="r7-api-class__anchor-btn"
    type="button"
    data-copy-anchor
    data-target-id="<?php echo esc_attr( $accordion_id ); ?>"
    aria-label="Copy anchor link"
    title="Copy link"
>
    <!-- SVG icon -->
</button>
```

#### 13.3 — CSS: `scroll-margin-top` Accounting for the Admin Bar <Badge type="info" text="style.css" />

```css
/* Desktop */
.r7-api-class__accordion-heading[id] {
    scroll-margin-top: 100px;
}
.admin-bar .r7-api-class__accordion-heading[id] {
    scroll-margin-top: 132px; /* 100 + 32 */
}

/* Mobile ≤ 782px */
@media screen and (max-width: 782px) {
    .r7-api-class__accordion-heading[id] {
        scroll-margin-top: 60px;
    }
    .admin-bar .r7-api-class__accordion-heading[id] {
        scroll-margin-top: 106px; /* 60 + 46 */
    }
}
```

#### 13.4 — JavaScript Scrolling <Badge type="info" text="accordion.js" />

```js
// Before: scroll to <details>, offset from <summary>
scrollToAnchorTarget(details, settings.behavior || 'auto', summary); // [!code --]

// After: scroll to heading, offset from heading
scrollToAnchorTarget(target, settings.behavior || 'auto', target); // [!code ++]
```

---

### <SolarIcon name="check" /> Definition of Done (DoD)
- ✅ `id` is on `.r7-api-class__accordion-heading`, not `<summary>`
- ✅ `.r7-api-class__anchor-btn` is `<button type="button">`, not `<a>`
- ✅ Clicking the button copies the URL with `#hash` without navigation or toggle
- ✅ A URL with `#hash` opens the accordion, with the header visible below the fixed header
- ✅ The admin bar is accounted for on desktop and mobile
- ✅ Manual accordion toggling works as before

:::

::: details <SolarIcon name="magnifier" /> SQL Query Optimization (N+1 → Batched Query)

### Problem

```php
// ❌ OLD IMPLEMENTATION: N+1 database queries
foreach ($api_classes as $class_term) {
    $posts = new WP_Query([   // [!code warning]
        'cat' => $class_term->term_id,   // [!code warning]
        'posts_per_page' => 200   // [!code warning]
    ]);   // [!code warning]
    // Render class...
}
```

With 20 classes and 10 methods each, this generated more than **201 SQL queries** per page load.

### Solution

```php
/**
 * ✅ OPTIMIZED IMPLEMENTATION: 1 batched query instead of N+1
 */
function r7_api_index_get_api_class_posts_by_term(
    array $term_ids,
    int $posts_per_page = 200
) {
    if ( empty( $term_ids ) ) {
        return array();
    }

    $args = array(
        'post_type'              => 'post',
        'post_status'            => 'publish',
        'posts_per_page'         => $posts_per_page * count( $term_ids ), // [!code highlight]
        'update_post_term_cache' => true, // Warm relationship cache // [!code highlight]
        'tax_query'              => array(
            array(
                'taxonomy' => 'category',
                'field'    => 'term_id',
                'terms'    => $term_ids, // [!code highlight]
                'operator' => 'IN',
            ),
        ),
    );

    $query = new WP_Query( $args );
    $grouped = array();

    if ( $query->have_posts() ) {
        foreach ( $query->posts as $post ) {
            $post_terms = wp_get_post_categories( $post->ID );
            foreach ( $post_terms as $t_id ) {
                if ( in_array( $t_id, $term_ids, true ) ) {
                    $grouped[ $t_id ][ $post->ID ] = $post;
                }
            }
        }
    }

    // Enforce the limit: 200 methods per class
    foreach ( $grouped as $t_id => $bucket ) {
        $grouped[ $t_id ] = array_slice( $bucket, 0, $posts_per_page, true );
    }

    return $grouped;
}
```

### Result

| Metric | Before | After |
|---|---|---|
| SQL queries | **201** | **2** |
| Generation time | **1.4 sec** | **0.08 sec** |

:::

---

## <SolarIcon name="clipboard" /> Complete Registry of Project Engineering Tasks (`.tasks`)

::: details <SolarIcon name="clipboard" /> View the Complete List of All 40 Project Tasks and Their Goals

### <SolarIcon name="rocket" /> 1. Completed Development Tasks (`.tasks/done/`)

#### 01 — MVP: WordPress Child Theme With a Custom `api-text-document` Category Template <Badge type="tip" text="Done" />
> **Goal:** Create a minimal working implementation through a WordPress child theme so that the `category` term with ID `337` and slug `api-text-document` uses a custom template. The template must display all child categories, their descriptions, and the titles and excerpts of all articles in each subcategory. This is needed to validate the architecture quickly without implementing a complex admin interface or additional fields.

#### 02 — MVP: Term Meta Support for `api-text-document` Subcategories <Badge type="tip" text="Done" />
> **Goal:** Extend the current MVP: add three `term meta` fields (`api_constructor_syntax`, `api_class_description`, `api_example_code`) to subcategories of `api-text-document`, and change the custom template to display these fields instead of the standard `description` when populated.

#### 03 — MU Plugin: Term Meta Fields for All `category` Terms <Badge type="tip" text="Done" />
> **Goal:** Create a standalone `mu-plugin` that adds three fields to the WordPress admin for all `category` taxonomy terms and saves them to `term meta`. The plugin must work independently of the website theme and be used separately, without enabling the child theme at the same time.

#### 04 — Add a “Characteristics” Field With a Visual Editor <Badge type="tip" text="Done" />
> **Goal:** Add a new `api_characteristics` field—**“Characteristics”**—to the `mu-plugin`, using the standard WordPress visual editor (`wp_editor`). The field is intended for structured data (primarily tables) entered visually by an administrator through TinyMCE.

#### 05 — Preserve Backslashes (`\`) in All Term Meta Fields <Badge type="tip" text="Done" />
> **Goal:** Prevent loss of backslashes when saving **all** plugin term meta fields (`api_constructor_syntax`, `api_class_description`, `api_example_code`, `api_characteristics`). A user must be able to paste data containing backslashes (for example, `\n`, `\t`, `C:\path\to\file`, `new Foo\Bar()`, PHP code) and retrieve it exactly as entered, without manually escaping the slashes.

#### 07.1.2 — Proxy File and MU Plugin Directory Structure <Badge type="tip" text="Done" />
> **Goal:** Move the `r7-api-term-meta` plugin code into a subdirectory, leaving only a proxy file with the plugin header and `require_once` in the `mu-plugins` root. No shared loader is used—one MU plugin equals one proxy file. After implementation, the plugin works exactly as before, while the code lives in a subdirectory and the admin panel displays a proper name.

#### 07.2 — Sprint 2: Template Integration—Configuration, “Template” Field, Conditional Field Display, `template_include` <Badge type="tip" text="Done" />
> **Goal:** Add a category template selection mechanism and conditional meta-field display in child categories to the plugin. One template displays all category content on one page. The second dropdown option is a “no-op”: it does not change category rendering but activates meta fields in its child categories.

#### 09 — Script for Bulk-Populating Excerpts From the First Article Section <Badge type="tip" text="Done" />
> **Goal:** Create a standalone PHP script that loads WordPress, reads a list of post IDs from `posts.txt`, parses each article’s HTML through the DOM, extracts the first section immediately after the first heading, and saves it to `post_excerpt`, creating a revision without changing the original `post_content`.

#### 10 — Category Template Architecture for `r7-api-term-meta` <Badge type="tip" text="Done" />
> **Goal:** Migrate the `r7-api-term-meta` MU plugin’s category templates from a flat `templates/<file>.php` structure to a file architecture with a separate directory for each template, so styles, images, and other assets can be stored alongside `index.php`.

#### 11 — `category-api-index` Template: Two-Section Architecture <Badge type="tip" text="Done" />
> **Goal:** Implement a complete `category-api-index` template with two visually and logically separate sections: 1) **“Getting Started”**—flat output of guide categories; 2) **“API Classes”**—vertical accordions containing term meta, posts, and a code example.

#### 12 — Remove `parent_field_map` and JavaScript Field Switching <Badge type="tip" text="Done" />
> **Goal:** Remove the client-side logic from `r7-api-term-meta` that builds a map of all categories through `get_terms()` on every admin-form render, and make PHP the sole source of truth when term meta is saved.

#### 13 — Anchor Links in the API Class Accordion <Badge type="tip" text="Done" />
> **Goal:** Make anchor links in the “API Classes” section stable and predictable: the anchor (`id`) is attached to the accordion heading; the button next to the heading only copies the link; following `#hash` opens the accordion and displays its entire header below the fixed header.

#### 20 — Remove Child-Theme Integration Logic <Badge type="tip" text="Done" />
> **Goal:** Clean obsolete WordPress child-theme dependencies from the project code and move all autonomy into the MU plugin / currently active theme.

#### 21 — Cache Static MU Plugin Configurations <Badge type="tip" text="Done" />
> **Goal:** Eliminate repeated construction of static configuration arrays in `r7_api_term_meta_get_fields()` and `r7_api_term_meta_get_templates()` so the MU plugin does not create the same structures on every call within a single request.

#### 24 — Refactor API Accordion Anchor Navigation <Badge type="tip" text="Done" />
> **Goal:** Eliminate browser-navigation issues and height shifts (CLS): introduce a synchronous micro-script before accordion rendering, adjust `scroll-margin-top` to account for the WordPress admin bar, and standardize JavaScript scrolling to the heading.

#### 25 — Move the `r7-api-term-meta` MU Plugin Into the Theme <Badge type="tip" text="Done" />
> **Goal:** Move all `r7-api-term-meta` MU plugin functionality into the `r7-child` theme so category templates reside alongside the theme’s other templates, CSS/JavaScript is loaded through the theme, and existing behavior and term meta data are preserved without migrating values.

#### 26 — Adapt API Template Accordions for the Dark Theme <Badge type="tip" text="Done" />
> **Goal:** Make the `api-index` accordions visually consistent with the website’s dark theme, using the collapsed left sidebar palette as the primary reference and separately designing colors for closed, hover/focus, and expanded states.

#### 27 — “Edit Category” Button in API Class Accordions <Badge type="tip" text="Done" />
> **Goal:** Add a pencil button beside `r7-api-class__accordion-icon` (the chevron arrow on the right side of the summary) for quick navigation to the category editing page in wp-admin. The button must be visible only to users with the `manage_categories` capability.

#### 28 — Turn Selected Sidebar Parent Categories Into Direct Links <Badge type="tip" text="Done" />
> **Goal:** For specified parent-category slugs in the `r7` sidebar, output a regular `<a href="...">` link instead of an expandable `<span>`, and hide those parents’ child categories. The list of such categories is configured through configuration.

#### 29 — Remove the Global `$r7_sidenav_flat_parent_slugs` Variable <Badge type="tip" text="Done" />
> **Goal:** Replace the global `$r7_sidenav_flat_parent_slugs` variable with the `R7_SIDENAV_FLAT_PARENT_SLUGS` constant and the `r7_sidenav_flat_parent_slugs` filter hook for flexible configuration without polluting the global scope.

#### 30 — Verify the `api_presentation` Slug <Badge type="tip" text="Done" />
> **Goal:** Check the `api_presentation` category slug in the WordPress database and standardize it to the hyphenated convention (`api-presentation`), with correct handling in the theme code.

#### 31 — Handle `WP_Error` From `get_term_link()` <Badge type="tip" text="Done" />
> **Goal:** Add an `is_wp_error()` check when calling `get_term_link()` in taxonomy menus, preventing invalid URL generation and fatal failures when term-link retrieval fails.

#### 32 — Simplify the `$flat_parent_slugs` Defensive Check <Badge type="tip" text="Done" />
> **Goal:** Simplify defensive type casting of the `$flat_parent_slugs` filter to the compact `(array) ($r7_sidenav_flat_parent_slugs ?? [])` call.

#### 33 — Rename the `$has_children_raw` Variable <Badge type="tip" text="Done" />
> **Goal:** Rename `$has_children_raw` to `$has_children_in_db` to describe its meaning more precisely (whether subcategories exist in the database versus whether they are displayed in the menu).

#### 34 — Cache `$flat_parent_slugs` Between Recursions With `static` <Badge type="tip" text="Done" />
> **Goal:** Use `static $flat_parent_slugs = null;` with lazy initialization at the start of `r7_build_categories_menu()` so the filter is not called repeatedly at every recursion level.

#### 35 — Hide a Class Accordion if It Has No Method Articles <Badge type="tip" text="Done" />
> **Goal:** In the `api-index` template, a class category accordion is currently rendered even when it contains no method posts. Add a condition so the `<details>` accordion is output only when `$method_posts` is not empty. Adjust calculation of the `$has_api_classes` flag.

---

### <SolarIcon name="magnifier" /> 2. Code Review Tasks (`.tasks/done/review-15-05/done/`)

#### R-01 — Add a Nonce Check to `r7_api_term_meta_save` <Badge type="info" text="Code Review" />
> **Goal:** Protect term meta saving from programmatic `wp_update_term()` calls containing stale data in `$_POST`. Without a nonce check, the function can overwrite category metadata when any code calls `wp_update_term()` while fields from a previous form happen to remain in `$_POST`.

#### R-02 — Verify the `getting_started` Slug Convention <Badge type="info" text="Code Review" />
> **Goal:** Ensure the “Getting Started” section filter works correctly with slugs created both through code and the WordPress interface. The filter currently checks the `getting_started` prefix (with an underscore), but WordPress generates hyphenated slugs (`getting-started`) when created through the UI, which can cause the section to disappear.

#### R-03 — Move the Inline Accordion Filter Script to `accordion.js` <Badge type="info" text="Code Review" />
> **Goal:** Remove inline JavaScript from the PHP template and move the accordion-filtering logic into the existing `assets/js/accordion.js` file. The inline script reduces CSP compatibility, cannot be cached independently by the browser, and complicates template maintenance.

#### R-04 — Remove Inline `onclick` From the Category Edit Button <Badge type="info" text="Code Review" />
> **Goal:** Remove the inline `onclick="event.stopPropagation();"` handler from the category edit button and move this logic to `accordion.js` using event delegation. Inline handlers reduce CSP compatibility and violate separation of markup and behavior.

#### R-05 — Limit `posts_per_page` in the Query Factory <Badge type="info" text="Code Review" />
> **Goal:** Replace `'posts_per_page' => -1` with `'posts_per_page' => 200` in the `$get_category_posts_query` factory to protect the template from explosive category growth. With `-1`, WordPress retrieves all posts without limits, causing a sharp rise in memory consumption and page-generation time when a category grows beyond 500 posts.

#### R-06 — Remove Redundant `wp_kses_post` From the Class Description <Badge type="info" text="Code Review" />
> **Goal:** Simplify the API class description escaping chain. It currently uses the triple wrapper `wp_kses_post( wpautop( esc_html( $class_description ) ) )`, but `api_class_description` is a plain-text field passed through `sanitize_textarea_field` when saved.

#### R-07 — Combine N `WP_Query` Calls Into One for API Classes <Badge type="info" text="Code Review" />
> **Goal:** Replace the loop containing N separate `WP_Query` calls (one per child term) with one shared query grouped in PHP. With 50+ terms, the number of SQL queries grows linearly and puts pressure on the database.

#### R-08 — Split the `api-index` Template Into `template-parts` <Badge type="info" text="Code Review" />
> **Goal:** Decompose the monolithic `index.php` (~700 lines) into a coordinator and a set of isolated files. Helpers, data preparation, and markup are currently mixed in one file, complicating navigation, review, and targeted edits.

---

### <SolarIcon name="danger" /> 3. Cancelled / Architecturally Reconsidered Tasks (`.tasks/cancelled/`)

#### C-06 — MU Plugin: Limit Field Display to the Required Category Branches <Badge type="warning" text="Cancelled" />
> **Goal:** *(Architecturally reconsidered)* Modify the existing `mu-plugin` so term meta fields are shown not for all `category` taxonomy terms, but only for subcategories within three specific root sections (`api_presentation`, `api-text-document`, `api-tables`).

#### C-07.1 — Loader and MU Plugin Directory Structure <Badge type="warning" text="Cancelled" />
> **Goal:** *(Replaced with 07.1.2 proxy files)* Create a shared loader for MU plugins in subdirectories and move `r7-api-term-meta` into a subdirectory through a single `mu-plugins-loader.php`.

#### C-08 — Protect Category Term Meta Fields From Silent Overwriting With Empty Values <Badge type="warning" text="Cancelled" />
> **Goal:** *(Cancelled)* Fix the category term meta save logic so existing values are not overwritten with an empty string if the corresponding field is absent from `POST` when the form is saved.

#### C-14 — Smooth Animation for API Class Accordions <Badge type="warning" text="Cancelled" />
> **Goal:** *(Cancelled)* Make the opening/closing animation of accordions in the “API Classes” section smoothly reveal the height using JavaScript `scrollHeight`.

#### C-22 — Cache the Child Category List for `category-api-index` <Badge type="warning" text="Cancelled" />
> **Goal:** *(Cancelled)* Extract child-category list loading into separate cacheable logic using WordPress transients.

---

### <SolarIcon name="pin" /> 4. Planned Backlog (`.tasks/later/`)

#### L-23 — Split the MU Plugin’s `plugin.php` by Responsibility <Badge type="warning" text="Later" />
> **Goal:** Reduce the size and coupling of `mu-plugins/r7-api-term-meta/plugin.php` by splitting code according to loading context: bootstrap, shared helper functions, admin, and frontend.

:::

---

## <SolarIcon name="chart" /> Final Results

::: tip <SolarIcon name="trophy" /> Production Release and Project Status
The update was successfully deployed to production (**support.r7-office.ru**), all functionality was verified, and the system operates normally with no service downtime.
:::

### Category Page Template

An automatic template integration system was implemented: the “Template” selector in category settings determines which PHP template is used on the frontend and which meta fields are available to child categories.

#### `category-api-index` Template

**Two-section structure**
- The first section, “Getting Started,” displays articles from the introductory section (`getting_started`) as a list of link cards.
- The second section, “API Classes,” displays a list of classes with accordions.

**API class accordions**
Each class expands into an accordion that displays:
- the class category name and its metadata (constructor, description, characteristics, code example);
- a method list—articles from the child category, with a title and short description.

**Anchor navigation**
When a URL containing `#hash` is opened, the required accordion opens automatically and the page scrolls to it while accounting for the fixed header height. The button next to the heading copies the anchor link to the clipboard.

**Quick editing**
A pencil button was added to each accordion heading for administrators, providing a direct link to the category edit page in wp-admin. It does not affect accordion behavior.

**Dark theme**
The accordion visual style was fully adapted to the website’s dark appearance (the `.page--theme-dark` class).

**Modular structure**
The template was split into separate `template-parts`, and JavaScript was moved to the external `accordion.js` file.

---

### Category Meta Fields

Custom fields with flexible display configuration were added to API class categories: fields can be plain text or use the complete WordPress visual editor (TinyMCE).

- Backslashes (`\n`, `C:\path`, PHP code) are saved correctly—the systemic issue caused by a second `wp_unslash()` inside WordPress was eliminated.
- Security: nonce tokens are verified when category metadata is saved.

---

### Sidebar

An option was added to render selected parent categories in the sidebar as direct links instead of expandable lists. The list of these categories is managed through configuration without changing the menu’s JavaScript or CSS.

---

### Optimization and Resilience

| Improvement | Result |
|---|---|
| Combining SQL queries | Multiple `WP_Query` calls for individual classes were replaced with one shared query, significantly reducing database load when the API index is loaded |
| Configuration caching | Static settings and flat slugs are cached through `static` variables, eliminating repeated calculations during recursion |
| Error handling | A `WP_Error` check was added when retrieving category links through `get_term_link()` |
| Memory control | The maximum number of posts (`posts_per_page`) in the query factory was limited |
| Clean frontend | The accordion script was moved entirely to the external `accordion.js` file |

---

### Content Administration

- **1,656 method articles** — short excerpts (`excerpt`) were added and displayed by the template as method descriptions.
- **107 reference articles** — hidden from public display.
- **107 Document Builder API categories** — data was migrated from the standard “Description” field to separate custom meta fields.
