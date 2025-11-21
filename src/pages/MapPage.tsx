import { useState, useEffect } from 'react'
import { KakaoMap } from '@/components/Map/KakaoMap'
import { SearchBar } from '@/components/Map/SearchBar'
import { CurrentLocationButton } from '@/components/Map/CurrentLocationButton'
import { BuildingCard } from '@/components/Building/BuildingCard'
import { BuildingList } from '@/components/Building/BuildingList'
import { BuildingDetailSheet } from '@/components/Building/BuildingDetailSheet'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Building, BuildingListItem } from '@/types/building'
import BoardingPointLogo from '@/assets/icons/Boarding Point.svg'

type ViewMode = 'initial' | 'search' | 'detail' | 'route'

const MapPage = () => {
  const { location } = useGeolocation()
  const [viewMode, setViewMode] = useState<ViewMode>('initial')
  const [buildings, setBuildings] = useState<BuildingListItem[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mapCenter, setMapCenter] = useState(location)

  // 건물 목록 로드 ( 더미 데이터 )
  // API 연동하면 buildingService.getBuildings() 사용
  useEffect(() => {
    const mockBuildings: BuildingListItem[] = [
      {
        id: '1',
        name: '새빛관',
        department: '인공지능융합대학',
        distance: 100,
        imageUrl: '',
      },
      {
        id: '2',
        name: '비마관',
        department: '공과대학',
        distance: 150,
        imageUrl: '',
      },
      {
        id: '3',
        name: '참빛관',
        department: '자연과학대학',
        distance: 200,
        imageUrl: '',
      },
      {
        id: '4',
        name: '옥의관',
        department: '경영대학',
        distance: 250,
        imageUrl: '',
      },
      {
        id: '5',
        name: '화도관',
        department: '사회과학대학',
        distance: 300,
        imageUrl: '',
      }
    ]
    setBuildings(mockBuildings)
  }, [])

  const handleSearchFocus = () => {
    setViewMode('search')
  }

  const handleSearchBack = () => {
    setViewMode('initial')
    setSearchQuery('')
  }

  //API 연동하면 buildingService.getBuildingDetail() 사용
  const handleBuildingCardClick = async (building: BuildingListItem) => {
    const mockDetail: Building = {
      ...building,
      latitude: 37.6205,
      longitude: 127.0593,
      phone: '02-940-5114',
      accessibility: {
        wheelchairAccess: 4,
        hasElevator: true,
        elevatorLocation: '1층',
        hasAccessibleRestroom: true,
        accessibleRestroomFloor: '2F',
      },
    }
    setSelectedBuilding(mockDetail)
    setViewMode('detail')
  }

  const handleCloseDetail = () => {
    setSelectedBuilding(null)
    setViewMode('initial')
  }

  const handleCurrentLocation = () => {
    if (location) {
      setMapCenter({ ...location })
    }
  }

  // 사용자 위치 변경 시 지도 중심 이동
  useEffect(() => {
    if (location) {
      setMapCenter(location)
    }
  }, [location])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 지도 */}
      <KakaoMap center={mapCenter || undefined} level={3} showCurrentLocation={!!location} />

      {/* 헤더 */}
      <div className="absolute top-6 left-0 right-0 z-10 safe-area-top">
        {viewMode === 'initial' && (
          <div className="bg-transparent">
            <div className="px-5 py-3">
              <img src={BoardingPointLogo} alt="Boarding Point" className="mb-2" width={82} height={17} />
            </div>
            <div className="px-5 pb-4">
              <SearchBar placeholder="내 주변 건물을 검색해보세요!" onFocus={handleSearchFocus} />
            </div>
          </div>
        )}

        {viewMode === 'search' && (
          <div className="bg-white shadow-md px-5 py-3">
            <SearchBar
              placeholder="광운대학교 건물 검색"
              showBackButton
              onBack={handleSearchBack}
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        )}
      </div>

      {/* 검색 결과 */}
      {viewMode === 'search' && (
        <div className="absolute top-[72px] left-0 right-0 bottom-0 z-20 bg-white">
          <BuildingList
            buildings={buildings.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))}
            onBuildingClick={handleBuildingCardClick}
          />
        </div>
      )}

      {/* 카드 */}
      {viewMode === 'initial' && (
        <div className="absolute bottom-10 left-0 right-0 z-10 pb-6 safe-area-bottom">
          <div className="flex gap-4 px-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
            {buildings.slice(0, 5).map((building) => (
              <BuildingCard key={building.id} building={building} onClick={() => handleBuildingCardClick(building)} />
            ))}
          </div>
        </div>
      )}

      {/* 현재 위치로 이동 버튼 */}
      {(viewMode === 'initial' || viewMode === 'detail') && (
        <CurrentLocationButton onClick={handleCurrentLocation} className="absolute bottom-44 right-5 z-10" />
      )}

      {/* 빌딩 정보 파트 */}
      {viewMode === 'detail' && selectedBuilding && (
        <BuildingDetailSheet
          building={selectedBuilding}
          onClose={handleCloseDetail}
          onSetStart={() => console.log('출발 설정')}
          onSetDestination={() => console.log('도착 설정')}
        />
      )}
    </div>
  )
}

export default MapPage
