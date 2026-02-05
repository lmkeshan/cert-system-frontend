import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../../assets/images/background.png'
import studentImage from '../../assets/images/studentSignup.png'
import instituteImage from '../../assets/images/instituteSignup.png'
import { authAPI, setStudentToken, setUniversityToken } from '../../services/api'

export default function Signup() {
  const navigate = useNavigate()
  const [userType, setUserType] = useState('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const [studentForm, setStudentForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    birthdate: '',
  })

  const [instituteForm, setInstituteForm] = useState({
    institute_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    wallet_address: '',
    logo: null,
    verification_doc: null,
  })

  const handleStudentChange = (e) => {
    const { name, value } = e.target
    setStudentForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleInstituteChange = (e) => {
    const { name, value } = e.target
    setInstituteForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleFileChange = (e, fieldName, formType) => {
    const file = e.target.files[0]
    if (formType === 'institute') {
      setInstituteForm(prev => ({ ...prev, [fieldName]: file }))
    }
    setError('')
  }

  const handleStudentSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    // Validation
    if (!studentForm.full_name || !studentForm.email || !studentForm.password || !studentForm.birthdate) {
      setError('All fields are required')
      return
    }

    if (studentForm.password !== studentForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (studentForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      const response = await authAPI.registerStudent({
        full_name: studentForm.full_name,
        email: studentForm.email,
        password: studentForm.password,
        gender: studentForm.gender,
        birthdate: studentForm.birthdate,
      })

      setSuccessMessage('Registration successful! Redirecting...')
      setStudentToken(response.data.token)
      
      setTimeout(() => {
        navigate('/studentdashboard')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleInstituteSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    // Validation
    if (!instituteForm.institute_name || !instituteForm.email || !instituteForm.password || !instituteForm.wallet_address) {
      setError('All fields are required')
      return
    }

    if (instituteForm.password !== instituteForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (instituteForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!instituteForm.verification_doc) {
      setError('Verification document is required')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('institute_name', instituteForm.institute_name)
      formData.append('email', instituteForm.email)
      formData.append('password', instituteForm.password)
      formData.append('wallet_address', instituteForm.wallet_address)
      if (instituteForm.logo) {
        formData.append('logo', instituteForm.logo)
      }
      formData.append('verification_doc', instituteForm.verification_doc)

      const response = await authAPI.registerUniversity(formData)

      setSuccessMessage('Registration successful! Awaiting admin approval...')
      setUniversityToken(response.data.token)
      
      setTimeout(() => {
        navigate('/institute/dashboard')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'repeat' }} className="min-h-screen bg-gray-50">
      {/* Navbar placeholder */}
      <nav className="bg-gradient-primary px-3 md:px-4 py-3">
        <div className="max-w-312 mx-auto flex justify-between items-center gap-3">
          <h1 className="text-2xl font-bold text-white">CertiChain</h1>
          <div className="flex items-center gap-8">
            <a
              href="/login"
              className="inline-flex items-center justify-center text-white border border-white/70 rounded-lg px-3 py-1.5 font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Log In
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

          {/* Student Signup Form */}
          {userType === 'student' && (
            <div className="flex flex-col lg:flex-row-reverse items-stretch gap-0 bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Right Side - Image */}
              <div className="flex flex-1">
                <div className="bg-purple-100 p-8 w-full flex items-center justify-center h-full">
                  <div className="text-left ml-8">
                    <h2 className="text-5xl font-bold text-black mb-2">
                      certi<span className="text-purple-600">chain</span>
                    </h2>
                    <p className="text-2xl text-gray-700 font-semibold mb-6">New Here?</p>
                    <p className="text-gray-600 text-sm mb-8">Join now and unlock your student dashboard.</p>
                    <img src={studentImage} alt="Student" className="w-full h-auto" />
                  </div>
                </div>
              </div>

              {/* Left Side - Form */}
              <div className="flex-1">
                <form onSubmit={handleStudentSubmit} className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Student Registration</h2>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                      {successMessage}
                    </div>
                  )}

                  <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={studentForm.full_name}
                    onChange={handleStudentChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={studentForm.email}
                    onChange={handleStudentChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <select
                      name="gender"
                      value={studentForm.gender}
                      onChange={handleStudentChange}
                      className="col-span-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>

                    <input
                      type="date"
                      name="birthdate"
                      value={studentForm.birthdate}
                      onChange={handleStudentChange}
                      required
                      className="col-span-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <input
                    type="password"
                    name="password"
                    placeholder="Password (min 6 characters)"
                    value={studentForm.password}
                    onChange={handleStudentChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={studentForm.confirmPassword}
                    onChange={handleStudentChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-6 focus:outline-none focus:border-purple-500"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-primary text-white rounded-lg px-6 py-3 font-semibold hover:opacity-90 transition-opacity mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>

                  <div className="text-center text-sm">
                    <span className="text-gray-600">Already a member? </span>
                    <a href="/login" className="text-purple-600 hover:underline font-semibold">
                      Login
                    </a>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Institute Signup Form */}
          {userType === 'institute' && (
            <div className="flex flex-col lg:flex-row items-stretch gap-0 bg-white rounded-3xl shadow-lg overflow-hidden">
              {/* Right Side - Image */}
              <div className="flex flex-1">
                <div className="bg-purple-100 p-8 w-full flex items-center justify-center h-full">
                  <div className="text-left ml-8">
                    <h2 className="text-5xl font-bold text-black mb-2">
                      certi<span className="text-purple-600">chain</span>
                    </h2>
                    <p className="text-2xl text-gray-700 font-semibold mb-2">Register Your Institution</p>
                    <p className="text-gray-600 text-sm mb-8">Issue, manage, and verify certificates securely.</p>
                    <img src={instituteImage} alt="Institute" className="w-full h-auto" />
                  </div>
                </div>
              </div>

              {/* Left Side - Form */}
              <div className="flex-1">
                <form onSubmit={handleInstituteSubmit} className="p-8 overflow-y-auto max-h-screen">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Institute Registration</h2>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                      {successMessage}
                    </div>
                  )}

                  <input
                    type="text"
                    name="institute_name"
                    placeholder="Institution Name"
                    value={instituteForm.institute_name}
                    onChange={handleInstituteChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Official Email"
                    value={instituteForm.email}
                    onChange={handleInstituteChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Password (min 6 characters)"
                    value={instituteForm.password}
                    onChange={handleInstituteChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={instituteForm.confirmPassword}
                    onChange={handleInstituteChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <input
                    type="text"
                    name="wallet_address"
                    placeholder="Wallet Address (0x...)"
                    value={instituteForm.wallet_address}
                    onChange={handleInstituteChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <label className="block mb-4">
                    <span className="block text-sm font-semibold text-gray-700 mb-2">Institute Logo (Optional)</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'logo', 'institute')}
                      accept="image/*"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                    />
                    {instituteForm.logo && <p className="text-sm text-green-600 mt-2">✓ {instituteForm.logo.name}</p>}
                  </label>

                  <label className="block mb-4">
                    <span className="block text-sm font-semibold text-gray-700 mb-2">Verification Document (PDF/Image) *</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'verification_doc', 'institute')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                    />
                    {instituteForm.verification_doc && <p className="text-sm text-green-600 mt-2">✓ {instituteForm.verification_doc.name}</p>}
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-primary text-white rounded-lg px-6 py-3 font-semibold hover:opacity-90 transition-opacity mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Registering...' : 'Register Institution'}
                  </button>

                  <div className="text-center text-sm">
                    <span className="text-gray-600">Already a member? </span>
                    <a href="/login" className="text-purple-600 hover:underline font-semibold">
                      Login
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
