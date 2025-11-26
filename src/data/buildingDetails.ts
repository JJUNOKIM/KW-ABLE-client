type BuildingDetailData = {
  department?: string
  phone?: string
  accessibility?: {
    wheelchairAccess: number
    hasElevator: boolean
    elevatorLocation?: string
    hasAccessibleRestroom: boolean
    accessibleRestroomFloor?: string
  }
}

export const buildingDetailsMap: Record<string, BuildingDetailData> = {
  'node_10': {
    department: '인공지능융합대학',
    phone: '02-940-5114',
    accessibility: {
      wheelchairAccess: 3,
      hasElevator: true,
      hasAccessibleRestroom: false,
    },
  },
  'node_3': {
    department: '전자정보공과대학',
    phone: '02-940-5114',
    accessibility: {
      wheelchairAccess: 1,
      hasElevator: true,
      hasAccessibleRestroom: false,
    },
  },
  'node_2': {
    department: '전자정보공과대학',
    phone: '02-940-5114',
    accessibility: {
      wheelchairAccess: 2,
      hasElevator: true,
      hasAccessibleRestroom: false,
    },
  },
  'node_15': {
    phone: '02-940-5114',
    accessibility: {
      wheelchairAccess: 0,
      hasElevator: false,
      hasAccessibleRestroom: true,
      accessibleRestroomFloor: '1F',
    },
  },
  'node_13': {
    phone: '02-940-5114',
    accessibility: {
      wheelchairAccess: 0,
      hasElevator: true,
      hasAccessibleRestroom: false,
    },
  },
  'node_17': {
    department: '건축/건축공학',
    phone: '02-940-5114',
    accessibility: {
      wheelchairAccess: 4,
      hasElevator: true,
      hasAccessibleRestroom: false,
    },
  },
  'node_18': {
    department: '자연과학대학',
    phone: '02-940-5114',
    accessibility: {
      wheelchairAccess: 3,
      hasElevator: true,
      hasAccessibleRestroom: false,
    },
  },
  'node_16': {
    department: '인문사회/정법대학',
    phone: '02-940-5114',
    accessibility: {
      wheelchairAccess: 3,
      hasElevator: true,
      hasAccessibleRestroom: true,
      accessibleRestroomFloor: '1F',
    },
  },
  'node_9': {
    department: '참빛인재대학',
    phone: '02-940-5114',
    accessibility: {
      wheelchairAccess: 3,
      hasElevator: true,
      hasAccessibleRestroom: false,
    },
  },
}

export function getBuildingDetail(nodeId: string): BuildingDetailData | undefined {
  return buildingDetailsMap[nodeId]
}
