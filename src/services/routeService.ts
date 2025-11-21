import { apiClient } from './api'
import { Route, RouteRequest, convertRouteResponse } from '@/types/route'
import { RouteResponse } from '@/types/api'

export const routeService = {
  // 경로 검색
  async getRoute(startNodeId: string, endNodeId: string): Promise<Route> {
    const response = await apiClient.get<RouteResponse>('/api/route', {
      params: {
        startNodeId,
        endNodeId,
      },
    })

    return convertRouteResponse(response.data)
  },

  async findRoute(request: RouteRequest): Promise<Route> {
    return this.getRoute(request.startNodeId, request.endNodeId)
  },
}
