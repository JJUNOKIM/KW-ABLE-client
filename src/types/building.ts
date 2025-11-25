import { NodeDto } from './api'

export interface Building {
  id: string
  name: string
  nameEn?: string
  department?: string
  description?: string
  address?: string
  phone?: string
  latitude: number
  longitude: number
  distance?: number
  imageUrl?: string
  accessibility?: {
    wheelchairAccess: number
    hasElevator: boolean
    elevatorLocation?: string
    hasAccessibleRestroom: boolean
    accessibleRestroomFloor?: string
  }
}

export interface BuildingListItem {
  id: string
  name: string
  department?: string
  distance?: number
  imageUrl?: string
}

export function convertNodeToBuilding(node: NodeDto, distance?: number): Building {
  return {
    id: node.nodeId,
    name: node.nodeName,
    latitude: node.latitude,
    longitude: node.longitude,
    distance,
  }
}

export function convertNodeToBuildingListItem(node: NodeDto, distance?: number, imageUrl?: string): BuildingListItem {
  return {
    id: node.nodeId,
    name: node.nodeName,
    distance,
    imageUrl,
  }
}
