import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../features/auth/authSlice'
import { toast } from 'react-toastify'

export default function Profile() {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    role: '',
    github: '',
    techstack: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
        email: user.email || '',
        role: user.role || '',
        github: user.github || '',
        techstack: user.techstack || '',
      })
    }
  }, [user])

  const onChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => toast.success('Profile updated'))
      .catch((err) => toast.error(err))
  }

  const labelStyle = 'text-sm font-medium text-slate-600'
  const inputStyle =
    'w-full px-4 py-3 rounded-md bg-white text-slate-900 border border-slate-300 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition'

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="card w-full max-w-sm bg-slate-100 text-slate-900 shadow-2xl rounded-2xl border border-slate-200">
        <div className="card-body p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Edit Profile</h2>
            <p className="text-sm text-slate-500">Update your DevHub account</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {[
              { label: 'Full name', name: 'full_name' },
              { label: 'Username', name: 'username' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'GitHub', name: 'github' },
              { label: 'Tech Stack', name: 'techstack' },
            ].map(({ label, name, type = 'text' }) => (
              <div key={name}>
                <label htmlFor={name} className={labelStyle}>
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={onChange}
                  placeholder={label}
                  className={inputStyle}
                  required={['full_name', 'username', 'email'].includes(name)}
                />
              </div>
            ))}

            <div>
              <label htmlFor="role" className={labelStyle}>
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={onChange}
                className={inputStyle}
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="Student">Student</option>
                <option value="Developer">Developer</option>
                <option value="Company">Company</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold tracking-wide shadow-lg transition rounded-lg px-4 py-2"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
