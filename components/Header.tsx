
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <i className="fas fa-landmark text-white text-xl"></i>
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800">UAE Tax Advisor Pro</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Compliance & Regulatory Intelligence</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          FTA Database Live
        </div>
        <div className="h-4 w-px bg-slate-200"></div>
        <button className="text-blue-600 hover:text-blue-700">Official Portal</button>
      </div>
    </header>
  );
};

export default Header;
