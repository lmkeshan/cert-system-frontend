import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { universityAPI } from '../../services/api';

const BulkUpload = () => {
  const fileInputRef = useRef(null);
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [preview, setPreview] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const studentIdIdx = headers.indexOf('student_id');
    const courseIdx = headers.indexOf('course_name');
    const gradeIdx = headers.indexOf('grade');

    if (studentIdIdx === -1 || courseIdx === -1 || gradeIdx === -1) {
      return [];
    }

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length > gradeIdx && parts[studentIdIdx]?.trim()) {
        data.push({
          student_id: parts[studentIdIdx].trim(),
          course_name: parts[courseIdx].trim(),
          grade: parts[gradeIdx].trim(),
        });
      }
    }
    return data;
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setMessage({ type: 'error', text: '❌ Please upload a CSV file' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const data = parseCSV(text);

      if (data.length === 0) {
        setMessage({ 
          type: 'error', 
          text: '❌ Invalid CSV format. Required columns: student_id, course_name, grade' 
        });
        return;
      }

      if (data.length > 500) {
        setMessage({ 
          type: 'error', 
          text: '❌ Maximum 500 certificates per upload. Please split your file.' 
        });
        return;
      }

      setCsvData(data);
      setFileName(file.name);
      setPreview(data.slice(0, 5));
      setMessage({ type: 'success', text: `✅ ${file.name} ready! (${data.length} certificates)` });
    };
    reader.readAsText(file);
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (csvData.length === 0) {
      setMessage({ type: 'error', text: '❌ No CSV file selected' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setUploadProgress(0);

    try {
      // Simulate progress updates while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 30;
        });
      }, 200);

      const response = await universityAPI.bulkIssueCertificates({
        certificates: csvData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const successful = response.data.successful || csvData.length;
      setMessage({ 
        type: 'success', 
        text: `✅ Successfully uploaded ${successful} out of ${csvData.length} certificates!` 
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        setCsvData([]);
        setFileName('');
        setPreview([]);
        setUploadProgress(0);
        setMessage({ type: '', text: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to upload certificates';
      setMessage({ type: 'error', text: '❌ ' + errorMsg });
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-300 p-5 md:p-6 flex items-start gap-4 shadow-sm">
        <div className="text-3xl text-blue-500">
          <UploadCloud size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Bulk Upload Certificates</h2>
          <p className="text-sm text-gray-400 font-medium">upload multiple certificates at once using a CSV file</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-4xl p-6 md:p-16 shadow-2xl border border-gray-50 min-h-100 flex flex-col items-center justify-center">
        
        {message.text && (
          <div className={`w-full mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="w-full max-w-3xl space-y-8">
          
          {/* CSV Format Requirements Box */}
          <div className="bg-[#E1EFFE] border-l-4 border-[#3B82F6] p-5 md:p-6 rounded-r-xl">
            <h4 className="text-[#1E42AF] font-bold text-base mb-2">CSV Format Requirements</h4>
            <p className="text-[#1E42AF] text-sm leading-relaxed">
              Your CSV file must include these columns: <span className="font-bold text-black">student_id, course_name, grade</span>.
              <br />
              <span className="opacity-80">Example: STU123456, Bachelor of Computer Science, A+</span>
              <br />
              <span className="opacity-80">Maximum 500 certificates per upload.</span>
            </p>
          </div>

          {/* Upload Dropzone */}
          <div 
            className="relative group cursor-pointer"
            onClick={handleClick}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDrop={handleDragDrop}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".csv" 
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" 
            />
            <div className="border-2 border-dashed border-[#3B82F6] rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center gap-3 bg-white hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📂</span>
                <span className="text-[#3B82F6] font-bold text-lg md:text-xl underline">
                  {fileName ? `✅ ${fileName}` : 'Click to upload CSV or drag & drop'}
                </span>
              </div>
              <p className="text-gray-400 text-sm font-medium">Maximum 500 certificates per upload</p>
            </div>
          </div>

          {/* Preview Table */}
          {preview.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-gray-800 font-bold">Preview ({preview.length} of {csvData.length} rows)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="px-4 py-2 font-bold text-gray-700">Student ID</th>
                      <th className="px-4 py-2 font-bold text-gray-700">Course Name</th>
                      <th className="px-4 py-2 font-bold text-gray-700">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">{row.student_id}</td>
                        <td className="px-4 py-2 text-gray-700">{row.course_name}</td>
                        <td className="px-4 py-2 text-gray-700">{row.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Uploading...</span>
                <span className="text-gray-600">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {csvData.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg"
            >
              {loading ? `⏳ Uploading ${csvData.length} certificates...` : `📤 Upload ${csvData.length} Certificate${csvData.length !== 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;