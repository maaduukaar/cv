<script setup lang="ts">
import { computed, ref } from 'vue'
import report from '../../data/table-editor-report.json'

const props = withDefaults(defineProps<{ locale?: 'ru' | 'en' }>(), { locale: 'ru' })
const root = ref<HTMLElement>()
const labels = computed(() => props.locale === 'ru' ? {
  expand: 'Раскрыть весь отчёт', collapse: 'Свернуть разделы',
  entries: 'записей о статьях', redirects: 'редиректов',
  before: 'Было', after: 'Стало', old: 'Старый материал', target: 'Страница назначения',
  repeated: 'Повторные записи сохранены полностью, включая отличающиеся формулировки и примечания.',
} : {
  expand: 'Expand the full report', collapse: 'Collapse sections',
  entries: 'article entries', redirects: 'redirects',
  before: 'Before', after: 'After', old: 'Legacy material', target: 'Destination',
  repeated: 'Repeated entries are retained in full, including different wording and notes.',
})

function toggleAll(open: boolean) {
  root.value?.querySelectorAll('details').forEach(section => { section.open = open })
}

function parseLine(text: string) {
  const marker = text.match(/^([а-яёa-z])\.\s+/)
  const content = marker ? text.slice(marker[0].length) : text
  // Only split unambiguous quotation pairs. Complex original passages stay intact.
  const pair = content.match(/^([^«]*)«([^«»]*)»\s*→\s*«([^«»]*)»(.*)$/)
    ?? content.match(/^([^"]*)"([^"]*)"\s*→\s*"([^"]*)"(.*)$/)
  return {
    marker: marker ? marker[1] + '.' : '',
    text: content,
    pair: pair ? { label: pair[1].trim(), before: pair[2], after: pair[3], suffix: pair[4].trim().replace(/^[.;]$/, '') } : null,
    heading: /^(Ошибки|Важно|Примечание):$/.test(content),
    clear: /^Ошибок (не обнаружено|нет)\./.test(content),
    bullet: content.startsWith('- '),
  }
}

function lines(body: string) {
  return body.split('\n').map(line => line.trim()).filter(Boolean).map(parseLine)
}
</script>

<template>
  <div ref="root" class="full-audit-report" lang="ru">
    <div class="audit-report-toolbar" :lang="locale">
      <span class="audit-report-toolbar__scope">{{ report.articleEntries }} {{ labels.entries }} · {{ report.redirects }} {{ labels.redirects }}</span>
      <div class="audit-report-toolbar__actions">
        <button type="button" @click="toggleAll(true)">{{ labels.expand }}</button>
        <button type="button" @click="toggleAll(false)">{{ labels.collapse }}</button>
      </div>
    </div>

    <details v-for="(section, sectionIndex) in report.sections" :key="sectionIndex" class="audit-report-section">
      <summary :lang="locale">
        <span class="audit-report-section__number">{{ String(sectionIndex + 1).padStart(2, '0') }}</span>
        <span class="audit-report-section__title">{{ locale === 'ru' ? section.title : section.titleEn }}</span>
        <span class="audit-report-section__count" v-if="section.kind === 'articles'">{{ section.articles?.length }}</span>
        <span class="audit-report-section__count" v-else-if="section.kind === 'redirects'">30</span>
        <SolarIcon class="audit-report-section__arrow" name="arrow-right" :size="18" />
      </summary>
      <div class="audit-report-section__body">
        <p v-if="section.repeated" class="audit-report-note" :lang="locale">{{ labels.repeated }}</p>

        <template v-if="section.kind === 'articles'">
          <article v-for="(article, articleIndex) in section.articles" :key="articleIndex" class="audit-report-article">
            <h4><span class="audit-report-article__number">{{ article.number }}.</span> {{ article.title }}</h4>
            <div v-for="(line, lineIndex) in lines(article.body)" :key="lineIndex"
                 :class="['audit-report-line', { 'audit-report-line--finding': line.marker, 'audit-report-line--heading': line.heading, 'audit-report-line--clear': line.clear, 'audit-report-line--bullet': line.bullet }]">
              <span v-if="line.marker" class="audit-report-line__marker">{{ line.marker }}</span>
              <div class="audit-report-line__content">
                <template v-if="line.pair">
                  <p v-if="line.pair.label" class="audit-report-line__label">{{ line.pair.label }}</p>
                  <div class="audit-report-pair">
                    <div><span :lang="locale">{{ labels.before }}</span><p>{{ line.pair.before }}</p></div>
                    <div><span :lang="locale">{{ labels.after }}</span><p>{{ line.pair.after }}</p></div>
                  </div>
                  <p v-if="line.pair.suffix" class="audit-report-line__suffix">{{ line.pair.suffix }}</p>
                </template>
                <p v-else><SolarIcon v-if="line.clear" name="check" /> {{ line.text }}</p>
              </div>
            </div>
          </article>
        </template>

        <template v-else-if="section.kind === 'redirects'">
          <p>{{ section.intro }}</p>
          <section v-for="(group, groupIndex) in section.groups" :key="groupIndex" class="audit-report-redirect-group">
            <h4>{{ groupIndex + 1 }}. {{ group.title }}</h4>
            <div v-for="item in group.items" :key="item.number" class="audit-report-redirect">
              <span class="audit-report-redirect__number">{{ item.number }}</span>
              <div class="audit-report-redirect__content">
                <div class="audit-report-pair">
                  <div><span :lang="locale">{{ labels.old }}</span><p>{{ item.before }}</p></div>
                  <div><span :lang="locale">{{ labels.target }}</span><p>{{ item.after }}</p></div>
                </div>
                <p v-if="item.note" class="audit-report-note">{{ item.note }}</p>
              </div>
            </div>
          </section>
        </template>

        <p v-else>{{ section.text }}</p>
      </div>
    </details>
  </div>
</template>

<style scoped>
.full-audit-report { margin: 24px 0; }
.audit-report-toolbar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px; margin-bottom: 20px; }
.audit-report-toolbar__scope { color: var(--vp-c-text-2); font-size: 13px; }
.audit-report-toolbar__actions { display: flex; flex-wrap: wrap; gap: 8px; }
.audit-report-toolbar button { padding: 8px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font-size: 12px; font-weight: 650; cursor: pointer; }
.audit-report-toolbar button:first-child { color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.audit-report-toolbar button:hover { border-color: var(--vp-c-brand-1); }
.audit-report-toolbar button:focus-visible, .audit-report-section summary:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 4px; }
.full-audit-report .audit-report-section { margin: 12px 0; padding: 0; border: 1px solid var(--vp-c-divider); border-radius: 14px; background: var(--vp-c-bg); overflow: clip; }
.audit-report-section > summary { display: grid; grid-template-columns: 28px minmax(0, 1fr) auto 18px; align-items: center; gap: 12px; margin: 0; padding: 18px 20px; color: var(--vp-c-text-1); background: var(--vp-c-bg-soft); font-size: 15px; font-weight: 650; cursor: pointer; list-style: none; }
.audit-report-section > summary::-webkit-details-marker { display: none; }
.audit-report-section > summary::before { display: none; }
.audit-report-section__number { color: var(--vp-c-brand-1); font-size: 12px; font-variant-numeric: tabular-nums; }
.audit-report-section__arrow { grid-column: 4; color: var(--vp-c-text-3); }
.audit-report-section[open] .audit-report-section__arrow { transform: rotate(90deg); }
.audit-report-section__count { padding: 3px 8px; border-radius: 6px; color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); font-size: 12px; font-variant-numeric: tabular-nums; }
.audit-report-section[open] > summary { border-bottom: 1px solid var(--vp-c-divider); }
.audit-report-section__body { padding: 4px 22px 22px; }
.audit-report-article + .audit-report-article { margin-top: 32px; padding-top: 12px; border-top: 1px solid var(--vp-c-divider); }
.audit-report-article h4, .audit-report-redirect-group h4 { margin: 26px 0 18px; font-size: 18px; line-height: 1.5; letter-spacing: -0.015em; }
.audit-report-article__number { color: var(--vp-c-brand-1); }
.audit-report-line { margin: 12px 0; min-width: 0; }
.audit-report-line--finding { display: grid; grid-template-columns: 24px minmax(0, 1fr); gap: 10px; margin: 20px 0; }
.audit-report-line__marker { padding-top: 3px; color: var(--vp-c-text-3); font-size: 12px; font-weight: 650; }
.audit-report-line__content { min-width: 0; }
.audit-report-line p, .audit-report-pair p { margin: 0; font-size: 14px; line-height: 1.8; overflow-wrap: anywhere; }
.audit-report-line__label { margin-bottom: 10px !important; font-weight: 650; }
.audit-report-line--heading { margin-top: 24px; color: var(--vp-c-brand-1); font-weight: 650; }
.audit-report-line--clear { padding: 12px 16px; border-radius: 10px; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.audit-report-line--bullet { padding-left: 16px; }
.audit-report-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border: 1px solid var(--vp-c-divider); border-radius: 10px; overflow: hidden; }
.audit-report-pair > div { min-width: 0; padding: 14px 16px; background: var(--vp-c-bg-soft); }
.audit-report-pair > div + div { border-left: 1px solid var(--vp-c-divider); background: var(--vp-c-brand-soft); }
.audit-report-pair > div > span { display: block; margin-bottom: 8px; color: var(--vp-c-text-2); font-size: 10px; font-weight: 750; letter-spacing: 0.07em; text-transform: uppercase; }
.audit-report-pair > div + div > span { color: var(--vp-c-brand-1); }
.audit-report-line__suffix { margin-top: 8px !important; color: var(--vp-c-text-2); font-size: 12px !important; }
.audit-report-line__suffix:empty { display: none; }
.audit-report-note { margin: 14px 0 !important; padding: 12px 16px; border-left: 2px solid var(--vp-c-brand-1); background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font-size: 13px; line-height: 1.8; overflow-wrap: anywhere; }
.audit-report-redirect { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 10px; margin: 14px 0; }
.audit-report-redirect__number { padding-top: 15px; color: var(--vp-c-brand-1); font-size: 12px; font-weight: 650; font-variant-numeric: tabular-nums; }
.audit-report-redirect__content { min-width: 0; }
@media (max-width: 639px) {
  .audit-report-toolbar { align-items: flex-start; }
  .audit-report-section > summary { gap: 8px; padding: 16px; font-size: 14px; }
  .audit-report-section__body { padding: 2px 16px 16px; }
  .audit-report-article h4, .audit-report-redirect-group h4 { font-size: 17px; }
  .audit-report-line--finding { grid-template-columns: 18px minmax(0, 1fr); gap: 6px; }
  .audit-report-pair { grid-template-columns: 1fr; }
  .audit-report-pair > div { padding: 12px; }
  .audit-report-pair > div + div { border-top: 1px solid var(--vp-c-divider); border-left: 0; }
  .audit-report-redirect { grid-template-columns: 20px minmax(0, 1fr); gap: 6px; }
}
</style>
