import React, { useState, useMemo } from 'react';
import { JobApplication, ApplicantStatus, EmailLog } from '../types';
import { STATUS_CONFIG } from '../data/initialData';
import { 
  Users, 
  Sparkles, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Eye, 
  EyeOff, 
  FileSpreadsheet, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Award,
  BarChart2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { exportApplicationsToCsv, printApplicantSummaryPdf } from '../utils/exportUtils';

interface HrDashboardProps {
  applications: JobApplication[];
  onSelectApplication: (app: JobApplication) => void;
  onUpdateStatusQuick: (id: string, newStatus: ApplicantStatus) => Promise<void>;
  maskPii: boolean;
  setMaskPii: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenMonthlyReport: () => void;
}

export const HrDashboard: React.FC<HrDashboardProps> = ({
  applications,
  onSelectApplication,
  onUpdateStatusQuick,
  maskPii,
  setMaskPii,
  onOpenMonthlyReport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [aiScoreFilter, setAiScoreFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');

  // Departments
  const departments = useMemo(() => {
    return ['ALL', ...Array.from(new Set(applications.map((a) => a.department)))];
  }, [applications]);

  // Filtered & Sorted applicants
  const filteredApplicants = useMemo(() => {
    return applications
      .filter((app) => {
        // Status filter
        if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
        // Dept filter
        if (deptFilter !== 'ALL' && app.department !== deptFilter) return false;
        // AI score filter
        if (aiScoreFilter === 'HIGH' && (!app.aiScreening || app.aiScreening.overallScore < 80)) return false;
        if (aiScoreFilter === 'MEDIUM' && (!app.aiScreening || app.aiScreening.overallScore < 60 || app.aiScreening.overallScore >= 80)) return false;
        if (aiScoreFilter === 'LOW' && (!app.aiScreening || app.aiScreening.overallScore >= 60)) return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = app.applicant.fullName.toLowerCase().includes(q);
          const matchesCode = app.trackingCode.toLowerCase().includes(q);
          const matchesEmail = app.applicant.email.toLowerCase().includes(q);
          const matchesJob = app.jobTitle.toLowerCase().includes(q);
          const matchesSkill = app.applicant.skills.some((s) => s.toLowerCase().includes(q));
          return matchesName || matchesCode || matchesEmail || matchesJob || matchesSkill;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          const scoreA = a.aiScreening?.overallScore || 0;
          const scoreB = b.aiScreening?.overallScore || 0;
          return scoreB - scoreA;
        }
        if (sortBy === 'name') {
          return a.applicant.fullName.localeCompare(b.applicant.fullName);
        }
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });
  }, [applications, statusFilter, deptFilter, aiScoreFilter, searchQuery, sortBy]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = applications.length;
    const highAiMatch = applications.filter((a) => a.aiScreening && a.aiScreening.overallScore >= 80).length;
    const inInterview = applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED' || a.status === 'TECHNICAL_TEST').length;
    const hired = applications.filter((a) => a.status === 'HIRED' || a.status === 'OFFER_EXTENDED').length;
    const pdpaActive = applications.filter((a) => !a.pdpaConsent.isAnonymized).length;

    return { total, highAiMatch, inInterview, hired, pdpaActive };
  }, [applications]);

  // Export handlers
  const handleExportCsv = () => {
    exportApplicationsToCsv(filteredApplicants, maskPii);
  };

  const handleExportPdf = () => {
    printApplicantSummaryPdf(filteredApplicants, 'รายงานสรุปรายชื่อผู้สมัครงาน (TalentRecruit)');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            แดชบอร์ดฝ่ายบุคคล & คัดกรองผู้สมัคร (HR Recruitment Hub)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ระบบบริหารจัดการ จัดอันดับคุณสมบัติด้วย AI และปกป้องข้อมูลส่วนบุคคลตาม PDPA
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMonthlyReport}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <span>ดูรายงานสรุปประจำเดือน</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ส่งออก Excel / CSV</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ / บันทึก PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>ผู้สมัครทั้งหมด</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          <div className="text-[11px] text-slate-500">บันทึกในระบบทั้งหมด</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>AI คุณสมบัติเด่น (&gt;=80%)</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-700">{stats.highAiMatch}</div>
          <div className="text-[11px] text-purple-600 font-medium">แนะนำพิจารณาด่วน</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>ขั้นตอนสัมภาษณ์/ทดสอบ</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-700">{stats.inInterview}</div>
          <div className="text-[11px] text-slate-500">กำลังอยู่ในกระบวนการ</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>รับเข้าทำงานแล้ว</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.hired}</div>
          <div className="text-[11px] text-emerald-600 font-medium">Offer & Hired สำเร็จ</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>ความคุ้มครอง PDPA</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-800">{stats.pdpaActive}</div>
          <div className="text-[11px] text-emerald-700">อายุจัดเก็บไม่เกิน 180 วัน</div>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, รหัส, อีเมล หรือทักษะ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">สถานะทั้งหมด (All Status)</option>
              <option value="SUBMITTED">ส่งใบสมัครแล้ว</option>
              <option value="SCREENING">อยู่ระหว่างคัดกรอง</option>
              <option value="INTERVIEW_SCHEDULED">นัดสัมภาษณ์งาน</option>
              <option value="TECHNICAL_TEST">ทดสอบทักษะ</option>
              <option value="OFFER_EXTENDED">ยื่นข้อเสนอรับเข้าทำงาน</option>
              <option value="HIRED">รับเข้าทำงาน</option>
              <option value="REJECTED">ไม่ผ่านการคัดเลือก</option>
              <option value="WITHDRAWN">สละสิทธิ์ / ลบข้อมูล</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'ALL' ? 'ทุกแผนก (All Departments)' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* AI Match Filter */}
          <div>
            <select
              value={aiScoreFilter}
              onChange={(e) => setAiScoreFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">คะแนน AI ทั้งหมด</option>
              <option value="HIGH">AI Match สูงมาก (&gt;= 80%)</option>
              <option value="MEDIUM">AI Match ปานกลาง (60 - 79%)</option>
              <option value="LOW">AI Match ต่ำ (&lt; 60%)</option>
            </select>
          </div>
        </div>

        {/* Bottom Sorting & Toggle Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">เรียงลำดับตาม:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setSortBy('date')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  sortBy === 'date' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                วันที่ส่งล่าสุด
              </button>
              <button
                onClick={() => setSortBy('score')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  sortBy === 'score' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                คะแนนความเหมาะสม AI
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  sortBy === 'name' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ชื่อผู้สมัคร
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* PII Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={maskPii}
                onChange={(e) => setMaskPii(e.target.checked)}
                className="rounded text-blue-600 w-3.5 h-3.5 cursor-pointer"
              />
              <span>โหมดคุ้มครอง PII (PDPA Display)</span>
            </label>

            <span className="text-slate-400">|</span>

            <span className="text-slate-500">
              แสดง <strong className="text-slate-900">{filteredApplicants.length}</strong> จาก {applications.length} รายการ
            </span>
          </div>
        </div>
      </div>

      {/* Applicants Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">ผู้สมัคร & รหัสติดตาม</th>
                <th className="px-4 py-3.5">ตำแหน่ง & แผนก</th>
                <th className="px-4 py-3.5">ผลวิเคราะห์ AI (Gemini)</th>
                <th className="px-4 py-3.5">ประสบการณ์ & การศึกษา</th>
                <th className="px-4 py-3.5">เอกสาร</th>
                <th className="px-4 py-3.5">สถานะปัจจุบัน</th>
                <th className="px-5 py-3.5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    ไม่พบข้อมูลผู้สมัครที่ตรงตามเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => {
                  const displayName = maskPii
                    ? app.applicant.fullName.slice(0, 3) + '*** (PDPA Masked)'
                    : app.applicant.fullName;
                  const displayEmail = maskPii
                    ? 'user***@***.com'
                    : app.applicant.email;

                  const aiScore = app.aiScreening?.overallScore || 0;
                  const aiBadgeColor =
                    aiScore >= 80
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : aiScore >= 65
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200';

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-blue-50/20 transition-colors group cursor-pointer"
                      onClick={() => onSelectApplication(app)}
                    >
                      {/* Name & Code */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 border border-slate-200">
                            {app.applicant.fullName.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                              {displayName}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-mono text-blue-600 font-semibold">{app.trackingCode}</span>
                              <span>•</span>
                              <span>{displayEmail}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Position & Dept */}
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-800">{app.jobTitle}</div>
                        <div className="text-[11px] text-slate-500">{app.department}</div>
                      </td>

                      {/* AI Screening Score */}
                      <td className="px-4 py-4">
                        {app.aiScreening ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-mono font-extrabold text-sm px-2 py-0.5 rounded-md border ${aiBadgeColor}`}
                              >
                                {app.aiScreening.overallScore}%
                              </span>
                              <span className="text-[11px] font-bold text-slate-700 truncate max-w-[130px]">
                                {app.aiScreening.recommendationLabelTh}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 line-clamp-1 max-w-[170px]">
                              {app.aiScreening.strengths[0] || 'ทักษะตรงตามเกณฑ์'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">รอประเมิน</span>
                        )}
                      </td>

                      {/* Experience & Education */}
                      <td className="px-4 py-4">
                        <div className="text-slate-700 font-medium">
                          {app.applicant.experienceYears} ปี ({app.applicant.currentPosition || 'ผู้สมัครใหม่'})
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {app.applicant.educationLevel} {app.applicant.major ? `• ${app.applicant.major}` : ''}
                        </div>
                      </td>

                      {/* Documents */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                            <FileText className="w-3 h-3 text-blue-600" />
                            {app.documents.length} ไฟล์
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            STATUS_CONFIG[app.status]?.bg || 'bg-slate-100'
                          } ${STATUS_CONFIG[app.status]?.color || 'text-slate-700'} ${
                            STATUS_CONFIG[app.status]?.border || 'border-slate-200'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {STATUS_CONFIG[app.status]?.labelTh || app.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectApplication(app)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>ดูประวัติ & AI</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
