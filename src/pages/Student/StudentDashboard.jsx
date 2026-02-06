import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { studentAPI } from '../../services/api';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [careerInsights, setCareerInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [isPortfolioPublic, setIsPortfolioPublic] = useState(true); // Default to public, updated from backend
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [visibilityMessage, setVisibilityMessage] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await studentAPI.getDashboard();
      setDashboardData(response.data);
      // Set portfolio visibility from student data
      const visibility = response.data.student?.isPortfolioPublic ?? response.data.student?.is_portfolio_public;
      if (visibility !== undefined && visibility !== null) {
        setIsPortfolioPublic(Boolean(visibility));
      }

      // Initialize GitHub link from student data
      if (response.data.student?.github_url) {
        setGithubLink(response.data.student.github_url);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
      setError(err.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchCareerInsights = async () => {
    try {
      setLoadingInsights(true);
      const response = await studentAPI.getCareerInsights(false);
      setCareerInsights(response.data.insights);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load career insights');
    } finally {
      setLoadingInsights(false);
    }
  };

  const regenerateInsights = async () => {
    try {
      setLoadingInsights(true);
      const response = await studentAPI.getCareerInsights(true);
      setCareerInsights(response.data.insights);
    } catch (err) {
      setError('Failed to regenerate insights');
    } finally {
      setLoadingInsights(false);
    }
  };

  const handlePortfolioVisibilityChange = async (newValue) => {
    try {
      setSavingVisibility(true);
      setVisibilityMessage('');
      
      const response = await studentAPI.updatePortfolioVisibility(newValue);
      
      // Update state from backend response
      const updatedVisibility = response.data?.isPublic ?? response.data?.is_public ?? newValue;
      setIsPortfolioPublic(updatedVisibility);
      
      setVisibilityMessage(`Portfolio is now ${updatedVisibility ? 'publicly visible' : 'private'}`);
      setTimeout(() => setVisibilityMessage(''), 3000);
    } catch (err) {
      setVisibilityMessage('Failed to update portfolio visibility');
      setTimeout(() => setVisibilityMessage(''), 3000);
      // Refetch to get correct state
      fetchDashboardData();
    } finally {
      setSavingVisibility(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditedProfile({
      full_name: student?.full_name || '',
      email: student?.email || '',
      gender: student?.gender || '',
      birthdate: student?.birthdate || ''
    });
    setProfileMessage('');
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedProfile({});
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
    setCvFile(null);
    setProfileMessage('');
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      setProfileMessage('');

      const formData = new FormData();
      formData.append('full_name', editedProfile.full_name);
      formData.append('email', editedProfile.email);
      formData.append('gender', editedProfile.gender);
      formData.append('birthdate', editedProfile.birthdate);
      formData.append('github_url', githubLink);
      
      if (profilePhoto) {
        formData.append('profile_photo', profilePhoto);
      }
      if (cvFile) {
        formData.append('cv', cvFile);
      }

      await studentAPI.updateProfile(formData);
      
      setProfileMessage('Profile updated successfully!');
      setIsEditingProfile(false);
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
      setCvFile(null);
      setTimeout(() => setProfileMessage(''), 3000);
      
      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setProfileMessage('Failed to update profile. Please try again.');
      setTimeout(() => setProfileMessage(''), 4000);
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <p className="font-semibold mb-2">Error Loading Dashboard</p>
          <p>{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { student, certificates = [], statistics = {}, institutions = [] } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="bg-gradient-primary rounded-3xl px-5 py-8 md:px-10 md:py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">My Portfolio</h1>
          <p className="text-white text-base md:text-lg mb-6">
            {student?.full_name}'s verified digital certificates
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => navigate('/studentportfolio')}
              className="bg-white text-purple-600 rounded-lg px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-purple-50 transition-colors shadow-md"
            >
              <span>👁️</span> View My Portfolio
            </button>
            <button 
              onClick={() => {
                const link = `${window.location.origin}/portfolio/${student?.userId}`
                navigator.clipboard.writeText(link)
                alert('Portfolio link copied to clipboard!')
              }}
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors"
            >
              <span>📤</span> Share Portfolio
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors">
              <span>📥</span> Export
            </button>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 mb-8 border-2 border-purple-300">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>🔗</span> Share Your Portfolio
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Anyone with this link can view your certificates and career insights:
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={`${window.location.origin}/portfolio/${student?.userId}`}
              readOnly
              className="flex-1 bg-white border border-purple-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 font-mono"
            />
            <button 
              onClick={() => {
                const link = `${window.location.origin}/portfolio/${student?.userId}`
                navigator.clipboard.writeText(link)
                alert('Portfolio link copied!')
              }}
              className="bg-purple-600 text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              📋 Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Certificates */}
          <div className="bg-purple-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-4xl font-bold text-(--color-primary-violet) mb-1">
              {statistics.totalCertificates || 0}
            </div>
            <div className="text-sm font-semibold text-gray-700">Total Certificates</div>
          </div>

          {/* Blockchain Verified */}
          <div className="bg-purple-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-4xl font-bold text-(--color-primary-violet) mb-1">
              {statistics.blockchainVerifiedCount || 0}
            </div>
            <div className="text-sm font-semibold text-gray-700">Blockchain Verified</div>
          </div>

          {/* Institutions */}
          <div className="bg-purple-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🏛️</div>
            <div className="text-4xl font-bold text-(--color-primary-violet) mb-1">
              {statistics.institutionsCount || 0}
            </div>
            <div className="text-sm font-semibold text-gray-700">Institutions</div>
          </div>

          {/* Active Certificates */}
          <div className="bg-purple-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-4xl font-bold text-(--color-primary-violet) mb-1">
              {statistics.activeCertificatesCount || 0}
            </div>
            <div className="text-sm font-semibold text-gray-700">Active Certificates</div>
          </div>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Tab Navigation */}
        <div className="flex gap-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-1 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'text-(--color-primary-violet) border-b-2 border-(--color-primary-violet)'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Certificates
          </button>
          <button
            onClick={() => setActiveTab('institution')}
            className={`pb-3 px-1 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'institution'
                ? 'text-(--color-primary-violet) border-b-2 border-(--color-primary-violet)'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            By Institution
          </button>
          <button
            onClick={() => {
              setActiveTab('roadmap');
              if (!careerInsights) {
                fetchCareerInsights();
              }
            }}
            className={`pb-3 px-1 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'text-(--color-primary-violet) border-b-2 border-(--color-primary-violet)'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Road Map
          </button>
          <button
            onClick={() => {
              setActiveTab('summary');
              if (!careerInsights) {
                fetchCareerInsights();
              }
            }}
            className={`pb-3 px-1 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'summary'
                ? 'text-(--color-primary-violet) border-b-2 border-(--color-primary-violet)'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-1 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-(--color-primary-violet) border-b-2 border-(--color-primary-violet)'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            {certificates.length === 0 ? (
              <div className="bg-gray-100 rounded-2xl p-12 text-center">
                <p className="text-gray-600 text-lg">No certificates yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Your certificates will appear here once issued by institutions
                </p>
              </div>
            ) : (
              certificates.map((cert) => {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
                const serverUrl = baseUrl.replace('/api', '')
                const logoUrl = cert.logo_url ? `${serverUrl}${cert.logo_url}` : null
                
                return (
                <div key={cert.certificate_id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {cert.certificate_title || cert.course}
                      </h3>
                      <p className="text-sm text-gray-600 font-semibold">{cert.institute_name}</p>
                      <p className="text-xs text-gray-500 mt-1">Course: {cert.course}</p>
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
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                      <span>📘</span> {cert.course}
                    </span>
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                      <span>📅</span> {new Date(cert.issued_date).toLocaleDateString()}
                    </span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                      <span>⭐</span> Grade: {cert.grade}
                    </span>
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

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button className="bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors">
                      <span>📄</span> View Certificate
                    </button>
                    <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
                      <span>📥</span> Download PDF
                    </button>
                    {cert.blockchain_tx_hash && (
                      <a 
                        href={`https://amoy.polygonscan.com/tx/${cert.blockchain_tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                      >
                        <span>✅</span> Verify on Blockchain
                      </a>
                    )}
                  </div>
                </div>
              )})
            )}
          </div>
        )}

        {activeTab === 'institution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {institutions.length === 0 ? (
              <div className="col-span-2 bg-gray-100 rounded-2xl p-12 text-center">
                <p className="text-gray-600">No institutions yet</p>
              </div>
            ) : (
              institutions.map((inst, index) => {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
                const serverUrl = baseUrl.replace('/api', '')
                const logoUrl = inst.logo_url ? `${serverUrl}${inst.logo_url}` : null
                
                return (
                <div
                  key={index}
                  className="bg-purple-50 rounded-2xl p-8 text-center"
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={inst.institute_name}
                      className="w-20 h-20 object-contain rounded-lg mx-auto mb-4 border border-gray-200"
                    />
                  ) : (
                    <div className="text-5xl mb-4">🏛️</div>
                  )}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {inst.institute_name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {inst.certificateCount} Certificate{inst.certificateCount !== 1 ? 's' : ''}
                  </p>
                  <button className="bg-(--color-primary-violet) text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
                    View All
                  </button>
                </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            {loadingInsights ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing your certificates with AI...</p>
              </div>
            ) : careerInsights ? (
              <>
                {/* AI Career Roadmap Section */}
                <div className="bg-gradient-primary rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">Regenerate your personal career roadmap with AI</h3>
                  <p className="text-white/90 mb-6">Generate an AI-based career roadmap customized to your performance. Enter prompt or make sure you have certificates uploaded.</p>
                  <button
                    onClick={regenerateInsights}
                    disabled={loadingInsights}
                    className="bg-white text-purple-600 rounded-lg px-8 py-3 text-sm font-bold hover:shadow-lg transition-shadow disabled:opacity-50"
                  >
                    🔄 REGENERATE
                  </button>
                </div>

                {/* Career Matches */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🎯</span> Career Matches
                  </h3>
                  <div className="space-y-3">
                    {careerInsights.careerMatches?.map((career, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{career.title}</span>
                        <span className="font-semibold text-(--color-primary-violet)">{career.matchPercentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Next Steps</h3>
                  <div className="space-y-4">
                    {careerInsights.nextSteps?.map((step, index) => (
                      <div
                        key={index}
                        className={`border-l-4 ${step.completed ? 'border-green-500' : 'border-orange-500'} pl-4`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={step.completed ? 'text-green-600' : 'text-orange-600'}>
                            {step.completed ? '✓' : '✗'}
                          </span>
                          <div>
                            <h4 className="font-bold text-gray-800">{step.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-100 rounded-2xl p-12 text-center">
                <p className="text-gray-600 mb-4">Get AI-powered career roadmap based on your certificates</p>
                <button
                  onClick={fetchCareerInsights}
                  className="bg-(--color-primary-violet) text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
                >
                  🤖 Generate Career Roadmap
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-6">
            {loadingInsights ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating summary...</p>
              </div>
            ) : careerInsights ? (
              <>
                {/* Summary Text */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Summary</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {careerInsights.summary || 'Your professional summary will appear here based on your certificates and achievements.'}
                  </p>
                </div>

                {/* Top Skills */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Top Skills</h3>
                  <div className="space-y-3">
                    {careerInsights.topSkills?.map((skill, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg px-4 py-3 text-center font-medium text-gray-700">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Jobs */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Recommended Jobs</h3>
                  <div className="space-y-4">
                    {careerInsights.careerMatches?.slice(0, 2).map((career, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-800 mb-2">{career.title}</h4>
                        <p className="text-sm text-gray-600">
                          Based on your {career.matchPercentage}% match with this role, you are well-suited for positions requiring the skills demonstrated in your certificates.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-100 rounded-2xl p-12 text-center">
                <p className="text-gray-600 mb-4">Generate your professional summary and job recommendations</p>
                <button
                  onClick={fetchCareerInsights}
                  className="bg-(--color-primary-violet) text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
                >
                  🤖 Generate Summary
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Portfolio Settings */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Portfolio Settings</h3>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => !savingVisibility && handlePortfolioVisibilityChange(!isPortfolioPublic)}
                  disabled={savingVisibility}
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    isPortfolioPublic ? 'bg-green-500' : 'bg-gray-300'
                  } ${savingVisibility ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      isPortfolioPublic ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <label className="text-gray-700 font-medium">
                  Make portfolio publicly visible
                </label>
                {savingVisibility && (
                  <span className="text-sm text-gray-500">Saving...</span>
                )}
              </div>
              {visibilityMessage && (
                <div className={`text-sm mt-2 ml-7 px-3 py-2 rounded-lg ${
                  visibilityMessage.includes('Failed') 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {visibilityMessage}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2 ml-7">
                {isPortfolioPublic 
                  ? 'Your portfolio is visible to anyone with the link. Perfect for sharing with employers!' 
                  : 'Your portfolio is private and only visible to you.'}
              </p>
            </div>

            {/* Account Information */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Account Information</h3>
                {!isEditingProfile ? (
                  <button
                    onClick={handleEditProfile}
                    className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <span>✏️</span> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={savingProfile}
                      className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {savingProfile ? '⏳ Saving...' : '💾 Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              {profileMessage && (
                <div className={`text-sm mb-4 px-3 py-2 rounded-lg ${
                  profileMessage.includes('Failed') 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {profileMessage}
                </div>
              )}

              <div className="space-y-4">
                {/* Profile Photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {profilePhotoPreview ? (
                        <img 
                          src={profilePhotoPreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : student?.profile_photo_url ? (
                        <img 
                          src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001'}${student.profile_photo_url}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">👤</span>
                      )}
                    </div>
                    {isEditingProfile && (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setProfilePhoto(file);
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProfilePhotoPreview(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="text-sm"
                        />
                        {profilePhoto && (
                          <p className="text-xs text-green-600 mt-1">✓ {profilePhoto.name}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={isEditingProfile ? editedProfile.full_name : student?.full_name || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, full_name: e.target.value})}
                    disabled={!isEditingProfile}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                      isEditingProfile ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={isEditingProfile ? editedProfile.email : student?.email || ''}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    disabled={!isEditingProfile}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                      isEditingProfile ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>

                {/* GitHub Link */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GitHub Profile
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      placeholder="https://github.com/username"
                      disabled={!isEditingProfile}
                      className={`flex-1 border border-gray-300 rounded-lg px-4 py-2 ${
                        isEditingProfile ? 'bg-white' : 'bg-gray-50'
                      }`}
                    />
                    {githubLink && !isEditingProfile && (
                      <a
                        href={githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-900 transition-colors flex items-center gap-2"
                      >
                        <span>🔗</span> Visit
                      </a>
                    )}
                  </div>
                </div>

                {/* CV Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resume/CV
                  </label>
                  <div className="flex items-center gap-3">
                    {student?.cv_url && !isEditingProfile ? (
                      <a
                        href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001'}${student.cv_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <span>📄</span> View CV
                      </a>
                    ) : (
                      !isEditingProfile && (
                        <p className="text-sm text-gray-500">No CV uploaded</p>
                      )
                    )}
                    {isEditingProfile && (
                      <div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setCvFile(e.target.files[0])}
                          className="text-sm"
                        />
                        {cvFile && (
                          <p className="text-xs text-green-600 mt-1">✓ {cvFile.name}</p>
                        )}
                        {student?.cv_url && (
                          <p className="text-xs text-gray-500 mt-1">Current: {student.cv_url.split('/').pop()}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Portfolio URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="text"
                    value={`${window.location.origin}/portfolio/${student?.userId}`}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                  />
                </div>

                {/* Gender and Birthdate */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    {isEditingProfile ? (
                      <select
                        value={editedProfile.gender}
                        onChange={(e) => setEditedProfile({...editedProfile, gender: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={student?.gender || ''}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Birthdate
                    </label>
                    <input
                      type={isEditingProfile ? "date" : "text"}
                      value={isEditingProfile ? editedProfile.birthdate : student?.birthdate || ''}
                      onChange={(e) => setEditedProfile({...editedProfile, birthdate: e.target.value})}
                      disabled={!isEditingProfile}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                        isEditingProfile ? 'bg-white' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
