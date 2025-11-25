import 새빛관 from '@/assets/images/새빛관.webp'
import 비마관 from '@/assets/images/비마관.webp'
import 참빛관 from '@/assets/images/참빛관.webp'
import 옥의관 from '@/assets/images/옥의관.webp'
import 화도관 from '@/assets/images/화도관.webp'
import 한울관 from '@/assets/images/한울관.webp'
import 복지관 from '@/assets/images/복지관.webp'
import 연구관 from '@/assets/images/연구관.webp'
import 중앙도서관1층 from '@/assets/images/중앙도서관1층.webp'
import 중앙도서관2층 from '@/assets/images/중앙도서관2층.webp'

const buildingImageMap: Record<string, string> = {
  '새빛관': 새빛관,
  '비마관': 비마관,
  '참빛관': 참빛관,
  '옥의관': 옥의관,
  '화도관': 화도관,
  '한울관': 한울관,
  '복지관': 복지관,
  '연구관': 연구관,
  '중앙도서관1층': 중앙도서관1층,
  '중앙도서관2층': 중앙도서관2층,
}

export function getBuildingImage(buildingName: string): string | undefined {
  if (buildingImageMap[buildingName]) {
    return buildingImageMap[buildingName]
  }

  const matchedKey = Object.keys(buildingImageMap).find((key) =>
    buildingName.includes(key) || key.includes(buildingName)
  )

  return matchedKey ? buildingImageMap[matchedKey] : undefined
}
