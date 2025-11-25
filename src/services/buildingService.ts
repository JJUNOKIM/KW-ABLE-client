import { apiClient } from './api'
import { Building, BuildingListItem, convertNodeToBuildingListItem } from '@/types/building'
import { BuildingResponse } from '@/types/api'
import { getBuildingImage } from '@/utils/buildingImages'
import { getBuildingDetail } from '@/data/buildingDetails'

// 두 좌표 간 거리 계산
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const buildingService = {
  // 전체 건물 목록 조회
  async getBuildings(): Promise<BuildingListItem[]> {
    const response = await apiClient.get<BuildingResponse[]>('/api/buildings')

    return response.data.map((building) =>
      convertNodeToBuildingListItem(
        {
          nodeId: building.nodeId,
          nodeName: building.nodeName,
          nodeType: '',
          latitude: building.latitude,
          longitude: building.longitude,
        },
        undefined,
        getBuildingImage(building.nodeName)
      )
    )
  },

  // 건물 검색
  async searchBuildings(searchQuery: string): Promise<BuildingListItem[]> {
    const buildings = await this.getBuildings()

    if (!searchQuery) {
      return buildings
    }

    const query = searchQuery.toLowerCase().trim()
    return buildings.filter((building) => {
      return building.name.toLowerCase().includes(query)
    })
  },

  // 건물 상세 정보 조회
  async getBuildingDetail(buildingId: string): Promise<Building | null> {
    const buildings = await this.getBuildings()
    const found = buildings.find((b) => b.id === buildingId)

    if (!found) {
      return null
    }

    return {
      id: found.id,
      name: found.name,
      latitude: 0,
      longitude: 0,
      distance: found.distance,
      department: found.department,
      imageUrl: found.imageUrl,
    }
  },

  // 사용자 위치 기준 주변 건물 조회
  async getNearbyBuildings(userLatitude: number, userLongitude: number): Promise<BuildingListItem[]> {
    const response = await apiClient.get<BuildingResponse[]>('/api/buildings')

    const buildingsWithDistance = response.data.map((building) => {
      const distance = calculateDistance(userLatitude, userLongitude, building.latitude, building.longitude)

      return convertNodeToBuildingListItem(
        {
          nodeId: building.nodeId,
          nodeName: building.nodeName,
          nodeType: '',
          latitude: building.latitude,
          longitude: building.longitude,
        },
        Math.round(distance),
        getBuildingImage(building.nodeName)
      )
    })

    return buildingsWithDistance.sort((a, b) => {
      const distA = a.distance ?? Number.MAX_VALUE
      const distB = b.distance ?? Number.MAX_VALUE
      return distA - distB
    })
  },
}
