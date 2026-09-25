import React from 'react';
import { ShieldCheck, X, CheckCircle2, Lock, Clock, UserX, FileText } from 'lucide-react';

interface PdpaPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdpaPolicyModal: React.FC<PdpaPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                นโยบายความเป็นส่วนตัวสำหรับการรับสมัครงาน (PDPA Privacy Notice)
              </h3>
              <p className="text-xs text-slate-500">
                ฉบับปรับปรุง: สิงหาคม 2026 (เวอร์ชัน PDPA-REC-2026-V2.1)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto text-sm text-slate-700 space-y-4">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800 leading-relaxed">
              บริษัทให้ความสำคัญสูงสุดในการคุ้มครองข้อมูลส่วนบุคคลของผู้สมัครงาน ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ข้อมูลทั้งหมดจะได้รับการจัดเก็บในระบบที่มีการควบคุมความปลอดภัยและการเข้ารหัสตามมาตรฐานสากล
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              1. วัตถุประสงค์ในการเก็บรวบรวมและประมวลผลข้อมูล
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 text-xs leading-relaxed">
              <li>เพื่อใช้ในการพิจารณาคัดเลือก ตรวจสอบคุณสมบัติ และติดต่อสื่อสารในกระบวนการรับสมัครงาน</li>
              <li>เพื่อการนัดหมายสัมภาษณ์ การจัดส่งแบบทดสอบ และการยื่นข้อเสนอการจ้างงาน (Job Offer)</li>
              <li>การประมวลผลด้วยระบบอัตโนมัติ (AI Assisted Screening) เพื่อช่วยจัดอันดับความเหมาะสมของทักษะกับตำแหน่งงานอย่างเป็นธรรม</li>
              <li>การเก็บประวัติสำรองเพื่อพิจารณาตำแหน่งงานอื่นที่เปิดรับในอนาคต (กรณีที่ผู้สมัครให้ความยินยอม)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              2. ระยะเวลาในการจัดเก็บข้อมูล (Data Retention Period)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              ข้อมูลประวัติการสมัครและเอกสารแนบทั้งหมด จะถูกจัดเก็บไว้เป็นระยะเวลาไม่เกิน <strong className="text-slate-800">180 วัน (6 เดือน)</strong> นับจากวันที่ส่งใบสมัคร เมื่อครบกำหนดเวลา ระบบจะดำเนินการทำลายหรือปกปิดข้อมูลให้เป็นข้อมูลนิรนาม (Anonymization) โดยอัตโนมัติ
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1.5">
              <UserX className="w-4 h-4 text-purple-600" />
              3. สิทธิของเจ้าของข้อมูลส่วนบุคคล (Your Legal Rights)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-800">สิทธิขอเข้าถึงและรับสำเนา</p>
                <p className="text-slate-500">ตรวจสอบและขอรับข้อมูลประวัติของตนเองได้</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-800">สิทธิขอลบหรือทำลาย (Right to be Forgotten)</p>
                <p className="text-slate-500">ขอยกเลิกและลบประวัติของตนเองได้ทันทีผ่านระบบ</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-800">สิทธิขอแก้ไขข้อมูล</p>
                <p className="text-slate-500">แจ้งแก้ไขข้อมูลที่คลาดเคลื่อนให้ถูกต้อง</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-800">สิทธิขอถอนความยินยอม</p>
                <p className="text-slate-500">ถอนความยินยอมได้ตลอดเวลาโดยไม่มีผลย้อนหลัง</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1.5">
              <FileText className="w-4 h-4 text-slate-600" />
              4. ช่องทางติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)
            </h4>
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <p>อีเมล: <span className="font-medium text-slate-800">dpo@talentrecruit-organization.co.th</span></p>
              <p>โทรศัพท์: 02-000-9988 ต่อ 104 (ฝ่ายกำกับดูแลและคุ้มครองข้อมูลส่วนบุคคล)</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            รับทราบและปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
