/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_MAP_KEY: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 카카오맵 API 타입
interface Window {
  kakao: any
}

declare namespace kakao.maps {
  class Map {
    constructor(container: HTMLElement, options: MapOptions)
    setCenter(latlng: LatLng): void
    getLevel(): number
    setLevel(level: number): void
    setBounds(bounds: LatLngBounds): void
    panBy(x: number, y: number): void
  }

  class LatLng {
    constructor(latitude: number, longitude: number)
  }

  class LatLngBounds {
    constructor()
    extend(latlng: LatLng): void
  }

  class Marker {
    constructor(options: MarkerOptions)
    setMap(map: Map | null): void
  }

  class CustomOverlay {
    constructor(options: CustomOverlayOptions)
    setMap(map: Map | null): void
  }

  class Polyline {
    constructor(options: PolylineOptions)
    setMap(map: Map | null): void
    setPath(path: LatLng[]): void
  }

  interface MapOptions {
    center: LatLng
    level: number
  }

  interface MarkerOptions {
    position: LatLng
    map?: Map
  }

  interface CustomOverlayOptions {
    position: LatLng
    content: string | HTMLElement
    map?: Map
    yAnchor?: number
    clickable?: boolean
  }

  interface PolylineOptions {
    path: LatLng[]
    strokeWeight?: number
    strokeColor?: string
    strokeOpacity?: number
    strokeStyle?: 'solid' | 'shortdash' | 'shortdot' | 'shortdashdot' | 'shortdashdotdot' | 'dot' | 'dash' | 'dashdot' | 'longdash' | 'longdashdot' | 'longdashdotdot'
    endArrow?: boolean
    zIndex?: number
  }
}
