import React, { useState } from 'react';
import { 
  JobOpening, 
  UploadedDoc 
} from '../types';
import { submitApplication } from '../services/apiService';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  ArrowRight,
  Briefcase,
  ExternalLink
} from 'lucide-react';

interface ApplicationFormModalProps {
  job: JobOpening | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmit: (trackingCode: string) => void;
  onOpenPdpaPolicy: () => void;
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccessSubmit,
  onOpenPdpaPolicy
}) => {
  if (!isOpen || !job) return null;

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lineId, setLineId] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(2);
  const [expectedSalary, setExpectedSalary] = useState<number>(45000);
  const [educationLevel, setEducationLevel] = useState('ปริญญาตรี');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [gpa, setGpa] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['Communication', 'Teamwork']);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');

  // Documents
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [selectedDocType, setSelectedDocType] = useState<UploadedDoc['docType']>('RESUME');

  // PDPA Consents
  const [consentRecruitment, setConsentRecruitment] = useState(true);
  const [consentRetention, setConsentRetention] = useState(true);
  const [consentAiProcessing, setConsentAiProcessing] = useState(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Add skill tag
  const handleAddSkill = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      // 10MB limit check
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg(`ไฟล์ ${file.name} มีขนาดเกิน 10MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const newDoc: UploadedDoc = {
          id: `DOC-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          docType: selectedDocType,
          size: file.size,
          dataUrl: reader.result as string,
          mimeType: file.type || 'application/pdf',
          uploadedAt: new Date().toISOString()
        };
        setDocuments((prev) => [...prev, newDoc]);
      };
      reader.readAsDataURL(file);
    });
    // Reset file input
    e.target.value = '';
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('กรุณากรอกชื่อ-นามสกุล อีเมล และเบอร์โทรศัพท์ให้ครบถ้วน');
      return;
    }

    if (!consentRecruitment || !consentAiProcessing) {
      setErrorMsg('กรุณาให้ความยินยอมตามมาตรฐาน PDPA เพื่อความปลอดภัยและการประมวลผลข้อมูล');
      return;
    }

    if (documents.length === 0) {
      setErrorMsg('กรุณาอัปโหลด Resume หรือ CV อย่างน้อย 1 ไฟล์');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        jobId: job.id,
        applicant: {
          fullName,
          email,
          phone,
          lineId,
          currentPosition,
          experienceYears,
          expectedSalary,
          educationLevel,
          university,
          major,
          gpa,
          skills,
          portfolioUrl,
          coverNote
        },
        documents,
        pdpaConsent: {
          consented: true,
          purposesAccepted: [
            consentRecruitment ? 'ใช้ข้อมูลเพื่อการคัดเลือกและติดต่อสื่อสารการสมัครงาน' : '',
            consentRetention ? 'จัดเก็บประวัติเพื่อพิจารณาตำแหน่งงานอื่นที่เหมาะสมในอนาคต (180 วัน)' : '',
            consentAiProcessing ? 'ยินยอมให้ประมวลผลข้อมูลด้วยระบบ AI ช่วยคัดกรองเบื้องต้น' : ''
          ].filter(Boolean)
        }
      };

      const data = await submitApplication(payload);
      setSubmittedCode(data.trackingCode);
    } catch (err: any) {
      setErrorMsg(err.message || 'ไม่สามารถส่งใบสมัครได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (submittedCode) {
      navigator.clipboard.writeText(submittedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-blue-300 font-medium tracking-wide uppercase">แบบฟอร์มสมัครงานออนไลน์</span>
              <h3 className="font-bold text-base text-white line-clamp-1">{job.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto">
          {submittedCode ? (
            /* Success confirmation screen */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">ส่งใบสมัครสำเร็จเรียบร้อย!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  ระบบได้บันทึกใบสมัครและส่งอีเมลยืนยันไปยัง <strong>{email}</strong> เรียบร้อยแล้ว พร้อมประมวลผลการคัดกรองเบื้องต้นด้วย AI
                </p>
              </div>

              {/* Tracking Code Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 max-w-md mx-auto text-left shadow-xs">
                <p className="text-xs text-blue-700 font-semibold mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  รหัสติดตามสถานะของคุณ (Application Tracking Code)
                </p>
                <div className="flex items-center justify-between bg-white border border-blue-200 rounded-lg px-4 py-3">
                  <span className="font-mono text-xl font-extrabold text-blue-900 tracking-wider">
                    {submittedCode}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  * กรุณาบันทึกรหัสนี้ไว้เพื่อใช้ตรวจสอบสถานะการสมัครแบบเรียลไทม์ได้ตลอด 24 ชั่วโมง
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onSuccessSubmit(submittedCode);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <span>ไปที่หน้าตรวจสอบสถานะเรียลไทม์</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job summary mini-badge */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-600">
                  แผนก: <strong className="text-slate-800">{job.department}</strong> | รูปแบบ:{' '}
                  <strong className="text-slate-800">{job.workType}</strong>
                </span>
                <span className="text-blue-700 font-semibold">
                  ช่วงเงินเดือน: {job.salaryRange}
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Section 1: ข้อมูลส่วนตัวและการติดต่อ */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
                  ข้อมูลผู้สมัคร & การติดต่อ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      ชื่อ - นามสกุล <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น นาย กิตติศักดิ์ พัฒนวรกุล"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      อีเมล (สำหรับรับผลและแจ้งเตือน) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      เบอร์โทรศัพท์ติดต่อ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="08X-XXX-XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      LINE ID (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      placeholder="line_id"
                      value={lineId}
                      onChange={(e) => setLineId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: ประสบการณ์และการศึกษา */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
                  ประวัติการทำงาน & การศึกษา
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      ตำแหน่งปัจจุบัน หรือ ล่าสุด
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น Software Engineer ที่ บจก. เทคโนโลยี"
                      value={currentPosition}
                      onChange={(e) => setCurrentPosition(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      ปีประสบการณ์ทำงาน
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      step="0.5"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      เงินเดือนที่คาดหวัง (บาท/เดือน)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={expectedSalary}
                      onChange={(e) => setExpectedSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      ระดับการศึกษาสูงสุด
                    </label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="ปริญญาตรี">ปริญญาตรี (Bachelor's)</option>
                      <option value="ปริญญาโท">ปริญญาโท (Master's)</option>
                      <option value="ปริญญาเอก">ปริญญาเอก (Ph.D.)</option>
                      <option value="ปวส./อนุปริญญา">ปวส. / อนุปริญญา</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      เกรดเฉลี่ย (GPA)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น 3.45"
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      มหาวิทยาลัย / สถาบันการศึกษา
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น จุฬาลงกรณ์มหาวิทยาลัย"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      คณะ / สาขาวิชา
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น วิศวกรรมคอมพิวเตอร์"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Skills tags */}
                <div className="mt-3 text-xs">
                  <label className="block text-slate-700 font-semibold mb-1">
                    ทักษะและความสามารถ (Skills Tag) - ระบบ AI จะนำไปวิเคราะห์เปรียบเทียบ
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="พิมพ์ทักษะแล้วกด Enter หรือปุ่มเพิ่ม (เช่น React, SQL, Figma)"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
                    >
                      เพิ่มทักษะ
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-md font-medium text-xs"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => removeSkill(s)}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Portfolio URL & Cover Note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      ลิงก์ Portfolio / LinkedIn / GitHub
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/your-username"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      ข้อความแนะนำตัวสั้นๆ (Cover Note)
                    </label>
                    <input
                      type="text"
                      placeholder="จุดเด่นหรือความมุ่งมั่นในการร่วมงานกับทีม..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: อัปโหลดเอกสาร */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 pb-1 border-b border-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
                    อัปโหลดเอกสารประกอบการสมัคร <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-xs text-slate-500 font-normal">รองรับ PDF, DOCX, PNG สูงสุด 10MB</span>
                </h4>

                {/* Doc type selector & Dropzone */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-600 font-medium">ประเภทไฟล์ที่กำลังอัปโหลด:</span>
                    <div className="flex gap-1.5">
                      {(['RESUME', 'TRANSCRIPT', 'PORTFOLIO', 'CERTIFICATE'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedDocType(type)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                            selectedDocType === type
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition">
                    <Upload className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-xs font-semibold text-slate-700">
                      คลิกเพื่อเลือกไฟล์ หรือ ลากไฟล์มาวางที่นี่
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      กำลังเลือกประเภท: <strong className="text-blue-700">{selectedDocType}</strong> (Resume, Transcript, Portfolio)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded files list */}
                  {documents.length > 0 && (
                    <div className="space-y-2 mt-2">
                      <p className="text-xs font-semibold text-slate-700">
                        เอกสารที่แนบแล้ว ({documents.length} ไฟล์):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                              <div className="truncate">
                                <p className="font-medium text-slate-800 truncate">{doc.name}</p>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                  <span className="bg-slate-200 px-1.5 py-0.2 rounded font-semibold text-slate-700">{doc.docType}</span>
                                  <span>{(doc.size / 1024).toFixed(0)} KB</span>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(doc.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: PDPA Consent & Security */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    การให้ความยินยอมตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
                  </h4>
                  <button
                    type="button"
                    onClick={onOpenPdpaPolicy}
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
                  >
                    <span>อ่านนโยบายฉบับเต็ม</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentRecruitment}
                      onChange={(e) => setConsentRecruitment(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>
                      <strong className="text-slate-900">ความยินยอมเพื่อการสรรหาและติดต่อสื่อสาร:</strong> ข้าพเจ้ายินยอมให้บริษัทจัดเก็บ รวบรวม และประมวลผลข้อมูลส่วนบุคคลและเอกสารที่แนบมา เพื่อวัตถุประสงค์ในการคัดเลือกและติดต่อสมัครงาน <span className="text-rose-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentAiProcessing}
                      onChange={(e) => setConsentAiProcessing(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>
                      <strong className="text-slate-900">การวิเคราะห์ด้วยระบบ AI อัตโนมัติ:</strong> ยินยอมให้ระบบ AI ช่วยวิเคราะห์เปรียบเทียบทักษะและคุณสมบัติเบื้องต้นเพื่อความสะดวกรวดเร็วในการพิจารณา <span className="text-rose-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentRetention}
                      onChange={(e) => setConsentRetention(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>
                      <strong className="text-slate-900">การเก็บรักษาประวัติ 180 วัน:</strong> ยินยอมให้บริษัทจัดเก็บข้อมูลไว้เป็นเวลา 180 วัน เพื่อติดต่อกรณีมีตำแหน่งงานอื่นที่เหมาะสมในอนาคต (ท่านสามารถขอให้ลบข้อมูลได้ตลอดเวลา)
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>กำลังประมวลผลและคัดกรอง AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>ยืนยันการส่งใบสมัคร & ประเมิน AI</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
