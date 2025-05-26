import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className="navbar bg-base-100 px-4 shadow-md">
      {/* left: logo/title */}
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          DevHub
        </Link>
      </div>

      {/* right: auth links/buttons */}
      <div className="navbar-end space-x-2">
        {user ? (
          <button
            onClick={onLogout}
            className="btn btn-ghost gap-2"
          >
            <FaSignOutAlt />
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost gap-2">
              <FaSignInAlt />
              Login
            </Link>
            <Link to="/register" className="btn btn-ghost gap-2">
              <FaUser />
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
