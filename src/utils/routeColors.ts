export const ROUTE_COLORS = {
  EASY: '#9E9E9E',
  NORMAL: '#9E9E9E',
  HARD: '#FF9800',
  CAUTION: '#AF3C3C',
} as const

export type DifficultyLevel = '쉬움' | '보통' | '어려움'

export const getRouteColor = (
  difficultyLevel: string,
  hasWarning = false
): string => {
  if (hasWarning) return ROUTE_COLORS.CAUTION

  switch (difficultyLevel) {
    case '쉬움':
      return ROUTE_COLORS.EASY
    case '보통':
      return ROUTE_COLORS.NORMAL
    case '어려움':
      return ROUTE_COLORS.HARD
    default:
      return ROUTE_COLORS.NORMAL
  }
}

export const getRouteColorByScore = (
  difficultyScore: number,
  hasWarning = false
): string => {
  if (hasWarning) return ROUTE_COLORS.CAUTION

  if (difficultyScore < 0.3) return ROUTE_COLORS.EASY
  if (difficultyScore < 0.6) return ROUTE_COLORS.NORMAL
  return ROUTE_COLORS.HARD
}
