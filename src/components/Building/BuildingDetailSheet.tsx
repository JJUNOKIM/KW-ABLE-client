import { Building } from '@/types/building'
import PhoneIcon from '@/assets/icons/icons_telephone.svg'
import WheelchairIcon from '@/assets/icons/icons_wheelchair.svg'
import ElevatorIcon from '@/assets/icons/icons_elevator.svg'
import BathroomIcon from '@/assets/icons/icons_bathroom.svg'

interface BuildingDetailSheetProps {
  building: Building
  onClose: () => void
  onSetStart: () => void
  onSetDestination: () => void
}

export const BuildingDetailSheet = ({
  building,
  onClose,
  onSetStart,
  onSetDestination,
}: BuildingDetailSheetProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />

      <div className="relative bg-white rounded-t-2xl shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-14 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-6 mb-4">
          <div className="w-full h-36 bg-gray-200 rounded-lg overflow-hidden">
            {building.imageUrl ? (
              <img
                src={building.imageUrl}
                alt={building.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{building.name}</h2>
            {building.distance !== undefined && (
              <span className="text-xs text-gray-500">까지 {building.distance}m</span>
            )}
          </div>

          {building.phone && (
            <div className="flex items-center gap-2 mb-4">
              <img src={PhoneIcon} alt="" width={14} height={15} />
              <span className="text-sm text-gray-700">{building.phone}</span>
            </div>
          )}

          {building.accessibility && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <img src={WheelchairIcon} alt="" width={16} height={16} />
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-gray-700">휠체어 접근성</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= building.accessibility!.wheelchairAccess ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {building.accessibility.hasElevator && (
                <div className="flex items-center gap-3">
                  <img src={ElevatorIcon} alt="" width={16} height={16} />
                  <span className="text-sm text-gray-700">엘레베이터 있음</span>
                </div>
              )}

              {building.accessibility.hasAccessibleRestroom && (
                <div className="flex items-center gap-3">
                  <img src={BathroomIcon} alt="" width={18} height={16} />
                  <span className="text-sm text-gray-700">
                    장애인 화장실 {building.accessibility.accessibleRestroomFloor || ''}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onSetStart}
              className="flex-1 py-3 border-2 border-primary text-primary rounded-lg font-medium"
            >
              출발
            </button>
            <button
              onClick={onSetDestination}
              className="flex-1 py-3 bg-primary text-white rounded-lg font-medium"
            >
              도착
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
