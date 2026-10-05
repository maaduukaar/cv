---
title: "Technical editing: R7 Disk SSO guide"
description: "Technical editing case study: grammar, style, terminology, instruction structure and WordPress preparation for a guide with 31 screenshots."
outline: [2, 3]
pageClass: project-case editing-case
---

# From an engineer’s draft to a usable guide

<div class="case-tech-badges"><Badge type="tip" text="Technical editing" /> <Badge type="info" text="SSO · Keycloak · LDAP" /> <Badge type="info" text="Confluence / WordPress" /></div>

An SSO configuration guide for R7 Disk, Keycloak and ALD Pro LDAP user synchronization. I edited the language, clarified instructions and prepared the material for a knowledge base—from button names to screenshot captions and publication markup.

<div class="editing-stats" aria-label="Material scope"><div><strong>31</strong><span>screenshots with captions and alt text</span></div><div><strong>9</strong><span>headings in a consistent hierarchy</span></div><div><strong>6</strong><span>preserved code blocks</span></div></div>

::: info <SolarIcon name="clipboard" /> Case at a glance

| Parameter | Description |
|---|---|
| **Role** | Technical editing and publication preparation |
| **Audience** | Administrators configuring single sign-on |
| **Material** | R7 Disk, Keycloak IdP and ALD Pro LDAP integration guide |
| **Editorial scope** | Grammar, spelling, punctuation, style, terminology and instruction logic |
| **Publication format** | WordPress HTML, screenshot captions, code blocks and notes |
| **Result** | [Read the published guide in Russian](https://support.r7-office.ru/corporate-server2024/settings_cs-r7disk/nastrojka-sso-dlya-r7-disk-korporativnyj-server-2024-cherez-keycloak-idp-s-sinhronizatsiej-polzovatelej-iz-ald-pro-ldap/) |

:::

## <SolarIcon name="pin" /> Brief and starting point

The source contained the configuration sequence, commands and screenshots, but needed editorial preparation. It mixed “we open,” “enter” and “we can create”; included misspelled UI labels, case errors, colloquial expressions and vague conditions for proceeding. The Confluence export also carried platform-specific markup and uncaptioned images.

The goal was to make the procedure easier to follow: help readers find the right field, understand when to proceed and distinguish an explanation from an instruction. This required work on both language and document structure.

## <SolarIcon name="clipboard" /> Editorial work

| Area | Changes |
|---|---|
| **Grammar and spelling** | Case agreement, typos, word formation and compound words |
| **Punctuation** | Split overloaded sentences; clarify explanations and lists |
| **Style** | Remove filler, colloquialisms and redundant repetitions |
| **Terminology** | Consistent entity names and exact button, field and attribute labels |
| **Instruction logic** | Clarify conditions, references and action sequences |
| **Structure** | Heading hierarchy, numbering and separate notes |
| **Illustrations** | Captions, alt text and full-size image links for 31 screenshots |
| **Publication** | Remove Confluence markup, format code and replace a deployment address in an example |

## <SolarIcon name="magnifier" /> Before and after: real examples

The article was edited in Russian. The excerpts below retain the wording of both versions; HTML formatting is removed and non-breaking spaces are normalized. Each explanation describes the editorial change in English.

### 01. A button typo: Sing In / Sign In

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>Введите логин и пароль учетной записи в ALD Pro и нажмите кнопку &quot;Sing In&quot;.</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>Введите логин и пароль учётной записи ALD Pro и нажмите кнопку Sign In:</p></blockquote></div>
</div>

The button label is corrected: `Sing` and `Sign` are different words. Exact UI labels help readers locate the right control. The sentence also loses an unnecessary preposition, uses «ё» in «учётной» and identifies the button through bold formatting.

### 02. An attribute name: Tittle / title

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>Можем создать новые соответствия, что будем тянуть из ALD Pro в Keycloak (IdP), например атрибут должность Tittle</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>При необходимости можно создать новые соответствия для передачи данных из ALD Pro в Keycloak (IdP), например атрибут должности title (в LDAP он также называется title, укажите его в поле LDAP Attribute):</p></blockquote></div>
</div>

The edit corrects the attribute spelling and Russian case agreement. The colloquial «что будем тянуть» becomes an explicit description of data transfer. Two adjacent explanations are combined so the attribute and its destination field appear in one instruction—useful when readers copy identifiers into configuration.

### 03. Exact field and button names

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>заполняем поля как на скриншоте, в conntction url укажите адрес вашего домен контроллера, и нажмите кнопку тест соединения</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>Заполните поля, как на скриншоте. В поле Connection URL укажите адрес вашего домен-контроллера и нажмите кнопку Test connection:</p></blockquote></div>
</div>

The edit restores `Connection URL` and `Test connection`, splits the run-on sentence and fixes punctuation and the hyphen in «домен-контроллера». It also removes the switch between “we fill in” and “enter”: the entire step addresses the reader consistently.

### 04. Grammar in headings and steps

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>1.2 Настройка Корпоративный сервер 2024 (SP)</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>1.2. Настройка Корпоративного сервера 2024 (SP)</p></blockquote></div>
</div>

«Настройка» requires the genitive case in Russian: «Корпоративного сервера». Section numbering gains a final dot. Another step changes «Или удаляем не нужные.» to «Либо удалите ненужные.»—correcting the adjective spelling and adopting the instruction’s imperative voice.

### 05. Punctuation and the tone of a warning

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>В интерфейсе Keycloak (IdP) под учетной записью администратора создайте свой Realm и дайте ему имя, НЕ используйте Realm &quot;master&quot; , он используется для управления другими Realm.</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>В интерфейсе Keycloak (IdP) под учётной записью администратора создайте Realm и задайте ему имя. Не используйте Realm «master»: он предназначен для управления другими Realm:</p></blockquote></div>
</div>

The overloaded sentence is split. A colon connects the restriction to its reason; uppercase emphasis, a stray space and the redundant «свой» are removed. «Он предназначен» describes purpose more precisely. The final colon introduces the following screenshot in the publication version.

### 06. Consistent technical terminology

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>Создаем новые маперы:</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>Создайте новые мапперы:</p></blockquote></div>
</div>

The source alternated between «маперы» and English `mapper`. The result uses «маппер» and «мапперы». Other edits standardize «LDAP-провайдер», «веб-интерфейс» and «SSO-аутентификация», while preserving actual field and tab labels in the interface language.

### 07. A specific condition instead of “everything is fine”

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>если все в порядке, далее указываем каталог с учетной записью администратора домена и пароль, тестируем соединение</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>Если соединение успешно установлено, укажите каталог с учётной записью администратора домена и пароль, после чего нажмите кнопку Test authentication:</p></blockquote></div>
</div>

The vague condition is replaced with a concrete result: the connection has been established. The next action explicitly names `Test authentication`; the preceding step uses `Test connection`. The text now distinguishes the connection test from the authentication test.

### 08. Remove verbal clutter, keep the condition

<div class="editing-comparison">
<div class="editing-comparison__before"><span class="editing-label">Before</span><blockquote><p>Если же авторизация в Keycloak в этом браузере уже была произведена, тогда откроется сам портал.</p></blockquote></div>
<div class="editing-comparison__after"><span class="editing-label">After</span><blockquote><p>Если авторизация в Keycloak в этом браузере уже выполнена, откроется портал.</p></blockquote></div>
</div>

The edit removes filler words and replaces a heavy passive construction. It retains “in this browser,” because that condition explains why a login form may not appear again. The sentence becomes shorter while preserving the meaningful qualification.

## <SolarIcon name="lightbulb" /> A difficult passage: a procedure inside a field description

The certificate-password item contained a separate scenario: a new certificate, an existing certificate and a password change. A long parenthetical aside made these conditions difficult to scan.

::: details <SolarIcon name="document" /> See the certificate-password edit

**Before:**

> Пароль сертификата — указываем пароль на .pfx сертификат (При загрузке нового сертификата пароль обязателен. Для существующего сертификата пароль необязателен (сохранится старый). Если указать новый пароль - он обновится.).

**After — the action:**

> Пароль сертификата — укажите пароль к .pfx-сертификату.

**After — a separate explanation:**

> При загрузке нового сертификата пароль обязателен. Для существующего сертификата пароль необязателен (сохранится старый). Если указать новый пароль — пароль сертификата будет обновлён.

The explanation moves into a `[note type="clarification"]` block. The field item now presents an action, while the three conditions form a separate rule. Nested parentheses and awkward closing punctuation disappear; the ambiguous “it” is replaced with “certificate password.”

:::

## <SolarIcon name="compass" /> Structure and precision

### A reference points to the right step

The **Metadata IdP (URL)** description changes its reference from “step 1.1” to “section 1.2.1.” Section 1.2.1 provides the IdP metadata link; section 1.1 covers Realm preparation. This substantive correction helps readers return to the relevant action.

### Instructions address the reader

Main actions change from «Открываем», «Проверяем» and «Перезапускаем» (“we open/check/restart”) to «Откройте», «Проверьте» and «Перезапустите» (“open/check/restart”). The text becomes a procedure for the administrator to execute.

### Wording identifies the object

«Получаем ссылку для связи с КС24» becomes «получите ссылку на метаданные IdP для настройки связи с Корпоративным сервером 2024». The revised sentence names the link type and destination system, and expands an unexplained abbreviation.

### Headings reveal the route

The four main sections remain: connect Keycloak and the server, configure the Keycloak client, synchronize LDAP and verify login. All nine headings move from `h3 / h4 / h5` to `h2 / h3 / h4`, fitting a page with its own H1. Numbering follows one pattern: `1.`, `1.1.`, `1.2.1.`.

### Notes separate conditions from actions

The certificate-password rule becomes a clarification. The reminders about saving changes and authenticating in another browser become important-note blocks, making them easier to spot while scanning the procedure.

## <SolarIcon name="gallery" /> Illustrations and publication preparation

**All 31 screenshots gain captions and alt text.** The original images were embedded in Confluence wrappers without either. Descriptions now identify, for example, the “Create realm” dialog, the mail attribute mapper and the SSO login button.

Captions explain the purpose of an image during scanning; alt text supplies a textual description. WordPress `[caption]` markup includes image dimensions and links to full-size files.

The publication version removes the Confluence table-of-contents macro, nested wrappers, inline styles and wiki-specific classes. All six code blocks move to `EnlighterJSRAW`, retaining the commands and configuration fragments. A deployment-specific login address becomes `https://cddisk.example.com`.

## <SolarIcon name="chart" /> Verifiable results

| Comparison | Before | After |
|---|---|---|
| **Screenshot captions** | 0 of 31 | 31 of 31 |
| **Image alt text** | 0 of 31 | 31 of 31 |
| **Heading hierarchy** | 9 headings: h3 / h4 / h5 | 9 headings: h2 / h3 / h4 |
| **Code blocks** | 6 in Confluence markup | 6 in WordPress format |
| **Metadata reference** | Step 1.1: Realm preparation | Section 1.2.1: obtaining the link |
| **Labels and identifiers** | Sing In, conntction url, Tittle | Sign In, Connection URL, title |
| **Instruction voice** | Mixed “we” and reader address | Main steps use a consistent imperative |
| **Example login address** | A deployment-specific domain | A neutral example.com address |

The article is more consistent in language and presentation. Important conditions are separated from long sentences, interface labels are more precise, and captions connect illustrations to instructions. The case demonstrates technical editing from individual words through to a prepared knowledge-base article.

<div class="editing-result"><SolarIcon name="document" :size="28" /><div><strong>The finished guide in the R7 Office knowledge base</strong><p>R7 Disk SSO via Keycloak IdP with ALD Pro LDAP user synchronization. Published in Russian.</p><a href="https://support.r7-office.ru/corporate-server2024/settings_cs-r7disk/nastrojka-sso-dlya-r7-disk-korporativnyj-server-2024-cherez-keycloak-idp-s-sinhronizatsiej-polzovatelej-iz-ald-pro-ldap/" target="_blank" rel="noreferrer">Read the published guide <SolarIcon name="arrow-right" /></a></div></div>
