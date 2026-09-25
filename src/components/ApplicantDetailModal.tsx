import React, { useState } from 'react';
import { JobApplication, ApplicantStatus, EmailLog } from '../types';
import { STATUS_CONFIG } from '../data/initialData';
import { 
  X, 
  User, 
  Sparkles, 
  Clock, 
  Mail, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  Send, 
  Download, 
  Eye, 
  Plus, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  UserX
} from 'lucide-react';

interface ApplicantDetailModalProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    newStatus: ApplicantStatus,
    note: string,
    interviewSchedule?: any,
    sendEmail?: boolean
  ) => Promise<void>;
  onTriggerAiScreen: (id: string) => Promise<void>;
  onAddNote: (id: string, text: string, rating: number) => Promise<void>;
  onOpenEmailPreview: (email: EmailLog) => void;
  onPdpaAction: (id: string, action: string) => Promise<void>;
  maskPii: boolean;
}

export const ApplicantDetailModal: React.FC<ApplicantDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onUpdateStatus,
  onTriggerAiScreen,
  onAddNote,
  onOpenEmailPreview,
  onPdpaAction,
  maskPii
}) => {
  if (!isOpen || !application) return null;

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'AI_SCREEN' | 'STATUS_CHANGE' | 'NOTES' | 'EMAILS' | 'PDPA'>('AI_SCREEN');

  // Status update state
  const [targetStatus, setTargetStatus] = useState<ApplicantStatus>(application.status);
  const [statusNote, setStatusNote] = useState('');
  const [sendNotificationEmail, setSendNotificationEmail] = useState(true);
  const [interviewDate, setInterviewDate] = useState('2026-09-18');
  const [interviewTime, setInterviewTime] = useState('14:00 - 15:30 น.');
  const [interviewLocation, setInterviewLocation] = useState('Google Meet: meet.google.com/tr-interview');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Note state
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteRating, setNewNoteRating] = useState(5);
  const [isAddingNote, setIsAddingNote] = useState(false);

  // AI Re-screening state
  const [isScreening, setIsScreening] = useState(false);

  // Handle status update submission
  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingStatus(true);
    try {
      const interviewSchedule =
        targetStatus === 'INTERVIEW_SCHEDULED'
          ? {
              date: interviewDate,
              time: interviewTime,
              locationOrLink: interviewLocation,
              interviewers: ['HR Recruiter', 'Hiring Manager'],
              type: 'ONLINE' as const
            }
          : undefined;

      await onUpdateStatus(
        application.id,
        targetStatus,
        statusNote,
        interviewSchedule,
        sendNotificationEmail
      );
      setStatusNote('');
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการปรับปรุงสถานะ');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle note submission
  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setIsAddingNote(true);
    try {
      await onAddNote(application.id, newNoteText, newNoteRating);
      setNewNoteText('');
    } catch (err: any) {
      alert(err.message || 'ไม่สามารถเพิ่มบันทึกได้');
    } finally {
      setIsAddingNote(false);
    }
  };

  // Handle trigger AI
  const handleTriggerAi = async () => {
    setIsScreening(true);
    try {
      await onTriggerAiScreen(application.id);
    } catch (err: any) {
      alert(err.message || 'การคัดกรองด้วย AI ล้มเหลว');
    } finally {
      setIsScreening(false);
    }
  };

  const displayName = maskPii ? 'ผู้สมัคร (ข้อมูลถูกปกปิดตาม PDPA)' : application.applicant.fullName;
  const displayEmail = maskPii ? 'user***@***.com' : application.applicant.email;
  const displayPhone = maskPii ? '08X-XXX-XXXX' : application.applicant.phone;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {application.applicant.fullName.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{displayName}</h3>
                <span className="font-mono text-xs text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-400/30">
                  {application.trackingCode}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                สมัครตำแหน่ง: <strong className="text-white">{application.jobTitle}</strong> ({application.department})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                STATUS_CONFIG[application.status]?.bg || 'bg-slate-800'
              } ${STATUS_CONFIG[application.status]?.color || 'text-white'} ${
                STATUS_CONFIG[application.status]?.border || 'border-slate-700'
              }`}
            >
              {STATUS_CONFIG[application.status]?.labelTh || application.status}
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('AI_SCREEN')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'AI_SCREEN'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>ผลการวิเคราะห์ด้วย AI</span>
            {application.aiScreening && (
              <span className="ml-1 bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-mono font-bold">
                {application.aiScreening.overallScore}%
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'PROFILE'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>ข้อมูลและเอกสาร ({application.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('STATUS_CHANGE')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'STATUS_CHANGE'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>จัดการสถานะ & สัมภาษณ์</span>
          </button>

          <button
            onClick={() => setActiveTab('NOTES')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'NOTES'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>บันทึก HR ({application.hrNotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('EMAILS')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'EMAILS'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>ประวัติอีเมล ({application.emailsSent.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PDPA')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'PDPA'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ความยินยอม PDPA</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* TAB 1: AI SCREENING */}
          {activeTab === 'AI_SCREEN' && (
            <div className="space-y-6">
              {application.aiScreening ? (
                <>
                  {/* Score Hero Banner */}
                  <div className="p-6 rounded-2xl bg-linear-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      {/* Circular Gauge */}
                      <div className="relative w-20 h-20 shrink-0">
                        <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center border-4 border-blue-600 text-blue-700 font-extrabold text-2xl font-mono">
                          {application.aiScreening.overallScore}%
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                            {application.aiScreening.recommendationLabelTh}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            วิเคราะห์โดย Gemini AI
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-slate-900">
                          สรุปภาพรวมความเหมาะสมของผู้สมัคร
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-lg mt-1">
                          {application.aiScreening.qualificationSummaryTh}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleTriggerAi}
                      disabled={isScreening}
                      className="px-4 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {isScreening ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span>กำลังประมวลผล...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>วิเคราะห์ AI ใหม่อีกครั้ง</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Strengths & Gaps Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                      <h5 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5 uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        จุดแข็งที่โดดเด่น (Key Strengths)
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {application.aiScreening.strengths.map((st, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Gaps to probe */}
                    <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                      <h5 className="font-bold text-xs text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        ประเด็นที่ควรตรวจสอบในการสัมภาษณ์ (Areas to Probe)
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {application.aiScreening.gapsOrAreasToProbe.map((gp, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{gp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* AI Suggested Interview Questions */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        คำถามสัมภาษณ์แนะนำโดย AI สำหรับตำแหน่งนี้ (Suggested Questions)
                      </h5>
                      <span className="text-[10px] text-slate-500">สร้างจากประวัติและ Job Spec</span>
                    </div>

                    <div className="space-y-2">
                      {application.aiScreening.suggestedInterviewQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 flex items-start gap-2 shadow-xs"
                        >
                          <span className="font-mono font-bold text-blue-600 w-5 text-right shrink-0">
                            Q{idx + 1}:
                          </span>
                          <span className="leading-relaxed">{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 space-y-3">
                  <Sparkles className="w-10 h-10 text-blue-500 mx-auto" />
                  <p className="text-slate-600 text-sm">ยังไม่ได้ดำเนินการวิเคราะห์ด้วย AI สำหรับใบสมัครนี้</p>
                  <button
                    onClick={handleTriggerAi}
                    disabled={isScreening}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>วิเคราะห์คุณสมบัติด้วย Gemini AI เดี๋ยวนี้</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE & DOCUMENTS */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-6">
              {/* Contact and Overview Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 bg-slate-50 p-4 rounded-xl text-xs border border-slate-200">
                <div>
                  <span className="text-slate-500 block">อีเมลติดต่อ</span>
                  <span className="font-semibold text-slate-900">{displayEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">เบอร์โทรศัพท์</span>
                  <span className="font-semibold text-slate-900">{displayPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">LINE ID</span>
                  <span className="font-semibold text-slate-900">{application.applicant.lineId || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ตำแหน่งปัจจุบัน</span>
                  <span className="font-semibold text-slate-900">{application.applicant.currentPosition || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ปีประสบการณ์</span>
                  <span className="font-semibold text-slate-900">{application.applicant.experienceYears} ปี</span>
                </div>
                <div>
                  <span className="text-slate-500 block">เงินเดือนที่คาดหวัง</span>
                  <span className="font-bold text-emerald-700">{application.applicant.expectedSalary.toLocaleString()} บาท</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ระดับการศึกษา</span>
                  <span className="font-semibold text-slate-900">{application.applicant.educationLevel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">มหาวิทยาลัย / คณะ</span>
                  <span className="font-semibold text-slate-900">
                    {application.applicant.university} {application.applicant.major ? `(${application.applicant.major})` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">เกรดเฉลี่ย (GPA)</span>
                  <span className="font-semibold text-slate-900">{application.applicant.gpa || '-'}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div>
                <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wide mb-2">
                  ทักษะและความสามารถ (Skills)
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {application.applicant.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Portfolio and Cover Note */}
              {application.applicant.portfolioUrl && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block">ลิงก์ผลงาน (Portfolio / Profile)</span>
                    <a
                      href={application.applicant.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-semibold flex items-center gap-1 mt-0.5"
                    >
                      <span>{application.applicant.portfolioUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {application.applicant.coverNote && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="text-slate-500 block font-medium">ข้อความแนะนำตัว (Cover Note):</span>
                  <p className="text-slate-800 leading-relaxed italic">"{application.applicant.coverNote}"</p>
                </div>
              )}

              {/* Uploaded Documents List */}
              <div className="space-y-3 pt-2">
                <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wide flex items-center justify-between">
                  <span>เอกสารแนบประกอบการสมัคร ({application.documents.length} ไฟล์)</span>
                  <span className="text-slate-500 font-normal">ตรวจสอบความถูกต้องตาม PDPA</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {application.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between shadow-xs hover:border-blue-300 transition"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 truncate">{doc.name}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                              {doc.docType}
                            </span>
                            <span>{(doc.size / 1024).toFixed(0)} KB</span>
                          </div>
                        </div>
                      </div>

                      {doc.dataUrl ? (
                        <a
                          href={doc.dataUrl}
                          download={doc.name}
                          className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>ดาวน์โหลด</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400">แนบในระบบ</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STATUS MANAGEMENT & INTERVIEW */}
          {activeTab === 'STATUS_CHANGE' && (
            <div className="space-y-6">
              <form onSubmit={handleStatusSubmit} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                  ปรับปรุงสถานะขั้นตอนการสรรหา (Update Application Status)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      เลือกสถานะใหม่
                    </label>
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value as ApplicantStatus)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="SCREENING">อยู่ระหว่างคัดกรองเบื้องต้น (Screening)</option>
                      <option value="INTERVIEW_SCHEDULED">นัดหมายสัมภาษณ์งาน (Interview Scheduled)</option>
                      <option value="TECHNICAL_TEST">ทดสอบทักษะ / แบบประเมิน (Technical Test)</option>
                      <option value="OFFER_EXTENDED">ยื่นข้อเสนอรับเข้าทำงาน (Offer Extended)</option>
                      <option value="HIRED">รับเข้าทำงานเรียบร้อย (Hired)</option>
                      <option value="REJECTED">ไม่ผ่านการคัดเลือก (Not Selected)</option>
                      <option value="WITHDRAWN">สละสิทธิ์ / ยกเลิกข้อมูล (Withdrawn)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      ข้อความหมายเหตุเพิ่มเติมสำหรับผู้สมัคร
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ขอนัดสัมภาษณ์ออนไลน์ หรือ รายละเอียดเพิ่มเติม"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* If Interview Scheduled: Interview fields */}
                {targetStatus === 'INTERVIEW_SCHEDULED' && (
                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3 text-xs">
                    <h5 className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-purple-700" />
                      ข้อมูลการนัดสัมภาษณ์งาน (Interview Schedule Details)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">วันที่สัมภาษณ์</label>
                        <input
                          type="date"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">เวลา</label>
                        <input
                          type="text"
                          value={interviewTime}
                          onChange={(e) => setInterviewTime(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">ลิงก์ / สถานที่</label>
                        <input
                          type="text"
                          value={interviewLocation}
                          onChange={(e) => setInterviewLocation(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Send Notification Email Checkbox */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <input
                    type="checkbox"
                    id="sendMail"
                    checked={sendNotificationEmail}
                    onChange={(e) => setSendNotificationEmail(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="sendMail" className="text-slate-700 font-medium cursor-pointer">
                    ส่งอีเมลแจ้งเตือนการเปลี่ยนสถานะไปยังผู้สมัครอัตโนมัติ (Automated Email Notification)
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingStatus}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                  >
                    {isUpdatingStatus ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>กำลังบันทึกและส่งอีเมล...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>บันทึกสถานะ & ส่งแจ้งเตือน</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Timeline Audit History */}
              <div className="space-y-3">
                <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  ประวัติการเปลี่ยนแปลงทั้งหมด (Audit Trail)
                </h5>
                <div className="space-y-2">
                  {application.timeline.map((item) => (
                    <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1 shadow-xs">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-900">{item.titleTh}</span>
                        <span className="text-slate-400 text-[11px]">
                          {new Date(item.timestamp).toLocaleString('th-TH')}
                        </span>
                      </div>
                      <p className="text-slate-600">{item.descriptionTh}</p>
                      <div className="text-[10px] text-slate-400">โดย: {item.author}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HR NOTES & RATINGS */}
          {activeTab === 'NOTES' && (
            <div className="space-y-5">
              {/* Add Note Form */}
              <form onSubmit={handleNoteSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wide flex items-center justify-between">
                  <span>เพิ่มความเห็นหรือคะแนนสัมภาษณ์ (Internal Interviewer Feedback)</span>
                  <span className="text-slate-500 font-normal">มองเห็นเฉพาะฝ่ายบุคคล</span>
                </h5>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      ให้คะแนนความเหมาะสม (Rating)
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewNoteRating(star)}
                          className="p-1 text-amber-500 hover:scale-110 transition cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newNoteRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 font-bold text-slate-700">{newNoteRating} / 5 คะแนน</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      บันทึกความคิดเห็น
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="บันทึกความเห็นจากการสัมภาษณ์ ทักษะเฉพาะ หรือเหตุผลการพิจารณา..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isAddingNote}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>บันทึกความเห็น</span>
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-3">
                <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                  บันทึกความคิดเห็นที่มีอยู่ ({application.hrNotes.length})
                </h5>

                {application.hrNotes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">ยังไม่มีบันทึกความเห็นจากเจ้าหน้าที่</p>
                ) : (
                  <div className="space-y-2">
                    {application.hrNotes.map((note) => (
                      <div key={note.id} className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{note.author}</span>
                          <div className="flex items-center gap-1">
                            {note.rating && (
                              <div className="flex items-center gap-0.5 text-amber-500 mr-2">
                                {Array.from({ length: note.rating }).map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                                ))}
                              </div>
                            )}
                            <span className="text-[10px] text-slate-400">
                              {new Date(note.createdAt).toLocaleString('th-TH')}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: EMAILS SENT */}
          {activeTab === 'EMAILS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                  ประวัติการส่งอีเมลแจ้งเตือนผู้สมัคร ({application.emailsSent.length} ฉบับ)
                </h5>
                <span className="text-xs text-slate-500">คลิกที่รายการเพื่อดูตัวอย่างจดหมาย</span>
              </div>

              <div className="space-y-2.5">
                {application.emailsSent.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => onOpenEmailPreview(email)}
                    className="p-4 bg-white border border-slate-200 hover:border-blue-400 rounded-xl transition cursor-pointer text-xs space-y-1.5 group shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {email.subject}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {email.status}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">{email.previewText}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>ผู้รับ: {email.recipientEmail}</span>
                      <span>{new Date(email.sentAt).toLocaleString('th-TH')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PDPA PRIVACY & SECURITY */}
          {activeTab === 'PDPA' && (
            <div className="space-y-5 text-xs text-slate-700">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-sm text-emerald-900">
                    ข้อมูลความยินยอมตามมาตรฐาน PDPA (Consent Audit Record)
                  </h4>
                </div>
                <p className="text-emerald-800 leading-relaxed text-[11px]">
                  ใบสมัครนี้ได้รับการยินยอมอย่างถูกต้องตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 มีบันทึกเวลาและวัตถุประสงค์ที่เจ้าของข้อมูลให้ความยินยอมไว้อย่างสมบูรณ์
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">เวอร์ชันนโยบายที่ยินยอม</span>
                  <span className="font-semibold text-slate-900">{application.pdpaConsent.policyVersion}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">วันที่บันทึกความยินยอม</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(application.pdpaConsent.consentTimestamp).toLocaleString('th-TH')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">กำหนดระยะเวลาจัดเก็บ (180 วัน)</span>
                  <span className="font-bold text-amber-700">
                    ถึงวันที่ {new Date(application.pdpaConsent.retentionExpiresAt).toLocaleDateString('th-TH')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">สถานะการปกปิด/ลบข้อมูล</span>
                  <span className={`font-semibold ${application.pdpaConsent.isAnonymized ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {application.pdpaConsent.isAnonymized ? 'ข้อมูลถูกลบ/ปกปิดตามคำขอ (Anonymized)' : 'จัดเก็บในระบบความปลอดภัยปกติ'}
                  </span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wide mb-1.5">
                  วัตถุประสงค์ที่ผู้สมัครให้ความยินยอม:
                </h5>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {application.pdpaConsent.purposesAccepted.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Anonymize / Right to be forgotten action */}
              {!application.pdpaConsent.isAnonymized && (
                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-rose-900 flex items-center gap-1.5">
                      <UserX className="w-4 h-4 text-rose-600" />
                      ดำเนินการลบหรือปกปิดข้อมูลตามสิทธิ PDPA (Right to be Forgotten)
                    </h5>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      เจ้าหน้าที่ HR สามารถดำเนินการลบข้อมูลส่วนบุคคลตามคำร้องขอของผู้สมัครได้ทันที
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบและทำลายข้อมูลส่วนบุคคลของผู้สมัครรายนี้ตามข้อกำหนด PDPA?')) {
                        onPdpaAction(application.id, 'RIGHT_TO_BE_FORGOTTEN');
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                  >
                    ดำเนินการลบข้อมูล (Purge)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            รหัสติดตาม: <strong className="font-mono text-slate-800">{application.trackingCode}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
