import LocationCurrentIcon from '@/assets/icons/btn_locationCurrent.png'

interface CurrentLocationButtonProps {
  onClick: () => void
  className?: string
}

export const CurrentLocationButton = ({ onClick, className = '' }: CurrentLocationButtonProps) => {
  return (
    <button onClick={onClick} className={className}>
      <img src={LocationCurrentIcon} alt="현재 위치" className="w-full h-full" />
    </button>
  )
}
