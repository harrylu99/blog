import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import recoThemeModule from 'vuepress-theme-reco'

const recoTheme = (recoThemeModule as any).default

export default defineUserConfig({
  title: "Harry's Blog",
  description: "Almost there...",
  base: '/blog/',
  bundler: viteBundler(),
  head: [
    ['link', { rel: 'icon', href: '/blog/favicon.ico' }],
  ],
  theme: recoTheme({
    author: 'Harry Lu',
    startYear: '2022',
    docsDir: '/posts',
    blog: {
      autoSetCategories: true,
    },
    navbar: [
      { text: 'Home', link: '/', icon: 'reco-home' },
      { text: 'Blog', link: '/posts', icon: 'reco-blog' },
      { text: 'About Me', link: 'https://harrylu99.github.io', icon: 'reco-coding' },
    ],
    locales: {
      '/': {
        lang: 'en-US',
      },
    },
    socialLinks: [
      { icon: 'reco-github', link: 'https://github.com/harrylu99' },
    ],
  }),
  lang: 'en-US',
})
