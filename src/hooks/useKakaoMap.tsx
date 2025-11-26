import { useEffect, useRef, useState } from 'react'
import { Location } from '@/types/location'
import { NodeData } from '@/components/Map/KakaoMap'
import { RouteResponse } from '@/types/api'
import CurrentLocationIcon from '@/assets/icons/current.svg'
import { createRoot } from 'react-dom/client'
import { NodeMarker } from '@/components/Map/NodeMarker'
import { getRouteColor } from '@/utils/routeColors'
import { mapWarningsToEdges } from '@/utils/routeWarnings'

interface UseKakaoMapProps {
  center?: Location
  level?: number
  showCurrentLocation?: boolean
  nodes?: NodeData[]
  onNodeClick?: (node: NodeData) => void
  route?: RouteResponse | null
}

export const useKakaoMap = ({
  center,
  level = 3,
  showCurrentLocation = false,
  nodes = [],
  onNodeClick,
  route = null
}: UseKakaoMapProps = {}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const markerRef = useRef<kakao.maps.CustomOverlay | null>(null)
  const nodeMarkersRef = useRef<kakao.maps.CustomOverlay[]>([])
  const polylinesRef = useRef<kakao.maps.Polyline[]>([])
  const startMarkerRef = useRef<kakao.maps.CustomOverlay | null>(null)
  const endMarkerRef = useRef<kakao.maps.CustomOverlay | null>(null)

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

  useEffect(() => {
    if (!map || !isLoaded) return

    nodeMarkersRef.current.forEach((overlay) => {
      overlay.setMap(null)
    })
    nodeMarkersRef.current = []

    nodes.forEach((node) => {
      const markerDiv = document.createElement('div')
      markerDiv.style.pointerEvents = 'auto'
      const root = createRoot(markerDiv)

      root.render(
        <NodeMarker
          name={node.nodeName}
          distance={node.distance}
          onClick={() => {
            onNodeClick?.(node)
          }}
        />
      )

      const position = new window.kakao.maps.LatLng(node.latitude, node.longitude)

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: markerDiv,
        yAnchor: 1.2,
        clickable: true,
      })

      overlay.setMap(map)
      nodeMarkersRef.current.push(overlay)
    })

    return () => {
      nodeMarkersRef.current.forEach((overlay) => {
        overlay.setMap(null)
      })
      nodeMarkersRef.current = []
    }
  }, [map, isLoaded, nodes, onNodeClick])

  useEffect(() => {
    if (!map || !isLoaded) return

    polylinesRef.current.forEach((polyline) => polyline.setMap(null))
    polylinesRef.current = []

    if (!route?.edges?.length) return

    const bounds = new window.kakao.maps.LatLngBounds()
    const edgesWithWarning = mapWarningsToEdges(route)

    edgesWithWarning.forEach((edge) => {
      const startLatLng = new window.kakao.maps.LatLng(
        edge.fromNode.latitude,
        edge.fromNode.longitude
      )
      const endLatLng = new window.kakao.maps.LatLng(
        edge.toNode.latitude,
        edge.toNode.longitude
      )

      bounds.extend(startLatLng)
      bounds.extend(endLatLng)

      const polyline = new window.kakao.maps.Polyline({
        path: [startLatLng, endLatLng],
        strokeWeight: 8,
        strokeColor: getRouteColor(edge.difficultyLevel, edge.hasWarning),
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
        zIndex: 100,
      })

      polyline.setMap(map)
      polylinesRef.current.push(polyline)
    })

    map.setBounds(bounds)

    if (route.startNode) {
      startMarkerRef.current?.setMap(null)

      const markerDiv = document.createElement('div')
      markerDiv.style.cssText = `
        width: 16px;
        height: 16px;
        background-color: #536DFE;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(
          route.startNode.latitude,
          route.startNode.longitude
        ),
        content: markerDiv,
        yAnchor: 0.5,
      })

      overlay.setMap(map)
      startMarkerRef.current = overlay
    }

    if (route.endNode) {
      endMarkerRef.current?.setMap(null)

      const markerDiv = document.createElement('div')
      markerDiv.style.cssText = `
        width: 16px;
        height: 16px;
        background-color: #501B1B;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `

      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(
          route.endNode.latitude,
          route.endNode.longitude
        ),
        content: markerDiv,
        yAnchor: 0.5,
      })

      overlay.setMap(map)
      endMarkerRef.current = overlay
    }

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null))
      polylinesRef.current = []
      startMarkerRef.current?.setMap(null)
      startMarkerRef.current = null
      endMarkerRef.current?.setMap(null)
      endMarkerRef.current = null
    }
  }, [map, isLoaded, route])

  return { mapRef, map, isLoaded }
}
