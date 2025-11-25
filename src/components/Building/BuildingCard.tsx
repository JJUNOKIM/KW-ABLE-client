import { BuildingListItem } from '@/types/building'
import BtnArrow from '@/assets/icons/btn_arrow.svg'

interface BuildingCardProps {
  building: BuildingListItem
  onClick?: () => void
}

export const BuildingCard = ({ building, onClick }: BuildingCardProps) => {
  return (
    <div
      onClick={onClick}
      className="relative flex-shrink-0 w-[250px] h-[112px] bg-[#501b1b] rounded-xl shadow-[0px_2px_48px_0px_rgba(0,0,0,0.08)] cursor-pointer snap-center"
    >
      <div className="absolute left-5 top-[21px] w-[70px] h-[70px] rounded-lg overflow-hidden bg-gray-300">
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

      <div className="absolute left-[100px] top-1/2 -translate-y-1/2 w-[116px]">
        <p className="text-white font-bold text-[14px] mb-[5px] tracking-wide">
          {building.name}
        </p>
        {building.department && (
          <p className="text-white text-[14px] mb-[5px] tracking-wide">
            {building.department}
          </p>
        )}
        {building.distance !== undefined && (
          <p className="text-white text-[10px] tracking-wide">
            현 위치에서 {building.distance}m
          </p>
        )}
      </div>

      <div className="absolute right-[17px] top-[15px] w-6 h-6">
        <img src={BtnArrow} alt="arrow" className="w-full h-full" />
      </div>
    </div>
  )
}
