import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('all');

  // Sample certificate data
  const certificates = [
    {
      id: 1,
      title: 'React Master Course',
      institution: 'University A',
      category: 'React',
      issueDate: '1/10/2025',
      grade: 'A',
      verified: true,
      expiryDate: '1/12/2029'
    },
    {
      id: 2,
      title: 'React Master Course',
      institution: 'University A',
      category: 'React',
      issueDate: '1/10/2025',
      grade: 'A',
      verified: true,
      expiryDate: '1/12/2029'
    }
  ];

  const institutions = [
    { name: 'Test University_A', certificateCount: 2 },
    { name: 'Test University_B', certificateCount: 1 }
  ];

  const careerMatches = [
    { title: 'Junior UI/UX Designer', match: 85 },
    { title: 'Graphic Designer', match: 82 },
    { title: 'Digital Graphic Designer', match: 80 },
    { title: 'UI/Visual Asset Designer', match: 78 }
  ];

  const topSkills = [
    'UI/UX Design Principles',
    'Adobe Illustrator (Advanced)',
    'Adobe Photoshop (Advanced)',
    'Vector & after Graphic Production',
    'Prototyping & Wireframing'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="bg-gradient-primary rounded-3xl px-5 py-8 md:px-10 md:py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">My Portfolio</h1>
          <p className="text-white text-base md:text-lg mb-6">Showcase your achievements with verified digital certificates</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors no-underline">
              <span>🏠</span> Home
            </Link>
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
          <p className="text-gray-600 text-sm mb-4">Share this link to showcase your certificates with employers or peers:</p>
          <div className="flex gap-3">
            <input 
              type="text" 
              value="http://localhost:3000/portfolio" 
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
            <div className="text-4xl font-bold text-(--color-primary-violet) mb-1">3</div>
            <div className="text-sm font-semibold text-gray-700">Total Certificates</div>
          </div>

          {/* Blockchain Verified */}
          <div className="bg-purple-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-4xl font-bold text-(--color-primary-violet) mb-1">2</div>
            <div className="text-sm font-semibold text-gray-700">Blockchain Verified</div>
          </div>

          {/* Institutions */}
          <div className="bg-purple-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🏛️</div>
            <div className="text-4xl font-bold text-(--color-primary-violet) mb-1">2</div>
            <div className="text-sm font-semibold text-gray-700">Institutions</div>
          </div>

          {/* Active Certificates */}
          <div className="bg-purple-100 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-4xl font-bold text-(--color-primary-violet) mb-1">2</div>
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
            className={`pb-3 px-1 font-semibold transition-colors ${
              activeTab === 'all' 
                ? 'text-(--color-primary-violet) border-b-2 border-(--color-primary-violet)' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Certificates
          </button>
          <button 
            onClick={() => setActiveTab('institution')}
            className={`pb-3 px-1 font-semibold transition-colors ${
              activeTab === 'institution' 
                ? 'text-(--color-primary-violet) border-b-2 border-(--color-primary-violet)' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            By Institution
          </button>
          <button 
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 px-1 font-semibold transition-colors ${
              activeTab === 'roadmap' 
                ? 'text-(--color-primary-violet) border-b-2 border-(--color-primary-violet)' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Road Map
          </button>
          <button 
            onClick={() => setActiveTab('summary')}
            className={`pb-3 px-1 font-semibold transition-colors ${
              activeTab === 'summary' 
                ? 'text-(--color-primary-violet) border-b-2 border-(--color-primary-violet)' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Summary
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-1 font-semibold transition-colors ${
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
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{cert.title}</h3>
                    <p className="text-sm text-gray-500">{cert.institution}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                    <span>📘</span> {cert.category}
                  </span>
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                    <span>📅</span> {cert.issueDate}
                  </span>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                    <span>⭐</span> {cert.grade}
                  </span>
                  {cert.verified && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                      <span>✅</span> Verified
                    </span>
                  )}
                  <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1">
                    <span>📆</span> Expires {cert.expiryDate}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="text-gray-700 text-sm font-medium flex items-center gap-1 hover:text-gray-900">
                    <span>👁️</span> View Details
                  </button>
                  <button className="text-gray-700 text-sm font-medium flex items-center gap-1 hover:text-gray-900">
                    <span>🔍</span> Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'institution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {institutions.map((inst, index) => (
              <div key={index} className="bg-purple-50 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🏛️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{inst.name}</h3>
                <p className="text-gray-600 mb-4">{inst.certificateCount} Certificates</p>
                <button className="bg-(--color-primary-violet) text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
                  View All
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            {/* AI Career Roadmap Section */}
            <div className="bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-3">Regenerate your personal career roadmap with AI</h3>
              <p className="text-white/90 mb-6">Generate an AI-based career roadmap customized to your performance. Enter prompt or make sure you have certificates uploaded.</p>
              <button className="bg-white text-(--color-primary-violet) rounded-lg px-8 py-3 text-sm font-bold hover:shadow-lg transition-shadow">
                🔄 REGENERATE
              </button>
            </div>

            {/* Career Matches */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎯</span> Career Matches
              </h3>
              <div className="space-y-3">
                {careerMatches.map((career, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{career.title}</span>
                    <span className="font-semibold text-(--color-primary-violet)">{career.match}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Next Steps</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <div>
                      <h4 className="font-bold text-gray-800">Step 1: Portfolio Construction</h4>
                      <p className="text-sm text-gray-600 mt-1">Develop 3-4 comprehensive case studies demonstrating the full life cycle from research to final design. Include a variety of projects to showcase "why design" decisions...</p>
                    </div>
                  </div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600">✗</span>
                    <div>
                      <h4 className="font-bold text-gray-800">Step 2: Master Industry-Standard Prototyping Tools</h4>
                      <p className="text-sm text-gray-600 mt-1">While Adobe proficiency is strong, the UI/UX industry now demands expertise in Figma. Figma has become the de facto tool...</p>
                    </div>
                  </div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600">✗</span>
                    <div>
                      <h4 className="font-bold text-gray-800">Step 3: Applied User Research and Testing</h4>
                      <p className="text-sm text-gray-600 mt-1">Incorporate formal usability testing. This requires recruiting users, developing test scripts...</p>
                    </div>
                  </div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600">✗</span>
                    <div>
                      <h4 className="font-bold text-gray-800">Step 4: Design Systems and Accessibility</h4>
                      <p className="text-sm text-gray-600 mt-1">Familiarize with creating and maintaining a comprehensive design system for larger systems...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Summary Text */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Summary</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Nat Student is a highly motivated and technically proficient professional whose credentials include a strong foundation in both strategic visual-centric design and advanced digital production capabilities. Her core expertise is established through a successful completion of advanced certificates...
              </p>
            </div>

            {/* Top Skills */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Top Skills</h3>
              <div className="space-y-3">
                {topSkills.map((skill, index) => (
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
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-2">Junior UI/UX Designer</h4>
                  <p className="text-sm text-gray-600">Creative digital with life cycle Design principles and proficient. providing the opportunity to work with cutting-edge medical...</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 mb-2">Digital Production Artist</h4>
                  <p className="text-sm text-gray-600">This role offers hands-on our technical execution with mixed preparation skills increased through our of detail-conscious Adobe proficiency...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Portfolio Settings */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Portfolio Settings</h3>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="makePublic" className="w-4 h-4" defaultChecked />
                <label htmlFor="makePublic" className="text-gray-700">Make portfolio publicly visible</label>
              </div>
              <p className="text-sm text-gray-500 mt-2 ml-7">Your portfolio will be visible to anyone with the link, use this visibility control to share with employers</p>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input type="text" defaultValue="Nat_Student" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" defaultValue="example@email.com" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Portfolio URL</label>
                  <input type="text" defaultValue="http://localhost:3000/student" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
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
