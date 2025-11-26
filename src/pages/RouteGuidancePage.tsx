import { useLocation, useNavigate } from 'react-router-dom'
import { RouteResponse } from '@/types/api'
import { BuildingListItem } from '@/types/building'
import CloseIcon from '@/assets/icons/icons_close.svg'
import GoStraightIcon from '@/assets/icons/icons_goStraight.svg'
import TurnLeftIcon from '@/assets/icons/icons_turnLeft.svg'
import TurnRightIcon from '@/assets/icons/icons_turnRight.svg'
import WarnIcon from '@/assets/icons/icons_warn.svg'
import { useEffect } from 'react'
import { useKakaoMap } from '@/hooks/useKakaoMap'

interface RouteGuidanceState {
  route: RouteResponse
  startPoint: BuildingListItem
  endPoint: BuildingListItem
}

const RouteGuidancePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as RouteGuidanceState | null

  const defaultCenter = {
    latitude: 37.6205,
    longitude: 127.0593,
  }

  const { mapRef, map, isLoaded } = useKakaoMap({
    center: defaultCenter,
    level: 4,
    route: state?.route || null,
  })

  useEffect(() => {
    if (!state?.route) {
      navigate('/route')
    }
  }, [state, navigate])

  useEffect(() => {
    if (!map || !isLoaded || !state?.route || !mapRef.current) return

    const route = state.route
    const bounds = new window.kakao.maps.LatLngBounds()

    if (route.startNode) {
      bounds.extend(new window.kakao.maps.LatLng(route.startNode.latitude, route.startNode.longitude))
    }
    if (route.endNode) {
      bounds.extend(new window.kakao.maps.LatLng(route.endNode.latitude, route.endNode.longitude))
    }

    if (route.edges) {
      route.edges.forEach((edge) => {
        bounds.extend(new window.kakao.maps.LatLng(edge.fromNode.latitude, edge.fromNode.longitude))
        bounds.extend(new window.kakao.maps.LatLng(edge.toNode.latitude, edge.toNode.longitude))
      })
    }

    map.setBounds(bounds)

    setTimeout(() => {
      const mapHeight = mapRef.current?.offsetHeight || 0
      const sheetHeight = mapHeight * 0.5
      map.panBy(0, -sheetHeight / 3)
    }, 100)
  }, [map, isLoaded, state, mapRef])

  if (!state?.route) {
    return null
  }

  const { route, startPoint, endPoint } = state

  const handleBack = () => navigate(-1)

  const getTurnIcon = (turnType: string) => {
    const type = turnType.toLowerCase()
    if (type.includes('left')) return TurnLeftIcon
    if (type.includes('right')) return TurnRightIcon
    return GoStraightIcon
  }

  const getTurnDescription = (turnType: string) => {
    const type = turnType.toLowerCase()
    if (type.includes('sharp_left')) return '크게 좌회전'
    if (type.includes('left')) return '좌회전'
    if (type.includes('sharp_right')) return '크게 우회전'
    if (type.includes('right')) return '우회전'
    return '직진'
  }

  const instructions = route.instructions || []

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />

        <div className="absolute top-0 left-0 right-0 z-10">
          <div
            style={{ backgroundColor: '#501B1B' }}
            className="flex items-center justify-between px-4 py-3 shadow-md"
          >
            <h1 className="text-lg font-semibold text-white">경로 상세 안내</h1>
            <button onClick={handleBack} className="p-1">
              <img src={CloseIcon} alt="닫기" width={17} height={17} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 top-[50%] z-10 bg-white rounded-t-2xl shadow-lg flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {instructions.length > 0 ? (
              <div>
                <div className="px-5 py-4 border-b border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#536DFE' }}></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">출발</div>
                      <div className="text-base font-semibold text-gray-900">{startPoint.name}</div>
                    </div>
                  </div>
                </div>

                {instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className={`px-5 py-4 border-b border-gray-100 ${
                      instruction.warning ? 'bg-red-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={getTurnIcon(instruction.turnType)}
                          alt={getTurnDescription(instruction.turnType)}
                          className="w-8 h-8"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold">
                            {getTurnDescription(instruction.turnType)}
                          </span>
                          <span className="text-sm text-gray-600">{instruction.distance.toFixed(1)}m</span>
                        </div>
                      </div>

                      {instruction.warning && (
                        <div className="flex-shrink-0 flex flex-col items-center gap-1">
                          <img src={WarnIcon} alt="주의" className="w-6 h-6" />
                          <p className="text-xs text-red-600 font-medium text-center max-w-[100px]">{instruction.warning}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#501B1B' }}></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">도착</div>
                      <div className="text-base font-semibold text-gray-900">{endPoint.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">안내 정보가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteGuidancePage
