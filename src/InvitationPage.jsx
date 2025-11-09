import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { translations } from './translations'

const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.eu1.make.com/756yxbomqcl3seu137flfscixiqsmank'
const MAKE_SUBMIT_WEBHOOK_URL = import.meta.env.VITE_MAKE_SUBMIT_WEBHOOK_URL || "https://hook.eu1.make.com/rhfeo9jdjdy1bbs701h4h51uxts4v0u8"

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
    if (!willCome) return

    if (willCome === 'yes' && !peopleCount) return

    setSubmitting(true)
    setError(null) // Clear any previous errors
    try {
      const answer = willCome === 'yes'
      const number = willCome === 'yes' ? parseInt(peopleCount) : 0
      
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

  if (loading) {
    return (
      <div className="container">
        <div className="loading">{t.loading}</div>
      </div>
    )
  }


  return (
    <div className="container">
      <h1>{t.hello}, {userData.Name}!</h1>
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

