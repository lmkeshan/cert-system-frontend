import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import studentImage from '../../assets/images/studentSignup.webp'
import instituteImage from '../../assets/images/instituteSignup.webp'
import logoImage from '../../assets/images/logo.webp'
import { authAPI, setStudentToken, setUniversityToken } from '../../services/api'

export default function Signup() {
  const navigate = useNavigate()
  const [userType, setUserType] = useState('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [connectingWallet, setConnectingWallet] = useState(false)
  
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthdate: '',
  })

  const [instituteForm, setInstituteForm] = useState({
    institutionName: '',
    email: '',
    password: '',
    confirmPassword: '',
    walletAddress: '',
    logo: null,
    verificationDoc: null,
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

  const handleConnectMetaMask = async () => {
    if (!window.ethereum) {
      setError('MetaMask not detected. Please install MetaMask.')
      return
    }

    try {
      setConnectingWallet(true)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts && accounts[0]) {
        setInstituteForm(prev => ({ ...prev, walletAddress: accounts[0] }))
        setSuccessMessage('Wallet address filled from MetaMask')
        setError('')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setError('No accounts returned from MetaMask')
      }
    } catch (err) {
      setError('Failed to connect MetaMask: ' + err.message)
    } finally {
      setConnectingWallet(false)
    }
  }

  const validateWalletAddress = (address) => {
    return address.startsWith('0x') && address.length === 42
  }

  const handleStudentSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    // Validation
    if (!studentForm.firstName || !studentForm.lastName || !studentForm.email || !studentForm.password || !studentForm.gender || !studentForm.birthdate) {
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
        full_name: `${studentForm.firstName} ${studentForm.lastName}`,
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
    if (!instituteForm.institutionName || !instituteForm.email || !instituteForm.password || !instituteForm.walletAddress) {
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

    if (!validateWalletAddress(instituteForm.walletAddress)) {
      setError('Invalid wallet address format (should be 0x...)')
      return
    }

    if (!instituteForm.verificationDoc) {
      setError('Verification document is required for approval')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('institute_name', instituteForm.institutionName)
      formData.append('email', instituteForm.email)
      formData.append('password', instituteForm.password)
      formData.append('wallet_address', instituteForm.walletAddress)
      if (instituteForm.logo) {
        formData.append('logo', instituteForm.logo)
      }
      formData.append('verification_doc', instituteForm.verificationDoc)

      const response = await authAPI.registerUniversity(formData)

      setSuccessMessage('Registration successful! Awaiting admin approval... Redirecting...')
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
    <div className="min-h-screen bg-gray-50 bg-certi-repeat">
      {/* Navbar placeholder */}
      <nav className="bg-gradient-primary px-3 md:px-4 py-3">
        <div className="max-w-312 mx-auto flex justify-between items-center gap-3">
          <a href="/" className="inline-flex items-center">
            <img src={logoImage} alt="CertiChain" className="h-7 md:h-8 w-auto" />
          </a>
          <div className="flex items-center gap-4 md:gap-8">
            <a
              href="/login"
              className="inline-flex items-center justify-center text-white border border-white/70 rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-sm md:text-base font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Log In
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

              {/* Left Side - Form */}
              <div className="flex-1">
                <form onSubmit={handleStudentSubmit} className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Student Registration</h2>

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

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={studentForm.firstName}
                      onChange={handleStudentChange}
                      required
                      className="col-span-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={studentForm.lastName}
                      onChange={handleStudentChange}
                      required
                      className="col-span-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>


                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={studentForm.email}
                    onChange={handleStudentChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-purple-500"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select
                      name="gender"
                      value={studentForm.gender}
                      onChange={handleStudentChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select Gender</option>
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500"
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
                <form onSubmit={handleInstituteSubmit} className="p-8">
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
                    name="institutionName"
                    placeholder="Institution Name"
                    value={instituteForm.institutionName}
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

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Wallet Address (0x...) *</label>
                    <input
                      type="text"
                      name="walletAddress"
                      placeholder="0x..."
                      value={instituteForm.walletAddress}
                      onChange={handleInstituteChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-2 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={handleConnectMetaMask}
                      disabled={connectingWallet}
                      className="w-full border-2 border-orange-500 text-orange-600 rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-orange-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      🔗 {connectingWallet ? 'Connecting...' : 'Connect MetaMask to fill'}
                    </button>
                    <small className="text-xs text-gray-500 mt-2 block">
                      💡 This will be your signing wallet for issuing certificates. Must be a valid Ethereum address.
                    </small>
                  </div>

                  <label className="block mb-4">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Institute Logo (PNG/JPG/WebP, max 5MB)</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'logo', 'institute')}
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                      className="hidden"
                      id="instituteLogo"
                    />
                    <label htmlFor="instituteLogo" className="w-full border border-blue-500 rounded-lg px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 cursor-pointer flex items-center gap-2 transition-colors">
                      📁 Upload Institute Logo
                    </label>
                    {instituteForm.logo && (
                      <small className="text-xs text-green-600 mt-2 block">✓ {instituteForm.logo.name}</small>
                    )}
                  </label>

                  <label className="block mb-6">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Verification Document (PDF or image, max 5MB) *</span>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'verificationDoc', 'institute')}
                      accept="application/pdf, image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      id="verificationDocs"
                      required
                    />
                    <label htmlFor="verificationDocs" className="w-full border border-blue-500 rounded-lg px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 cursor-pointer flex items-center gap-2 transition-colors">
                      📁 Upload Verified Documents
                    </label>
                    {instituteForm.verificationDoc && (
                      <small className="text-xs text-green-600 mt-2 block">✓ {instituteForm.verificationDoc.name}</small>
                    )}
                    <small className="text-xs text-gray-500 mt-2 block">
                      Proof of accreditation/authority. Required for approval.
                    </small>
                  </label>

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
        </div>
      </div>
    </div>
  )
}
