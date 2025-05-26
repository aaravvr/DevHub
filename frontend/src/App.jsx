// App.js
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'    // ← import your navbar
import HomePage from './pages/HomePage'
import CreateProject from './pages/CreateProject'
import Register from './pages/Register'
import Login from './pages/Login'

const App = () => {
  return (
    <>
      <Navbar />     {/* ← always up top */}
      <main className="pt-4">  {/* optional padding so content isn’t hidden under navbar */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  )
}

export default App
