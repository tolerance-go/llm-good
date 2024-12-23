// https://vitepress.dev/reference/site-config
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/default-theme-config
export default defineConfig({
  lang: 'zh-CN',
  title: "官网",
  description: "Official Website",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/your-repo' }
    ]
  }
}) 