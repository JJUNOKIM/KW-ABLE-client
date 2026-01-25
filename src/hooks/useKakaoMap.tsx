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
  const KW_UNIV_LOCATION = {
    latitude: 37.6194,
    longitude: 127.0598
  };

  const activeCenter = KW_UNIV_LOCATION;

  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const markerRef = useRef<kakao.maps.CustomOverlay | null>(null)
  const nodeMarkersRef = useRef<kakao.maps.CustomOverlay[]>([])
  const polylinesRef = useRef<kakao.maps.Polyline[]>([])
  const startMarkerRef = useRef<kakao.maps.CustomOverlay | null>(null)
  const endMarkerRef = useRef<kakao.maps.CustomOverlay | null>(null)
  const isBoundsSet = useRef(false)
  const currentRoute = useRef<RouteResponse | null>(null)

  useEffect(() => {
    if (!window.kakao?.maps) {
      return
    }

    window.kakao.maps.load(() => {
      if (!mapRef.current) return

      const mapCenter = new window.kakao.maps.LatLng(
        activeCenter.latitude, 
        activeCenter.longitude
      )

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
    if (!map || !activeCenter) return

    const newCenter = new window.kakao.maps.LatLng(activeCenter.latitude, activeCenter.longitude)
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
  }, [map, activeCenter, showCurrentLocation])

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

    if (!route?.edges?.length) {
      if (currentRoute.current !== null) {
        polylinesRef.current.forEach((polyline) => polyline.setMap(null))
        polylinesRef.current = []
        startMarkerRef.current?.setMap(null)
        startMarkerRef.current = null
        endMarkerRef.current?.setMap(null)
        endMarkerRef.current = null
        currentRoute.current = null
        isBoundsSet.current = false
      }
      return
    }

    if (currentRoute.current === route) {
      return
    }

    polylinesRef.current.forEach((polyline) => polyline.setMap(null))
    polylinesRef.current = []

    const bounds = new window.kakao.maps.LatLngBounds()
    const edgesWithWarning = mapWarningsToEdges(route)

    edgesWithWarning.forEach((edge) => {
      const startPos = new window.kakao.maps.LatLng(
        edge.fromNode.latitude,
        edge.fromNode.longitude
      )
      const endPos = new window.kakao.maps.LatLng(
        edge.toNode.latitude,
        edge.toNode.longitude
      )

      bounds.extend(startPos)
      bounds.extend(endPos)

      const line = new window.kakao.maps.Polyline({
        path: [startPos, endPos],
        strokeWeight: 8,
        strokeColor: getRouteColor(edge.difficultyLevel, edge.hasWarning),
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
        zIndex: 100,
      })

      line.setMap(map)
      polylinesRef.current.push(line)
    })

    map.setBounds(bounds)
    isBoundsSet.current = true

    setTimeout(() => {
      if (map) {
        map.relayout()
        const level = map.getLevel()
        map.setLevel(level)
      }
    }, 150)

    if (route.startNode) {
      startMarkerRef.current?.setMap(null)

      const markerEl = document.createElement('div')
      markerEl.style.cssText = `
        width: 16px;
        height: 16px;
        background-color: #536DFE;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `

      const startOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(
          route.startNode.latitude,
          route.startNode.longitude
        ),
        content: markerEl,
        yAnchor: 0.5,
      })

      startOverlay.setMap(map)
      startMarkerRef.current = startOverlay
    }

    if (route.endNode) {
      endMarkerRef.current?.setMap(null)

      const markerEl = document.createElement('div')
      markerEl.style.cssText = `
        width: 16px;
        height: 16px;
        background-color: #501B1B;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `

      const endOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(
          route.endNode.latitude,
          route.endNode.longitude
        ),
        content: markerEl,
        yAnchor: 0.5,
      })

      endOverlay.setMap(map)
      endMarkerRef.current = endOverlay
    }

    currentRoute.current = route

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