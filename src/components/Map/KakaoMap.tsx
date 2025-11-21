import { useKakaoMap } from '@/hooks/useKakaoMap'
import { Location } from '@/types/location'

interface KakaoMapProps {
  center?: Location
  level?: number
  className?: string
  showCurrentLocation?: boolean
}

export const KakaoMap = ({ center, level = 3, className = '', showCurrentLocation = false }: KakaoMapProps) => {
  const { mapRef, isLoaded } = useKakaoMap({ center, level, showCurrentLocation })

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">로딩중...</div>
        </div>
      )}
    </div>
  )
}
