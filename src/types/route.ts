import { RouteResponse, NavigationInstruction } from './api'

export interface RouteRequest {
  startNodeId: string
  endNodeId: string
}

export interface Route {
  id: string
  name: string
  duration: number
  distance: number
  elevatorCount: number
  rampCount: number
  stairCount: number
  floorChanges: number
  accessible: boolean
  accessibilitySummary: string
  steps: RouteStep[]
}

export interface RouteStep {
  id: string
  order: number
  type: 'start' | 'move' | 'elevator' | 'ramp' | 'turn' | 'end'
  instruction: string
  distance?: number
  cumulativeDistance?: number
  turnType?: string
  turnAngle?: number
  warning?: string
  location?: {
    latitude: number
    longitude: number
  }
}

function getStepType(turnType: string, index: number, total: number): RouteStep['type'] {
  if (index === 0) return 'start'
  if (index === total - 1) return 'end'

  const type = turnType.toLowerCase()

  if (type.includes('elevator')) return 'elevator'
  if (type.includes('ramp')) return 'ramp'
  if (type.includes('turn') || type.includes('left') || type.includes('right')) {
    return 'turn'
  }

  return 'move'
}

export function convertRouteResponse(response: RouteResponse, routeType: 'easy' | 'fast' = 'easy'): Route {
  const steps: RouteStep[] = response.instructions.map((instruction: NavigationInstruction, idx: number) => ({
    id: `step-${idx}`,
    order: instruction.step,
    type: getStepType(instruction.turnType, idx, response.instructions.length),
    instruction: instruction.instruction,
    distance: instruction.distance,
    cumulativeDistance: instruction.cumulativeDistance,
    turnType: instruction.turnType,
    turnAngle: instruction.turnAngle,
    warning: instruction.warning,
  }))

  return {
    id: `route-${response.startNode.nodeId}-${response.endNode.nodeId}`,
    name: routeType === 'easy' ? '쉬운 경로' : '빠른 경로',
    duration: Math.ceil(response.summary.totalDuration / 60),
    distance: response.summary.totalDistance,
    elevatorCount: response.summary.elevatorCount,
    rampCount: response.summary.rampCount,
    stairCount: response.summary.stairCount,
    floorChanges: response.summary.floorChanges,
    accessible: response.summary.accessible,
    accessibilitySummary: response.summary.accessibilitySummary,
    steps,
  }
}
