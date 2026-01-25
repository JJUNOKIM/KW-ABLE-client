import type { VercelRequest, VercelResponse } from '@vercel/node'

const BACKEND_URL = 'http://219.255.242.174:8082'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { startNodeId, endNodeId } = req.query

  if (!startNodeId || !endNodeId) {
    return res.status(400).json({ error: 'startNodeId and endNodeId are required' })
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/route?startNodeId=${startNodeId}&endNodeId=${endNodeId}`
    )
    
    // 백엔드 에러 처리
    if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json()

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    
    res.status(200).json(data)
  } catch (error) {
    console.error('Backend API Error:', error)
    res.status(500).json({ error: 'Failed to fetch route' })
  }
}