import React, { useState } from 'react';
import { universityAPI } from '../../services/api';

const IssueCertificate = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    courseName: '',
    grade: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await universityAPI.issueCertificate({
        student_id: formData.studentId,
        course_name: formData.courseName,
        grade: formData.grade,
      });

      setMessage({ 
        type: 'success', 
        text: '✅ Certificate issued successfully! Certificate ID: ' + response.data.certificateId 
      });
      setFormData({ studentId: '', courseName: '', grade: '' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to issue certificate';
      setMessage({ type: 'error', text: '❌ ' + errorMsg });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-gray-300 p-6 flex items-start gap-4 shadow-sm">
        <div className="text-2xl bg-[#E9D5FF] p-2 rounded-lg">🎟️</div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Issue Certificate</h2>
          <p className="text-sm text-gray-400 font-medium">Issue a blockchain verified certificate for a student</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-gray-50">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-gray-800 font-bold text-lg">Student ID</label>
            <input 
              type="text" 
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="STU12345...." 
              className="w-full p-3.5 rounded-xl border-2 border-gray-300 focus:border-[#9366E4] outline-none transition-all placeholder:text-gray-300 font-medium" 
            />
            <p className="text-gray-400 text-sm font-medium">Enter the registered student ID</p>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-800 font-bold text-lg">Course/Program Name</label>
            <input 
              type="text" 
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="e.g..B.Tech Computer science" 
              className="w-full p-3.5 rounded-xl border-2 border-gray-300 focus:border-[#9366E4] outline-none transition-all placeholder:text-gray-300 font-medium" 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-800 font-bold text-lg">Grade/Score</label>
            <input 
              type="text" 
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder="e.g.. A, 95% , First Class" 
              className="w-full p-3.5 rounded-xl border-2 border-gray-300 focus:border-[#9366E4] outline-none transition-all placeholder:text-gray-300 font-medium" 
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#A78BFA] hover:bg-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-4 rounded-xl transition-all shadow-lg text-lg"
            >
              {loading ? '⏳ Issuing...' : 'Issue Certificate'}
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed font-medium px-6">
            <span className="font-bold text-gray-600">Note :</span> The certificate will be stored on the block chain. Make sure all information is accurate before submitting. The student will be able to view and share this certificate once issued.
          </p>
        </form>
      </div>
    </div>
  );
};

export default IssueCertificate;