import { useState, useEffect } from 'react'
import { UserLocation } from '@/types/location'

export const useGeolocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation 이 지원하지 않습니다.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  return { location, error, loading, refetch: getCurrentLocation }
}
