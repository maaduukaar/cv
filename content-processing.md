---
title: Content Processing
outline: [2, 3]
---

# content-neuro-update Project

**Task:** Mass content processing of 4,000 WordPress articles according to 20+ rules.

**Complexity:** Long articles with technical instructions in which data accuracy must be preserved.

**Problem:** When processed with neural networks, instructions were lost and rules constantly dropped out of context.

**Solution:** A system for automated processing of WordPress posts using declarative rules and helper scripts that process content according to those rules.

![Rule development workflow](/ru/images/content-processing/rule-creation-workflow.webp)

:::tip
> **Content processing workflow:**
> 1. Select posts for processing
> 2. Download posts to the local machine
> 3. Commit the content to Git
> 4. Process posts with utilities according to the required rules
> 5. Review changes through Git diff
> 6. Roll back changes if necessary or make manual corrections
> 7. Upload the modified articles

:::

**Result:** Dozens of person-hours saved on content processing.

**Project evolution**

After the project started, Google Antigravity integrated skill creation technology into its IDE, which is essentially analogous to my idea of making content processing rules deterministic. The advantage of SKILL.md is that the neural network works natively according to the specified rules and, when necessary, fixes problems missed by helper utilities "manually."

The workflow is currently being migrated to use [Agent Skills](https://agentskills.io/specification).

## Project Context

### Scale of the Task

| Parameter | Value |
|----------|----------|
| **Number of articles** | 4,000+ |
| **Number of rules** | 20+ |
| **Total number of operations** | 80,000+ rule applications |
| **Content type** | Technical instructions |

### Content Complexity

The articles are **long technical instructions** with the following characteristics:

- Large amounts of text (up to 50+ screens)
- Many code blocks and terminal commands
- Screenshots showing step-by-step actions
- Complex nested lists
- Tables with technical parameters
- Cross-links between sections

### Problem: Why Standard Approaches Do Not Work

Attempts to process the content directly with neural networks caused critical problems:

| Problem | Description |
|----------|----------|
| **Content loss** | • Parts of instructions disappeared during processing<br>• Code blocks were truncated or distorted<br>• Images lost their attributes |
| **Loss of rule context** | • Rules "dropped out" of the model's memory<br>• By the second or third article, the model began to ignore the rules<br>• The instructions had to be repeated constantly |
| **Unpredictability** | • The same rule was applied differently<br>• Consistency could not be guaranteed<br>• It was difficult to track exactly what had changed |
| **Lack of versioning** | • No way to roll back changes<br>• Rules could not be applied incrementally<br>• Data was lost when errors occurred |

### Key Insight

:::info
> **You cannot send 4,000 articles to a neural network and expect a correct result.**
>
> A **system** is required that:
> 1. Isolates each article for processing
> 2. Guarantees that rules are applied without losing context
> 3. Preserves the original content without distortion
> 4. Versions every change
:::

## Problem

Mass content processing for WordPress websites requires significant time and human resources:

- **Repetitive edits** — correcting punctuation, formatting, and image alignment
- **Human factor** — errors during manual processing of hundreds of posts
- **Lack of standardization** — different authors format content differently
- **Labor costs** — hours of editor time spent on routine tasks

## Solution: Content Neuro Update

**Content Neuro Update** is a system for automated content processing of WordPress posts using an AI agent and declarative rules.

### Key Innovation

:::tip
Instead of writing code for every task, we create **declarative rules in natural language** (Markdown), which the AI agent interprets, creates helper utilities for, and applies to the content.

```text
📝 Rule (Markdown) → 🤖 AI agent → 📄 Processed content
```
:::

## System Architecture

![System architecture](/ru/images/content-processing/content-architecture.png)

*Visualization of the process: from synchronization with WordPress to committing changes in Git.*


## Unique Approach: Declarative Rules

### Traditional Approach (Code):

```python
# Complex code for each task
def fix_punctuation(html):
    soup = BeautifulSoup(html, 'html.parser')
    for li in soup.find_all('li'):
        # ... 50+ lines of logic
```

### Our Approach (Rules):

```markdown
# Rule 9: Correct List Punctuation

## Main Rules:
1. Every list item except the last → `;`
2. The last item → `.`

## Examples:
### Before:
- First item,
- Second item.

### After:
- First item;
- Second item.
```

> **Advantages:**
>
> <SolarIcon name="check" /> Understandable without programming knowledge
>
> <SolarIcon name="check" /> Easy to modify and expand
>
> <SolarIcon name="check" /> Self-documenting rules
>
> <SolarIcon name="check" /> Examples are built into the description


## Workflow

### Rule Creation Process

1. **Text rule** — Initial description in natural language (`Rules/N_rule.md`)
2. **AI enhancement** — The neural network supplements the rule with edge cases (exceptions, special situations, nuances)
3. **Test creation** — Test cases for validating the rule (`tests/test_N_rule.py`)
4. **Processing utility** — A working script based on the tests (`utils/N_rule/*.py`)

![Key principles](/ru/images/content-processing/key-principles.webp)

## Rule Examples

| # | Rule | Description |
|---|---------|----------|
| 1 | `center-alignnone-images` | Centering block images |
| 2 | `images-full-screen` | Full-screen mode for images |
| 3 | `li_indentation` | Indentation in list items |
| 4 | `remove-a-inline` | Removing unnecessary inline links |
| 5 | `ks-2024` | Replacing keywords |
| 6 | `colon-img-pre` | Colons before images/code |
| 7 | `remove-colon-in-h` | Removing colons from headings |
| 8 | `list_punctuation` | Correct list punctuation |

## Technology Stack

### System Core:

| Component | Technology | Purpose |
|-----------|------------|------------|
| API | WordPress REST API | Interaction with the website |
| Scripts | Python 3 | Downloading/uploading posts |
| Rules | Markdown | Declarative rule descriptions |
| Agent | AI (Gemini CLI) | Interpreting and applying rules |
| VCS | Git | Versioning changes |


## Key Features

### 1. Bidirectional Synchronization

```bash
# Download posts from the website
python main.py download

# Upload changes back
python main.py upload --mod
```

### 2. Intelligent Uploading

- `upload` — uploads all posts
- `upload --mod` — only Git-modified files (incremental uploading)

### 3. Safety

- Automatic creation of WordPress revisions
- Git tracking of all changes
- Ability to roll back to any version

### 4. Rule Flexibility

Each rule can contain:
- Task description
- Step-by-step instructions
- "Before/after" examples
- Exceptions and special cases
- Test cases for validation

### 5. Helper Tools

- Content analyzers (`utils/utils/`)
- Tests for validating rules (`tests/`)
- Automation scripts (`utils/*_rule/`)

## Solution Benefits

### For the Business:

| Metric | Traditional Approach | Content Neuro Update |
|---------|---------------------|----------------------|
| Time per rule | Hours of development | Minutes to describe |
| Required qualification | Programmer | Editor/content manager |
| Scaling | Difficult | Easy |
| Documentation | Separate task | Built into the rules |

### For the Developer:

:::tip
- <SolarIcon name="check" /> **Extensibility** — new rules without code changes
- <SolarIcon name="check" /> **Testability** — every rule has test cases
- <SolarIcon name="check" /> **Transparency** — all changes are in Git
- <SolarIcon name="check" /> **Safety** — WordPress revisions + Git history
:::

### For the Editor:

:::tip
- <SolarIcon name="check" /> **Clarity** — rules in natural language
- <SolarIcon name="check" /> **Control** — "before/after" examples in every rule
- <SolarIcon name="check" /> **Flexibility** — easy to add exceptions
:::

## Scaling

The system is ready to expand:

1. **New rules** — simply add an `.md` file to `Rules/`
2. **New skills** — create a folder in `.agent/skills/`
3. **Integrations** — any website with the WordPress REST API
4. **Teamwork** — Git enables collaboration

## Conclusion

![Content Neuro Update](/ru/images/content-processing/content-neuro-update.webp)

::: info NOTE
The project was developed to automate routine content processing tasks for WordPress websites with minimal human involvement and maximum process transparency.
:::
