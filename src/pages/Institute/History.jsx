import React, { useState, useEffect } from "react";
import { universityAPI } from "../../services/api";

const HistoryPage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);

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
      const formattedData = certificates.map(cert => ({
        certId: cert.certificate_id,
        studentId: cert.student_id || cert.user_id,
        course: cert.course || cert.course_name,
        grade: cert.grade,
        date: new Date(cert.issued_date).toLocaleDateString(),
        tx: cert.blockchain_tx_hash || 'Pending',
      }));
      
      setHistoryData(formattedData);
    } catch (err) {
      setError(err.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
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
                <th className="pb-4 px-2">Student ID</th>
                <th className="pb-4 px-2">Course</th>
                <th className="pb-4 px-2">Grade</th>
                <th className="pb-4 px-2">Issued Date</th>
                <th className="pb-4 px-2">Blockchain TX</th>
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
                  <td className="py-6 px-2 font-medium">{item.studentId}</td>
                  <td className="py-6 px-2">{item.course}</td>
                  <td className="py-6 px-2 font-bold">{item.grade}</td>
                  <td className="py-6 px-2">{item.date}</td>
                  <td className="py-6 px-2 font-mono text-xs text-gray-400 truncate max-w-30">
                    {item.tx}
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

              {/* Middle Row: Student ID */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  Student ID
                </span>
                <p className="text-sm font-medium text-gray-800 break-all">
                  {item.studentId}
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

              {/* Bottom Row: Blockchain TX */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block mb-1">
                  Blockchain Transaction
                </span>
                <p className="text-[10px] font-mono text-gray-500 break-all leading-tight">
                  {item.tx}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default HistoryPage;
