---
title: "Documentation QA: R7 Spreadsheet Editor"
description: "An audit of 89 help articles: reproducible instructions, factual and language errors, an application issue and 30 restored redirects."
outline: [2, 3]
pageClass: project-case editing-case table-audit-case
---

<script setup>
import AuditReport from "./.vitepress/theme/components/AuditReport.vue"
</script>

# Testing the Spreadsheet Editor documentation

<div class="case-tech-badges"><Badge type="tip" text="Documentation QA" /> <Badge type="info" text="Technical editing" /> <Badge type="info" text="R7 Office" /></div>

I reviewed the Spreadsheet Editor help for accuracy and usability: explanations, user actions, interface labels, illustrations and language. The audit covered 89 unique articles across 14 topic groups; scenario checks also identified discrepancies with application behaviour.

<div class="editing-stats" aria-label="Scope of work"><div><strong>89</strong><span>unique articles in the report</span></div><div><strong>14</strong><span>topic groups</span></div><div><strong>30</strong><span>restored redirects</span></div></div>

::: info <SolarIcon name="clipboard" /> Case at a glance

| Parameter | Description |
|---|---|
| **Role** | Documentation testing, scenario reproduction, technical editing and navigation review |
| **Product** | R7 Office Spreadsheet Editor |
| **Material** | User help covering functions, charts, objects, protection, settings and other operations |
| **Reported scope** | 89 unique articles; repeated entries for four articles are counted once |
| **Application checks** | Including macro assignment and shape connectors; connector checks describe desktop and corporate online versions |
| **Navigation** | 30 missing redirects from legacy articles and categories |
| **Result** | [Spreadsheet Editor help section, in Russian](https://support.r7-office.ru/desktop-editors/table-editor/) |

:::

## <SolarIcon name="pin" /> The question: can a reader follow the procedure?

Help should lead to a specific result. The wrong mouse button, a missing modifier key or an incorrect action sequence can block a user even when the sentence is grammatically correct. An inaccurate calculation or parameter description can also lead to a wrong understanding of the outcome.

I reviewed subject-matter accuracy, interface correspondence, action sequences, completeness, illustrations and editorial quality. As the help structure changed, I also checked how legacy articles led to the new material.

## <SolarIcon name="compass" /> Review process

| Stage | Checked | Recorded |
|---|---|---|
| **Content** | Functions, formats, properties and parameter meanings | The factual error and its corrected explanation |
| **Actions** | Mouse buttons, modifier keys, operation order and object selection | A corrected sequence or a discrepancy with the application |
| **Interface** | Button, tab and command labels; setting locations | Exact labels and availability conditions |
| **Language and formatting** | Grammar, punctuation, repetition, terminology and nested lists | Before-and-after excerpts with an explanation |
| **Illustrations** | Screenshot placement and correspondence with the text | Missing or misplaced illustrations |
| **Navigation** | Mapping legacy articles and categories to the new structure | Missing redirects and appropriate destinations |

Articles without identified issues received an explicit “no errors found” outcome. The record therefore includes both articles needing changes and reviewed material without findings.

## <SolarIcon name="layers" /> Scope and coverage

The report covers the topic groups below. Groups follow the article subjects; totals count each distinct article once.

| Topic group | Articles | Articles without findings |
|---|---:|---:|
| General reference | 4 | 0 |
| Collaboration and protection | 5 | 0 |
| Functions | 7 | 1 |
| Pivot charts | 9 | 2 |
| Charts | 9 | 2 |
| Images | 10 | 2 |
| Embedded files | 8 | 0 |
| Pivot tables | 5 | 0 |
| Equations | 6 | 2 |
| Slicers | 4 | 1 |
| Data operations | 3 | 0 |
| Shapes | 7 | 2 |
| Form controls | 5 | 1 |
| Tools and settings | 7 | 0 |
| **Total** | **89** | **13** |

Findings were recorded for 76 articles. A finding can cover several similar edits, so the article count is distinct from the number of individual errors.

## <SolarIcon name="test" /> Scenarios checked in the editor

### Assigning a macro to a button control

The guide claimed that macro assignment happened automatically. This behaviour could not be confirmed during the check. The action order was also incorrect: the macro had to be created before it could be selected from the list.

::: warning <SolarIcon name="danger" /> A discrepancy with the instructions

Correcting the Russian grammar did not resolve the main issue: automatic assignment and the documented sequence were not confirmed during testing.

:::

::: tip <SolarIcon name="lightbulb" /> The resulting revision

I prepared a second version based on the editor’s observed behaviour and retained the original for comparison. In the revised procedure, creating the macro comes before selecting and assigning it.

:::

### Connectors between shapes

Reproducing the procedure exposed a connection-point problem. In desktop version **2026.2.2.2683**, points either did not appear or appeared outside the shape outline. In the corporate online version they also appeared outside the outline. The documented operation could not be completed.

The problem was recorded as a suspected application defect and submitted through ServiceDesk. The report distinguishes the behaviour of the two versions. It does not establish that the application was fixed; the documented outcome is discovery and escalation.

### Selecting and deleting a form control

“Select it” was replaced with a specific action: hold **Ctrl** and left-click the control. The guide also gained deletion with **Delete** after selection by right-click. The revised description covers both object selection and the available deletion methods.

## <SolarIcon name="magnifier" /> Factual and procedural errors: examples

The excerpts below come from the audit report in Russian. Each explanation describes how the change affects the operation or the reader’s understanding.

### 01. A four-month quarter

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>четыре месяца составляют квартал</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>три месяца составляют один квартал</p></blockquote></div>
</div>
The data-grouping article defined the period incorrectly. This affects how readers understand date grouping: a clear sentence also needs to describe the right time interval.

### 02. What “Count” actually counts

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>Подсчитывается количество нечисловых ячеек</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>Подсчитывается количество непустых ячеек</p></blockquote></div>
</div>
The pivot-table operation confused non-numeric cells with non-empty cells. A separate article clarified that СЧЁТ (COUNT) counts numeric cells. The review preserved this contextual distinction rather than applying one explanation everywhere.

### 03. An inverted opacity scale

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>0% — непрозрачное изображение, 100% — изображение максимально прозрачное</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>0% — полностью прозрачное изображение, 100% — полностью непрозрачное изображение</p></blockquote></div>
</div>
Both endpoints described the opposite result. Correcting the meaning of the parameter lets readers connect a slider value with the expected appearance of an image.

### 04. Left-click instead of right-click

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>Для этого нажмите левой кнопкой мыши внутри области построения</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>Для этого нажмите правой кнопкой мыши внутри области построения</p></blockquote></div>
</div>
The chart-settings instruction named the wrong mouse button. That can block the procedure because the required menu does not open. The corrected action is reproducible.

### 05. SXC confused with XSC

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>Файл XSC представляет собой файл данных, связанный с изображениями давления программного обеспечения Xsensor</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>Формат электронных таблиц, созданных в OpenOffice.org Calc и StarOffice Calc (на основе XML)</p></blockquote></div>
</div>
The SXC format table contained a description of an unrelated XSC format. The sentence looked complete but described a different kind of data. The audit checked the correspondence between the extension and its description.

### 06. Upload date and creation date are different

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>Загружена — дата создания файла</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>Загружена — дата и время загрузки файла</p></blockquote></div>
</div>
The property name and its explanation did not match. The correction helps readers interpret file information without confusing an upload timestamp with a creation date.

### 07. A leftover from another object’s guide

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>без изменения размера среза</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>без изменения размера объекта</p></blockquote></div>
</div>
An embedded-file article retained “slicer” from another context. Similar substitutions appeared in macro instructions: “shape” instead of “chart.” The review checked whether each description referred to the object being edited.

### 08. A click is not enough: drag to create the shape

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>добавьте её левой кнопкой мыши</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>нажмите и удерживайте левую кнопку мыши, растяните фигуру до необходимого размера и отпустите кнопку мыши</p></blockquote></div>
</div>
The short sentence omitted holding the button, dragging and releasing it. Combined with the corrected “Shape” button label, the edit turns a vague description into an actionable sequence.

## <SolarIcon name="notes" /> Language, interface labels and completeness

Editorial work accompanied the factual review: case agreement, typos, punctuation, heavy constructions and repetition. Repeated terms were standardized, and command names were aligned with interface labels.

| Issue | Example | Purpose |
|---|---|---|
| **Grammar** | «Для выбора диапазон ячеек» / «Для выбора диапазона ячеек» | Correct the instruction’s Russian case agreement |
| **Typos** | «черырёхнаправленной» / «четырёхнаправленной» | Make the cursor description readable |
| **Repetition** | “Apply to apply changes” / “Apply to save changes” | Remove redundant wording |
| **Terminology** | Mac OS / macOS; “number” instead of “identifier” in numeric grouping | Name the platform and data type precisely |
| **Interface commands** | «Вставить автофигуру» / «Фигура» | Help readers find the actual button |
| **Availability conditions** | “Visible area” moves into “More” in a narrow window | Explain why a control may not be visible |
| **Missing explanations** | Added a description of the page-layout view | Complete the description of viewing modes |

List structure also needed attention: asterisks used as markers, omitted items and lost nesting made it difficult to distinguish settings from their options. Russian «ё», abbreviations, capitalization and label formatting were standardized.

## <SolarIcon name="gallery" /> Illustrations and symbols

A chart-settings article gained an image illustrating the cursor shape. The screenshot of an editor-settings button was placed more precisely so it corresponded to the relevant instruction item.

A symbol table was rebuilt with real text characters instead of images. The symbols were checked and identified errors corrected. The resulting table is easier to read and copy, and its content no longer depends on separate pictures.

## <SolarIcon name="link" /> Help migration: 30 restored redirects

Under the new help structure, a legacy article did not always map to one replacement. I mapped the subjects and restored **26 article redirects and 4 legacy-category redirects**.

| Legacy material | Redirect destination | Reason |
|---|---|---|
| **Creating or opening a spreadsheet** | File operations section | One old guide became two separate instructions |
| **Inserting images** | Images section | The subject now spans ten articles |
| **Inserting and formatting shapes** | Shapes section | One broad article became seven instructions |
| **Spreadsheet protection overview** | Collaboration and protection section | The overview covers several protection methods |
| **Legacy operations and protection categories** | Their corresponding new sections | Preserve entry points after the structure changes |

The destination followed the subject of the legacy link: a focused instruction could lead to an article, while material split across several topics could lead to the relevant section.

## <SolarIcon name="chart" /> Outcomes

| Outcome | Evidence in the report |
|---|---|
| **Article-by-article review** | 89 unique materials across 14 topic groups |
| **Recorded findings** | 76 articles with language, factual, procedural or formatting issues |
| **Articles without findings** | 13 articles explicitly recorded as having no identified errors |
| **Behaviour checks** | Revised macro-assignment sequence; connector issue submitted through ServiceDesk |
| **Navigation restoration** | 30 missing redirects: 26 from articles and 4 from legacy categories |
| **Illustrations and tables** | Screenshot clarifications, checked symbols and text characters replacing raster symbols |

The case combines documentation testing and technical editing: subject-matter review, scenario reproduction, wording revisions and knowledge-base navigation. The output is a concrete record of edits and discrepancies for documentation updates and product follow-up.

## <SolarIcon name="clipboard" /> Reviewed article register

The complete report contains 93 entries covering 89 unique articles: every finding, original and revised wording, testing notes and 30 redirects. Four repeated entries are retained in a separate section.

The original report is presented in Russian, with its wording preserved. Draft references and the internal ticket URL are replaced with descriptions.

<AuditReport locale="en" />

<div class="editing-result"><SolarIcon name="document" :size="28" /><div><strong>R7 Office Spreadsheet Editor help</strong><p>User guides covering operations, functions, settings and objects. Published in Russian.</p><a href="https://support.r7-office.ru/desktop-editors/table-editor/" target="_blank" rel="noreferrer">Open the help section <SolarIcon name="arrow-right" /></a></div></div>
