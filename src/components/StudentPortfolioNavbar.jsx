import { Link } from 'react-router-dom'

export default function StudentPortfolioNavbar() {
  return (
    <nav className="bg-gradient-primary px-4 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">CertiChain</h1>
        <Link to="/" className="bg-white text-gray-800 rounded-lg px-4 py-2 font-semibold hover:shadow-md transition-shadow no-underline">
          Home
        </Link>
      </div>
    </nav>
  )
}
