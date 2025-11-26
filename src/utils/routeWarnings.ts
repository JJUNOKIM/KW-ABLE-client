import { RouteResponse, EdgeDto } from '@/types/api'

export interface EdgeWithWarning extends EdgeDto {
  hasWarning: boolean
}

export const mapWarningsToEdges = (route: RouteResponse): EdgeWithWarning[] => {
  if (!route.edges?.length) return []

  let cumulativeDistance = 0
  const edgeRanges = route.edges.map((edge) => {
    const start = cumulativeDistance
    const end = cumulativeDistance + edge.pathDistance
    cumulativeDistance = end
    return { edge, start, end }
  })

  return route.edges.map((edge, index) => {
    const range = edgeRanges[index]
    const hasWarning =
      route.instructions?.some(
        (instruction) =>
          instruction.warning &&
          instruction.cumulativeDistance >= range.start &&
          instruction.cumulativeDistance <= range.end
      ) || false

    return { ...edge, hasWarning }
  })
}
