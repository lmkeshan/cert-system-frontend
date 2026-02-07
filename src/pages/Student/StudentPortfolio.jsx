import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import StudentHeader from '../../components/StudentHeader'
import { studentAPI, verifyAPI } from '../../services/api'
import CertificatePdfRenderer from '../../components/CertificatePdfRenderer'
import { generateCertificatePdfBlob } from '../../utils/certificatePdf'

export default function StudentPortfolio() {
  const { userId } = useParams() // For public portfolio
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOwnPortfolio, setIsOwnPortfolio] = useState(false)
  
  const [studentData, setStudentData] = useState({
    name: '',
    userId: '',
    email: '',
    totalCertificates: 0,
    blockchainVerified: 0,
    institutions: 0,
    activeCertificates: 0,
    profilePhotoUrl: null,
    cvUrl: null,
    githubUrl: null
  })

  const [certificates, setCertificates] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [careerInsights, setCareerInsights] = useState(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [pdfCertificate, setPdfCertificate] = useState(null)
  const templateRef = useRef(null)

  useEffect(() => {
    loadPortfolioData()
  }, [userId])

  const loadPortfolioData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if viewing own portfolio or public portfolio
      const studentToken = localStorage.getItem('studentToken')
      const isPublic = !!userId

      if (isPublic) {
        // Load public portfolio data
        try {
          const response = await verifyAPI.getUserCertificates(userId)
          const { student, certificates: certs, careerInsights: insights } = response.data
        
        setStudentData({
          name: student.fullName || student.full_name,
          userId: student.userId || student.user_id,
          email: student.email,
          totalCertificates: certs.length,
          blockchainVerified: certs.filter(c => c.blockchain_tx_hash).length,
          institutions: new Set(certs.map(c => c.institute_id)).size,
          activeCertificates: certs.filter(c => !c.expiry_date || new Date(c.expiry_date) > new Date()).length,
          profilePhotoUrl: student.profilePhotoUrl || student.profile_photo_url,
          cvUrl: student.cvUrl || student.cv_url,
          githubUrl: student.githubUrl || student.github_url
        })
        
        setCertificates(certs)
        
        // Set career insights if available from backend
        if (insights) {
          setCareerInsights(insights)
        }
        
        // Calculate institutions
        const instMap = {}
        certs.forEach(cert => {
          if (!instMap[cert.institute_id]) {
            instMap[cert.institute_id] = {
              name: cert.institute_name,
              certificateCount: 0,
              logo_url: cert.logo_url
            }
          }
          instMap[cert.institute_id].certificateCount++
        })
        setInstitutions(Object.values(instMap))
        
        setIsOwnPortfolio(false)
        } catch (err) {
          if (err.response?.status === 403) {
            setError('This portfolio is private and cannot be viewed publicly')
          } else {
            setError(err.response?.data?.error || 'Failed to load portfolio')
          }
          setLoading(false)
          return
        }
      } else if (studentToken) {
        // Load authenticated student's full portfolio
        const dashboardResponse = await studentAPI.getDashboard()
        const { student, certificates: certs, statistics, institutions: insts } = dashboardResponse.data
        
        setStudentData({
          name: student.full_name,
          userId: student.userId,
          email: student.email,
          totalCertificates: statistics.totalCertificates,
          blockchainVerified: statistics.blockchainVerifiedCount,
          institutions: statistics.institutionsCount,
          activeCertificates: statistics.activeCertificatesCount,
          profilePhotoUrl: student.profile_photo_url,
          cvUrl: student.cv_url,
          githubUrl: student.github_url
        })
        
        setCertificates(certs)
        setInstitutions(insts)
        setIsOwnPortfolio(true)
        
        // Load career insights
        try {
          const insightsResponse = await studentAPI.getCareerInsights(false)
          setCareerInsights(insightsResponse.data.insights)
        } catch (err) {
          console.log('Career insights not available:', err.message)
        }
      } else {
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load portfolio')
    } finally {
      setLoading(false)
    }
  }

  const regenerateCareerInsights = async () => {
    try {
      setLoading(true)
      const response = await studentAPI.getCareerInsights(true)
      setCareerInsights(response.data.insights)
    } catch (err) {
      setError('Failed to regenerate career insights')
    } finally {
      setLoading(false)
    }
  }

  const copyPortfolioLink = () => {
    const link = `${window.location.origin}/portfolio/${studentData.userId}`
    navigator.clipboard.writeText(link)
    alert('Portfolio link copied to clipboard!')
  }

  const buildCertificateData = (cert) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
    const serverUrl = baseUrl.replace('/api', '')

    return {
      certificateId: cert.certificate_id,
      studentName: studentData.name || cert.student_name || cert.full_name,
      courseName: cert.certificate_title || cert.course || cert.course_name,
      instituteName: cert.institute_name,
      issueDate: cert.issued_date,
      grade: cert.grade,
      instituteLogoUrl: cert.logo_url ? `${serverUrl}${cert.logo_url}` : null
    }
  }

  const openCertificatePdf = async (cert) => {
    setPdfCertificate(buildCertificateData(cert))

    const waitForTemplate = async () => {
      for (let i = 0; i < 10; i += 1) {
        if (templateRef.current) {
          return true
        }
        await new Promise((resolve) => requestAnimationFrame(resolve))
      }
      return false
    }

    setIsGeneratingPdf(true)
    try {
      const ready = await waitForTemplate()
      if (!ready) {
        return
      }

      const blob = await generateCertificatePdfBlob(templateRef.current)
      if (!blob) {
        return
      }

      const url = URL.createObjectURL(blob)
      window.open(url, '_self')
      window.setTimeout(() => URL.revokeObjectURL(url), 30000)
    } catch (error) {
      console.error('Failed to generate certificate PDF:', error)
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {!userId && <StudentHeader />}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading portfolio...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {!userId && <StudentHeader />}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-semibold">Error Loading Portfolio</p>
            <p className="text-red-600 text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation - only show if authenticated */}
        {!userId && <StudentHeader />}

        <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-12 text-center mb-8 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-lg overflow-hidden">
              {studentData.profilePhotoUrl ? (
                <img 
                  src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001'}${studentData.profilePhotoUrl}`}
                  alt={studentData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{studentData.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{studentData.name}</h1>
          <p className="text-xl text-purple-100 mb-4">Professional Portfolio</p>
          <p className="text-sm text-purple-200">Student ID: {studentData.userId}</p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {isOwnPortfolio && (
              <button 
                onClick={copyPortfolioLink}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>🔗</span> Share My Portfolio
              </button>
            )}
            
            {studentData.githubUrl && (
              <a
                href={studentData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-900 transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>💻</span> GitHub Profile
              </a>
            )}
            
            {studentData.cvUrl && (
              <a
                href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001'}${studentData.cvUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>📄</span> Download CV
              </a>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 text-center border-2 border-purple-300">
            <div className="text-3xl mb-2">🖼️</div>
            <div className="text-3xl font-bold text-purple-800 mb-1">{studentData.totalCertificates}</div>
            <div className="text-sm font-semibold text-purple-700">Total Certificates</div>
          </Card>

          <Card className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 text-center border-2 border-green-300">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-800 mb-1">{studentData.blockchainVerified}</div>
            <div className="text-sm font-semibold text-green-700">Blockchain Verified</div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6 text-center border-2 border-blue-300">
            <div className="text-3xl mb-2">🏛️</div>
            <div className="text-3xl font-bold text-blue-800 mb-1">{studentData.institutions}</div>
            <div className="text-sm font-semibold text-blue-700">Institutions</div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6 text-center border-2 border-orange-300">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-3xl font-bold text-orange-800 mb-1">{studentData.activeCertificates}</div>
            <div className="text-sm font-semibold text-orange-700">Active Certificates</div>
          </Card>
        </div>

        {/* Courses Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-purple-600 mb-6 flex items-center gap-2">
            <span>📚</span> Certificates
          </h2>
          {certificates.length === 0 ? (
            <Card className="bg-gray-100 rounded-2xl p-12 text-center">
              <p className="text-gray-500 text-lg">No certificates yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {certificates.map((cert) => {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
                const serverUrl = baseUrl.replace('/api', '')
                const logoUrl = cert.logo_url ? `${serverUrl}${cert.logo_url}` : null
                
                return (
                <Card key={cert.certificate_id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{cert.course_name || cert.course}</h3>
                      <p className="text-sm text-gray-600">{cert.institute_name}</p>
                    </div>
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt={cert.institute_name}
                        className="w-16 h-16 object-contain rounded-lg border border-gray-200 ml-4"
                      />
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                      <span>📅</span> {new Date(cert.issued_date).toLocaleDateString()}
                    </span>
                    {cert.grade && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                        <span>⭐</span> Grade {cert.grade}
                      </span>
                    )}
                    {cert.blockchain_tx_hash && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                        <span>✅</span> Blockchain Verified
                      </span>
                    )}
                    {cert.expiry_date && (
                      <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                        <span>📆</span> Expires {new Date(cert.expiry_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Blockchain Transaction Hash */}
                  {cert.blockchain_tx_hash && (
                    <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 font-semibold mb-1">Blockchain Transaction:</p>
                      <a 
                        href={`https://amoy.polygonscan.com/tx/${cert.blockchain_tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 font-mono break-all underline flex items-center gap-1"
                      >
                        <span>🔗</span> {cert.blockchain_tx_hash}
                      </a>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex">
                    <button
                      onClick={() => openCertificatePdf(cert)}
                      disabled={isGeneratingPdf}
                      className="bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors disabled:opacity-60"
                    >
                      <span>📄</span> View Certificate
                    </button>
                  </div>
                </Card>
              )})}
            </div>
          )}
        </div>

        {/* Institutions Grid */}
        {institutions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-purple-600 mb-6 flex items-center gap-2">
              <span>🏛️</span> Institutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {institutions.map((inst, index) => {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
                const serverUrl = baseUrl.replace('/api', '')
                const logoUrl = inst.logo_url ? `${serverUrl}${inst.logo_url}` : null
                
                return (
                <Card key={index} className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-8 text-center text-white shadow-lg hover:shadow-xl transition-shadow">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={inst.name || inst.institute_name}
                      className="w-20 h-20 object-contain rounded-lg mx-auto mb-4 bg-white p-2"
                    />
                  ) : (
                    <div className="text-4xl mb-4">🎓</div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{inst.name || inst.institute_name}</h3>
                  <p className="text-white/90">{inst.certificateCount} Certificates</p>
                </Card>
              )})}
            </div>
          </div>
        )}

        {/* AI Career Insights Section */}
        {careerInsights && (
          <Card className="bg-white border-2 border-purple-300 rounded-3xl p-8 mb-12 shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                <span>🤖</span> AI Career Insights
              </h3>
              {isOwnPortfolio && (
                <button
                  onClick={regenerateCareerInsights}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition-all"
                >
                  🔄 Regenerate
                </button>
              )}
            </div>

            {/* Summary */}
            {careerInsights.summary && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">Professional Summary</h4>
                <p className="text-gray-700 text-center leading-relaxed">
                  {careerInsights.summary}
                </p>
              </div>
            )}

            {/* Top Skills */}
            {careerInsights.topSkills && careerInsights.topSkills.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-800 mb-6 text-center">Top Skills</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {careerInsights.topSkills.map((skill, index) => (
                    <div key={index} className="bg-blue-100 text-blue-700 rounded-lg px-6 py-3 text-center font-medium">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Matches */}
            {careerInsights.careerMatches && careerInsights.careerMatches.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-800 mb-6 text-center">Career Matches</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerInsights.careerMatches.map((career, index) => (
                    <Card key={index} className="border-l-4 border-purple-500 bg-purple-50 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-gray-800">{career.title}</h5>
                        <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {career.matchPercentage}%
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {careerInsights.nextSteps && careerInsights.nextSteps.length > 0 && (
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-6 text-center">Recommended Next Steps</h4>
                <div className="space-y-4">
                  {careerInsights.nextSteps.map((step, index) => (
                    <Card key={index} className="border-l-4 border-green-500 bg-green-50 p-6 rounded-lg">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{step.completed ? '✅' : '📌'}</span>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-semibold mb-1">{step.step}</p>
                          <h5 className="font-bold text-gray-800 mb-2">{step.title}</h5>
                          <p className="text-sm text-gray-700">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {careerInsights.generatedAt && (
              <p className="text-xs text-gray-500 text-center mt-6">
                Generated on {new Date(careerInsights.generatedAt).toLocaleString()}
              </p>
            )}
          </Card>
        )}

        {/* Generate Career Insights Button (for authenticated users without insights) */}
        {isOwnPortfolio && !careerInsights && certificates.length > 0 && (
          <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-3xl p-12 text-center mb-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Get AI Career Insights</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Let our AI analyze your certificates and provide personalized career recommendations, 
              top skills, and next steps to advance your career.
            </p>
            <button
              onClick={regenerateCareerInsights}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-purple-700 transition-all shadow-md"
            >
              Generate Career Insights
            </button>
          </Card>
        )}
        </div>
      </div>
      <CertificatePdfRenderer certificate={pdfCertificate} templateRef={templateRef} />
    </>
  )
}
