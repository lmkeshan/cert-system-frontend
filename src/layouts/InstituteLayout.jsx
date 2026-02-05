import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/InstituteSideBar';
import Footer from '../components/Footer';
import { Menu, X } from 'lucide-react';

const InstituteDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F3E8FF] font-sans">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block w-64 bg-[#9366E4] fixed h-full z-30">
        <Sidebar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden w-full fixed top-0 z-50 bg-[#9366E4] px-4 py-3 flex justify-between items-center shadow-md">
        <div className="text-white font-bold text-xl flex items-center gap-1">
          certi<span className="font-extrabold italic">chain</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#9366E4] pt-16">
          <Sidebar closeMenu={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        <main className="flex-1 p-4 md:p-8 mt-14 md:mt-0">
          {/* This component will render Overview.jsx or IssueCertificate.jsx based on URL */}
          <Outlet /> 
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default InstituteDashboard;