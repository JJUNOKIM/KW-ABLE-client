import { useKakaoMap } from '@/hooks/useKakaoMap.tsx'
import { Location } from '@/types/location'

export interface NodeData {
  nodeId: string
  nodeName: string
  latitude: number
  longitude: number
  distance?: number
}

interface KakaoMapProps {
  center?: Location
  level?: number
  className?: string
  showCurrentLocation?: boolean
  nodes?: NodeData[]
  onNodeClick?: (node: NodeData) => void
}

export const KakaoMap = ({
  center,
  level = 3,
  className = '',
  showCurrentLocation = false,
  nodes = [],
  onNodeClick
}: KakaoMapProps) => {
  const { mapRef, isLoaded } = useKakaoMap({
    center,
    level,
    showCurrentLocation,
    nodes,
    onNodeClick
  })

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
