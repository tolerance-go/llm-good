import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// 每个测试后清理
afterEach(() => {
  cleanup()
}) 