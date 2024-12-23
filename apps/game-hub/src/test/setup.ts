import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// 扩展 Vitest 的 expect 方法
expect.extend(matchers)

// 每个测试后进行清理
afterEach(() => {
  cleanup()
}) 