import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import verifyImage from '../../assets/images/verifyImage.webp'
import { verifyAPI } from '../../services/api'
import CertificatePdfRenderer from '../../components/CertificatePdfRenderer'
import { generateCertificatePdfBlob } from '../../utils/certificatePdf'

export default function VerifyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [certificateId, setCertificateId] = useState('')
  const [verificationResult, setVerificationResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [pdfCertificate, setPdfCertificate] = useState(null)
  const templateRef = useRef(null)

  const verifyCertificateId = async (id) => {
    if (!id || !id.trim()) {
      alert('Please enter a certificate ID')
      return
    }

    setIsLoading(true)

    try {
      const response = await verifyAPI.verifyCertificate(id.trim())
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
      const serverUrl = baseUrl.replace(/\/api\/?$/, '')
      const rawLogoUrl = response.data?.certificate?.logo_url
      const logoUrl = rawLogoUrl
        ? rawLogoUrl.startsWith('http')
          ? rawLogoUrl
          : `${serverUrl}${rawLogoUrl}`
        : null

      if (response.data?.certificate) {
        setVerificationResult({
          valid: true,
          certificateId: response.data.certificate.certificate_id,
          userId: response.data.certificate.user_id,
          studentName: response.data.certificate.student_name || response.data.certificate.fullName,
          courseName: response.data.certificate.course || response.data.certificate.courseName || response.data.certificate.course_name || response.data.certificate.certificate_title,
          instituteName: response.data.certificate.institute_name || response.data.certificate.instituteName,
          issueDate: response.data.certificate.issued_date || response.data.certificate.issueDate,
          grade: response.data.certificate.grade,
          blockchainTxHash: response.data.certificate.blockchain_tx_hash,
          blockchainVerified: response.data.onchain?.verified || false,
          instituteLogoUrl: logoUrl
        })
      } else {
        setVerificationResult({
          valid: false
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationResult({
        valid: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    await verifyCertificateId(certificateId)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerify()
    }
  }

  useEffect(() => {
    const paramId = searchParams.get('certificateId')
    if (paramId) {
      setCertificateId(paramId)
      verifyCertificateId(paramId)
    }
  }, [searchParams])

  const openCertificatePdf = () => {
    if (!verificationResult?.valid) {
      return
    }

    setPdfCertificate({
      certificateId: verificationResult.certificateId,
      studentName: verificationResult.studentName,
      courseName: verificationResult.courseName,
      instituteName: verificationResult.instituteName,
      issueDate: verificationResult.issueDate,
      grade: verificationResult.grade,
      instituteLogoUrl: verificationResult.instituteLogoUrl
    })
    setIsGeneratingPdf(true)
  }

  useEffect(() => {
    if (!pdfCertificate || !isGeneratingPdf) {
      return
    }

    let isCancelled = false

    const waitForTemplate = async () => {
      for (let i = 0; i < 60; i += 1) {
        if (templateRef.current) {
          return true
        }
        await new Promise((resolve) => requestAnimationFrame(resolve))
      }
      return false
    }

    const generatePdf = async () => {
      try {
        const ready = await waitForTemplate()
        if (!ready || isCancelled) {
          return
        }

        const blob = await generateCertificatePdfBlob(templateRef.current)
        if (!blob || isCancelled) {
          return
        }

        const url = URL.createObjectURL(blob)
        window.location.href = url
        window.setTimeout(() => URL.revokeObjectURL(url), 30000)
      } catch (error) {
        console.error('Failed to generate certificate PDF:', error)
        alert('Failed to generate certificate PDF. Please try again.')
      } finally {
        if (!isCancelled) {
          setIsGeneratingPdf(false)
        }
      }
    }

    generatePdf()

    return () => {
      isCancelled = true
    }
  }, [pdfCertificate, isGeneratingPdf])

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-purple-100 via-blue-50 to-purple-50">
        <Navbar />
        
        <main className="max-w-300 mx-auto px-4 py-8 md:py-12">
          {/* Main Container */}
          <div className="bg-purple-200/60 rounded-3xl p-6 md:p-12 shadow-lg backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Verify Certificate
            </h1>
            <p className="text-gray-700 text-base md:text-lg">
              Instantly verify the authenticity of any certificate using its unique ID.
            </p>
          </div>

          {/* Input Section */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <input
              type="text"
              placeholder="Enter Your Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full md:w-100 px-6 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-purple-500 text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleVerify}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-30"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-md min-h-87.5 flex items-center justify-center">
            {!verificationResult ? (
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 max-w-3xl">
                {/* Illustration */}
                <div className="flex-shrink-0">
                  <img
                    src={verifyImage}
                    alt="Certificate verification illustration"
                    className="w-48 h-48 md:w-64 md:h-64 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="text-gray-500 text-base md:text-lg text-center md:text-left">
                  Enter a certificate ID above to view and verify certificate details here.
                </p>
              </div>
            ) : (
              <div className="w-full">
                {verificationResult.valid ? (
                  <div className="space-y-6">
                    {/* Success Badge */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full flex items-center gap-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Certificate Valid</span>
                      </div>
                    </div>

                      <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Certificate ID</p>
                        <p className="font-semibold text-gray-800 break-all">{verificationResult.certificateId}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Student Name</p>
                        <p className="font-semibold text-gray-800">{verificationResult.studentName}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Course Name</p>
                        <p className="font-semibold text-gray-800">{verificationResult.courseName}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Institute</p>
                        <p className="font-semibold text-gray-800">{verificationResult.instituteName}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                        <p className="font-semibold text-gray-800">{new Date(verificationResult.issueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Grade</p>
                        <p className="font-semibold text-gray-800">{verificationResult.grade}</p>
                      </div>
                    </div>

                    {/* Blockchain Verification Info */}
                    {verificationResult.blockchainTxHash && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-gray-600 mb-2">✅ Blockchain Verified</p>
                        <p className="text-xs text-gray-700 font-mono break-all">{verificationResult.blockchainTxHash}</p>
                        <a
                          href={`https://amoy.polygonscan.com/tx/${verificationResult.blockchainTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block underline"
                        >
                          View on Polygonscan →
                        </a>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                      <button
                        onClick={openCertificatePdf}
                        disabled={isGeneratingPdf}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full transition-colors flex items-center gap-2 disabled:opacity-60"
                      >
                        <span>📄</span> View Certificate
                      </button>
                      <button
                        onClick={() => navigate(`/portfolio/${verificationResult.userId}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition-colors flex items-center gap-2"
                      >
                        <span>👤</span> View Portfolio
                      </button>
                      <button
                        onClick={() => {
                          setCertificateId('')
                          setVerificationResult(null)
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-full transition-colors"
                      >
                        Verify Another
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-red-100 text-red-700 px-6 py-3 rounded-full inline-flex items-center gap-2 mb-4">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">Certificate Not Found</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                      The certificate ID you entered could not be found. Please verify the ID and try again.
                    </p>
                    <button
                      onClick={() => {
                        setCertificateId('')
                        setVerificationResult(null)
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        </main>
      </div>
      <CertificatePdfRenderer certificate={pdfCertificate} templateRef={templateRef} />
    </>
  )
}
