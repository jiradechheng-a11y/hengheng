import React, { useState, useEffect } from 'react';
import { 
  JobOpening, 
  JobApplication, 
  ApplicantStatus, 
  EmailLog 
} from './types';
import { 
  getJobs, 
  getApplications, 
  updateApplicationStatus, 
  runAiScreening, 
  addApplicationNote, 
  performPdpaAction, 
  subscribeConnectionMode, 
  resetLocalData 
} from './services/apiService';
import { Navbar } from './components/Navbar';
import { JobsPortal } from './components/JobsPortal';
import { StatusTracker } from './components/StatusTracker';
import { HrDashboard } from './components/HrDashboard';
import { MonthlyReport } from './components/MonthlyReport';
import { ApplicationFormModal } from './components/ApplicationFormModal';
import { ApplicantDetailModal } from './components/ApplicantDetailModal';
import { EmailPreviewModal } from './components/EmailPreviewModal';
import { PdpaPolicyModal } from './components/PdpaPolicyModal';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Lock,
  Heart,
  Info
} from 'lucide-react';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'JOBS' | 'TRACK' | 'HR_DASHBOARD' | 'MONTHLY_REPORT'>('JOBS');
  
  // Data state
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionMode, setConnectionMode] = useState<'server' | 'standalone'>('server');

  // PDPA Privacy Masking
  const [maskPii, setMaskPii] = useState(false);
  const [isPdpaPolicyOpen, setIsPdpaPolicyOpen] = useState(false);

  // Modal states
  const [selectedJobToApply, setSelectedJobToApply] = useState<JobOpening | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [selectedApplicant, setSelectedApplicant] = useState<JobApplication | null>(null);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);

  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Auto-fill tracking code when applicant applies
  const [trackingCodeInput, setTrackingCodeInput] = useState<string>('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Connection mode subscription & Initial load
  useEffect(() => {
    const unsub = subscribeConnectionMode((mode) => setConnectionMode(mode));
    fetchInitialData();
    return unsub;
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [jobsData, appsData] = await Promise.all([
        getJobs(),
        getApplications()
      ]);

      setJobs(jobsData);
      setApplications(appsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh application list
  const reloadApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
      // If modal applicant is open, update it
      if (selectedApplicant) {
        const updated = data.find((a: JobApplication) => a.id === selectedApplicant.id);
        if (updated) setSelectedApplicant(updated);
      }
    } catch (e) {
      console.error('Error refreshing applications', e);
    }
  };

  // Trigger Apply modal
  const handleSelectJobToApply = (job: JobOpening) => {
    setSelectedJobToApply(job);
    setIsApplyModalOpen(true);
  };

  // On successful job application submit
  const handleApplicationSuccess = (trackingCode: string) => {
    reloadApplications();
    setTrackingCodeInput(trackingCode);
    showToast(
      'ยื่นใบสมัครสำเร็จเรียบร้อย',
      `รหัสติดตามของคุณคือ ${trackingCode} พร้อมส่งอีเมลยืนยันแล้ว`
    );
  };

  // Update application status
  const handleUpdateStatus = async (
    id: string,
    newStatus: ApplicantStatus,
    note: string,
    interviewSchedule?: any,
    sendEmail: boolean = true
  ) => {
    try {
      const updatedApp = await updateApplicationStatus(id, newStatus, note, interviewSchedule, sendEmail);
      setSelectedApplicant(updatedApp);
      setApplications((prev) => prev.map((a) => (a.id === id ? updatedApp : a)));

      showToast(
        'อัปเดตสถานะสำเร็จ',
        sendEmail ? 'บันทึกสถานะใหม่และส่งอีเมลแจ้งเตือนถึงผู้สมัครเรียบร้อยแล้ว' : 'บันทึกสถานะใหม่เรียบร้อยแล้ว'
      );
    } catch (e: any) {
      showToast('เกิดข้อผิดพลาด', e.message || 'ไม่สามารถอัปเดตสถานะได้', 'info');
    }
  };

  // Quick update status from table
  const handleUpdateStatusQuick = async (id: string, newStatus: ApplicantStatus) => {
    await handleUpdateStatus(id, newStatus, 'ปรับปรุงสถานะด่วนจากแดชบอร์ด', undefined, true);
  };

  // Trigger AI screening
  const handleTriggerAiScreen = async (id: string) => {
    try {
      const aiResult = await runAiScreening(id);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, aiScreening: aiResult } : a))
      );
      if (selectedApplicant && selectedApplicant.id === id) {
        setSelectedApplicant((prev) => (prev ? { ...prev, aiScreening: aiResult } : null));
      }

      showToast(
        'วิเคราะห์ด้วย AI สำเร็จ',
        `คะแนนความเหมาะสม: ${aiResult.overallScore}% (${aiResult.recommendationLabelTh})`
      );
    } catch (e: any) {
      showToast('เกิดข้อผิดพลาด', e.message || 'ไม่สามารถวิเคราะห์ด้วย AI ได้', 'info');
    }
  };

  // Add HR Note
  const handleAddNote = async (id: string, text: string, rating: number) => {
    try {
      const updatedApp = await addApplicationNote(id, 'เจ้าหน้าที่สรรหา (HR Recruiter)', text);
      setSelectedApplicant(updatedApp);
      setApplications((prev) => prev.map((a) => (a.id === id ? updatedApp : a)));

      showToast('บันทึกความเห็นเรียบร้อย', 'เพิ่มความเห็นและคะแนนสัมภาษณ์แล้ว');
    } catch (e: any) {
      showToast('เกิดข้อผิดพลาด', e.message || 'ไม่สามารถบันทึกความเห็นได้', 'info');
    }
  };

  // PDPA Action (Right to be forgotten)
  const handlePdpaAction = async (id: string, action: string) => {
    try {
      const data = await performPdpaAction(
        id,
        action as any,
        'ผู้สมัครหรือเจ้าหน้าที่ร้องขอใช้สิทธิลบข้อมูลตาม PDPA'
      );
      setSelectedApplicant(data.application);
      setApplications((prev) => prev.map((a) => (a.id === id ? data.application : a)));

      showToast(
        'ดำเนินการตามสิทธิ PDPA สำเร็จ',
        'ลบและทำลายข้อมูลส่วนบุคคลเรียบร้อยตามมาตรฐานความปลอดภัย',
        'info'
      );
    } catch (e: any) {
      showToast('เกิดข้อผิดพลาด', e.message || 'ไม่สามารถดำเนินการตามสิทธิ PDPA ได้', 'info');
    }
  };

  // Open email preview modal
  const handleOpenEmailPreview = (email: EmailLog) => {
    setSelectedEmail(email);
    setIsEmailModalOpen(true);
  };

  // Pending count for navbar badge
  const pendingCount = applications.filter((a) => a.status === 'SUBMITTED' || a.status === 'SCREENING').length;

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-slide-up max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <h5 className="font-bold text-slate-900 text-sm">{toastMessage.title}</h5>
            <p className="text-slate-600 mt-0.5 leading-relaxed">{toastMessage.desc}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Header / Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        maskPii={maskPii}
        setMaskPii={setMaskPii}
        onOpenPdpaPolicy={() => setIsPdpaPolicyOpen(true)}
        pendingCount={pendingCount}
        connectionMode={connectionMode}
        onResetLocalData={() => {
          if (confirm('คุณต้องการรีเซ็ตข้อมูลทดสอบกลับเป็นค่าเริ่มต้นหรือไม่? ข้อมูลใบสมัครใหม่ที่เคยบันทึกไว้ในเบราว์เซอร์จะถูกรีเซ็ต')) {
            resetLocalData();
            fetchInitialData();
            showToast('รีเซ็ตข้อมูลสำเร็จ', 'คืนค่าข้อมูลผู้สมัครและตำแหน่งงานเริ่มต้นเรียบร้อยแล้ว');
          }
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Standalone Mode Banner */}
        {connectionMode === 'standalone' && !isLoading && !error && (
          <div className="mb-6 p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-center justify-between text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
              <span>
                <strong>โหมด Standalone (Vercel / Static Ready):</strong> ระบบทำงานแบบ Client-Side Persistence อัตโนมัติ โดยบันทึกข้อมูลใบสมัคร การคัดกรอง AI และเอกสารต่างๆ ในเบราว์เซอร์ของคุณอย่างปลอดภัยตาม PDPA
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm('ต้องการรีเซ็ตข้อมูลผู้สมัครทั้งหมดเป็นค่าเริ่มต้นหรือไม่?')) {
                  resetLocalData();
                  fetchInitialData();
                  showToast('รีเซ็ตข้อมูลสำเร็จ', 'คืนค่าข้อมูลเริ่มต้นเรียบร้อยแล้ว');
                }
              }}
              className="px-2.5 py-1 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-800 rounded-lg font-medium transition cursor-pointer shrink-0 ml-3"
            >
              รีเซ็ตข้อมูลเริ่มต้น
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600">กำลังเชื่อมต่อระบบรับสมัครงานออนไลน์...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-6 bg-white rounded-2xl border border-rose-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{error}</h3>
            <button
              onClick={fetchInitialData}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        ) : (
          <>
            {/* TAB 1: CAREER JOBS PORTAL */}
            {activeTab === 'JOBS' && (
              <JobsPortal
                jobs={jobs}
                onSelectJobToApply={handleSelectJobToApply}
                onOpenTracking={() => setActiveTab('TRACK')}
              />
            )}

            {/* TAB 2: REAL-TIME TRACKING */}
            {activeTab === 'TRACK' && (
              <StatusTracker
                initialCode={trackingCodeInput}
                onOpenEmailPreview={handleOpenEmailPreview}
                maskPii={maskPii}
              />
            )}

            {/* TAB 3: HR DASHBOARD */}
            {activeTab === 'HR_DASHBOARD' && (
              <HrDashboard
                applications={applications}
                onSelectApplication={(app) => {
                  setSelectedApplicant(app);
                  setIsApplicantModalOpen(true);
                }}
                onUpdateStatusQuick={handleUpdateStatusQuick}
                maskPii={maskPii}
                setMaskPii={setMaskPii}
                onOpenMonthlyReport={() => setActiveTab('MONTHLY_REPORT')}
              />
            )}

            {/* TAB 4: MONTHLY REPORT */}
            {activeTab === 'MONTHLY_REPORT' && (
              <MonthlyReport
                applications={applications}
                maskPii={maskPii}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">TalentRecruit Portal</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              PDPA Compliant (พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562)
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setIsPdpaPolicyOpen(true)}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              นโยบายความเป็นส่วนตัว (PDPA Notice)
            </button>
            <span>•</span>
            <span>สิทธิการเข้าถึง Role-based HR</span>
            <span>•</span>
            <span className="text-slate-400">Gemini AI Assistant v3.8</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Job Application Submission Modal */}
      <ApplicationFormModal
        job={selectedJobToApply}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccessSubmit={(code) => {
          handleApplicationSuccess(code);
          setActiveTab('TRACK');
        }}
        onOpenPdpaPolicy={() => setIsPdpaPolicyOpen(true)}
      />

      {/* 2. Applicant Dossier & HR Actions Modal */}
      <ApplicantDetailModal
        application={selectedApplicant}
        isOpen={isApplicantModalOpen}
        onClose={() => setIsApplicantModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onTriggerAiScreen={handleTriggerAiScreen}
        onAddNote={handleAddNote}
        onOpenEmailPreview={handleOpenEmailPreview}
        onPdpaAction={handlePdpaAction}
        maskPii={maskPii}
      />

      {/* 3. Email Preview Modal */}
      <EmailPreviewModal
        email={selectedEmail}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />

      {/* 4. PDPA Privacy Policy Modal */}
      <PdpaPolicyModal
        isOpen={isPdpaPolicyOpen}
        onClose={() => setIsPdpaPolicyOpen(false)}
      />
    </div>
  );
}
