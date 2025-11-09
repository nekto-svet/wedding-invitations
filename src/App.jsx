import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import InvitationPage from './InvitationPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:lang/:username" element={<InvitationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

