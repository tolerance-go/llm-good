// https://vitepress.dev/reference/site-config
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/default-theme-config
export default defineConfig({
  lang: 'zh-CN',
  title: "LLM Good",
  description: "AI驱动的游戏资产创作平台",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '功能', link: '/guide/features' },
      { text: '定价', link: '/guide/pricing' },
      { text: '文档', link: '/guide/getting-started' },
      { text: '游戏', link: '/guide/snake-game' },
    ],
    sidebar: [
      {
        text: '入门指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '功能详情', link: '/guide/features' },
          { text: '定价方案', link: '/guide/pricing' },
        ]
      },
      {
        text: '游戏展示',
        items: [
          { text: '超级贪吃蛇', link: '/guide/snake-game' },
        ]
      },
      {
        text: '核心功能',
        items: [
          { text: 'AI资产生成', link: '/guide/features#ai资产生成' },
          { text: '资产管理系统', link: '/guide/features#资产管理系统' },
          { text: 'AI辅助工具', link: '/guide/features#ai辅助工具' },
        ]
      },
      {
        text: '资源',
        items: [
          { text: '常见问题', link: '/guide/pricing#常见问题' },
          { text: 'API文档', link: '/api/' },
          { text: '更新日志', link: '/changelog' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/your-repo' }
    ],
    footer: {
      message: '基于 AI 技术提供游戏资产创作解决方案',
      copyright: 'Copyright © 2023-present LLM Good'
    }
  }
}) 