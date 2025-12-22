import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InvitationPage from './InvitationPage'
import FirstInvitation from './FirstInvitation'
import HackPage from './HackPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/count/:lang/:username" element={<InvitationPage />} />
        <Route path="/first/:lang/:username" element={<FirstInvitation />} />
        <Route path="/second/:lang/:username" element={<HackPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

