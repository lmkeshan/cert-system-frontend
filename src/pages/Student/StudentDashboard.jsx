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
    } catch (err) {
      console.error('Error fetching dashboard:', err);
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
      console.error('Error fetching career insights:', err);
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
      console.error('Error regenerating insights:', err);
      setError('Failed to regenerate insights');
    } finally {
      setLoadingInsights(false);
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
            <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors">
              <span>🔒</span> Make Private
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors">
              <span>📤</span> Share
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors">
              <span>📥</span> Export
            </button>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-purple-100 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Share Your Portfolio</h3>
          <p className="text-gray-600 text-sm mb-4">
            Share this link to showcase your certificates with employers or peers:
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={`http://localhost:3000/portfolio/${student?.userId}`}
              readOnly
              className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700"
            />
            <button className="bg-(--color-primary-violet) text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
              📋 Copy
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
              certificates.map((cert) => (
                <div key={cert.certificate_id} className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {cert.certificate_title}
                      </h3>
                      <p className="text-sm text-gray-500">{cert.institute_name}</p>
                      <p className="text-xs text-gray-400 mt-1">Course: {cert.course}</p>
                    </div>
                    {cert.logo_url && (
                      <img
                        src={cert.logo_url}
                        alt="Institute"
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                      <span>📘</span> {cert.course}
                    </span>
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                      <span>📅</span> {cert.issued_date}
                    </span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                      <span>⭐</span> Grade: {cert.grade}
                    </span>
                    {cert.blockchain_tx_hash && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                        <span>✅</span> Verified
                      </span>
                    )}
                    {cert.expiry_date && (
                      <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                        <span>📆</span> Expires {cert.expiry_date}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="text-gray-700 text-sm font-medium flex items-center gap-1 hover:text-gray-900">
                      <span>👁️</span> View Details
                    </button>
                    {cert.blockchain_tx_hash && (
                      <button className="text-gray-700 text-sm font-medium flex items-center gap-1 hover:text-gray-900">
                        <span>🔍</span> Verify
                      </button>
                    )}
                  </div>
                </div>
              ))
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
              institutions.map((inst, index) => (
                <div
                  key={index}
                  className="bg-purple-50 rounded-2xl p-8 text-center"
                >
                  {inst.logo_url && (
                    <img
                      src={inst.logo_url}
                      alt={inst.institute_name}
                      className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
                    />
                  )}
                  <div className="text-5xl mb-4">🏛️</div>
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
              ))
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
              <div className="flex items-center gap-3">
                <input type="checkbox" id="makePublic" className="w-4 h-4" defaultChecked />
                <label htmlFor="makePublic" className="text-gray-700">
                  Make portfolio publicly visible
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2 ml-7">
                Your portfolio will be visible to anyone with the link, use this visibility control to share with employers
              </p>
            </div>

            {/* Share Token */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Share Token</h3>
              <p className="text-sm text-gray-600 mb-4">Use share token below to share or generate new portfolio link. Keep it safe.</p>
              <div className="flex gap-3">
                <button className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-200">
                  Generate New Token
                </button>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={student?.full_name}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={student?.email}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="text"
                    defaultValue={`http://localhost:3000/portfolio/${student?.userId}`}
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    <input
                      type="text"
                      defaultValue={student?.gender}
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Birthdate
                    </label>
                    <input
                      type="text"
                      defaultValue={student?.birthdate}
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
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
