import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ProfileView from '../components/ProfileView';

export default function MyProfile() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()  

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <p>Loading user info...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-300 text-white py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <ProfileView user={user} />
        <div className="flex flex-col gap-3 mt-6">
          <button onClick={() => navigate('/profile/edit')} className="btn w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold">
            Edit Profile
          </button>
          <button onClick={() => navigate('/my-projects')} className="btn w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold">
            View My Projects
          </button>
        </div>
      </div>
    </div>
  )
}
