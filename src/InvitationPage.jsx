import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { translations } from './translations'

const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.eu1.make.com/756yxbomqcl3seu137flfscixiqsmank'
const MAKE_SUBMIT_WEBHOOK_URL = import.meta.env.VITE_MAKE_SUBMIT_WEBHOOK_URL || "https://hook.eu1.make.com/rhfeo9jdjdy1bbs701h4h51uxts4v0u8"

function InvitationPage() {
  const { lang, username } = useParams()
  const langKey = lang?.toLowerCase() === 'heb' ? 'heb' : 'ru'
  const t = translations[langKey]
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)
  const [willCome, setWillCome] = useState('')
  const [peopleCount, setPeopleCount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Preload background image
  useEffect(() => {
    const img = new Image()
    img.src = '/20250902_151105.jpg'
    img.onload = () => setImageLoaded(true)
    img.onerror = () => setImageLoaded(true)
  }, [])

  // Add delay after both image and data are loaded
  useEffect(() => {
    if (!loading && imageLoaded) {
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    }
  }, [loading, imageLoaded])

  useEffect(() => {
    fetchUserData()
  }, [username])

  const getData = async (data) => {
    try {
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        return await response.json()
      }
    } catch (err) {
      console.log('Webhook call failed:', err)
      throw err
    }
  }

  const fetchUserData = async () => {
    try {
      setLoading(true)
      // Fetch user data using POST with userId
      const data = await getData({ userId: username })
      if (data) {
        setUserData(data);
        console.log(data);
      }
    } catch (err) {
      // Silently fail - form will still work without user data
      console.log('User data fetch optional:', err)
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async (answer, number) => {
    try {
      const response = await fetch(MAKE_SUBMIT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: username,
          answer: answer,
          number: number,
          recordId: userData.Id,
        })
      })
      // Make webhooks might return various status codes, so we check if request was sent
      if (response.status >= 400) {
        const errorText = await response.text().catch(() => 'Unknown error')
        console.error('Webhook error:', response.status, errorText)
        throw new Error(`Webhook returned status ${response.status}`)
      }
      // Try to parse JSON, but don't fail if it's not JSON
      try {
        return await response.json()
      } catch {
        // Webhook might not return JSON, that's okay
        return { success: true }
      }
    } catch (err) {
      console.error('Answer submission failed:', err)
      throw err
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!peopleCount) return

    setSubmitting(true)
    setError(null) // Clear any previous errors
    try {
      const answer = peopleCount !== 'no'
      const number = peopleCount === 'no' ? 0 : parseInt(peopleCount)
      
      console.log('Submitting answer:', { userId: username, answer, number })
      
      // Submit answer to Make webhook
      await submitAnswer(answer, number)
      
      console.log('Answer submitted successfully')
      setSubmitted(true)
      setError(null)
    } catch (err) {
      console.error('Submit error:', err)
      setError(t.error)
    } finally {
      setSubmitting(false)
    }
  }

  const isLoading = loading || !imageLoaded || !showContent

  if (isLoading) {
    return (
      <div className="first-invitation-loading">
        <div className="loading-spinner">💚</div>
        <p className="loading-text">{t.loading}</p>
      </div>
    )
  }

  return (
    <div className="invitation-page-background">
      <div className={`invitation-page-content ${langKey === 'heb' ? 'rtl' : ''}`}>
      <h1>{t.hello}, {userData.Name}</h1>

      {submitted ? (
        <div className="success">{t.success}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.howMany}</label>
            <select value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} required>
              <option value="">{t.selectOption}</option>
              <option value="no">{t.no}</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={submitting}>
            {submitting ? t.loading : t.submit}
          </button>
        </form>
      )}

      <div className="carpool-section">
        <h3>{t.carpoolTitle}</h3>
        <p>{t.carpoolOffer}</p>
        <p>{t.carpoolNeed}</p>
        <a 
          href="https://docs.google.com/spreadsheets/d/1T_d-wPz0ye8bpQHptLFnrMlUtY6onswRxPhlwUMjwOY/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="carpool-link"
        >
          {t.carpoolLink}
        </a>
      </div>

      <div className="invitation-details align-center">
        <p className="detail-item">
          {langKey === 'heb' ? <>{t.text2Date} 📅</> : <>📅 {t.text2Date}</>}
        </p>
        <p className="detail-item">
          {langKey === 'heb' ? <>{t.text2Place} 📍</> : <>📍 {t.text2Place}</>}
        </p>
      </div>

      <a 
        href="https://www.waze.com/ul?q=31.925588,34.827163&navigate=yes"
        target="_blank"
        rel="noopener noreferrer"
        className="waze-link submitted-waze"
      >
        {t.openInWaze}
      </a>
      </div>
    </div>
  )
}

export default InvitationPage

