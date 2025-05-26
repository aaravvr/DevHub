import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './components/Navbar'    
import HomePage from './pages/HomePage'
import CreateProject from './pages/CreateProject'
import Register from './pages/Register'
import Login from './pages/Login'

const App = () => {
  return (
    <>
      <Navbar />     
      <main className="pt-4">  
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
