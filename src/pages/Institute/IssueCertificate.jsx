import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { universityAPI } from "../../services/api";
import { useMetaMaskContext } from "../../context/MetaMaskContext";
import MetaMaskGuard from "../../components/MetaMaskGuard";

const COURSE_HISTORY_KEY = 'issueCertificate.courseHistory';
const GRADE_HISTORY_KEY = 'issueCertificate.gradeHistory';
const STUDENT_HISTORY_KEY = 'issueCertificate.studentHistory';
const LAST_STUDENT_KEY = 'issueCertificate.lastStudent';
const MAX_HISTORY_ITEMS = 6;

const IssueCertificate = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    courseName: '',
    grade: '',
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [lastIssued, setLastIssued] = useState(null);
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [searchingStudents, setSearchingStudents] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchTimeoutRef = useRef(null);
  const previousFormRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  
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

  useEffect(() => {
    const query = formData.studentId.trim();

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length < 3) {
      setStudentSuggestions([]);
      setSearchingStudents(false);
      setSearchError('');
      setHighlightedIndex(-1);
      return;
    }

    setSearchingStudents(true);
    setSearchError('');

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await universityAPI.searchStudents(query, 8);
        setStudentSuggestions(response.data?.students || []);
        setHighlightedIndex(-1);
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to search students';
        setSearchError(errorMsg);
        setStudentSuggestions([]);
        setHighlightedIndex(-1);
      } finally {
        setSearchingStudents(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [formData.studentId]);

  const handleSelectStudent = (student) => {
    setFormData(prev => ({
      ...prev,
      studentId: student.user_id
    }));
    setSelectedStudent(student);
    setStudentSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    updateStudentHistory(student);
  };

  useEffect(() => {
    try {
      const storedCourses = JSON.parse(localStorage.getItem(COURSE_HISTORY_KEY) || '[]');
      const storedGrades = JSON.parse(localStorage.getItem(GRADE_HISTORY_KEY) || '[]');
      const storedStudents = JSON.parse(localStorage.getItem(STUDENT_HISTORY_KEY) || '[]');
      const storedLastStudent = JSON.parse(localStorage.getItem(LAST_STUDENT_KEY) || 'null');
      setRecentCourses(Array.isArray(storedCourses) ? storedCourses : []);
      setRecentGrades(Array.isArray(storedGrades) ? storedGrades : []);
      setRecentStudents(Array.isArray(storedStudents) ? storedStudents : []);
      if (storedLastStudent?.user_id) {
        setSelectedStudent(storedLastStudent);
        const mergedStudents = Array.isArray(storedStudents)
          ? [storedLastStudent, ...storedStudents.filter((item) => item.user_id !== storedLastStudent.user_id)]
          : [storedLastStudent];
        setRecentStudents(mergedStudents.slice(0, MAX_HISTORY_ITEMS));
      }
    } catch (error) {
      setRecentCourses([]);
      setRecentGrades([]);
      setRecentStudents([]);
    }
  }, []);

  const updateHistory = (key, value, setter) => {
    if (!value) return;
    const normalized = value.trim();
    if (!normalized) return;

    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = Array.isArray(existing)
      ? existing.filter((item) => item !== normalized)
      : [];
    const next = [normalized, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(key, JSON.stringify(next));
    setter(next);
  };

  const updateStudentHistory = (student) => {
    if (!student?.user_id) return;
    const existing = JSON.parse(localStorage.getItem(STUDENT_HISTORY_KEY) || '[]');
    const filtered = Array.isArray(existing)
      ? existing.filter((item) => item.user_id !== student.user_id)
      : [];
    const next = [
      {
        user_id: student.user_id,
        full_name: student.full_name,
        email: student.email
      },
      ...filtered
    ].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STUDENT_HISTORY_KEY, JSON.stringify(next));
    setRecentStudents(next);
    localStorage.setItem(LAST_STUDENT_KEY, JSON.stringify(next[0]));
  };

  const clearHistory = (key, setter) => {
    localStorage.removeItem(key);
    setter([]);
  };

  const showToast = (type, text, duration = 3000) => {
    setMessage({ type, text });
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, duration);
  };

  const handleCopy = async (value, label) => {
    if (!value || value === '-') return;
    try {
      await navigator.clipboard.writeText(value);
      showToast('info', `${label} copied to clipboard`, 2000);
    } catch (error) {
      showToast('error', 'Failed to copy. Please copy manually.', 3000);
    }
  };

  const handleStudentInputKeyDown = (event) => {
    if (!showSuggestions || studentSuggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % studentSuggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev <= 0 ? studentSuggestions.length - 1 : prev - 1));
    } else if (event.key === 'Enter') {
      if (highlightedIndex >= 0) {
        event.preventDefault();
        handleSelectStudent(studentSuggestions[highlightedIndex]);
      }
    } else if (event.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLastIssued(null);
    setActiveStep(0);
    
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

    if (!window.ethereum || !metamaskAddress) {
      setMessage({ type: 'error', text: '❌ MetaMask not available. Please reconnect your wallet.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setCurrentStep('Validating details...');
    setActiveStep(1);

    previousFormRef.current = { ...formData };
    setFormData({ studentId: '', courseName: '', grade: '' });
    setStudentSuggestions([]);
    setShowSuggestions(false);

    try {
      setCurrentStep('Preparing signature payload...');
      setActiveStep(2);

      const payloadResponse = await universityAPI.getSignPayload({
        student_id: previousFormRef.current.studentId,
        course_name: previousFormRef.current.courseName,
        grade: previousFormRef.current.grade,
      });

      const messageHash = payloadResponse.data?.message_hash || payloadResponse.data?.messageHash;
      const certificateId =
        payloadResponse.data?.certificate_id ||
        payloadResponse.data?.cert_id ||
        payloadResponse.data?.certId ||
        payloadResponse.data?.certData?.certId ||
        '-';
      const issuedDate =
        payloadResponse.data?.issued_date ||
        payloadResponse.data?.issueDate ||
        payloadResponse.data?.certData?.issueDate ||
        null;

      if (!messageHash || certificateId === '-') {
        throw new Error('Failed to prepare certificate signature payload');
      }

      setCurrentStep('Waiting for MetaMask signature...');
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [messageHash, metamaskAddress]
      });

      setCurrentStep('Submitting signed certificate...');

      const response = await universityAPI.issueSignedCertificate({
        certificate_id: certificateId,
        student_id: previousFormRef.current.studentId,
        course_name: previousFormRef.current.courseName,
        grade: previousFormRef.current.grade,
        issued_date: issuedDate,
        signature,
        signer_address: metamaskAddress,
        message_hash: messageHash
      });

      const txHash = response.data?.certificate?.blockchain_tx_hash || response.data?.blockchain_tx_hash || response.data?.certificate?.blockchain?.transactionHash || '-';

      setCurrentStep('Finalizing...');
      setActiveStep(3);
      setLastIssued({ certificateId, txHash });
      showToast('success', 'Certificate issued successfully!', 3000);
      setCurrentStep('');
      setActiveStep(0);

      updateHistory(COURSE_HISTORY_KEY, previousFormRef.current.courseName, setRecentCourses);
      updateHistory(GRADE_HISTORY_KEY, previousFormRef.current.grade, setRecentGrades);
      updateStudentHistory(selectedStudent);
      
    } catch (err) {
      console.error('Certificate issuance error:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to issue certificate';
      showToast('error', errorMsg, 4000);
      setCurrentStep('');
      setActiveStep(0);
      if (previousFormRef.current) {
        setFormData(previousFormRef.current);
      }
    } finally {
      setLoading(false);
    }
  };
  const steps = [
    { id: 1, label: 'Validate' },
    { id: 2, label: 'Submit' },
    { id: 3, label: 'Finalize' }
  ];
  return (
    <MetaMaskGuard pageTitle="Issue Certificate">
      <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {message.text && (
        <div
          className={`fixed z-50 right-6 top-6 max-w-sm rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${
            message.type === "success" ? "bg-green-600 text-white" :
            message.type === "info" ? "bg-blue-600 text-white" :
            "bg-red-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}
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
          {loading && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4 space-y-3">
              <p className="text-sm text-purple-700 font-medium text-center">
                {currentStep || 'Processing...'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {steps.map((step, index) => {
                  const isDone = activeStep > index + 1;
                  const isActive = activeStep === index + 1;
                  const Icon = isDone ? CheckCircle2 : isActive ? Loader2 : Circle;

                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2">
                      <Icon className={`${isActive ? 'animate-spin text-purple-600' : isDone ? 'text-green-600' : 'text-purple-300'}`} size={20} />
                      <span className={`text-[11px] font-semibold ${isActive ? 'text-purple-700' : isDone ? 'text-green-700' : 'text-purple-400'}`}>
                        {step.label}
                      </span>
                      <div className={`h-1.5 w-full rounded-full ${activeStep > index ? 'bg-purple-500' : 'bg-purple-200'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Student ID - Reduced input height */}
          <div className="space-y-1.5">
            <label className="block text-gray-800 font-bold text-base">
              Student ID
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={handleStudentInputKeyDown}
                className="w-full p-2.5 rounded-lg border-2 border-gray-200 focus:border-[#9366E4] outline-none transition-all placeholder:text-gray-300 font-medium text-sm"
              />
              {showSuggestions && (searchingStudents || studentSuggestions.length > 0 || searchError) && (
                <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                  {searchingStudents && (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Searching students...
                    </div>
                  )}
                  {!searchingStudents && searchError && (
                    <div className="px-4 py-3 text-sm text-red-600">
                      {searchError}
                    </div>
                  )}
                  {!searchingStudents && !searchError && studentSuggestions.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No students found
                    </div>
                  )}
                  {!searchingStudents && !searchError && studentSuggestions.length > 0 && (
                    <ul className="max-h-64 overflow-y-auto py-1">
                      {studentSuggestions.map((student) => (
                        <li key={student.user_id}>
                          <button
                            type="button"
                            onMouseDown={() => handleSelectStudent(student)}
                            className={`w-full text-left px-4 py-2.5 transition-colors ${
                              highlightedIndex >= 0 && studentSuggestions[highlightedIndex]?.user_id === student.user_id
                                ? 'bg-purple-50'
                                : 'hover:bg-purple-50'
                            }`}
                          >
                            <div className="text-sm font-semibold text-gray-800">
                              {student.full_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {student.user_id} · {student.email}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-400 text-[11px] font-medium">
              Type at least 3 characters to search
            </p>
            <p className="text-gray-400 text-[11px] font-medium">
              Use ↑/↓ to navigate, Enter to select, Esc to close
            </p>
            {selectedStudent && (
              <button
                type="button"
                onClick={() => handleSelectStudent(selectedStudent)}
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-50"
              >
                Last selected: {selectedStudent.full_name}
              </button>
            )}
            {recentStudents.length > 0 && (
              <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-600">Recent students</p>
                  <button
                    type="button"
                    onClick={() => clearHistory(STUDENT_HISTORY_KEY, setRecentStudents)}
                    className="text-[11px] font-semibold text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentStudents.map((student) => (
                    <button
                      key={student.user_id}
                      type="button"
                      onClick={() => handleSelectStudent(student)}
                      className="rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                    >
                      {student.full_name} · {student.user_id}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
            {recentCourses.length > 0 && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500">Recent courses</p>
                  <button
                    type="button"
                    onClick={() => clearHistory(COURSE_HISTORY_KEY, setRecentCourses)}
                    className="text-[11px] font-semibold text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                {recentCourses.map((course) => (
                  <button
                    key={course}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, courseName: course }))}
                    className="rounded-full border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                  >
                    {course}
                  </button>
                ))}
                </div>
              </div>
            )}
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
            {recentGrades.length > 0 && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500">Recent grades</p>
                  <button
                    type="button"
                    onClick={() => clearHistory(GRADE_HISTORY_KEY, setRecentGrades)}
                    className="text-[11px] font-semibold text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                {recentGrades.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, grade }))}
                    className="rounded-full border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                  >
                    {grade}
                  </button>
                ))}
                </div>
              </div>
            )}
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
          {lastIssued && (
            <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4 text-sm">
              <p className="font-semibold text-purple-700">Issued certificate details</p>
              <div className="mt-3 space-y-2 text-xs font-semibold text-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Certificate ID:</span>
                  <span className="font-mono text-gray-900">{lastIssued.certificateId}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(lastIssued.certificateId, 'Certificate ID')}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Copy
                  </button>
                </div>
                {lastIssued.txHash && lastIssued.txHash !== '-' && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span>TX Hash:</span>
                    <span className="font-mono text-gray-900">{lastIssued.txHash}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(lastIssued.txHash, 'TX hash')}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      Copy
                    </button>
                  </div>
                )}
                {lastIssued.certificateId && lastIssued.certificateId !== '-' && (
                  <a
                    href={`/verify?certificateId=${encodeURIComponent(lastIssued.certificateId)}`}
                    className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open verify page
                  </a>
                )}
              </div>
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
    </MetaMaskGuard>
  );
};

export default IssueCertificate;
