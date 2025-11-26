import { useLocation, useNavigate } from 'react-router-dom'
import { KakaoMap } from '@/components/Map/KakaoMap'
import { RouteResponse } from '@/types/api'
import { BuildingListItem } from '@/types/building'
import CloseIcon from '@/assets/icons/icons_close.svg'
import { useEffect, useState } from 'react'

interface RouteResultState {
  route: RouteResponse
  startPoint: BuildingListItem
  endPoint: BuildingListItem
}

const RouteResultPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as RouteResultState | null

  const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number } | undefined>()

  useEffect(() => {
    if (!state?.route) {
      navigate('/route')
      return
    }

    if (state.route.startNode && state.route.endNode) {
      const centerLat = (state.route.startNode.latitude + state.route.endNode.latitude) / 2
      const centerLng = (state.route.startNode.longitude + state.route.endNode.longitude) / 2
      setMapCenter({ latitude: centerLat, longitude: centerLng })
    }
  }, [state, navigate])

  if (!state?.route) {
    return null
  }

  const { route, startPoint, endPoint } = state

  const handleBack = () => {
    navigate('/route')
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* 지도 */}
      <div className="flex-1 relative">
        <KakaoMap center={mapCenter} level={2} route={route} />

        {/* 상단 헤더 */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <div
            style={{ backgroundColor: '#501B1B' }}
            className="flex items-center justify-between px-4 py-3 shadow-md"
          >
            <h1 className="text-lg font-semibold text-white">경로 안내</h1>
            <button onClick={handleBack} className="p-1">
              <img src={CloseIcon} alt="닫기" width={17} height={17} />
            </button>
          </div>
        </div>

        {/* 하단 경로 정보 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-2xl shadow-lg">
          <div className="p-5">
            {/* 출발지 - 도착지 */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#536DFE' }}></div>
                  <span className="text-base font-semibold">{startPoint.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#501B1B' }}></div>
                  <span className="text-base font-semibold">{endPoint.name}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/route-guidance', { state: { route, startPoint, endPoint } })}
                className="px-5 py-2.5 rounded-lg text-white font-semibold whitespace-nowrap ml-4"
                style={{ backgroundColor: '#501B1B' }}
              >
                안내시작
              </button>
            </div>

            {/* 경로 요약 정보 */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">거리</p>
                <p className="text-base font-semibold">
                  {route.summary.totalDistance > 1000
                    ? `${(route.summary.totalDistance / 1000).toFixed(1)}km`
                    : `${Math.round(route.summary.totalDistance)}m`}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">소요시간</p>
                <p className="text-base font-semibold">
                  {Math.ceil(route.summary.totalDuration / 60)}분
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">경사로</p>
                <p className="text-base font-semibold">{route.summary.rampCount}회</p>
              </div>
            </div>

            {/* 접근성 정보 */}
            {route.summary.accessibilitySummary && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{route.summary.accessibilitySummary}</p>
              </div>
            )}

            {/* 경로 상세 정보 */}
            {route.summary.elevatorCount > 0 ||
            route.summary.rampCount > 0 ||
            route.summary.stairCount > 0 ? (
              <div className="mt-3 flex gap-3 text-xs text-gray-600">
                {route.summary.elevatorCount > 0 && (
                  <span>엘리베이터 {route.summary.elevatorCount}회</span>
                )}
                {route.summary.rampCount > 0 && (
                  <span>경사로 {route.summary.rampCount}회</span>
                )}
                {route.summary.stairCount > 0 && (
                  <span>계단 {route.summary.stairCount}회</span>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteResultPage
