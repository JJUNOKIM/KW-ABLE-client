import { memo } from 'react'
import { Route } from '@/types/route'

interface RouteCardProps {
  route: Route
  onClick?: () => void
  selected?: boolean
}

export const RouteCard = memo(({ route, onClick, selected = false }: RouteCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`w-[157px] h-[117px] rounded-lg p-4 cursor-pointer transition-all ${
        selected
          ? 'bg-primary text-white shadow-lg'
          : 'bg-white text-gray-900 shadow-md hover:shadow-lg'
      }`}
    >
      <h3
        className={`text-sm font-semibold mb-2 ${
          selected ? 'text-white' : 'text-gray-900'
        }`}
      >
        {route.name}
      </h3>
      <p
        className={`text-xl font-bold mb-2 ${
          selected ? 'text-white' : 'text-primary'
        }`}
      >
        최대 {route.duration}분
      </p>
      <p
        className={`text-xs ${selected ? 'text-white/90' : 'text-gray-600'}`}
      >
        엘리베이터 {route.elevatorCount}번 / 경사로 {route.rampCount}번
      </p>
    </div>
  )
})
