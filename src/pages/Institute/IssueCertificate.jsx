import React, { useState } from "react";
import { universityAPI, authAPI } from "../../services/api";
import { useMetaMaskContext } from "../../context/MetaMaskContext";

const IssueCertificate = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    courseName: '',
    grade: '',
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // MetaMask integration from global context
  const { 
    connected: metamaskConnected, 
    address: metamaskAddress
  } = useMetaMaskContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.studentId.trim() || !formData.courseName.trim() || !formData.grade.trim()) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    // Check MetaMask connection
    if (!metamaskConnected) {
      setMessage({ type: 'error', text: '⚠️ Please connect MetaMask from the header first' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      setCurrentStep('Issuing certificate on blockchain...');
      
      const response = await universityAPI.issueCertificate({
        student_id: formData.studentId,
        course_name: formData.courseName,
        grade: formData.grade,
      });

      const certificateId = response.data?.certificate?.certificate_id || response.data?.certificate_id || response.data?.certificateId || '-';
      const txHash = response.data?.certificate?.blockchain_tx_hash || response.data?.blockchain_tx_hash || '-';
      
      setMessage({ 
        type: 'success', 
        text: `✅ Certificate issued successfully! Certificate ID: ${certificateId}${txHash !== '-' ? ' | TX: ' + txHash.slice(0, 10) + '...' : ''}` 
      });
      setFormData({ studentId: '', courseName: '', grade: '' });
      setCurrentStep('');
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      
    } catch (err) {
      console.error('Certificate issuance error:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to issue certificate';
      setMessage({ type: 'error', text: '❌ ' + errorMsg });
      setCurrentStep('');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header Banner - Increased Height and Padding */}
      <div className="bg-white rounded-2xl border border-gray-300 px-6 py-8 md:py-10 flex items-center gap-5 shadow-sm min-h-[120px]">
        <div className="text-3xl bg-[#E9D5FF] p-3 rounded-xl flex items-center justify-center shrink-0">
          🎟️
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            Issue Certificate
          </h2>
          <p className="text-sm md:text-base text-gray-400 font-medium mt-1">
            Issue a blockchain verified certificate for a student
          </p>
        </div>
      </div>

      {/* 2. Main Form Card */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-50">
        <form
          className="space-y-5 max-w-2xl mx-auto"
          onSubmit={handleSubmit}
        >
          {/* Progress indicator */}
          {loading && currentStep && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-700 font-medium text-center">
                {currentStep}
              </p>
            </div>
          )}
          {/* Student ID - Reduced input height */}
          <div className="space-y-1.5">
            <label className="block text-gray-800 font-bold text-base">
              Student ID
            </label>
            <input
              type="text"
              placeholder="STU12345...."
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border-2 border-gray-200 focus:border-[#9366E4] outline-none transition-all placeholder:text-gray-300 font-medium text-sm"
            />
            <p className="text-gray-400 text-[11px] font-medium">
              Enter the registered student ID
            </p>
          </div>

          {/* Course Name - Reduced input height */}
          <div className="space-y-1.5">
            <label className="block text-gray-800 font-bold text-base">
              Course/Program Name
            </label>
            <input
              type="text"
              placeholder="e.g..B.Tech Computer science"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border-2 border-gray-200 focus:border-[#9366E4] outline-none transition-all placeholder:text-gray-300 font-medium text-sm"
            />
          </div>

          {/* Grade/Score - Reduced input height */}
          <div className="space-y-1.5">
            <label className="block text-gray-800 font-bold text-base">
              Grade/Score
            </label>
            <input
              type="text"
              placeholder="e.g.. A, 95% , First Class"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border-2 border-gray-200 focus:border-[#9366E4] outline-none transition-all placeholder:text-gray-300 font-medium text-sm"
            />
          </div>

          {/* Action Button - Reduced height and padding */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A78BFA] hover:bg-[#8B5CF6] text-white font-extrabold py-3 rounded-xl transition-all shadow-md text-base active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Issuing Certificate..." : "🚀 Issue Certificate"}
            </button>
          </div>

          {message.text && (
            <div
              className={`rounded-lg p-4 text-sm font-medium ${  
                message.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : 
                message.type === "info" ? "bg-blue-50 border border-blue-200 text-blue-700" :
                "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Note Section - Large, clean text without background */}
          <div className="mt-8 px-6">
            <p className="text-base md:text-lg text-gray-500 text-center leading-relaxed font-medium">
              <span className="font-bold text-gray-700">Note :</span> The
              certificate will be stored on the block chain. Make sure all
              information is accurate before submitting. The student will be
              able to view and share this certificate once issued.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueCertificate;
