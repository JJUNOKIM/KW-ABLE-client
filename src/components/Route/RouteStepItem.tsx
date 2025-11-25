import { RouteStep } from '@/types/route'

interface RouteStepItemProps {
  step: RouteStep
  isFirst?: boolean
  isLast?: boolean
}

export const RouteStepItem = ({ step, isLast }: RouteStepItemProps) => {
  const getBadgeContent = () => {
    if (step.type === 'start') return '출발'
    if (step.type === 'end') return '도착'
    return null
  }

  const badgeContent = getBadgeContent()

  return (
    <div className="flex gap-3 py-3">
      <div className="flex flex-col items-center">
        {badgeContent ? (
          <div className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
            {badgeContent}
          </div>
        ) : (
          <div className="w-3 h-3 bg-primary rounded-full mt-2" />
        )}
        {!isLast && <div className="w-0.5 flex-1 bg-gray-300 mt-2" />}
      </div>

      <div className="flex-1 pt-1">
        <p className="text-sm text-gray-900">{step.instruction}</p>
        {step.distance && (
          <p className="text-xs text-gray-500 mt-1">{step.distance}m</p>
        )}
      </div>
    </div>
  )
}
