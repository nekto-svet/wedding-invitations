import { useParams } from 'react-router-dom'
import { translations } from './translations'

function FirstInvitation() {
  const { lang, username } = useParams()
  const langKey = lang?.toLowerCase() === 'heb' ? 'heb' : 'ru'
  const t = translations[langKey]

  // Location details - update with your coordinates
  const locationName = 'Havat Allenby Kibutz Natzrat Serniy'
  const latitude = 31.925588
  const longitude = 34.827163
  
  // Google Calendar link with location and geopoint
  const eventTitle = encodeURIComponent(t.invitationTitle)
  const eventDetails = encodeURIComponent(`${t.invitationText}\n\n${t.text2}\n\nLocation: ${locationName}\nCoordinates: ${latitude}, ${longitude}`)
  const eventLocation = encodeURIComponent(`${locationName} (${latitude}, ${longitude})`)
  const eventDate = '20260208T190000' // Format: YYYYMMDDTHHMMSS
  const eventEndDate = '20260208T240000'
  
  // Google Calendar URL with location
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventDate}/${eventEndDate}&details=${eventDetails}&location=${eventLocation}`

  // Waze link with coordinates
  const wazeUrl = `https://www.waze.com/ul?q=${latitude},${longitude}&navigate=yes`

  return (
    <div className="first-invitation">
      <div className="first-invitation-content">
        <h1>{t.invitationTitle}</h1>
        <p>{t.invitationText}</p>
        <p>{t.text2}</p>
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

