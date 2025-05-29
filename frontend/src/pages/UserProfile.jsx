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

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200 text-white">
        <p>Loading user...</p>
      </div>
    )
  }

  const renderCard = (title, value, isLink = false) => (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h3 className="card-title text-xl font-semibold">{title}</h3>
        {value ? (
          isLink ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:underline"
            >
              {value}
            </a>
          ) : (
            <p className="text-gray-300">{value}</p>
          )
        ) : (
          <p className="text-gray-500 italic">N/A</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-base-300 text-white py-10 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body text-center">
            <h2 className="card-title text-3xl font-bold justify-center">
              {profile.full_name}
            </h2>
          </div>
        </div>

        {/* Info Cards */}
        {renderCard('Username', profile.username)}
        {renderCard('Email', profile.email)}
        {renderCard('Role', profile.role)}
        {renderCard('GitHub', profile.github, true)}
        {renderCard('Tech Stack', profile.techstack)}
      </div>
    </div>
  )
}
