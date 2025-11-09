import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { translations } from './translations'

const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/YOUR_WEBHOOK_ID'

function InvitationPage() {
  const { lang, username } = useParams()
  const langKey = lang?.toLowerCase() === 'heb' ? 'heb' : 'ru'
  const t = translations[langKey]
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)
  const [willCome, setWillCome] = useState('')
  const [peopleCount, setPeopleCount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [username])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      // Replace with your Make webhook URL to fetch user data
      // This is optional - if not configured, the form will still work
      const response = await fetch(`${MAKE_WEBHOOK_URL}?action=get&username=${username}`)
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (err) {
      // Silently fail - form will still work without user data
      console.log('User data fetch optional:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!willCome) return

    if (willCome === 'yes' && !peopleCount) return

    setSubmitting(true)
    try {
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          willCome: willCome === 'yes',
          peopleCount: willCome === 'yes' ? parseInt(peopleCount) : 0
        })
      })
      if (!response.ok) throw new Error('Failed to submit')
      setSubmitted(true)
      setError(null)
    } catch (err) {
      setError(t.error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">{t.loading}</div>
      </div>
    )
  }


  return (
    <div className="container">
      <h1>{t.hello}, {username}!</h1>
      <h2>{t.question}</h2>

      {submitted ? (
        <div className="success">{t.success}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.question}</label>
            <select value={willCome} onChange={(e) => setWillCome(e.target.value)} required>
              <option value="">{t.selectOption}</option>
              <option value="yes">{t.yes}</option>
              <option value="no">{t.no}</option>
            </select>
          </div>

          {willCome === 'yes' && (
            <div className="form-group">
              <label>{t.howMany}</label>
              <select value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} required>
                <option value="">{t.selectOption}</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={submitting}>
            {submitting ? t.loading : t.submit}
          </button>
        </form>
      )}
    </div>
  )
}

export default InvitationPage

