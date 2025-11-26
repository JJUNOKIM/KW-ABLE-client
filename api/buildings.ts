import type { VercelRequest, VercelResponse } from '@vercel/node'

const BACKEND_URL = 'http://219.255.242.174:8082'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/buildings`)
    const data = await response.json()

    res.status(200).json(data)
  } catch (error) {
    console.error('Backend API Error:', error)
    res.status(500).json({ error: 'Failed to fetch buildings' })
  }
}
