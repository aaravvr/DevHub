import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function MyProfile() {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <p>Loading user info...</p>
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
        {/* Header with Edit button inside */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body text-center">
            <h2 className="card-title text-3xl font-bold justify-center">Your Profile</h2>
            <p className="text-sm text-gray-400 mb-3">Here's what we know about you</p>
            <Link
              to="/profile/edit"
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Info Cards */}
        {renderCard('Full Name', user.full_name)}
        {renderCard('Username', user.username)}
        {renderCard('Email', user.email)}
        {renderCard('Role', user.role)}
        {renderCard('GitHub', user.github, true)}
        {renderCard('Tech Stack', user.techstack)}
      </div>
    </div>
  )
}
