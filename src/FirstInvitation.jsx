import { useParams } from 'react-router-dom'
import { translations } from './translations'
import { useState, useEffect, useCallback } from 'react'

const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.eu1.make.com/756yxbomqcl3seu137flfscixiqsmank'

function FirstInvitation() {
  const { lang, username } = useParams()
  const langKey = lang?.toLowerCase() === 'heb' ? 'heb' : 'ru'
  const t = translations[langKey]
  
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true)
      // Fetch user data using POST with userId
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: username })
      })
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setUserData(data)
          console.log(data)
        }
      }
    } catch (err) {
      // Silently fail - form will still work without user data
      console.log('User data fetch optional:', err)
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  // Preload background image
  useEffect(() => {
    const img = new Image()
    img.src = '/20250902_151104.jpg'
    img.onload = () => {
      setImageLoaded(true)
    }
    img.onerror = () => {
      // If image fails to load, still show content
      setImageLoaded(true)
    }
  }, [])

  // Add 0.3 second delay after both image and user data are loaded
  useEffect(() => {
    if (!loading && imageLoaded) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 300) // 0.3 seconds = 100ms
      
      return () => clearTimeout(timer)
    }
  }, [loading, imageLoaded])

  // Location details - update with your coordinates
  const locationName = 'Havat Allenby, Kibbutz Netzer Sereni'
  const latitude = 31.925588
  const longitude = 34.827163
  
  // Google Calendar link with location and geopoint
  const eventTitle = encodeURIComponent(t.invitationTitle)
  const eventDetails = encodeURIComponent(`${t.invitationText}\n\n${t.text2Date}\n${t.text2Place}\n\nLocation: ${locationName}\nCoordinates: ${latitude}, ${longitude}`)
  const eventLocation = encodeURIComponent(`${locationName}`)
  const eventDate = '20260208T190000' // Format: YYYYMMDDTHHMMSS
  const eventEndDate = '20260208T235959'
  
  // Google Calendar URL with location
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventDate}/${eventEndDate}&details=${eventDetails}&location=${eventLocation}`

  // Waze link with coordinates
  const wazeUrl = `https://www.waze.com/ul?q=${latitude},${longitude}&navigate=yes`

  const isLoading = loading || !imageLoaded || !showContent

  if (isLoading) {
    return (
      <div className="first-invitation-loading">
        <div className="loading-spinner">💚</div>
        <p className="loading-text">{t.loading}</p>
      </div>
    )
  }

  const displayName = userData?.Name || username
  
  // Check if name is single word (no spaces)
  const isSingleWord = displayName.trim().split(/\s+/).length === 1

  // Create personalized invitation text
  let personalizedText = `${displayName}, ${t.invitationText}`
  
  if (isSingleWord) {
    if (langKey === 'heb') {
      // Replace אתכם (plural) with אותך (singular)
      personalizedText = personalizedText.replace('אתכם', 'אותך')
    } else {
      // Replace вы/вас (plural/formal) with ты/тебя (singular/informal)
      personalizedText = personalizedText.replace(/\bвы\b/gi, 'ты')
      personalizedText = personalizedText.replace('вас', 'тебя')
    }
  }

  return (
    <div className="first-invitation">
      <div className="first-invitation-content">
        <h1>{t.invitationTitle}</h1>
        <p>{personalizedText}</p>
        <div className={`invitation-details ${langKey === 'heb' ? 'align-right' : 'align-left'}`}>
          <p className="detail-item">
            {langKey === 'heb' ? (
              <>
                {t.text2Date} 📅
              </>
            ) : (
              <>
                📅 {t.text2Date}
              </>
            )}
          </p>
          <p className="detail-item">
            {langKey === 'heb' ? (
              <>
                {t.text2Place} 📍
              </>
            ) : (
              <>
                📍 {t.text2Place}
              </>
            )}
          </p>
        </div>
        <div className="invitation-links">
          <a 
            href={googleCalendarUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="calendar-link"
          >
            {t.addToCalendar}
          </a>
          <a 
            href={wazeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="waze-link"
          >
            {t.openInWaze}
          </a>
        </div>
      </div>
    </div>
  )
}

export default FirstInvitation

