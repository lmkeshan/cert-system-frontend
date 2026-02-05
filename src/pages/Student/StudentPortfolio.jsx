import Card from '../../components/Card'
import StudentPortfolioNavbar from '../../components/StudentPortfolioNavbar'

export default function StudentPortfolio() {
  // Sample portfolio data
  const studentData = {
    name: 'Alice Johnson',
    title: 'Professional Portfolio',
    avatar: '👩‍🎓',
    totalCertificates: 3,
    blockchainVerified: 2,
    institutions: 3,
    activeCertificates: 3
  }

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
  ]

  const institutions = [
    { name: 'University_A', certificateCount: 2 },
    { name: 'University_B', certificateCount: 1 },
    { name: 'University_C', certificateCount: 1 }
  ]

  const topSkills = [
    'UI/UX Design Principles',
    'Adobe Illustrator (Advanced)',
    'Adobe Photoshop (Advanced)',
    'Vector & alter Graphic Production'
  ]

  const recommendedJobs = [
    {
      title: 'Junior UI/UX Designer',
      description: 'Directly aligns with the UI/UX Design Masterclass certification, providing the foundational knowledge needed for entry-level roles'
    },
    {
      title: 'Digital Production Artist',
      description: 'This role relies heavily on the technical execution and asset preparation skills developed through our listed advanced Adobe software courses.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <StudentPortfolioNavbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-blue-200 rounded-3xl p-12 text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-lg">
              {studentData.avatar}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{studentData.name}</h1>
          <p className="text-xl text-gray-700">{studentData.title}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-200 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">🖼️</div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{studentData.totalCertificates}</div>
            <div className="text-sm font-semibold text-gray-700">Total Certificates</div>
          </Card>

          <Card className="bg-gray-200 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{studentData.blockchainVerified}</div>
            <div className="text-sm font-semibold text-gray-700">Blockchain Verified</div>
          </Card>

          <Card className="bg-gray-200 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">🏛️</div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{studentData.institutions}</div>
            <div className="text-sm font-semibold text-gray-700">Institutions</div>
          </Card>

          <Card className="bg-gray-200 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{studentData.activeCertificates}</div>
            <div className="text-sm font-semibold text-gray-700">Active Certificates</div>
          </Card>
        </div>

        {/* Courses Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-(--color-primary-violet) mb-6">Courses</h2>
          <div className="space-y-4">
            {certificates.map((cert) => (
              <Card key={cert.id} className="bg-gray-200 rounded-2xl p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{cert.title}</h3>
                  <p className="text-sm text-gray-600">{cert.institution}</p>
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
              </Card>
            ))}
          </div>
        </div>

        {/* Institutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {institutions.map((inst, index) => (
            <Card key={index} className="bg-gradient-primary rounded-2xl p-8 text-center text-white">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold mb-2">{inst.name}</h3>
              <p className="text-white/90">{inst.certificateCount} Certificates</p>
            </Card>
          ))}
        </div>

        {/* Summary and Details Section */}
        <Card className="bg-white border-2 border-gray-300 rounded-3xl p-8 mb-12">
          {/* Summary */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Summary</h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Test Student is a highly motivated and technically proficient 27-year-old female design professional whose credentials indicate a strong foundation in both strategic user-centric design and advanced digital production capabilities. Her core expertise is established through a successful completion of a "UI/UX Design Masterclass," which suggests she is well-versed in the end-to-end design process, including understanding user flows, executing wireframing, and utilizing prototyping methodologies crucial for modern digital product development. Evidently, Test mode demonstrably advanced technical skills in industry-standard software, evidenced by achieving superior A grades in both Adobe Photoshop and Adobe Illustrator advanced courses. Additionally, she demonstrates a strong commitment to mastery in complex image manipulation, visual communication, and the creation of detailed vector and raster graphics. This combination of strategic design concepts and high-level technical execution will make her an immediate asset ready to contribute to design teams focused on visual consistency and effective user experience.
            </p>
          </div>

          {/* Top Skills */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Top Skills</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {topSkills.map((skill, index) => (
                <div key={index} className="bg-blue-100 text-blue-700 rounded-lg px-6 py-3 text-center font-medium">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Recommended Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedJobs.map((job, index) => (
                <Card key={index} className="border-l-4 border-gray-400 bg-gray-100 p-6 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">{job.title}</h4>
                  <p className="text-sm text-gray-700">{job.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
