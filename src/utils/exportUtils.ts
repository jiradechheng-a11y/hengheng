import { JobApplication } from '../types';
import { STATUS_CONFIG } from '../data/initialData';

/**
 * Exports candidate applications to CSV formatted with UTF-8 BOM for Microsoft Excel
 * ensuring Thai characters render cleanly without mojibake.
 */
export function exportApplicationsToCsv(
  applications: JobApplication[],
  maskPii = false,
  filename = 'รายงานผู้สมัครงาน_PDPA.csv'
) {
  const headers = [
    'รหัสติดตาม (Tracking Code)',
    'ชื่อ-นามสกุล',
    'ตำแหน่งงานที่สมัคร',
    'แผนก',
    'สถานะปัจจุบัน',
    'คะแนน AI (Score %)',
    'ข้อเสนอแนะ AI',
    'อีเมล',
    'เบอร์โทรศัพท์',
    'ปีประสบการณ์',
    'เงินเดือนที่คาดหวัง (บาท)',
    'ระดับการศึกษา',
    'สถาบันการศึกษา',
    'ทักษะ (Skills)',
    'วันที่ส่งใบสมัคร',
    'วันหมดอายุจัดเก็บ PDPA',
    'สถานะความยินยอม PDPA'
  ];

  const rows = applications.map((app) => {
    const statusLabel = STATUS_CONFIG[app.status]?.labelTh || app.status;
    const aiScore = app.aiScreening?.overallScore ? `${app.aiScreening.overallScore}%` : 'ยังไม่ได้วิเคราะห์';
    const aiRec = app.aiScreening?.recommendationLabelTh || '-';
    const consentStatus = app.pdpaConsent?.isAnonymized
      ? 'ข้อมูลถูกปกปิด (PDPA Anonymized)'
      : app.pdpaConsent?.consented
      ? 'ยินยอมแล้ว (Consented)'
      : 'ไม่ได้ระบุ';

    const name = maskPii ? app.applicant.fullName.slice(0, 3) + '*** (Masked)' : app.applicant.fullName;
    const email = maskPii ? 'user***@***.com' : app.applicant.email;
    const phone = maskPii ? '08X-XXX-XXXX' : app.applicant.phone;

    return [
      `"${app.trackingCode}"`,
      `"${name.replace(/"/g, '""')}"`,
      `"${app.jobTitle.replace(/"/g, '""')}"`,
      `"${app.department.replace(/"/g, '""')}"`,
      `"${statusLabel}"`,
      `"${aiScore}"`,
      `"${aiRec.replace(/"/g, '""')}"`,
      `"${email}"`,
      `"${phone}"`,
      `"${app.applicant.experienceYears}"`,
      `"${app.applicant.expectedSalary.toLocaleString()}"`,
      `"${app.applicant.educationLevel}"`,
      `"${(app.applicant.university || '').replace(/"/g, '""')}"`,
      `"${(app.applicant.skills || []).join(', ').replace(/"/g, '""')}"`,
      `"${new Date(app.submittedAt).toLocaleDateString('th-TH')}"`,
      `"${new Date(app.pdpaConsent.retentionExpiresAt).toLocaleDateString('th-TH')}"`,
      `"${consentStatus}"`
    ].join(',');
  });

  // \uFEFF is UTF-8 Byte Order Mark (BOM) needed by Excel for Thai text
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and triggers clean print preview formatted for PDF generation
 */
export function printApplicantSummaryPdf(applications: JobApplication[], title = 'รายงานสรุปภาพรวมการรับสมัครงาน') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const rowsHtml = applications
    .map(
      (app, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
      <td style="padding: 8px 6px;">${idx + 1}</td>
      <td style="padding: 8px 6px; font-weight: bold;">${app.trackingCode}</td>
      <td style="padding: 8px 6px;">${app.applicant.fullName}</td>
      <td style="padding: 8px 6px;">${app.jobTitle}</td>
      <td style="padding: 8px 6px;">${app.department}</td>
      <td style="padding: 8px 6px; font-weight: bold; color: #2563eb;">${app.aiScreening ? app.aiScreening.overallScore + '%' : '-'}</td>
      <td style="padding: 8px 6px;">${STATUS_CONFIG[app.status]?.labelTh || app.status}</td>
      <td style="padding: 8px 6px;">${new Date(app.submittedAt).toLocaleDateString('th-TH')}</td>
    </tr>
  `
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 18px; font-weight: bold; color: #0f172a; margin: 0; }
          .meta { font-size: 11px; color: #64748b; margin-top: 4px; }
          .pdpa-tag { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; text-align: left; margin-top: 12px; }
          th { background: #f8fafc; padding: 8px 6px; font-size: 11px; font-weight: bold; color: #475569; border-bottom: 2px solid #cbd5e1; }
          .footer { margin-top: 24px; font-size: 10px; color: #94a3b8; text-align: right; border-top: 1px solid #e2e8f0; padding-top: 8px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${title}</h1>
            <div class="meta">ออกรายงานเมื่อ: ${new Date().toLocaleString('th-TH')} | จัดทำโดยระบบบริหารการรับสมัครงาน TalentRecruit</div>
          </div>
          <div class="pdpa-tag">PDPA Compliant (Sec. 24)</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รหัสติดตาม</th>
              <th>ชื่อ-นามสกุล</th>
              <th>ตำแหน่งที่สมัคร</th>
              <th>แผนก</th>
              <th>คะแนน AI</th>
              <th>สถานะ</th>
              <th>วันที่สมัคร</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          รายงานนี้ได้รับการคุ้มครองข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) สำหรับใช้ภายในฝ่ายบุคคลเท่านั้น
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

export function triggerPdfPrint() {
  window.print();
}
