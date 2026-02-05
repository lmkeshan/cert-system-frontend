import { Link, useNavigate } from 'react-router-dom'
import { clearAllTokens } from '../services/api'

export default function StudentHeader() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAllTokens()
    navigate('/login')
  }

  return (
    <header className="bg-gradient-primary text-white">
      <div className="max-w-[1248px] mx-auto flex items-center justify-between gap-3 px-3 md:px-4 py-3">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold italic m-0">CertiChain</h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link 
            to="/studentdashboard" 
            className="text-white no-underline font-medium hover:opacity-90 transition-opacity"
          >
            Home
          </Link>
          <Link 
            to="/studentportfolio" 
            className="text-white no-underline font-medium hover:opacity-90 transition-opacity"
          >
            My_Portfolio
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-purple-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Log Out
          </button>
        </nav>
      </div>
    </header>
  )
}
