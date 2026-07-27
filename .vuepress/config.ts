import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { recoTheme } from 'vuepress-theme-reco'

export default defineUserConfig({
  title: "Harry's Blog",
  description: "Almost there...",
  base: '/blog/',
  bundler: viteBundler({
    viteOptions: {
      plugins: [{
        name: 'inject-favicon',
        transformIndexHtml(html) {
          return html.replace(
            '</head>',
            '  <link rel="icon" href="/blog/favicon.ico">\n  </head>'
          )
        }
      }]
    }
  }),
  head: [
    ['link', { rel: 'icon', href: '/blog/favicon.ico' }],
  ],
  theme: recoTheme({
    author: 'Harry Lu',
    startYear: '2022',
    docsDir: '/posts',
    lastUpdated: false,
    autoSetSeries: true,
    autoSetBlogCategories: false,
    navbar: [
      { text: 'Home', link: '/', icon: 'reco-home' },
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
