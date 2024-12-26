import { useState } from 'react'

type ConfigPrimitive = string | number | boolean | null
type Position = { readonly x: number; readonly y: number }
type ConfigValue =
  | ConfigPrimitive
  | ConfigObject
  | ConfigArray
  | readonly ConfigValue[]
  | readonly Position[]
  | Position

interface ConfigObject {
  readonly [key: string]: ConfigValue
}

type ConfigArray = ConfigValue[]

interface ConfigTreeProps {
  data: ConfigValue
  label?: string
  depth?: number
}

export function ConfigTree({ data, label, depth = 0 }: ConfigTreeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const indent = depth * 20

  if (typeof data !== 'object' || data === null) {
    return (
      <div className="text-gray-600 my-1" style={{ marginLeft: `${indent}px` }}>
        {label && <span className="text-gray-400">{label}: </span>}
        <span className="font-mono">{String(data)}</span>
      </div>
    )
  }

  const isArray = Array.isArray(data)
  const items: [string, ConfigValue][] = isArray 
    ? (data as readonly ConfigValue[]).map((item, index) => [String(index), item])
    : Object.entries(data as ConfigObject)

  return (
    <div className="my-1" style={{ marginLeft: `${indent}px` }}>
      {label && (
        <div 
          className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="mr-2">{isExpanded ? '▼' : '▶'}</span>
          <span className="font-medium text-gray-700">{label}</span>
        </div>
      )}
      {isExpanded && (
        <div>
          {items.map(([key, value]) => (
            <ConfigTree
              key={key}
              data={value}
              label={isArray ? `[${key}]` : key}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
} 