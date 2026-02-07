import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import studentImage from '../../assets/images/studentLogin.webp'
import instituteImage from '../../assets/images/instituteLogin.webp'
import { authAPI, setStudentToken, setUniversityToken } from '../../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [userType, setUserType] = useState('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleStudentLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const response = await authAPI.loginStudent({
        email: formData.email,
        password: formData.password,
      })

      setStudentToken(response.data.token)
      navigate('/studentdashboard')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleInstituteLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const response = await authAPI.loginUniversity({
        email: formData.email,
        password: formData.password,
      })

      setUniversityToken(response.data.token)
      navigate('/institute/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 bg-certi-repeat">
      {/* Navbar placeholder */}
      <nav className="bg-gradient-primary px-3 md:px-4 py-3">
        <div className="max-w-312 mx-auto flex justify-between items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-white">CertiChain</h1>
          <div className="flex items-center gap-4 md:gap-8">
            <a
              href="/signup"
              className="inline-flex items-center justify-center text-white border border-white/70 rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-sm md:text-base font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Sign Up
            </a>
            <button className="inline-flex items-center justify-center bg-white text-gray-900 rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-sm md:text-base font-semibold border border-white/70 hover:bg-transparent hover:text-white transition-colors">
              Verify
            </button>
          </div>
        </div>
      </nav>

      <div className="min-h-screen flex items-start justify-center pt-10 pb-8 px-4">
        <div className="w-full max-w-6xl">
          {/* Role Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-4 bg-gray-200 rounded-lg p-1.5">
              <button
                onClick={() => {
                  setUserType('student')
                  setError('')
                }}
                className={`px-6 py-2.5 rounded font-semibold transition-all ${
                  userType === 'student'
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'bg-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => {
                  setUserType('institute')
                  setError('')
                }}
                className={`px-6 py-2.5 rounded font-semibold transition-all ${
                  userType === 'institute'
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'bg-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                Institute
              </button>
            </div>
          </div>

          {/* Student Login Form */}
          {userType === 'student' && (
            <div className="flex flex-col lg:flex-row-reverse items-stretch gap-0 bg-white lg:rounded-3xl lg:shadow-lg overflow-hidden border lg:border-0 border-gray-300 lg:border-none">
              {/* Right Side - Form */}
              <div className="flex-1">
                <form onSubmit={handleStudentLogin} className="p-8">
                  {/* Image inside form - Mobile only */}
                  <div className="lg:hidden flex items-center justify-center mb-6">
                    <img
                      src={studentImage}
                      alt="Student"
                      className="w-full h-auto max-w-xs"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
                  <p className="text-gray-600 text-sm mb-6">Enter Your account details</p>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-6 focus:outline-none focus:border-purple-500"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-primary text-white rounded-lg px-6 py-3 font-semibold hover:opacity-90 transition-opacity mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>

                  <div className="text-center text-sm mb-6">
                    <span className="text-gray-600">Don't have an account? </span>
                    <a href="/signup" className="text-purple-600 hover:underline font-semibold">
                      Sign Up
                    </a>
                  </div>
                </form>
              </div>

              {/* Left Side - Image - Desktop only */}
              <div className="hidden lg:flex flex-1">
                <div className="bg-purple-100 p-8 w-full flex items-center justify-center h-full">
                  <div className="text-left ml-8">
                    <h2 className="text-5xl font-bold text-black mb-2">
                      certi<span className="text-purple-600">chain</span>
                    </h2>
                    <p className="text-2xl text-gray-700 font-semibold mb-6">Welcome Back!</p>
                    <p className="text-gray-600 text-sm mb-8">Login to access your portfolio and certificates</p>
                    <img
                      src={studentImage}
                      alt="Student"
                      className="w-full h-auto"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Institute Login Form */}
          {userType === 'institute' && (
            <div className="flex flex-col lg:flex-row-reverse items-stretch gap-0 bg-white lg:rounded-3xl lg:shadow-lg overflow-hidden border lg:border-0 border-gray-300 lg:border-none">
              {/* Right Side - Image - Desktop only */}
              <div className="hidden lg:flex flex-1">
                <div className="bg-purple-100 p-8 w-full flex items-center justify-center h-full">
                  <div className="text-left ml-8">
                    <h2 className="text-5xl font-bold text-black mb-2">
                      certi<span className="text-purple-600">chain</span>
                    </h2>
                    <p className="text-2xl text-gray-700 font-semibold mb-2">Welcome to Institution Portal</p>
                    <p className="text-gray-600 text-sm mb-8">Login to manage your certificates and students</p>
                    <img
                      src={instituteImage}
                      alt="Institute"
                      className="w-full h-auto"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>

              {/* Left Side - Form */}
              <div className="flex-1">
                <form onSubmit={handleInstituteLogin} className="p-8">
                  {/* Image inside form - Mobile only */}
                  <div className="lg:hidden flex items-center justify-center mb-6">
                    <img
                      src={instituteImage}
                      alt="Institute"
                      className="w-full h-auto max-w-xs"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
                  <p className="text-gray-600 text-sm mb-6">Enter Your account details</p>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-6 focus:outline-none focus:border-purple-500"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-primary text-white rounded-lg px-6 py-3 font-semibold hover:opacity-90 transition-opacity mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>

                  <div className="text-center text-sm mb-6">
                    <span className="text-gray-600">Don't have an account? </span>
                    <a href="/signup" className="text-purple-600 hover:underline font-semibold">
                      Sign Up
                    </a>
                  </div>

                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
