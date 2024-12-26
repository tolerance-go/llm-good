// https://vitepress.dev/reference/site-config
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/default-theme-config
export default defineConfig({
  lang: 'zh-CN',
  title: "UNoCodeX",
  description: "AI时代的游戏创作平台",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '创作平台', link: 'https://create.unocodex.com' },
      { text: '游戏中心', link: 'https://play.unocodex.com' },
      { text: '帮助文档', link: '/guide/getting-started' },
    ],
    sidebar: [
      {
        text: '开始使用',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '创作指南', link: '/guide/features' },
          { text: '游戏发布', link: '/guide/pricing' },
        ]
      },
      {
        text: '游戏展示',
        items: [
          { text: '热门游戏', link: '/guide/snake-game' },
        ]
      },
      {
        text: '创作功能',
        items: [
          { text: 'AI对话创作', link: '/guide/features#ai对话创作' },
          { text: '游戏管理', link: '/guide/features#游戏管理' },
          { text: '社区分享', link: '/guide/features#社区分享' },
        ]
      },
      {
        text: '帮助',
        items: [
          { text: '常见问题', link: '/guide/pricing#常见问题' },
          { text: '更新日志', link: '/changelog' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/unocodex/unocodex' }
    ],
    footer: {
      message: '让每个人都能创造属于自己的游戏',
      copyright: 'Copyright © 2023-present UNoCodeX'
    }
  }
}) 