import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function UserProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/public/${id}`)
        setProfile(res.data)
      } catch (err) {
        console.error('Error fetching user:', err)
      }
    }

    fetchUser()
  }, [id])

  if (!profile) return <p className="text-center mt-10 text-white">Loading user...</p>

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <div className="bg-white text-slate-900 p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold text-center mb-4">{profile.full_name}</h2>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>GitHub:</strong> {profile.github || 'N/A'}</p>
        <p><strong>Tech Stack:</strong> {profile.techstack || 'N/A'}</p>
      </div>
    </div>
  )
}
