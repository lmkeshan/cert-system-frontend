import React from 'react';

const IssueCertificate = () => {
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
        <form className="space-y-6 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="block text-gray-800 font-bold text-lg">Student ID</label>
            <input type="text" placeholder="STU12345...." className="w-full p-3.5 rounded-xl border-2 border-gray-300 focus:border-[#9366E4] outline-none transition-all placeholder:text-gray-300 font-medium" />
            <p className="text-gray-400 text-sm font-medium">Enter the registered student ID</p>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-800 font-bold text-lg">Course/Program Name</label>
            <input type="text" placeholder="e.g..B.Tech Computer science" className="w-full p-3.5 rounded-xl border-2 border-gray-300 focus:border-[#9366E4] outline-none transition-all placeholder:text-gray-300 font-medium" />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-800 font-bold text-lg">Grade/Score</label>
            <input type="text" placeholder="e.g.. A, 95% , First Class" className="w-full p-3.5 rounded-xl border-2 border-gray-300 focus:border-[#9366E4] outline-none transition-all placeholder:text-gray-300 font-medium" />
          </div>

          <div className="pt-6">
            <button className="w-full bg-[#A78BFA] hover:bg-[#8B5CF6] text-white font-extrabold py-4 rounded-xl transition-all shadow-lg text-lg">
              Issue Certificate
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