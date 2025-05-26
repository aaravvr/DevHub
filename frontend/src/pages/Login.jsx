import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaSignInAlt } from 'react-icons/fa'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const { username, password } = formData

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
    dispatch(login({ username, password }))
  }

  if (isLoading) return <Spinner />

  return (
    <section className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-lg rounded-lg">
        <div className="card-body p-6">
          <div className="text-center mb-6">
            <FaSignInAlt className="text-4xl text-primary mx-auto mb-2" />
            <h1 className="text-2xl font-semibold">Welcome Back</h1>
            <p className="text-sm text-neutral mt-1">
              Log in to your DevHub account
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="form-control">
              <input
                type="text"
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
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="input input-bordered w-full"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4">
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
