import React, { useState } from 'react';
import { JobOpening } from '../types';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Banknote, 
  CheckCircle, 
  Sparkles, 
  Search, 
  ChevronRight,
  Building,
  Flame
} from 'lucide-react';

interface JobsPortalProps {
  jobs: JobOpening[];
  onSelectJobToApply: (job: JobOpening) => void;
  onOpenTracking: () => void;
}

export const JobsPortal: React.FC<JobsPortalProps> = ({
  jobs,
  onSelectJobToApply,
  onOpenTracking
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobOpening | null>(null);

  // Departments list
  const departments = ['ALL', ...Array.from(new Set(jobs.map((j) => j.department)))];

  const filteredJobs = jobs.filter((job) => {
    const matchesDept = selectedDept === 'ALL' || job.department === selectedDept;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      job.title.toLowerCase().includes(query) ||
      job.department.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.qualifications.some((q) => q.toLowerCase().includes(query));
    return matchesDept && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 md:p-12 overflow-hidden shadow-xl">
        <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            ระบบรับสมัครงานออนไลน์ยุคใหม่ พร้อมวิเคราะห์ประวัติด้วย AI
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            ร่วมงานกับเราและขับเคลื่อน <span className="text-blue-400">อนาคตขององค์กร</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
            ค้นหาตำแหน่งงานที่ตอบโจทย์ความสามารถของคุณ ส่งใบสมัครพร้อมเอกสารออนไลน์ได้ใน 3 นาที ตรวจสอบสถานะแบบเรียลไทม์ได้ตลอด 24 ชม. และได้รับการปกป้องข้อมูลตามมาตรฐาน PDPA 100%
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#openings"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <span>ดูตำแหน่งงานที่เปิดรับ ({jobs.length})</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenTracking}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl backdrop-blur-md border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-blue-300" />
              <span>ตรวจสอบสถานะใบสมัครที่มีอยู่</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Department Filters */}
      <div id="openings" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาตำแหน่งงาน, ทักษะ หรือแผนก..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xs"
            />
          </div>

          {/* Result counter */}
          <div className="text-xs text-slate-500 font-medium">
            พบทั้งหมด <strong className="text-slate-800">{filteredJobs.length}</strong> ตำแหน่ง
          </div>
        </div>

        {/* Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedDept === dept
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {dept === 'ALL' ? 'ทุกแผนก (All Departments)' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Header tags */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {job.department}
                    </span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {job.workType}
                    </span>
                    {job.urgent && (
                      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                        <Flame className="w-3 h-3 text-rose-500" />
                        รับด่วน
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              {/* Meta information badges */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{job.salaryRange}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>ประสบการณ์: {job.experienceRequired}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
              </div>

              {/* Key qualifications bullet points */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">
                  คุณสมบัติหลัก:
                </span>
                <ul className="space-y-1">
                  {job.qualifications.slice(0, 2).map((q, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedJobDetail(job)}
                className="text-xs font-semibold text-slate-700 hover:text-blue-600 hover:underline cursor-pointer"
              >
                ดูรายละเอียดตำแหน่ง
              </button>

              <button
                onClick={() => onSelectJobToApply(job)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>สมัครงานตำแหน่งนี้</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Job Details Modal */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {selectedJobDetail.department}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">
                  {selectedJobDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJobDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 overflow-y-auto space-y-5 text-sm text-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-slate-500 block">ช่วงเงินเดือน</span>
                  <span className="font-bold text-emerald-700">{selectedJobDetail.salaryRange}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ประสบการณ์</span>
                  <span className="font-bold text-slate-800">{selectedJobDetail.experienceRequired}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">รูปแบบงาน</span>
                  <span className="font-bold text-slate-800">{selectedJobDetail.workType}</span>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-slate-500 block">สถานที่ปฏิบัติงาน</span>
                  <span className="font-medium text-slate-800">{selectedJobDetail.location}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">รายละเอียดงาน (Job Description)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedJobDetail.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">หน้าที่ความรับผิดชอบ (Responsibilities)</h4>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-600">
                  {selectedJobDetail.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">คุณสมบัติผู้สมัคร (Qualifications)</h4>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-600">
                  {selectedJobDetail.qualifications.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedJobDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
              <button
                onClick={() => {
                  const job = selectedJobDetail;
                  setSelectedJobDetail(null);
                  onSelectJobToApply(job);
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                กรอกใบสมัครตำแหน่งนี้ทันที
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
