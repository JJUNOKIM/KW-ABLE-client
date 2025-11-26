import axios, { AxiosInstance } from 'axios'
import { BuildingResponse, RouteResponse } from '@/types/api'

// Vercel Serverless Functions를 사용하므로 상대 경로로 요청
const API_BASE_URL = ''

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error)
        return Promise.reject(error)
      }
    )
  }

  getClient() {
    return this.client
  }

  async getBuildings(): Promise<BuildingResponse[]> {
    const response = await this.client.get<BuildingResponse[]>('/api/buildings')
    return response.data
  }

  async getRoute(startNodeId: string, endNodeId: string): Promise<RouteResponse> {
    const response = await this.client.get<RouteResponse>('/api/route', {
      params: { startNodeId, endNodeId },
    })
    return response.data
  }
}

export const apiService = new ApiService()
export const apiClient = apiService.getClient()
