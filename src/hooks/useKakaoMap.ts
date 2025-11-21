import { useEffect, useRef, useState } from 'react'
import { Location } from '@/types/location'
import CurrentLocationIcon from '@/assets/icons/current.svg'

interface UseKakaoMapProps {
  center?: Location
  level?: number
  showCurrentLocation?: boolean
}

export const useKakaoMap = ({ center, level = 3, showCurrentLocation = false }: UseKakaoMapProps = {}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const markerRef = useRef<kakao.maps.CustomOverlay | null>(null)

  useEffect(() => {
    if (!window.kakao?.maps) {
      console.error('카카오맵 SDK를 불러올 수 없습니다')
      return
    }

    window.kakao.maps.load(() => {
      if (!mapRef.current) return

      const defaultCenter = center || {
        latitude: 37.6205,
        longitude: 127.0593,
      }

      const mapCenter = new window.kakao.maps.LatLng(defaultCenter.latitude, defaultCenter.longitude)
      const options = {
        center: mapCenter,
        level: level,
      }

      const newMap = new window.kakao.maps.Map(mapRef.current, options)
      setMap(newMap)
      setIsLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!map || !center) return

    const newCenter = new window.kakao.maps.LatLng(center.latitude, center.longitude)
    map.setCenter(newCenter)

    if (showCurrentLocation) {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }

      const markerDiv = document.createElement('div')
      markerDiv.style.cssText = 'position: relative; width: 26px; height: 26px;'

      const img = document.createElement('img')
      img.src = CurrentLocationIcon
      img.alt = '현재 위치'
      img.style.cssText = 'width: 26px; height: 26px; display: block;'

      markerDiv.appendChild(img)

      const overlay = new window.kakao.maps.CustomOverlay({
        position: newCenter,
        content: markerDiv,
        yAnchor: 0.5,
      })

      overlay.setMap(map)
      markerRef.current = overlay
    } else {
      if (markerRef.current) {
        markerRef.current.setMap(null)
        markerRef.current = null
      }
    }
  }, [map, center, showCurrentLocation])

  return { mapRef, map, isLoaded }
}
