interface NodeMarkerProps {
  name: string
  distance?: number
  onClick?: () => void
}

export const NodeMarker = ({ name, distance, onClick }: NodeMarkerProps) => {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    onClick?.()
  }

  return (
    <div
      onClick={handleClick}
      onTouchEnd={handleClick}
      className="cursor-pointer bg-white border border-[#FF7C7C] rounded-[8px] px-2 py-1 whitespace-nowrap shadow-sm hover:shadow-md transition-shadow"
      style={{ touchAction: 'auto' }}
    >
      <div className="flex flex-col gap-0.5 items-center">
        <span className="text-[11px] font-semibold text-gray-800">{name}</span>
        {distance !== undefined && (
          <span className="text-[9px] text-gray-500">현 위치에서 {Math.round(distance)}m</span>
        )}
      </div>
    </div>
  )
}
