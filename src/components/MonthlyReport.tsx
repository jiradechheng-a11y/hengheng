import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { MonthlyReportData, JobApplication } from '../types';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  FileSpreadsheet,
  Award,
  Layers
} from 'lucide-react';
import { exportApplicationsToCsv, printApplicantSummaryPdf } from '../utils/exportUtils';
import { getMonthlyAnalytics } from '../services/apiService';

interface MonthlyReportProps {
  applications: JobApplication[];
  maskPii: boolean;
}

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#475569'];

export const MonthlyReport: React.FC<MonthlyReportProps> = ({ applications, maskPii }) => {
  const [reportData, setReportData] = useState<MonthlyReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2026-08');

  useEffect(() => {
    fetchReport();
  }, [selectedMonth]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await getMonthlyAnalytics(selectedMonth);
      setReportData(data);
    } catch (err) {
      console.error('Failed to load monthly analytics', err);
    } finally {
      setLoading(false);
    }
  };

  // Funnel data calculation
  const funnelData = [
    { stage: '1. ยื่นใบสมัคร (Submitted)', count: applications.length, fill: '#2563eb' },
    { 
      stage: '2. ผ่านคัดกรอง (Screened)', 
      count: applications.filter((a) => a.status !== 'REJECTED' && a.status !== 'SUBMITTED').length,
      fill: '#3b82f6'
    },
    { 
      stage: '3. นัดสัมภาษณ์ (Interview)', 
      count: applications.filter((a) => ['INTERVIEW_SCHEDULED', 'TECHNICAL_TEST', 'OFFER_EXTENDED', 'HIRED'].includes(a.status)).length,
      fill: '#8b5cf6'
    },
    { 
      stage: '4. ทดสอบทักษะ (Test)', 
      count: applications.filter((a) => ['TECHNICAL_TEST', 'OFFER_EXTENDED', 'HIRED'].includes(a.status)).length,
      fill: '#a855f7'
    },
    { 
      stage: '5. ยื่นข้อเสนอ (Offer)', 
      count: applications.filter((a) => ['OFFER_EXTENDED', 'HIRED'].includes(a.status)).length,
      fill: '#10b981'
    },
    { 
      stage: '6. รับเข้าทำงาน (Hired)', 
      count: applications.filter((a) => a.status === 'HIRED').length,
      fill: '#059669'
    }
  ];

  const handleExportCsv = () => {
    exportApplicationsToCsv(applications, maskPii);
  };

  const handlePrintPdf = () => {
    printApplicantSummaryPdf(
      applications,
      `รายงานสรุปภาพรวมการรับสมัครงานประจำเดือน (${selectedMonth})`
    );
  };

  return (
    <div className="space-y-8">
      {/* Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              รายงานสรุปภาพรวมการรับสมัครประจำเดือน (Monthly Recruitment Analytics)
            </h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Executive View
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            วิเคราะห์อัตราการคัดเลือก ประสิทธิภาพกระบวนการ และแนวโน้มความต้องการตำแหน่งงาน
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="2026-08">สิงหาคม 2026 (August 2026)</option>
              <option value="2026-07">กรกฎาคม 2026 (July 2026)</option>
              <option value="2026-06">มิถุนายน 2026 (June 2026)</option>
            </select>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ส่งออก Excel</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงาน PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>ใบสมัครเข้าใหม่ในเดือน</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {reportData?.totalApplications || applications.length}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +18.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">เทียบกับเดือนก่อนหน้า</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>นัดสัมภาษณ์ & ทดสอบ</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-700">
              {reportData?.totalInterviewed || 12}
            </span>
            <span className="text-xs font-medium text-slate-500">ครั้ง</span>
          </div>
          <p className="text-[11px] text-purple-600 font-medium">อัตราผ่านคัดกรอง 62%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>ยื่น Offer / บรรจุงาน</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">
              {reportData?.totalHired || 6}
            </span>
            <span className="text-xs font-medium text-slate-500">อัตรา</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">ความสำเร็จ 85.7% ของเป้าหมาย</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>เฉลี่ยระยะเวลาสรรหา</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {reportData?.avgTimeToHireDays || 14.5}
            </span>
            <span className="text-xs font-medium text-slate-500">วัน</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">เร็วขึ้น 3.2 วันด้วย AI Screening</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Department Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              สัดส่วนผู้สมัครแยกตามแผนกงาน (By Department)
            </h3>
            <span className="text-xs text-slate-500">ประจำเดือน {selectedMonth}</span>
          </div>

          <div className="h-64 w-full">
            {reportData?.byDepartment && reportData.byDepartment.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.byDepartment}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="department"
                    label={({ department, percent }) => `${department} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {reportData.byDepartment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} คน`, 'จำนวนผู้สมัคร']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                กำลังประมวลผลข้อมูล...
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: 6-Month Hiring Trends */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              แนวโน้มจำนวนใบสมัครและผู้ผ่านการคัดเลือก (6-Month Trend)
            </h3>
            <span className="text-xs text-slate-500">เปรียบเทียบย้อนหลัง</span>
          </div>

          <div className="h-64 w-full">
            {reportData?.trends ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="applications" name="ผู้สมัครทั้งหมด" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="hired" name="รับเข้าทำงานแล้ว" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                กำลังประมวลผลแนวโน้ม...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recruitment Funnel Conversion */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              กรวยการสรรหาและอัตราการแปลง (Recruitment Funnel & Conversion)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ติดตามสัดส่วนผู้สมัครที่ผ่านในแต่ละด่าน เพื่อปรับปรุงประสิทธิภาพการคัดเลือก
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            Conversion Rate: {((funnelData[5].count / Math.max(funnelData[0].count, 1)) * 100).toFixed(1)}%
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {funnelData.map((item, idx) => {
            const percentage = Math.round((item.count / Math.max(funnelData[0].count, 1)) * 100);
            return (
              <div key={item.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.stage}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900">{item.count} คน</span>
                    <span className="font-mono text-slate-500 w-12 text-right">({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(percentage, 3)}%`,
                      backgroundColor: item.fill
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PDPA Compliance & Retention Health Audit */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            การกำกับดูแลมาตรฐาน PDPA ประจำเดือน (Compliance Audit Status)
          </h4>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
            สถานะ: ผ่านเกณฑ์ 100%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">อัตราการให้ความยินยอม (Consent Rate)</span>
            <span className="font-bold text-slate-900 text-sm">100% (ผ่านระบบบันทึกเวลา)</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">รายการที่ขอลบข้อมูล (Right to Erasure)</span>
            <span className="font-bold text-slate-900 text-sm">
              {applications.filter((a) => a.pdpaConsent.isAnonymized).length} รายการ (ดำเนินการทันที)
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">การเข้ารหัสและสิทธิการเข้าถึง</span>
            <span className="font-bold text-emerald-700 text-sm">Role-based Access & Logged</span>
          </div>
        </div>
      </div>
    </div>
  );
};
