import { Link } from 'react-router-dom'

export function Home() {
  const games = [
    {
      id: 'snake',
      title: '贪吃蛇',
      description: '经典的贪吃蛇游戏，通过方向键控制蛇的移动，吃到食物可以变长。',
      color: 'green'
    },
    {
      id: 'tetris',
      title: '俄罗斯方块',
      description: '经典的俄罗斯方块游戏，使用方向键控制方块的移动和旋转。',
      color: 'blue'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map(game => (
        <Link
          key={game.id}
          to={`/${game.id}`}
          className={`block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow`}
        >
          <h2 className={`text-2xl font-bold mb-2 text-${game.color}-600`}>{game.title}</h2>
          <p className="text-gray-600">{game.description}</p>
          <div className={`mt-4 inline-block px-4 py-2 bg-${game.color}-500 text-white rounded hover:bg-${game.color}-600`}>
            开始游戏
          </div>
        </Link>
      ))}
    </div>
  )
} 