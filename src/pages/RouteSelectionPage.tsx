import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DualSearchBar } from '@/components/Route/DualSearchBar'
import { BuildingList } from '@/components/Building/BuildingList'
import { BuildingListItem } from '@/types/building'
import { apiService } from '@/services/api'
import CloseIcon from '@/assets/icons/icons_close.svg'

type SelectionMode = 'start' | 'end' | null

interface RouteState {
  selectedBuilding?: {
    id: string
    name: string
  }
  mode?: 'start' | 'end'
}

const RouteSelectionPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as RouteState | null

  const [startPoint, setStartPoint] = useState<BuildingListItem | null>(null)
  const [endPoint, setEndPoint] = useState<BuildingListItem | null>(null)
  const [buildings, setBuildings] = useState<BuildingListItem[]>([])
  const [filteredBuildings, setFilteredBuildings] = useState<BuildingListItem[]>([])
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadBuildings()
  }, [])

  useEffect(() => {
    if (state?.selectedBuilding && state?.mode && buildings.length > 0) {
      const building = buildings.find((b) => b.id === state.selectedBuilding!.id)
      if (building) {
        if (state.mode === 'start') {
          setStartPoint(building)
          setSelectionMode('end')
        } else {
          setEndPoint(building)
          setSelectionMode('start')
        }
      }
    }
  }, [state, buildings])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBuildings(buildings)
    } else {
      setFilteredBuildings(
        buildings.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
  }, [searchQuery, buildings])

  const loadBuildings = async () => {
    try {
      const data = await apiService.getBuildings()
      const buildingList: BuildingListItem[] = data.map((building) => ({
        id: building.nodeId,
        name: building.nodeName,
        department: '',
        imageUrl: '',
      }))
      setBuildings(buildingList)
      setFilteredBuildings(buildingList)
    } catch (error) {
      console.error('Failed to load buildings:', error)
    }
  }

  const handleBuildingSelect = (building: BuildingListItem) => {
    if (selectionMode === 'start') {
      setStartPoint(building)
      setSelectionMode(null)
    } else if (selectionMode === 'end') {
      setEndPoint(building)
      setSelectionMode(null)
    }
    setSearchQuery('')
  }

  const handleSwap = () => {
    const temp = startPoint
    setStartPoint(endPoint)
    setEndPoint(temp)
  }

  const handleStartSearch = () => {
    setSelectionMode('start')
  }

  const handleEndSearch = () => {
    setSelectionMode('end')
  }

  const handleBack = () => {
    if (selectionMode) {
      setSelectionMode(null)
      setSearchQuery('')
    } else {
      navigate('/')
    }
  }

  const handleSearch = () => {
    if (startPoint && endPoint) {
      console.log('경로 검색:', startPoint, endPoint)
    }
  }

  return (
    <div className="relative w-full h-full bg-white flex flex-col">
      <div style={{ backgroundColor: '#501B1B' }} className="shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {selectionMode && (
            <h1 className="text-lg font-semibold text-white">
              {selectionMode === 'start' ? '출발지 선택' : '도착지 선택'}
            </h1>
          )}
          {!selectionMode && <div />}
          <button onClick={handleBack} className="p-1">
            <img src={CloseIcon} alt="닫기" width={17} height={17} />
          </button>
        </div>

        {!selectionMode && (
          <div className="relative px-4 pb-4">
            <DualSearchBar
              startValue={startPoint?.name || ''}
              endValue={endPoint?.name || ''}
              onStartClick={handleStartSearch}
              onEndClick={handleEndSearch}
              onSwap={handleSwap}
            />
          </div>
        )}

        {selectionMode && (
          <div className="px-4 pb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="건물 이름을 검색하세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-primary"
              autoFocus
            />
          </div>
        )}
      </div>

      {selectionMode && (
        <div className="flex-1 overflow-y-auto">
          <BuildingList buildings={filteredBuildings} onBuildingClick={handleBuildingSelect} />
        </div>
      )}

      {!selectionMode && startPoint && endPoint && (
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSearch}
            className="w-full py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90"
          >
            경로 검색
          </button>
        </div>
      )}
    </div>
  )
}

export default RouteSelectionPage
