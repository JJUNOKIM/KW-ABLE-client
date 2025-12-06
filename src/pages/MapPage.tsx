import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { KakaoMap, NodeData } from '@/components/Map/KakaoMap'
import { SearchBar } from '@/components/Map/SearchBar'
import { CurrentLocationButton } from '@/components/Map/CurrentLocationButton'
import { BuildingCard } from '@/components/Building/BuildingCard'
import { BuildingList } from '@/components/Building/BuildingList'
import { BuildingDetailSheet } from '@/components/Building/BuildingDetailSheet'
import { useGeolocation } from '@/hooks/useGeolocation'
import { Building, BuildingListItem } from '@/types/building'
import { getBuildingImage } from '@/utils/buildingImages'
import { getBuildingDetail } from '@/data/buildingDetails'
import BoardingPointLogo from '@/assets/icons/Boarding Point.svg'

type ViewMode = 'initial' | 'search' | 'detail' | 'route'

const MapPage = () => {
  const navigate = useNavigate()
  const { location } = useGeolocation()
  const [viewMode, setViewMode] = useState<ViewMode>('initial')
  const [buildings, setBuildings] = useState<BuildingListItem[]>([])
  const [nodes, setNodes] = useState<NodeData[]>([])
  const [rawBuildingsData, setRawBuildingsData] = useState<any[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mapCenter, setMapCenter] = useState(location)

  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3
    const toRad = (deg: number) => (deg * Math.PI) / 180

    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [])

  useEffect(() => {
    const loadBuildingsAndNodes = async () => {
      try {
        const response = await fetch('/api/buildings')
        const rawData = await response.json()
        setRawBuildingsData(rawData)
      } catch (error) {
        console.error('건물 데이터 로드 실패:', error)
        setRawBuildingsData([])
        const mockBuildings: BuildingListItem[] = [
          {
            id: '1',
            name: '새빛관',
            department: '인공지능융합대학',
            distance: 100,
            imageUrl: getBuildingImage('새빛관'),
          },
          {
            id: '2',
            name: '비마관',
            department: '공과대학',
            distance: 150,
            imageUrl: getBuildingImage('비마관'),
          },
          {
            id: '3',
            name: '참빛관',
            department: '자연과학대학',
            distance: 200,
            imageUrl: getBuildingImage('참빛관'),
          },
          {
            id: '4',
            name: '옥의관',
            department: '경영대학',
            distance: 250,
            imageUrl: getBuildingImage('옥의관'),
          },
          {
            id: '5',
            name: '화도관',
            department: '사회과학대학',
            distance: 300,
            imageUrl: getBuildingImage('화도관'),
          }
        ]
        setBuildings(mockBuildings)
      }
    }

    loadBuildingsAndNodes()
  }, [])

  const buildingsWithDistance = useMemo(() => {
    if (!rawBuildingsData.length) return []

    return rawBuildingsData.map((item: any) => {
      let distance: number | undefined

      if (location) {
        distance = calculateDistance(
          location.latitude,
          location.longitude,
          item.latitude,
          item.longitude
        )
      }

      const detail = getBuildingDetail(item.nodeId)

      return {
        id: item.nodeId,
        name: item.nodeName,
        department: detail?.department,
        distance: distance ? Math.round(distance) : undefined,
        imageUrl: getBuildingImage(item.nodeName),
      }
    })
  }, [rawBuildingsData, location, calculateDistance])

  const nodesWithDistance = useMemo(() => {
    if (!rawBuildingsData.length) return []

    return rawBuildingsData.map((item: any) => {
      let distance: number | undefined

      if (location) {
        distance = calculateDistance(
          location.latitude,
          location.longitude,
          item.latitude,
          item.longitude
        )
      }

      return {
        nodeId: item.nodeId,
        nodeName: item.nodeName,
        latitude: item.latitude,
        longitude: item.longitude,
        distance,
      }
    })
  }, [rawBuildingsData, location, calculateDistance])

  useEffect(() => {
    setBuildings(buildingsWithDistance)
    setNodes(nodesWithDistance)
  }, [buildingsWithDistance, nodesWithDistance])

  const handleSearchFocus = () => {
    setViewMode('search')
  }

  const handleSearchBack = () => {
    setViewMode('initial')
    setSearchQuery('')
  }

  const handleBuildingCardClick = useCallback((building: BuildingListItem) => {
    requestAnimationFrame(() => {
      const detail = getBuildingDetail(building.id)
      const nodeData = rawBuildingsData.find((item: any) => item.nodeId === building.id)

      const buildingDetail: Building = {
        ...building,
        latitude: nodeData?.latitude || 37.6205,
        longitude: nodeData?.longitude || 127.0593,
        phone: detail?.phone || '02-940-5114',
        accessibility: detail?.accessibility,
      }

      setSelectedBuilding(buildingDetail)
      setViewMode('detail')
    })
  }, [rawBuildingsData])

  const handleCloseDetail = () => {
    setSelectedBuilding(null)
    setViewMode('initial')
  }

  const handleCurrentLocation = () => {
    if (location) {
      setMapCenter({ ...location })
    }
  }

  useEffect(() => {
    if (location) {
      setMapCenter(location)
    }
  }, [location])

  const handleNodeClick = (node: NodeData) => {
    setMapCenter({ latitude: node.latitude, longitude: node.longitude })
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <KakaoMap
        center={mapCenter || undefined}
        level={3}
        showCurrentLocation={!!location}
        nodes={nodes}
        onNodeClick={handleNodeClick}
      />

      <div className="absolute top-6 left-0 right-0 z-10 safe-area-top">
        <div className={`bg-transparent ${viewMode === 'initial' ? 'block' : 'hidden'}`}>
          <div className="px-5 py-3">
            <img src={BoardingPointLogo} alt="Boarding Point" className="mb-2" width={82} height={17} />
          </div>
          <div className="px-5 pb-4">
            <SearchBar placeholder="내 주변 건물을 검색해보세요!" onFocus={handleSearchFocus} />
          </div>
        </div>

        <div className={`bg-white shadow-md px-5 py-3 ${viewMode === 'search' ? 'block' : 'hidden'}`}>
          <SearchBar
            placeholder="광운대학교 건물 검색"
            showBackButton
            onBack={handleSearchBack}
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
      </div>

      <div className={`absolute top-[72px] left-0 right-0 bottom-0 z-20 bg-white ${viewMode === 'search' ? 'block' : 'hidden'}`}>
        <BuildingList
          buildings={buildings.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))}
          onBuildingClick={handleBuildingCardClick}
        />
      </div>

      <div className={`absolute bottom-10 left-0 right-0 z-10 pb-6 safe-area-bottom ${viewMode === 'initial' ? 'block' : 'hidden'}`}>
        <div className="flex gap-4 px-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
          {buildings.map((building) => (
            <BuildingCard key={building.id} building={building} onClick={() => handleBuildingCardClick(building)} />
          ))}
        </div>
      </div>

      {(viewMode === 'initial' || viewMode === 'detail') && (
        <CurrentLocationButton onClick={handleCurrentLocation} className="absolute bottom-44 right-5 z-10" />
      )}

      {viewMode === 'detail' && selectedBuilding && (
        <BuildingDetailSheet
          building={selectedBuilding}
          onClose={handleCloseDetail}
          onSetStart={() => {
            navigate('/route', {
              state: {
                selectedBuilding: { id: selectedBuilding.id, name: selectedBuilding.name },
                mode: 'start',
              },
            })
          }}
          onSetDestination={() => {
            navigate('/route', {
              state: {
                selectedBuilding: { id: selectedBuilding.id, name: selectedBuilding.name },
                mode: 'end',
              },
            })
          }}
        />
      )}
    </div>
  )
}

export default MapPage
