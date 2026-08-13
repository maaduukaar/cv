---
layout: home
pageClass: portfolio-home
description: Max Shvedov — full-stack web specialist. Development, automation, security, and technical content systems.

hero:
  name: "Max Shvedov"
  text: "I build web systems that handle real-world complexity"
  tagline: "Full-stack development, automation, security, and content infrastructure — from technical specification and architecture to production and QA."
  actions:
    - theme: brand
      text: View projects
      link: "#projects"
    - theme: alt
      text: About me
      link: /about-me
---

<script setup>
import { withBase } from 'vitepress'
</script>

<!-- Keep custom HTML flush-left: indented blocks are parsed as code by Markdown. -->
<main class="home-portfolio">
<section class="home-metrics" aria-label="Key results">
<div class="home-metric">
<strong>15+</strong>
<span>years across web and technology</span>
</div>
<div class="home-metric">
<strong>4,000+</strong>
<span>articles in one processing pipeline</span>
</div>
<div class="home-metric">
<strong>1,656</strong>
<span>API method articles standardized</span>
</div>
<div class="home-metric">
<strong>152</strong>
<span>manual QA test cases documented</span>
</div>
</section>

<section id="projects" class="home-section home-projects">
<header class="home-section__header">
<div class="home-section__icon"><SolarIcon name="folder" :size="22" /></div>
<div>
<p class="home-section__eyebrow">Selected work</p>
<h2>Projects with the full path to the result</h2>
<p>Architecture, implementation, trade-offs, QA, and outcomes — not just the final screenshot.</p>
</div>
</header>

<div class="home-project-grid">
<article class="home-project-card home-project-card--featured">
<div class="home-project-card__content">
<div class="home-project-card__meta">
<span>PHP / Legacy</span>
<span>Security</span>
<span>QA</span>
</div>
<h3>Securing the company creation form</h3>
<p>A full redesign of a legacy <code>contact/create</code> flow: isolated authentication, 2FA, input validation, duplicate TIN/KPP protection, audit logs, and 152 documented manual QA cases.</p>
<div class="home-project-card__facts" aria-label="Project facts">
<span><strong>11</strong> delivery stages</span>
<span><strong>152</strong> QA cases</span>
<span><strong>2FA</strong> and audit trail</span>
</div>
<a class="home-card-link" :href="withBase('/contact-create-page.html')">
Open case study
<SolarIcon name="arrow-right" :size="19" />
</a>
</div>
<a class="home-project-card__media" :href="withBase('/contact-create-page.html')" aria-label="Open the company creation form security case study">
<img
:src="withBase('/images/contact-create-page/duplicate-found.png')"
alt="Duplicate company warning in the protected creation form"
width="779"
height="587"
loading="lazy"
decoding="async"
/>
</a>
</article>

<article class="home-project-card">
<a class="home-project-card__media home-project-card__media--wide" :href="withBase('/r7-document-api.html')" aria-label="Open the R7 Office Document Builder API case study">
<img
src="/ru/images/r7-document-api/r7-api-main.png"
alt="R7 Office Document Builder API knowledge-base interface"
width="1920"
height="922"
loading="lazy"
decoding="async"
/>
</a>
<div class="home-project-card__content">
<div class="home-project-card__meta"><span>WordPress</span><span>Information architecture</span></div>
<h3>R7 Office Document Builder API</h3>
<p>A scalable knowledge-base architecture for 107 API classes and 1,656 method articles, with fast navigation and consistent content structure.</p>
<div class="home-project-card__facts">
<span><strong>107</strong> API categories</span>
<span><strong>1 week</strong> for content standardization</span>
</div>
<a class="home-card-link" :href="withBase('/r7-document-api.html')">
Open case study
<SolarIcon name="arrow-right" :size="19" />
</a>
</div>
</article>

<article class="home-project-card">
<a class="home-project-card__media home-project-card__media--diagram" :href="withBase('/content-processing.html')" aria-label="Open the content processing case study">
<img
src="/ru/images/content-processing/content-architecture.png"
alt="Architecture of the automated WordPress content processing system"
width="1024"
height="1024"
loading="lazy"
decoding="async"
/>
</a>
<div class="home-project-card__content">
<div class="home-project-card__meta"><span>Automation</span><span>AI agents</span><span>Git</span></div>
<h3>Deterministic content processing</h3>
<p>A controlled pipeline for mass WordPress updates: declarative rules, Python utilities, AI-assisted processing, diff review, and safe rollback.</p>
<div class="home-project-card__facts">
<span><strong>4,000+</strong> articles</span>
<span><strong>20+</strong> processing rules</span>
</div>
<a class="home-card-link" :href="withBase('/content-processing.html')">
Open case study
<SolarIcon name="arrow-right" :size="19" />
</a>
</div>
</article>
</div>

