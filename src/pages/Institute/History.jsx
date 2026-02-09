import React, { useState, useEffect, useRef } from "react";
import { universityAPI, verifyAPI } from "../../services/api";
import CertificatePdfRenderer from "../../components/CertificatePdfRenderer";
import { generateCertificatePdfBlob } from "../../utils/certificatePdf";

const HistoryPage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfCertificate, setPdfCertificate] = useState(null);
  const templateRef = useRef(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await universityAPI.getCertificates();
      const certificates = response.data.certificates || [];
      
      // Transform API data to component format
      const baseUrl = window.location.origin;
      const formattedData = certificates.map(cert => {
        const studentId = cert.student_id || cert.user_id;
        const studentName = cert.student_name || cert.full_name || cert.issuer_name || 'Student';
        const txHash = cert.blockchain_tx_hash || '';
        const hasTx = txHash && txHash !== 'Pending';
        return {
          certId: cert.certificate_id,
          studentId,
          studentName,
          course: cert.course || cert.course_name,
          grade: cert.grade,
          date: new Date(cert.issued_date).toLocaleDateString(),
          tx: txHash || 'Pending',
          txUrl: hasTx && txHash.startsWith('0x') ? `https://amoy.polygonscan.com/tx/${txHash}` : '',
          portfolioUrl: studentId ? `${baseUrl}/portfolio/${studentId}` : '',
          verifyUrl: cert.certificate_id ? `${baseUrl}/verify?certificateId=${cert.certificate_id}` : ''
        };
      });
      
      setHistoryData(formattedData);
    } catch (err) {
      setError(err.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const buildCertificateData = (certificate, onchain) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    const serverUrl = baseUrl.replace(/\/api\/?$/, '');
    const rawLogoUrl = certificate?.logo_url;
    const logoUrl = rawLogoUrl
      ? rawLogoUrl.startsWith('http')
        ? rawLogoUrl
        : `${serverUrl}${rawLogoUrl}`
      : null;

    return {
      certificateId: certificate?.certificate_id,
      studentName: certificate?.student_name || certificate?.fullName || certificate?.full_name,
      courseName: certificate?.course || certificate?.courseName || certificate?.course_name || certificate?.certificate_title,
      instituteName: certificate?.institute_name || certificate?.instituteName,
      issueDate: certificate?.issued_date || certificate?.issueDate,
      grade: certificate?.grade,
      instituteLogoUrl: logoUrl
    };
  };

  const viewCertificatePdf = async (certId) => {
    if (!certId || isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const response = await verifyAPI.verifyCertificate(certId);
      if (!response.data?.certificate) {
        throw new Error('Certificate not found');
      }

      const data = buildCertificateData(response.data.certificate, response.data.onchain);
      setPdfCertificate(data);

      const waitForTemplate = async () => {
        for (let i = 0; i < 10; i += 1) {
          if (templateRef.current) {
            return true;
          }
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
        return false;
      };

      const ready = await waitForTemplate();
      if (!ready) return;

      const blob = await generateCertificatePdfBlob(templateRef.current);
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      window.open(url, '_self');
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (err) {
      console.error('Failed to generate certificate PDF:', err);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-300 px-6 py-8 md:py-10 flex items-start gap-4 shadow-sm min-h-[120px]">
        <div className="text-2xl bg-[#E9D5FF] p-2 rounded-lg shrink-0">
          <span role="img" aria-label="history-icon">
            📊
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Issued Certificate History
          </h2>
          <p className="text-sm text-gray-400 font-medium font-sans">
            View all certificates issued by your institution
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
          <p>Loading certificates...</p>
        </div>
      )}

      {!loading && historyData.length === 0 && !error && (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
          <p className="text-lg font-semibold">No certificates issued yet</p>
          <p className="text-sm mt-2">Start by issuing your first certificate!</p>
        </div>
      )}

      {/* Main Container */}
      {!loading && historyData.length > 0 && (
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-50 overflow-hidden">
        {/* DESKTOP VIEW */}
        <div className="hidden md:block overflow-x-auto p-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-800 font-bold text-sm border-b border-purple-100">
                <th className="pb-4 px-2">Certificate ID</th>
                <th className="pb-4 px-2">Student</th>
                <th className="pb-4 px-2">Course</th>
                <th className="pb-4 px-2">Grade</th>
                <th className="pb-4 px-2">Issued Date</th>
                <th className="pb-4 px-2">Blockchain TX</th>
                <th className="pb-4 px-2">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historyData.map((item, index) => (
                <tr
                  key={index}
                  className="text-sm text-gray-700 hover:bg-purple-50/50 transition-colors"
                >
                  <td className="py-6 px-2 font-bold text-black">
                    {item.certId}
                  </td>
                  <td className="py-6 px-2">
                    <div className="font-semibold text-gray-900">{item.studentName}</div>
                    <div className="text-xs text-gray-500">
                      {item.portfolioUrl ? (
                        <a href={item.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          {item.studentId}
                        </a>
                      ) : (
                        item.studentId
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-2">{item.course}</td>
                  <td className="py-6 px-2 font-bold">{item.grade}</td>
                  <td className="py-6 px-2">{item.date}</td>
                  <td className="py-6 px-2 font-mono text-xs text-gray-400 truncate max-w-30">
                    {item.txUrl ? (
                      <a href={item.txUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                        {item.tx}
                      </a>
                    ) : (
                      item.tx
                    )}
                  </td>
                  <td className="py-6 px-2">
                    {item.certId ? (
                      <button
                        type="button"
                        onClick={() => viewCertificatePdf(item.certId)}
                        className="text-sm text-blue-600 hover:underline font-semibold"
                      >
                        View Certificate
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW (Stacked Cards with TX Included) */}
        <div className="md:hidden divide-y divide-gray-100">
          {historyData.map((item, index) => (
            <div key={index} className="p-6 space-y-4">
              {/* Top Row: Cert ID and Grade */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    Certificate ID
                  </span>
                  <span className="text-sm font-bold text-black">
                    {item.certId}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    Grade
                  </span>
                  <span className="text-sm font-bold text-purple-600">
                    {item.grade}
                  </span>
                </div>
              </div>

              {/* Middle Row: Student */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  Student
                </span>
                <p className="text-sm font-semibold text-gray-800">{item.studentName}</p>
                <p className="text-xs text-gray-500 break-all">
                  {item.portfolioUrl ? (
                    <a href={item.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                      {item.studentId}
                    </a>
                  ) : (
                    item.studentId
                  )}
                </p>
              </div>

              {/* Course and Date */}
              <div className="flex justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    Course
                  </span>
                  <p className="text-sm text-gray-700">{item.course}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    Date
                  </span>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </div>

              {/* Bottom Row: Blockchain TX + Links */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-1">
                  Blockchain Transaction
                </span>
                <p className="text-[10px] font-mono text-gray-500 break-all leading-tight">
                  {item.txUrl ? (
                    <a href={item.txUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                      {item.tx}
                    </a>
                  ) : (
                    item.tx
                  )}
                </p>
                <div className="flex gap-3">
                  {item.certId && (
                    <button
                      type="button"
                      onClick={() => viewCertificatePdf(item.certId)}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
      <CertificatePdfRenderer certificate={pdfCertificate} templateRef={templateRef} />
    </div>
  );
};

export default HistoryPage;
