import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    role: '',
    github: '',
    techstack: '',
  })
  const {
    full_name,
    username,
    email,
    password,
    password2,
    role,
    github,
    techstack,
  } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess || user) navigate('/')
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    if (password !== password2) {
      toast.error('Passwords do not match')
    } else {
      dispatch(register({ full_name, username, email, password, role, github, techstack }))
    }
  }

  if (isLoading) return <Spinner />

  return (
    <section className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg rounded-lg">
        <div className="card-body p-6">
          <div className="text-center mb-6">
            <FaUser className="text-4xl text-primary mx-auto mb-2" />
            <h1 className="text-2xl font-semibold">Create Your Account</h1>
            <p className="text-sm text-neutral mt-1">
              Join DevHub and connect with developers worldwide.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="form-control">
              <input
                name="full_name"
                value={full_name}
                onChange={onChange}
                placeholder="Full Name"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <input
                name="username"
                value={username}
                onChange={onChange}
                placeholder="Username"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <input
                type="password"
                name="password2"
                value={password2}
                onChange={onChange}
                placeholder="Confirm Password"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <select
                name="role"
                value={role}
                onChange={onChange}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  Select Your Role
                </option>
                <option>Student</option>
                <option>Employee</option>
                <option>Company</option>
              </select>
            </div>

            <div className="form-control">
              <input
                type="url"
                name="github"
                value={github}
                onChange={onChange}
                placeholder="GitHub Profile (optional)"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <input
                name="techstack"
                value={techstack}
                onChange={onChange}
                placeholder="Tech Stack (optional)"
                className="input input-bordered w-full"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4">
              Register
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
