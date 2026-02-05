import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setOpen(false)

  const handleHomeClick = (e) => {
    // If already on homepage, smooth scroll to top
    if (location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setOpen(false)
    }
  }

  return (
    <header className="relative md:sticky top-0 z-50 bg-gradient-primary text-white">
      <div className="max-w-[1248px] mx-auto flex items-center justify-between gap-3 px-3 md:px-4 py-3">
        <div className="flex items-center">
          <Link to="/" aria-label="Homepage" className="inline-block w-[140px] h-9 hover:opacity-90" onClick={handleHomeClick}>
            <img src={logo} alt="CertiChain logo" className="w-full h-full object-contain" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          <ul className="flex items-center gap-5 m-0 p-0 list-none" onClick={closeMenu}>
            <li>
              <Link to="/" className="text-white no-underline font-medium hover:opacity-90" onClick={handleHomeClick}>Home</Link>
            </li>
            <li>
              <Link to="/#about" className="text-white no-underline font-medium hover:opacity-90">About us</Link>
            </li>
            <li>
              <Link to="/login" className="text-white no-underline font-medium hover:opacity-90">Login</Link>
            </li>
            <li>
              <Link to="/signup" className="text-white no-underline font-medium hover:opacity-90">Signup</Link>
            </li>
            <li>
              <Link to="/#contact" className="text-white no-underline font-medium hover:opacity-90">Contact us</Link>
            </li>
          </ul>
        </nav>

        {/* Desktop Verify */}
        <div className="hidden md:block">
          <Link to="/verify" className="bg-white text-[var(--color-primary-violet)] border-none rounded-full px-4 py-2 font-semibold no-underline inline-block hover:opacity-95" onClick={closeMenu}>Verify</Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden bg-transparent border-none cursor-pointer p-1"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-6 h-0.5 bg-white my-1" />
          <span className="block w-6 h-0.5 bg-white my-1" />
          <span className="block w-6 h-0.5 bg-white my-1" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute inset-x-0 top-full bg-gradient-primary px-4 pb-4 shadow-lg">
          <nav aria-label="Primary" onClick={closeMenu}>
            <ul className="flex flex-col gap-3 m-0 p-0 list-none">
              <li>
                <Link to="/" className="text-white no-underline font-medium hover:opacity-90" onClick={handleHomeClick}>Home</Link>
              </li>
              <li>
                <Link to="/#about" className="text-white no-underline font-medium hover:opacity-90">About us</Link>
              </li>
              <li>
                <Link to="/login" className="text-white no-underline font-medium hover:opacity-90">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="text-white no-underline font-medium hover:opacity-90">Signup</Link>
              </li>
              <li>
                <Link to="/#contact" className="text-white no-underline font-medium hover:opacity-90">Contact us</Link>
              </li>
            </ul>
          </nav>
          <div className="mt-3">
            <Link to="/verify" className="bg-white text-[var(--color-primary-violet)] border-none rounded-full px-4 py-2 font-semibold no-underline inline-block hover:opacity-95" onClick={closeMenu}>Verify</Link>
          </div>
        </div>
      )}
    </header>
  )
}