<nav class="home-more-projects" aria-label="More project case studies">
<a :href="withBase('/r7-category-faq.html')">
<span class="home-more-projects__icon"><SolarIcon name="bolt" :size="21" /></span>
<span><strong>Category FAQ template</strong><small>8.5× loading-speed improvement</small></span>
<SolarIcon name="arrow-right" :size="18" />
</a>
<a :href="withBase('/r7-dashamail-footer.html')">
        <span class="home-more-projects__icon"><SolarIcon name="shield" :size="21" /></span>
        <span><strong>DashaMail footer widget</strong><small>Live AJAX form and four security fixes</small></span>
        <SolarIcon name="arrow-right" :size="18" />
      </a>
<a :href="withBase('/r7-image-alignment.html')">
        <span class="home-more-projects__icon"><SolarIcon name="gallery" :size="21" /></span>
        <span><strong>WordPress image alignment</strong><small>Four editor markup patterns covered</small></span>
        <SolarIcon name="arrow-right" :size="18" />
      </a>
<a :href="withBase('/modx-case-1.html')">
        <span class="home-more-projects__icon"><SolarIcon name="settings" :size="21" /></span>
        <span><strong>ModX order form</strong><small>Field-type changes with input validation</small></span>
        <SolarIcon name="arrow-right" :size="18" />
      </a>
</nav>
</section>

<section class="home-section home-expertise">
<header class="home-section__header">
<div class="home-section__icon"><SolarIcon name="layers" :size="22" /></div>
<div>
<p class="home-section__eyebrow">Expertise</p>
<h2>One system view instead of isolated fixes</h2>
<p>I connect product requirements, code, infrastructure, content, and quality control.</p>
</div>
</header>

<div class="home-expertise-grid">
<article>
<span class="home-expertise-card__icon"><SolarIcon name="code" :size="24" /></span>
<h3>Web engineering</h3>
<p>PHP, JavaScript, Vue, WordPress, ModX, APIs, and careful work with legacy systems.</p>
</article>
<article>
<span class="home-expertise-card__icon"><SolarIcon name="magic" :size="24" /></span>
<h3>Automation</h3>
<p>Python, Bash, content pipelines, declarative rules, and AI-assisted workflows.</p>
</article>
<article>
<span class="home-expertise-card__icon"><SolarIcon name="shield" :size="24" /></span>
<h3>Security and QA</h3>
<p>Threat-aware architecture, validation, auditability, test design, and release documentation.</p>
</article>
<article>
<span class="home-expertise-card__icon"><SolarIcon name="graph" :size="24" /></span>
<h3>Infrastructure and growth</h3>
<p>VPS administration, DNS, SSL, Cloudflare, technical SEO, and content operations.</p>
</article>
</div>
</section>

<section class="home-section home-process">
<header class="home-section__header home-section__header--compact">
<div class="home-section__icon"><SolarIcon name="compass" :size="22" /></div>
<div>
<p class="home-section__eyebrow">Process</p>
<h2>A clear path from problem to release</h2>
</div>
</header>

<ol class="home-process-list">
<li><span>01</span><strong>Context</strong><small>Constraints and risks</small></li>
<li><span>02</span><strong>Architecture</strong><small>Decisions and trade-offs</small></li>
<li><span>03</span><strong>Implementation</strong><small>Focused delivery</small></li>
<li><span>04</span><strong>QA</strong><small>Checks and edge cases</small></li>
<li><span>05</span><strong>Handoff</strong><small>Documentation and result</small></li>
</ol>
</section>

<section class="home-cta">
<div class="home-cta__icon"><SolarIcon name="rocket" :size="28" /></div>
<div>
<p class="home-section__eyebrow">The details matter</p>
<h2>See the experience behind the projects</h2>
<p>Background, technology stack, infrastructure, Web3, e-commerce, and the principles I bring to complex work.</p>
</div>
<div class="home-cta__actions">
<a class="home-button home-button--brand" :href="withBase('/about-me.html')">About me <SolarIcon name="arrow-right" :size="18" /></a>
<a class="home-button" :href="withBase('/faq.html')">Q&amp;A</a>
</div>
</section>
</main>
