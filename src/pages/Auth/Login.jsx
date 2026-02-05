import { useState } from 'react'
import backgroundImage from '../../assets/images/background.png'
import studentImage from '../../assets/images/studentLogin.png'
import instituteImage from '../../assets/images/instituteLogin.png'

export default function Login() {
  const [userType, setUserType] = useState('student')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', userType, formData)
  }

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'repeat' }} className="min-h-screen bg-gray-50">
      {/* Navbar placeholder */}
      <nav className="bg-gradient-primary px-3 md:px-4 py-3">
        <div className="max-w-312 mx-auto flex justify-between items-center gap-3">
          <h1 className="text-2xl font-bold text-white">CertiChain</h1>
          <div className="flex items-center gap-8">
            <a
              href="/signup"
              className="inline-flex items-center justify-center text-white border border-white/70 rounded-lg px-3 py-1.5 font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Sign Up
            </a>
            <button className="inline-flex items-center justify-center bg-white text-gray-900 rounded-lg px-3 py-1.5 font-semibold border border-white/70 hover:bg-transparent hover:text-white transition-colors">
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
                onClick={() => setUserType('student')}
                className={`px-6 py-2.5 rounded font-semibold transition-all ${
                  userType === 'student'
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'bg-transparent text-gray-700 hover:text-gray-900'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setUserType('institute')}
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
            <div className="flex flex-col lg:flex-row items-stretch gap-0 bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Left Side - Form */}
              <div className="flex-1">
                <form onSubmit={handleSubmit} className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
                  <p className="text-gray-600 text-sm mb-6">Enter Your account details</p>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-6 focus:outline-none focus:border-purple-500"
                  />

                  <button
                    type="submit"
                    className="w-full bg-gradient-primary text-white rounded-lg px-6 py-3 font-semibold hover:opacity-90 transition-opacity mb-4"
                  >
                    Log In
                  </button>

                  <div className="text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <a href="/signup" className="text-purple-600 hover:underline font-semibold">
                      Sign Up
                    </a>
                  </div>
                </form>
              </div>

              {/* Right Side - Image */}
              <div className="flex flex-1">
                <div className="bg-purple-100 p-8 w-full flex items-center justify-center h-full">
                  <div className="text-left ml-8">
                    <h2 className="text-5xl font-bold text-black mb-2">
                      certi<span className="text-purple-600">chain</span>
                    </h2>
                    <p className="text-2xl text-gray-700 font-semibold mb-6">Welcome to Student Portal</p>
                    <p className="text-gray-600 text-sm mb-8">Login to access your account!</p>
                    <img src={studentImage} alt="Student" className="w-full h-auto" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Institute Login Form */}
          {userType === 'institute' && (
            <div className="flex flex-col lg:flex-row-reverse items-stretch gap-0 bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Right Side - Image */}
              <div className="flex flex-1">
                <div className="bg-purple-100 p-8 w-full flex items-center justify-center h-full">
                  <div className="text-left ml-8">
                    <h2 className="text-5xl font-bold text-black mb-2">
                      certi<span className="text-purple-600">chain</span>
                    </h2>
                    <p className="text-2xl text-gray-700 font-semibold mb-2">Welcome to Institution Portal</p>
                    <p className="text-gray-600 text-sm mb-8">Login to manage your certificates.</p>
                    <img src={instituteImage} alt="Institute" className="w-full h-auto" />
                  </div>
                </div>
              </div>

              {/* Left Side - Form */}
              <div className="flex-1">
                <form onSubmit={handleSubmit} className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
                  <p className="text-gray-600 text-sm mb-6">Enter Your account details</p>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-6 focus:outline-none focus:border-purple-500"
                  />

                  <button
                    type="submit"
                    className="w-full bg-gradient-primary text-white rounded-lg px-6 py-3 font-semibold hover:opacity-90 transition-opacity mb-4"
                  >
                    Log In
                  </button>

                  <div className="text-center text-sm">
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
