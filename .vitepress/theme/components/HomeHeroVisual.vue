<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import SolarIcon from './SolarIcon.vue'
import avatarUrl from '../../../ru/images/about-me/max-shvedov-header-avatar.png'

const { lang } = useData()

const copy = computed(() => {
  const isRussian = lang.value.toLowerCase().startsWith('ru')

  return isRussian
    ? {
        alt: 'Макс Шведов на фоне гор',
        experience: '15+ лет опыта',
        scope: 'От ТЗ до QA',
        focus: 'Web · Automation · Security',
      }
    : {
        alt: 'Max Shvedov with mountains in the background',
        experience: '15+ years of experience',
        scope: 'From spec to QA',
        focus: 'Web · Automation · Security',
      }
})
</script>

<template>
  <div class="home-hero-visual">
    <div class="home-hero-visual__orbit" aria-hidden="true"></div>

    <div class="home-hero-visual__portrait">
      <img
        :src="avatarUrl"
        :alt="copy.alt"
        width="1029"
        height="318"
        decoding="async"
      />
      <div class="home-hero-visual__focus">
        <span class="home-hero-visual__status" aria-hidden="true"></span>
        {{ copy.focus }}
      </div>
    </div>

    <div class="home-hero-visual__chip home-hero-visual__chip--experience">
      <SolarIcon name="trophy" :size="20" />
      <span>{{ copy.experience }}</span>
    </div>

    <div class="home-hero-visual__chip home-hero-visual__chip--scope">
      <SolarIcon name="check" :size="20" />
      <span>{{ copy.scope }}</span>
    </div>
  </div>
</template>
