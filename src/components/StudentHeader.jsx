import { Link, useNavigate } from 'react-router-dom'
import logoImage from '../assets/images/logo.webp'
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
          <Link to="/" className="inline-flex items-center">
            <img src={logoImage} alt="CertiChain" className="h-7 md:h-8 w-auto" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link 
            to="/studentportfolio" 
            className="text-white no-underline font-medium hover:opacity-90 transition-opacity"
          >
            My Portfolio
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
