import { BrowserRouter, Routes, Route } from 'react-router-dom'
import InvitationPage from './InvitationPage'
import FirstInvitation from './FirstInvitation'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/second/:lang/:username" element={<InvitationPage />} />
        <Route path="/first/:lang/:username" element={<FirstInvitation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

