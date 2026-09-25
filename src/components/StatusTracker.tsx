import React, { useState } from 'react';
import { JobApplication, EmailLog } from '../types';
import { STATUS_CONFIG } from '../data/initialData';
import { getApplicationByTrackingCode, performPdpaAction } from '../services/apiService';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Video, 
  FileText, 
  Mail, 
  ShieldCheck, 
  AlertCircle, 
  UserX, 
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';

interface StatusTrackerProps {
  initialCode?: string;
  onOpenEmailPreview: (email: EmailLog) => void;
  maskPii: boolean;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  initialCode = '',
  onOpenEmailPreview,
  maskPii
}) => {
  const [searchInput, setSearchInput] = useState(initialCode);
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPdpaPurgeModal, setShowPdpaPurgeModal] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  // Quick sample tracking codes
  const sampleCodes = ['APP-2026-9102', 'APP-2026-7731', 'APP-2026-5541', 'APP-2026-3198'];

  const handleSearch = async (codeToSearch?: string) => {
    const code = (codeToSearch || searchInput).trim();
    if (!code) {
      setErrorMessage('กรุณาระบุรหัสติดตาม (เช่น APP-2026-XXXX) หรืออีเมล');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const data = await getApplicationByTrackingCode(code);
      setApplication(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'ไม่สามารถค้นหาข้อมูลได้');
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  // Perform PDPA Right to be Forgotten
  const handlePdpaPurge = async () => {
    if (!application) return;
    setIsPurging(true);

    try {
      const res = await performPdpaAction(
        application.id,
        'RIGHT_TO_BE_FORGOTTEN',
        'คำร้องขอใช้สิทธิลบข้อมูลส่วนบุคคลโดยผู้สมัครผ่านหน้าตรวจสอบสถานะ'
      );

      setApplication(res.application);
      setShowPdpaPurgeModal(false);
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setIsPurging(false);
    }
  };

  // Stepper definition
  const steps = [
    { key: 'SUBMITTED', title: 'ส่งใบสมัครแล้ว', sub: 'รับเอกสารเข้าระบบ' },
    { key: 'SCREENING', title: 'คัดกรองเบื้องต้น', sub: 'ตรวจสอบคุณสมบัติ' },
    { key: 'INTERVIEW_SCHEDULED', title: 'นัดสัมภาษณ์งาน', sub: 'นัดหมายพูดคุย' },
    { key: 'TECHNICAL_TEST', title: 'ทดสอบทักษะ', sub: 'แบบประเมิน/โจทย์' },
    { key: 'OFFER_EXTENDED', title: 'ยื่นข้อเสนองาน', sub: 'ส่ง Job Offer' },
    { key: 'HIRED', title: 'รับเข้าทำงาน', sub: 'เสร็จสิ้นกระบวนการ' }
  ];

  const getStepIndex = (status: string) => {
    if (status === 'AI_REVIEWED') return 1;
    const idx = steps.findIndex((s) => s.key === status);
    return idx !== -1 ? idx : 0;
  };

  const currentStepIdx = application ? getStepIndex(application.status) : 0;
  const isRejected = application?.status === 'REJECTED';
  const isWithdrawn = application?.status === 'WITHDRAWN';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              ตรวจสอบสถานะใบสมัครงาน (Real-time Status Tracking)
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              อัปเดตสด
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            กรอกรหัสติดตาม (เช่น APP-2026-9102) หรืออีเมลที่ใช้สมัครงาน เพื่อตรวจสอบความคืบหน้าแบบเรียลไทม์
          </p>
        </div>

        {/* Input Form */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ระบุรหัสติดตาม (เช่น APP-2026-9102) หรืออีเมล"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>กำลังค้นหา...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>ตรวจสอบสถานะ</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-slate-500">รหัสตัวอย่างเพื่อทดสอบ:</span>
          {sampleCodes.map((code) => (
            <button
              key={code}
              onClick={() => {
                setSearchInput(code);
                handleSearch(code);
              }}
              className="font-mono px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-md border border-slate-200 transition cursor-pointer"
            >
              {code}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Application Details & Visual Tracker */}
      {application && (
        <div className="space-y-6">
          {/* Main Status Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {application.trackingCode}
                  </span>
                  <span className="text-xs text-slate-500">
                    ยื่นเมื่อ: {new Date(application.submittedAt).toLocaleString('th-TH')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{application.jobTitle}</h3>
                <p className="text-xs text-slate-500">
                  แผนก {application.department} • ผู้สมัคร:{' '}
                  <strong className="text-slate-700">
                    {maskPii ? 'นาย ก*** พ***' : application.applicant.fullName}
                  </strong>
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-left sm:text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    STATUS_CONFIG[application.status]?.bg || 'bg-slate-50'
                  } ${STATUS_CONFIG[application.status]?.color || 'text-slate-700'} ${
                    STATUS_CONFIG[application.status]?.border || 'border-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {STATUS_CONFIG[application.status]?.labelTh || application.status}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  อัปเดตล่าสุด: {new Date(application.statusUpdatedAt).toLocaleString('th-TH')}
                </p>
              </div>
            </div>

            {/* Visual Stepper / Funnel Progress */}
            {!isRejected && !isWithdrawn ? (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  ลำดับขั้นตอนการคัดเลือก (Recruitment Progress)
                </p>

                <div className="relative pt-4 pb-2">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 rounded-full" />
                  <div
                    className="hidden sm:block absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentStepIdx / (steps.length - 1)) * 90}%`
                    }}
                  />

                  {/* Step Icons */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-1 relative z-10">
                    {steps.map((step, idx) => {
                      const isCompleted = idx < currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center p-2 rounded-xl bg-white sm:bg-transparent">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition shadow-xs mb-1.5 ${
                              isCurrent
                                ? 'bg-blue-600 text-white ring-4 ring-blue-100 ring-offset-1 scale-110'
                                : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-xs font-semibold leading-tight ${
                              isCurrent ? 'text-blue-700 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                            }`}
                          >
                            {step.title}
                          </span>
                          <span className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
                            {step.sub}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : isRejected ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm mb-1">ผลการพิจารณา: ขออภัยในความไม่สะดวก</p>
                  <p className="leading-relaxed">
                    จากการพิจารณาคุณสมบัติอย่างละเอียด ทางบริษัทขอขอบพระคุณที่ท่านได้ให้ความสนใจสมัครงานในตำแหน่งนี้ และขอเก็บประวัติของท่านไว้ตามมาตรฐาน PDPA สำหรับตำแหน่งงานอื่นที่เปิดรับในอนาคต
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 text-xs flex items-start gap-3">
                <UserX className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm mb-1">ข้อมูลถูกลบและทำลายตามสิทธิ PDPA แล้ว</p>
                  <p className="leading-relaxed">
                    ข้อมูลส่วนบุคคลและเอกสารประกอบการสมัครได้รับการปกปิด/ทำลายเรียบร้อยแล้วตามคำขอ Right to be Forgotten
                  </p>
                </div>
              </div>
            )}

            {/* Active Interview Banner if Scheduled */}
            {application.interviewSchedule && application.status === 'INTERVIEW_SCHEDULED' && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-700" />
                  <h4 className="font-bold text-xs uppercase tracking-wide">
                    กำหนดการสัมภาษณ์งานของคุณ (Upcoming Interview)
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-purple-100">
                  <div>
                    <span className="text-slate-500 block text-[11px]">วันที่</span>
                    <span className="font-bold text-slate-800">{application.interviewSchedule.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">เวลา</span>
                    <span className="font-bold text-slate-800">{application.interviewSchedule.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">ช่องทาง / สถานที่</span>
                    <span className="font-bold text-purple-700 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      {application.interviewSchedule.locationOrLink}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Two-Column Grid: Timeline & Email Notification History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline Event Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                ประวัติความเคลื่อนไหว (Real-time Audit Log)
              </h4>

              <div className="space-y-4 relative pl-4 border-l-2 border-slate-200 ml-2">
                {application.timeline.map((event) => (
                  <div key={event.id} className="relative group">
                    {/* Timeline dot */}
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{event.titleTh}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(event.timestamp).toLocaleDateString('th-TH', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{event.descriptionTh}</p>
                      {event.note && (
                        <p className="text-[11px] text-blue-700 bg-blue-50/70 p-1.5 rounded-md mt-1">
                          ข้อความ: {event.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Notification History Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  การแจ้งเตือนทางอีเมล ({application.emailsSent.length})
                </h4>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                  ส่งอัตโนมัติ
                </span>
              </div>

              <div className="space-y-2.5">
                {application.emailsSent.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => onOpenEmailPreview(email)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition cursor-pointer space-y-1 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition truncate max-w-[220px]">
                        {email.subject}
                      </span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-medium shrink-0">
                        {email.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{email.previewText}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{new Date(email.sentAt).toLocaleString('th-TH')}</span>
                      <span className="text-blue-600 flex items-center gap-0.5 font-medium group-hover:underline">
                        ดูเนื้อหาจดหมาย <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PDPA Privacy & Data Rights Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>การคุ้มครองข้อมูลส่วนบุคคล (PDPA Protection & Rights)</span>
              </div>
              <p className="text-slate-600 leading-relaxed max-w-xl text-[11px]">
                ใบสมัครของคุณได้รับการจัดเก็บอย่างปลอดภัยตามข้อกำหนด PDPA 
                กำหนดระยะเวลาจัดเก็บถึงวันที่{' '}
                <strong className="text-slate-800">
                  {new Date(application.pdpaConsent.retentionExpiresAt).toLocaleDateString('th-TH')}
                </strong>{' '}
                (180 วัน) และจะทำการทำลายข้อมูลอัตโนมัติ
              </p>
            </div>

            {!application.pdpaConsent.isAnonymized && (
              <button
                onClick={() => setShowPdpaPurgeModal(true)}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>ขอลบ/ทำลายข้อมูล (PDPA Right)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PDPA Purge Confirmation Modal */}
      {showPdpaPurgeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <UserX className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-slate-900 text-base">
                ยืนยันการใช้สิทธิขอลบข้อมูลส่วนบุคคล (Right to be Forgotten)?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                การดำเนินการนี้จะทำการลบ ทำลาย และปกปิดข้อมูลส่วนบุคคล (ชื่อ เบอร์โทร เอกสารแนบ) ออกจากฐานข้อมูลรับสมัครงานทันที และไม่สามารถกู้คืนได้ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowPdpaPurgeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handlePdpaPurge}
                disabled={isPurging}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {isPurging ? 'กำลังทำลายข้อมูล...' : 'ยืนยันลบข้อมูลทันที'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
