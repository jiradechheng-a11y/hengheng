import React from 'react';
import { 
  Briefcase, 
  Search, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  FileText,
  Bell,
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'JOBS' | 'TRACK' | 'HR_DASHBOARD' | 'MONTHLY_REPORT';
  setActiveTab: (tab: 'JOBS' | 'TRACK' | 'HR_DASHBOARD' | 'MONTHLY_REPORT') => void;
  maskPii: boolean;
  setMaskPii: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenPdpaPolicy: () => void;
  pendingCount: number;
  connectionMode?: 'server' | 'standalone';
  onResetLocalData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  maskPii,
  setMaskPii,
  onOpenPdpaPolicy,
  pendingCount,
  connectionMode = 'server',
  onResetLocalData
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('JOBS')}
              className="flex items-center gap-3 text-left group transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">TalentRecruit</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    PDPA Certified
                  </span>
                </div>
                <p className="text-xs text-slate-500">ระบบสมัครงานออนไลน์ & คัดกรองด้วย AI</p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('JOBS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === 'JOBS'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              ตำแหน่งงานที่เปิดรับ
            </button>

            <button
              onClick={() => setActiveTab('TRACK')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === 'TRACK'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Search className="w-4 h-4" />
              ตรวจสอบสถานะ
            </button>

            <button
              onClick={() => setActiveTab('HR_DASHBOARD')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition cursor-pointer relative ${
                activeTab === 'HR_DASHBOARD'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-4 h-4" />
              แดชบอร์ดฝ่ายบุคคล (HR)
              {pendingCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('MONTHLY_REPORT')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeTab === 'MONTHLY_REPORT'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              รายงานประจำเดือน
            </button>
          </nav>

          {/* Right Action Tools: Connection Status, PDPA Privacy & Policy */}
          <div className="flex items-center gap-2">
            {/* Connection mode indicator */}
            {connectionMode === 'standalone' ? (
              <div 
                title="ทำงานในโหมด Standalone / ข้อมูลบันทึกใน LocalStorage เบราว์เซอร์อัตโนมัติ (รองรับ Vercel Static และ Offline)"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-800 rounded-lg border border-amber-200"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Standalone (Vercel Ready)</span>
              </div>
            ) : (
              <div 
                title="เชื่อมต่อกับ Express Backend Server เรียบร้อยแล้ว"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>API Server Active</span>
              </div>
            )}

            {/* Reset data button in standalone mode */}
            {connectionMode === 'standalone' && onResetLocalData && (
              <button
                onClick={onResetLocalData}
                title="รีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้น"
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>รีเซ็ตข้อมูลทดสอบ</span>
              </button>
            )}

            {/* PII Masking toggle for PDPA data protection */}
            <button
              onClick={() => setMaskPii((prev) => !prev)}
              title={maskPii ? 'กำลังเปิดโหมดปกปิดข้อมูลส่วนบุคคลตาม PDPA' : 'กำลังแสดงข้อมูลจริง'}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition cursor-pointer ${
                maskPii
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {maskPii ? <EyeOff className="w-3.5 h-3.5 text-indigo-600" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">{maskPii ? 'โหมดปกปิด PII (PDPA)' : 'แสดงข้อมูลปกติ'}</span>
            </button>

            {/* PDPA Policy Button */}
            <button
              onClick={onOpenPdpaPolicy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>นโยบาย PDPA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white px-2 py-1.5 text-xs">
        <button
          onClick={() => setActiveTab('JOBS')}
          className={`flex flex-col items-center py-1 px-2 rounded-md ${
            activeTab === 'JOBS' ? 'text-blue-600 font-bold' : 'text-slate-600'
          }`}
        >
          <Briefcase className="w-4 h-4 mb-0.5" />
          ตำแหน่งงาน
        </button>
        <button
          onClick={() => setActiveTab('TRACK')}
          className={`flex flex-col items-center py-1 px-2 rounded-md ${
            activeTab === 'TRACK' ? 'text-blue-600 font-bold' : 'text-slate-600'
          }`}
        >
          <Search className="w-4 h-4 mb-0.5" />
          เช็คสถานะ
        </button>
        <button
          onClick={() => setActiveTab('HR_DASHBOARD')}
          className={`flex flex-col items-center py-1 px-2 rounded-md relative ${
            activeTab === 'HR_DASHBOARD' ? 'text-blue-600 font-bold' : 'text-slate-600'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          แดชบอร์ด HR
          {pendingCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('MONTHLY_REPORT')}
          className={`flex flex-col items-center py-1 px-2 rounded-md ${
            activeTab === 'MONTHLY_REPORT' ? 'text-blue-600 font-bold' : 'text-slate-600'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          รายงาน
        </button>
      </div>
    </header>
  );
};
