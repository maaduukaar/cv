---
outline: [2, 3]
pageClass: project-case
---

# pdf2audiobook: interactive PDF-to-MP3 CLI

<div class="case-tech-badges">
  <Badge type="tip" text="Python 3.9+" />
  <Badge type="info" text="Edge TTS" />
  <Badge type="warning" text="OCR fallback" />
  <Badge type="tip" text="CLI / TUI" />
</div>

::: info <SolarIcon name="clipboard" /> Project Card

| Parameter | Value |
|---|---|
| **Stack** | Python 3.9+, `pypdf`, `edge-tts`, `questionary`, `mutagen`, optional `pypdfium2` and `rapidocr-onnxruntime` |
| **Role** | Python developer, CLI/TUI designer, and reliability engineer |
| **Key files** | `pdf2audiobook.py`, `requirements.txt`, `README.md`, `README.ru.md` |
| **Source** | <SolarIcon name="link" /> [GitHub: pdf-to-audiobook](https://github.com/maaduukaar/pdf-to-audiobook) |
| **Result** | An MIT-licensed utility that turns digital and scanned PDF books into MP3 audiobooks through a guided wizard or a scriptable CLI |

:::

---

## <SolarIcon name="pin" /> Project overview and specification

**pdf2audiobook** removes the usual friction of producing an audiobook from a PDF: choosing a voice, skipping front matter, splitting a long book into safe TTS requests, and recovering after a network interruption. It uses Microsoft Edge Text-to-Speech through the `edge-tts` package, so it needs an internet connection but neither API keys nor paid services.

Two complementary interfaces serve different working styles:

- the default interactive mode finds PDF files in the project folder and leads the reader through conversion settings with the arrow keys;
- the command-line interface supports direct conversion, test runs, cover-art embedding, and voice discovery for repeatable workflows.

<figure>
  <img src="/images/pdf-to-audiobook/wizard-menu.png" alt="Main menu of the pdf2audiobook interactive wizard" width="445" height="193" loading="lazy" decoding="async">
  <figcaption>The terminal wizard exposes conversion, cover-art, and voice-listing actions without requiring users to memorise command syntax.</figcaption>
</figure>

### Functional goals

- Extract text from ordinary PDFs and automatically fall back to OCR on scanned pages.
- Generate speech in batches that stay within a configurable TTS request limit.
- Show progress as a batch is being generated, retry failed requests, and resume after a stopped run.
- Let users select a start page, language, voice, output file, and optional cover through the wizard.
- Keep every capability available through explicit CLI subcommands for automation and testing.

---

## <SolarIcon name="clipboard" /> Completed implementation milestones

The repository does not use a separate task tracker, so the implementation milestones below are reconstructed from the project documentation and Git history.

| No. | Milestone | Delivered result |
|:---:|---|---|
| 01 | **PDF text extraction and segmentation** | Reads PDF pages with `pypdf`, normalises broken line endings, and splits text at sentence boundaries or whitespace |
| 02 | **Streaming TTS generation** | Sends chunks to Edge TTS and reports completion progress from sentence-boundary events |
| 03 | **Failure recovery** | Applies a configurable timeout and retry count; preserves completed temporary chunks so a restarted run continues from the first missing batch |
| 04 | **MP3 assembly and cover art** | Concatenates generated audio and can embed a JPG or PNG cover through ID3 metadata |
| 05 | **CLI interface** | Provides `convert`, `cover`, and `voices` subcommands, including a first-page test mode |
| 06 | **Interactive terminal wizard** | Adds keyboard-driven selection of files, conversion mode, output name, and optional cover image |
| 07 | **Reader-oriented settings** | Adds start-page selection plus dynamic language and voice selection from the Edge TTS catalog |
| 08 | **Scanned-document support** | Adds automatic, page-level OCR fallback using PDF rendering and RapidOCR |
| 09 | **Long-choice and locale ergonomics** | Paginates large file and voice lists; confirmation dialogs also accept Cyrillic equivalents of yes and no |

---

## <SolarIcon name="lightbulb" /> Complex engineering task: automatic OCR fallback for scanned PDFs

::: details <SolarIcon name="code" /> Open the OCR decision and implementation flow

### The problem

`pypdf` extracts text only when a PDF contains a text layer. A scanned book can look correct in a viewer while `extract_text()` returns an empty value for every page. A separate OCR-only mode would force a user to diagnose the document type before starting conversion and would make mixed PDFs unnecessarily expensive to process.

### The implementation

The converter keeps the normal extraction path as the fast default. For every page that comes back empty, it lazily initialises the optional OCR dependencies, renders only that page at a 2x scale, passes the image to RapidOCR, and uses the recognised lines as the page text. The OCR engine is created once and reused for later scanned pages.

```python
page_text = reader.pages[i].extract_text()

if not page_text or not page_text.strip():
    if has_ocr:
        if not ocr_engine:
            ocr_engine = RapidOCR()

        doc = pdfium.PdfDocument(pdf_path)
        page = doc[i]
        image = page.render(scale=2.0).to_pil()
        result, _ = ocr_engine(np.array(image))

        if result:
            page_text = "\n".join(item[1] for item in result)
```

### Behaviour when OCR is unavailable

OCR packages are imported conditionally. Ordinary text PDFs therefore do not require their installation. If no text can be obtained and OCR support is absent, the program exits with a clear message naming the two optional packages that enable scanned-PDF conversion.

### Result

The same conversion command accepts ordinary, scanned, and mixed documents. OCR is applied only where needed, preserving the quicker text-layer workflow for the rest of a book.

:::

---

## <SolarIcon name="bolt" /> Technical decisions and key challenges

::: warning <SolarIcon name="danger" /> Long books can exceed a single TTS request or be interrupted mid-run

Sending an entire book at once makes a failed request expensive and leaves no useful recovery point. Network calls also need enough time for large chunks without hanging indefinitely.

:::

::: tip <SolarIcon name="lightbulb" /> Solution: chunked generation with visible progress and resume

The text is split into chunks of up to `35_000` characters by default, preferring sentence endings. Each result is stored as `temp_batch_N.mp3`. Existing non-empty chunks are skipped on the next run, while configurable timeouts and retries isolate transient failures. The final step concatenates the batches and removes them unless the user opts to keep them.

:::

::: warning <SolarIcon name="danger" /> The Edge catalog can contain too many languages and voices for a single terminal menu

Hard-coding several voices would make the wizard incomplete and quickly stale. Showing all dynamic choices at once makes keyboard navigation impractical.

:::

::: tip <SolarIcon name="lightbulb" /> Solution: runtime discovery, language filtering, and paginated selection

The wizard loads the current Edge voice catalog, presents common language codes first, filters voices by the selected language, and shows long lists ten choices at a time with previous and next navigation. The same paginator is also used for PDFs, MP3 files, and cover images.

:::

---

## <SolarIcon name="chart" /> Results

::: tip <SolarIcon name="trophy" /> Product outcome

| Area | Before the utility | In the delivered workflow |
|---|---|---|
| **Document types** | Text-layer PDFs only through direct extraction | Text-layer, scanned, and mixed PDFs through on-demand OCR |
| **Long conversions** | One opaque request with manual restarts | Batched output, in-place progress, retries, and automatic resume |
| **Voice setup** | A voice identifier must be known in advance | Language and voice are discovered and selected in the wizard |
| **Operating modes** | Command syntax required for every action | Guided terminal workflow plus explicit CLI subcommands |
| **Output polish** | Generated audio only | Optional cover art embedded in the finished MP3 |

:::

The public repository includes Russian and English documentation, cross-platform virtual-environment setup, and focused examples for both interactive and CLI use.
