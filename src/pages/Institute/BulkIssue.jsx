import React from 'react';
import { UploadCloud } from 'lucide-react';

const BulkUpload = () => {
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
      <div className="bg-white rounded-[2rem] p-6 md:p-16 shadow-2xl border border-gray-50 min-h-[400px] flex flex-col items-center justify-center">
        
        <div className="w-full max-w-3xl space-y-8">
          
          {/* CSV Format Requirements Box */}
          <div className="bg-[#E1EFFE] border-l-4 border-[#3B82F6] p-5 md:p-6 rounded-r-xl">
            <h4 className="text-[#1E42AF] font-bold text-base mb-2">CSV Format Requirements</h4>
            <p className="text-[#1E42AF] text-sm leading-relaxed">
              Your CSV file must include these columns: <span className="font-bold text-black">Student_ID, Course_name, Grade</span>.
              <br />
              <span className="opacity-80">Example: STU123456, Bachelor of Computer Science, A+.</span>
              <br />
              <span className="opacity-80">Maximum 500 certificates per upload.</span>
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="relative group cursor-pointer">
            <input type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
            <div className="border-2 border-dashed border-[#3B82F6] rounded-2xl p-10 md:p-14 flex flex-col items-center justify-center gap-3 bg-white hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📂</span>
                <span className="text-[#3B82F6] font-bold text-lg md:text-xl underline">
                  Click to upload CSV or drag & drop
                </span>
              </div>
              <p className="text-gray-400 text-sm font-medium">Maximum 500 certificates per upload</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BulkUpload;