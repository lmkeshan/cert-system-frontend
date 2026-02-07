import CertificateTemplate from './CertificateTemplate'

export default function CertificatePdfRenderer({ certificate, templateRef }) {
  return (
    <div className="absolute left-[-10000px] top-0" aria-hidden="true">
      <div ref={templateRef} className="inline-block">
        {certificate && <CertificateTemplate certificate={certificate} />}
      </div>
    </div>
  )
}
