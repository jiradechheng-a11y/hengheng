import React from 'react';
import { EmailLog } from '../types';
import { Mail, X, CheckCircle, Copy, Printer, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface EmailPreviewModalProps {
  email: EmailLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ email, isOpen, onClose }) => {
  if (!isOpen || !email) return null;

  const copyEmailBody = () => {
    navigator.clipboard.writeText(email.content);
    alert('คัดลอกเนื้อหาอีเมลเรียบร้อย');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Email Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-blue-300 font-medium tracking-wide">
                ระบบจำลองการส่งอีเมลแจ้งเตือนผู้สมัคร (Automated Notification)
              </span>
              <h3 className="font-bold text-sm text-white truncate max-w-md">{email.subject}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Metadata Envelope */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              จาก: <strong className="text-slate-800">HR Talent Acquisition &lt;careers@talentrecruit.co.th&gt;</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
              <CheckCircle className="w-3 h-3" />
              {email.status} (จัดส่งสำเร็จ)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              ถึง: <strong className="text-slate-800">{email.recipientName} &lt;{email.recipientEmail}&gt;</strong>
            </span>
            <span className="text-slate-400 text-[11px]">
              {new Date(email.sentAt).toLocaleString('th-TH')}
            </span>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-800">
          <div className="border border-slate-200 rounded-xl p-6 bg-white space-y-4 shadow-xs">
            {/* Brand in Email */}
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  TR
                </div>
                <span className="font-bold text-slate-900 text-sm">TalentRecruit Organization</span>
              </div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                PDPA Verified Secure Mail
              </span>
            </div>

            {/* Content text */}
            <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700 font-sans">
              {email.content}
            </div>

            {/* Footer in Email */}
            <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 space-y-1">
              <p>
                อีเมลฉบับนี้เป็นการแจ้งเตือนอัตโนมัติจากระบบรับสมัครงานออนไลน์ TalentRecruit Portal
              </p>
              <p>
                ข้อมูลของท่านได้รับการจัดเก็บอย่างปลอดภัยตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={copyEmailBody}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg transition font-medium cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>คัดลอกข้อความ</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
