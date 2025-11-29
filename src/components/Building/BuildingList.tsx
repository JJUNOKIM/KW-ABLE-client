import { memo } from 'react'
import { BuildingListItem } from '@/types/building'

interface BuildingListProps {
  buildings: BuildingListItem[]
  onBuildingClick: (building: BuildingListItem) => void
}

const BuildingListItemComponent = memo(({
  building,
  onClick
}: {
  building: BuildingListItem
  onClick: () => void
}) => (
  <div
    onClick={onClick}
    className="flex items-center gap-4 p-4 border-b border-gray-100 cursor-pointer"
  >
    <div className="flex-1">
      <h3 className="text-lg font-bold text-gray-900 mb-1">{building.name}</h3>
      {building.department && (
        <p className="text-sm text-gray-600 mb-1">{building.department}</p>
      )}
      {building.distance !== undefined && (
        <p className="text-sm text-gray-500">현위치에서 {building.distance}m</p>
      )}
    </div>
    <div className="w-[70px] h-[70px] flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
      {building.imageUrl ? (
        <img
          src={building.imageUrl}
          alt={building.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          No Image
        </div>
      )}
    </div>
  </div>
))

BuildingListItemComponent.displayName = 'BuildingListItemComponent'

export const BuildingList = memo(({ buildings, onBuildingClick }: BuildingListProps) => {
  return (
    <div className="bg-white h-full overflow-y-auto">
      {buildings.map((building) => (
        <BuildingListItemComponent
          key={building.id}
          building={building}
          onClick={() => onBuildingClick(building)}
        />
      ))}
    </div>
  )
})
