# R7 Office: Styling and Automatic Numbering of Image Captions <Badge type="tip" text="WordPress" /> <Badge type="warning" text="CSS Counters" /> <Badge type="info" text="Typography" />

![Example of image caption styling and numbering — R7 Support Center](/images/r7-image-captions-preview.png)

::: info <SolarIcon name="clipboard" /> Project Card

| | |
|---|---|
| **Stack** | WordPress, CSS3 (CSS Counters), HTML5, BEM |
| **Role** | Frontend Developer |
| **Target blocks** | `.wysiwyg-result figcaption`, `.faq-item__answer .wp-caption-text` |
| **Website** | <SolarIcon name="link" /> [R7 Support Center](https://support.r7-office.ru/) |
| **Result** | Automatic continuous “Figure N:” numbering with no JavaScript or database overhead |

:::

---

## <SolarIcon name="pin" /> Project Overview and Technical Specification

### Problem Description

In [R7 Support Center](https://support.r7-office.ru/) articles and FAQ entries, illustration captions were inconsistent. In some articles, authors manually wrote `Figure 1. ...`; in others, `Fig. 1: ...`; while in still others captions blended into the main text because no explicit CSS styles were defined.

When editing or deleting an image in the middle of an article, authors had to **manually renumber every subsequent figure**.

### Technical Requirements (Technical Specification)

### Comparison of the Implementation Options Considered

Before the final solution was selected, three architectural approaches to automating numbering were technically evaluated (`image-captions-proposal.txt`):

| Approach | Mechanism | Advantages | Disadvantages | Verdict |
|---|---|---|---|:---:|
| **1. Regex-based PHP filter** | `the_content` hook, search for `<figcaption>` via regex, and number substitution | • The number is visible to search engines (SEO)<br>• Works the same way in articles and FAQ entries | • Regex is fragile across WP updates<br>• CPU overhead from parsing text on every request<br>• Risk of duplicating manually entered text | ❌ Rejected |
| **2. PHP filter with DOM parsing** | `the_content` hook + `DOMDocument` / `Dom\HTMLDocument` (PHP 8.4+) | • Reliable handling of the HTML tree<br>• The number is embedded in the source | • On PHP <=8.3, handling UTF-8/Cyrillic is complex<br>• Depends on the server’s PHP version<br>• Slower than regex | ❌ Rejected |
| **3. CSS Counters** | `counter-reset`, `counter-increment`, and `::before` pseudo-elements | • **0 KB JS, 0 ms CPU execution**<br>• 0 database or PHP changes<br>• Easy maintenance and resettable scope | • The number exists only in the browser’s visual rendering | ✅ **Selected** |

::: details <SolarIcon name="clipboard" /> View the Detailed Rationale and Comparison from `image-captions-proposal.txt`

#### Approach 1 — PHP Filter With Regular Expressions
When an image with a caption is inserted, WordPress generates markup containing a `<figcaption class="wp-caption-text">` tag. A filter on the `the_content` hook runs a regular expression over the HTML and inserts “Fig. N:”.
* **Advantages:** The number is embedded in the HTML and visible to search engines.
* **Disadvantages:** An extra attribute or space in the tag can break the match after a WordPress update; PHP reparses the entire article content on every request; manually entered “Fig. 1:” text must be handled to avoid duplication.

#### Approach 2 — PHP Filter With DOM Parsing
The same `the_content` hook is used, but instead of a regular expression the HTML is loaded into a PHP parser object (on PHP >= 8.4, `Dom\HTMLDocument`; on PHP <= 8.3, `DOMDocument`).
* **Advantages:** More reliable parsing of the tag structure.
* **Disadvantages:** On PHP <= 8.3, the classic `DOMDocument` requires encoding workarounds (`mb_convert_encoding`) and parses HTML5 incorrectly; it is slower than regex; it requires checking the PHP version on the server.

#### Approach 3 — CSS Counters — Selected Option
The browser counts elements on the page using built-in CSS mechanisms via `counter-reset` / `counter-increment`. The `::before` pseudo-element inserts “Figure N:” automatically during rendering.
* **Advantages:** Zero server overhead; does not touch PHP, templates, or the database; easy caption format changes (“Figure” → “Fig.”); works for new and existing articles with no modifications.
* **Disadvantages:** The number exists only in the browser’s visual rendering.
:::

---

## <SolarIcon name="clipboard" /> Complete Task List

| No. | Task | Description | Status |
|:---:|---|---|:---:|
| 03 | **Research caption CSS wrappers** | An attempt to style base tags, cancelled in favor of CSS Counters | ↩️ |
| 03-1 | **CSS Counters caption architecture** | Prepare the `image-captions-css-counters` technical configuration | ✅ |
| 03-1.1 | **Initialize and reset counters** | Add `counter-reset: r7-figure-counter` to root containers | ✅ |
| 03-1.2 | **Generate prefixes via `::before`** | Dynamic text `"Рисунок " counter(...) ": "` | ✅ |
| 03-1.3 | **Responsiveness and accessibility** | Mobile display and `@media (prefers-reduced-motion)` | ✅ |
| 03-1.4 | **Content standards guide** | A caption-standardization guideline document for authors | ✅ |

---

## <SolarIcon name="lightbulb" /> Most Complex Task Example: Task 03-1 — Implementing Automatic Numbering With CSS Counters

::: details <SolarIcon name="clipboard" /> View the Full Technical Specification and Implementation for Task 03-1

### Pure CSS3 Caption Solution

CSS Counters make it possible to number DOM elements without a single line of JavaScript.

#### Implementation Source Code in `themes/r7/assets/stylesheets/common.css`:

```css
/* ===== 1. Initialize and reset the figure counter ===== */
.wysiwyg-result,
.faq-item__answer {
    counter-reset: r7-figure-counter; /* Reset the counter at the start of each article/question */
}

/* ===== 2. Increment the counter for each caption ===== */
.wysiwyg-result figure,
.wysiwyg-result .wp-caption,
.faq-item__answer figure,
.faq-item__answer .wp-caption {
    counter-increment: r7-figure-counter;
}

/* ===== 3. Style and output the "Figure N:" prefix ===== */
.wysiwyg-result figcaption,
.wysiwyg-result .wp-caption-text,
.faq-item__answer figcaption,
.faq-item__answer .wp-caption-text {
    margin-top: calc(12 / 16 * 1rem);
    font-size: calc(14 / 16 * 1rem);
    line-height: 1.4;
    color: var(--ne-lght-600, #8b929b);
    text-align: center;
}

/* Automatically insert the "Figure N: " prefix */
.wysiwyg-result figcaption::before,
.wysiwyg-result .wp-caption-text::before,
.faq-item__answer figcaption::before,
.faq-item__answer .wp-caption-text::before {
    content: "Рисунок " counter(r7-figure-counter) ": "; /* [!code ++] */
    font-weight: 600;
    color: var(--ne-lght-800, #4b5563);
}
```

:::

---

## <SolarIcon name="bolt" /> Technical Solutions and Key Challenges

### Challenge 1: Preventing False Numbering of Empty Elements

::: warning Problem
If an empty `<figcaption></figcaption>` tag was accidentally left in the editor, the CSS Counter still incremented the counter, throwing off the numbering of subsequent real illustrations.
:::

::: tip <SolarIcon name="lightbulb" /> Solution: `:not(:empty)` Selectors
The prefix pseudo-element is applied only when the caption container contains actual text:

```css
/* Number only captions that contain text */
.wysiwyg-result figcaption:not(:empty)::before,
.faq-item__answer figcaption:not(:empty)::before {
    content: "Рисунок " counter(r7-figure-counter) ": ";
}
```
:::

### Challenge 2: Authors Manually Entering the Prefix

::: warning Problem
If a content manager habitually entered `Figure 1: Main window` in the admin panel, the result was duplicated text: `Figure 1: Figure 1: Main window`.
:::

::: tip <SolarIcon name="lightbulb" /> Solution: Author Guidelines
A content standards guide was prepared, instructing authors to enter only plain descriptive text in the caption field. The prefix is added automatically on the frontend.
:::

---

## <SolarIcon name="chart" /> Final Results

::: tip <SolarIcon name="trophy" /> Project Achievements
| Metric / Option | Before Implementation | After Implementation |
|---|---|---|
| **JavaScript / CPU overhead** | Manual markup or JavaScript required | **0 KB JS, 0 ms CPU execution** |
| **Caption consistency** | Inconsistent fonts and colors | **100% unified standard (14px, #8b929b)** |
| **Automatic numbering** | Manually entered by authors | **Automatic “Figure N:” prefix via CSS Counters** |
:::
