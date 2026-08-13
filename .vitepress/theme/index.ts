// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeHeroVisual from './components/HomeHeroVisual.vue'
import SolarIcon from './components/SolarIcon.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HomeHeroVisual),
    })
  },
  enhanceApp({ app }) {
    app.component('SolarIcon', SolarIcon)
  }
} satisfies Theme
