import { useState } from 'react'
import { SnakeGameConfig } from '../config/snakeGameConfig'

type ConfigValue = string | number | boolean | ConfigObject | ConfigArray
interface ConfigObject {
  [key: string]: ConfigValue
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
        <span className="font-mono">{JSON.stringify(data)}</span>
      </div>
    )
  }

  const isArray = Array.isArray(data)
  const items = isArray ? data : Object.entries(data)

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
          {isArray
            ? items.map((item, index) => (
                <ConfigTree
                  key={index}
                  data={item}
                  label={`[${index}]`}
                  depth={depth + 1}
                />
              ))
            : items.map(([key, value]) => (
                <ConfigTree
                  key={key}
                  data={value as ConfigValue}
                  label={key}
                  depth={depth + 1}
                />
              ))}
        </div>
      )}
    </div>
  )
} 