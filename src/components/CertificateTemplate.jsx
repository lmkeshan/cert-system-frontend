import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import '../styles/certificate.css'

const formatDate = (value) => {
  if (!value) {
    return ''
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return String(value)
  }

  return parsed.toLocaleDateString()
}

export default function CertificateTemplate({ certificate }) {
  const [logoError, setLogoError] = useState(false)

  if (!certificate) {
    return null
  }

  const {
    certificateId,
    studentName,
    courseName,
    instituteName,
    issueDate,
    grade,
    instituteLogoUrl
  } = certificate

  const safeCertificateId = certificateId || 'N/A'
  const verifyUrl = `${window.location.origin}/verify?certificateId=${encodeURIComponent(safeCertificateId)}`

  return (
    <div className="certificate-root">
      <div className="certificate-top">
        <div className="certificate-box">
          {instituteLogoUrl && !logoError ? (
            <img
              src={instituteLogoUrl}
              alt={instituteName || 'Institute logo'}
              className="w-24 h-24 object-contain"
              crossOrigin="anonymous"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-xs text-gray-500 text-center">Institute Logo</span>
          )}
        </div>
        <div className="certificate-box">
          <QRCodeSVG value={verifyUrl} size={104} />
        </div>
      </div>

      <h1 className="certificate-title">COURSE CERTIFICATE</h1>

      <div className="certificate-body">
        <p className="certificate-subtitle">This is to certify that</p>
        <p className="certificate-name">{studentName || 'STUDENT NAME'}</p>
        <p className="certificate-description">
          has successfully completed the course by demonstrating
          theoretical and practical understanding of
        </p>
        <p className="certificate-course">{courseName || 'COURSE TITLE'}</p>
        <p className="certificate-subtitle">from</p>
        <p className="certificate-institute">{instituteName || 'INSTITUTE / UNIVERSITY NAME'}</p>
        <p className="certificate-grade">{grade ? `GRADE ${grade}` : 'GRADE'}</p>
      </div>

      <div className="certificate-footer">
        <img src="/certificate/stamp.webp" alt="Stamp" className="w-36 h-36 object-contain" />
        <div className="certificate-footer-center">
          CERTIFICATE ID : {safeCertificateId}
          <small>ISSUED : {formatDate(issueDate) || 'N/A'}</small>
        </div>
        <div className="certificate-logo-box">
          <img src="/certificate/certificateLogo.webp" alt="Company logo" className="w-40 h-40 object-contain" />
        </div>
      </div>
    </div>
  )
}
