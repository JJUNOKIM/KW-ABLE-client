export interface NodeDto {
  nodeId: string
  nodeName: string
  nodeType: string
  latitude: number
  longitude: number
}

export interface NavigationInstruction {
  step: number
  distance: number
  cumulativeDistance: number
  instruction: string
  turnType: string
  turnAngle: number
  warning: string
}

export interface RouteSummary {
  totalDistance: number
  totalDuration: number
  totalDifficultyScore: number
  floorChanges: number
  stairCount: number
  elevatorCount: number
  rampCount: number
  accessibilitySummary: string
  accessible: boolean
}

export interface EdgeDto {
  edgeId: string
  fromNode: NodeDto
  toNode: NodeDto
  pathDistance: number
  pathDuration: number
  difficultyScore: number
  difficultyLevel: string
}

export interface BuildingResponse {
  nodeId: string
  nodeName: string
  latitude: number
  longitude: number
}

export interface RouteResponse {
  startNode: NodeDto
  endNode: NodeDto
  summary: RouteSummary
  nodes: NodeDto[]
  edges: EdgeDto[]
  instructions: NavigationInstruction[]
}
