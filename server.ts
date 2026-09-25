import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_JOBS, INITIAL_APPLICATIONS } from './src/data/initialData.ts';
import { JobApplication, JobOpening, EmailLog, TimelineEvent, AiScreeningResult } from './src/types.ts';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-memory data stores (with persistent initial seeds)
let jobs: JobOpening[] = [...INITIAL_JOBS];
let applications: JobApplication[] = [...INITIAL_APPLICATIONS];

// Helper to initialize Gemini
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Generate unique tracking code
function generateTrackingCode(): string {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `APP-${year}-${randNum}`;
}

// Fallback AI screener calculation if API key is not configured or fails
function fallbackAiScreening(job: JobOpening, applicant: JobApplication['applicant']): AiScreeningResult {
  const applicantSkills = applicant.skills.map((s) => s.toLowerCase());
  const jobRequirements = job.qualifications.join(' ').toLowerCase();

  let matchedSkillCount = 0;
  applicantSkills.forEach((skill) => {
    if (jobRequirements.includes(skill)) matchedSkillCount++;
  });

  const expYears = applicant.experienceYears || 0;
  let baseScore = 60;

  // Experience weight
  if (expYears >= 5) baseScore += 20;
  else if (expYears >= 3) baseScore += 15;
  else if (expYears >= 1) baseScore += 10;

  // Skill matches
  baseScore += Math.min(matchedSkillCount * 5, 20);

  // Expected salary sanity check
  const finalScore = Math.min(Math.max(baseScore, 50), 96);

  let recommendation: AiScreeningResult['recommendation'] = 'REVIEW_REQUIRED';
  let recommendationLabelTh = 'ต้องพิจารณาเพิ่มเติม (Review Required)';

  if (finalScore >= 90) {
    recommendation = 'FAST_TRACK';
    recommendationLabelTh = 'แนะนำเร่งด่วน (Fast-Track)';
  } else if (finalScore >= 75) {
    recommendation = 'QUALIFIED';
    recommendationLabelTh = 'คุณสมบัติดี เหมาะสม (Qualified)';
  } else if (finalScore < 60) {
    recommendation = 'NOT_MATCHED';
    recommendationLabelTh = 'ไม่ตรงตามเกณฑ์ขั้นต่ำ (Not Matched)';
  }

  return {
    overallScore: finalScore,
    recommendation,
    recommendationLabelTh,
    qualificationSummaryTh: `ผู้สมัครมีประสบการณ์ ${expYears} ปี ทักษะสำคัญ: ${applicant.skills.slice(0, 4).join(', ')} เหมาะสมกับเกณฑ์เบื้องต้นของตำแหน่ง ${job.title}`,
    strengths: [
      `ประสบการณ์การทำงาน ${expYears} ปี ในสายงานที่เกี่ยวข้อง`,
      `มีทักษะสอดคล้องกับตำแหน่ง: ${applicant.skills.slice(0, 3).join(', ')}`,
      `วุฒิการศึกษา ${applicant.educationLevel} ${applicant.university ? `จาก ${applicant.university}` : ''}`,
    ],
    gapsOrAreasToProbe: [
      'ควรประเมินความรู้เชิงลึกในระบบ Enterprise และการทำงานร่วมกับทีม',
      'ตรวจสอบความคาดหวังเรื่องเงินเดือนและการเริ่มงาน',
    ],
    suggestedInterviewQuestions: [
      `ให้อธิบายโปรเจกต์ที่ท้าทายที่สุดที่คุณเคยทำ และวิธีแก้ปัญหาที่นำมาใช้`,
      `ในตำแหน่ง ${job.title} นี้ คุณคิดว่าจะสามารถสร้าง Impact ให้กับทีมได้อย่างไรใน 90 วันแรก?`,
    ],
    screenedAt: new Date().toISOString(),
  };
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/jobs - list all jobs
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

// GET /api/jobs/:id - single job
app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

// GET /api/applications - list all applications (for HR dashboard)
app.get('/api/applications', (req, res) => {
  const { status, department, search, minScore } = req.query;

  let filtered = [...applications];

  if (status && status !== 'ALL') {
    filtered = filtered.filter((app) => app.status === status);
  }

  if (department && department !== 'ALL') {
    filtered = filtered.filter((app) => app.department === department);
  }

  if (search) {
    const s = String(search).toLowerCase();
    filtered = filtered.filter(
      (app) =>
        app.trackingCode.toLowerCase().includes(s) ||
        app.applicant.fullName.toLowerCase().includes(s) ||
        app.applicant.email.toLowerCase().includes(s) ||
        app.jobTitle.toLowerCase().includes(s) ||
        app.applicant.skills.some((sk) => sk.toLowerCase().includes(s))
    );
  }

  if (minScore) {
    const score = Number(minScore);
    filtered = filtered.filter((app) => (app.aiScreening?.overallScore || 0) >= score);
  }

  res.json(filtered);
});

// GET /api/applications/track/:code - track application by code or phone/email
app.get('/api/applications/track/:code', (req, res) => {
  const code = req.params.code.trim().toUpperCase();
  const rawCode = req.params.code.trim().toLowerCase();

  const application = applications.find(
    (app) =>
      app.trackingCode.toUpperCase() === code ||
      app.applicant.email.toLowerCase() === rawCode ||
      app.applicant.phone.replace(/[^0-9]/g, '') === code.replace(/[^0-9]/g, '')
  );

  if (!application) {
    return res.status(404).json({ error: 'ไม่พบข้อมูลใบสมัคร กรุณาตรวจสอบรหัสติดตามหรืออีเมล' });
  }

  res.json(application);
});

// GET /api/applications/:id - get application by ID
app.get('/api/applications/:id', (req, res) => {
  const application = applications.find((app) => app.id === req.params.id);
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }
  res.json(application);
});

// POST /api/applications - submit new application
app.post('/api/applications', async (req, res) => {
  try {
    const { jobId, applicant, documents, pdpaConsent } = req.body;

    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      return res.status(400).json({ error: 'ไม่พบตำแหน่งงานที่ระบุ' });
    }

    if (!pdpaConsent?.consented) {
      return res.status(400).json({ error: 'จำเป็นต้องให้ความยินยอมตามมาตรฐาน PDPA ก่อนส่งใบสมัคร' });
    }

    const trackingCode = generateTrackingCode();
    const now = new Date().toISOString();
    const appId = `APP-${Date.now().toString().slice(-6)}`;

    // Initial timeline event
    const initialTimeline: TimelineEvent[] = [
      {
        id: `TL-${Date.now()}-1`,
        timestamp: now,
        status: 'SUBMITTED',
        titleTh: 'ส่งใบสมัครสำเร็จ (Submitted)',
        descriptionTh: `ระบบบันทึกใบสมัครและเอกสารแนบ (${(documents || []).length} ไฟล์) เรียบร้อยแล้ว`,
        author: 'SYSTEM',
      },
    ];

    // Initial email confirmation log
    const initialEmail: EmailLog = {
      id: `EM-${Date.now()}-1`,
      recipientEmail: applicant.email,
      recipientName: applicant.fullName,
      subject: `[ยืนยันรับใบสมัคร] ตำแหน่ง ${job.title} - รหัสติดตาม ${trackingCode}`,
      previewText: `เรียนคุณ ${applicant.fullName} ฝ่ายบุคคลได้รับใบสมัครของคุณเรียบร้อยแล้ว รหัสติดตามสถานะคือ ${trackingCode}`,
      content: `เรียนคุณ ${applicant.fullName},\n\nฝ่ายทรัพยากรบุคคลได้รับใบสมัครของคุณสำหรับตำแหน่ง "${job.title}" เรียบร้อยแล้ว\n\nรหัสติดตามสถานะ (Tracking Code): ${trackingCode}\nท่านสามารถนำรหัสดังกล่าวมาตรวจสอบสถานะแบบเรียลไทม์ได้ตลอด 24 ชั่วโมงผ่านหน้าเว็บไซต์\n\nข้อมูลของท่านได้รับการจัดเก็บอย่างปลอดภัยตามมาตรฐาน พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)\n\nขอแสดงความนับถือ,\nฝ่ายสรรหาและพัฒนาทรัพยากรบุคคล`,
      type: 'APPLICATION_RECEIVED',
      sentAt: now,
      status: 'DELIVERED',
    };

    const newApplication: JobApplication = {
      id: appId,
      trackingCode,
      jobId: job.id,
      jobTitle: job.title,
      department: job.department,
      applicant: {
        fullName: applicant.fullName,
        email: applicant.email,
        phone: applicant.phone,
        lineId: applicant.lineId || '',
        currentPosition: applicant.currentPosition || '',
        experienceYears: Number(applicant.experienceYears) || 0,
        expectedSalary: Number(applicant.expectedSalary) || 0,
        educationLevel: applicant.educationLevel || 'ปริญญาตรี',
        university: applicant.university || '',
        major: applicant.major || '',
        gpa: applicant.gpa || '',
        skills: Array.isArray(applicant.skills) ? applicant.skills : [],
        portfolioUrl: applicant.portfolioUrl || '',
        coverNote: applicant.coverNote || '',
      },
      documents: documents || [],
      status: 'SUBMITTED',
      statusUpdatedAt: now,
      submittedAt: now,
      pdpaConsent: {
        consented: true,
        consentTimestamp: now,
        policyVersion: 'PDPA-REC-2026-V2.1',
        retentionExpiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        purposesAccepted: pdpaConsent.purposesAccepted || [
          'ใช้ข้อมูลเพื่อการคัดเลือกและติดต่อสื่อสารการสมัครงาน',
          'จัดเก็บประวัติเพื่อพิจารณาตำแหน่งงานอื่นที่เหมาะสมในอนาคต (180 วัน)',
          'ยินยอมให้ประมวลผลข้อมูลด้วยระบบ AI ช่วยคัดกรองเบื้องต้น',
        ],
      },
      hrNotes: [],
      timeline: initialTimeline,
      emailsSent: [initialEmail],
    };

    // Auto-trigger AI screening immediately upon application submission
    try {
      const aiResult = await runAiScreening(job, newApplication.applicant);
      newApplication.aiScreening = aiResult;
      newApplication.timeline.push({
        id: `TL-${Date.now()}-2`,
        timestamp: new Date().toISOString(),
        status: 'AI_REVIEWED',
        titleTh: 'ประเมินคุณสมบัติด้วย AI อัตโนมัติ',
        descriptionTh: `ผลการวิเคราะห์: คะแนนความเหมาะสม ${aiResult.overallScore}% (${aiResult.recommendationLabelTh})`,
        author: 'AI_SCREENER',
      });
      newApplication.status = 'AI_REVIEWED';
      newApplication.statusUpdatedAt = new Date().toISOString();
    } catch (aiErr) {
      console.warn('Initial AI screening fallback:', aiErr);
      const fallback = fallbackAiScreening(job, newApplication.applicant);
      newApplication.aiScreening = fallback;
    }

    applications.unshift(newApplication);

    res.status(201).json({
      success: true,
      message: 'ส่งใบสมัครสำเร็จเรียบร้อยแล้ว',
      trackingCode,
      application: newApplication,
    });
  } catch (err: any) {
    console.error('Error submitting application:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกใบสมัคร: ' + err.message });
  }
});

// Helper to perform AI screening with Gemini
async function runAiScreening(job: JobOpening, applicant: JobApplication['applicant']): Promise<AiScreeningResult> {
  const gemini = getGeminiClient();
  if (!gemini) {
    return fallbackAiScreening(job, applicant);
  }

  const prompt = `คุณคือผู้เชี่ยวชาญด้านการสรรหาทรัพยากรบุคคล (Senior HR Talent Specialist)
โปรดวิเคราะห์คุณสมบัติของผู้สมัครงานเทียบกับรายละเอียดตำแหน่งงานอย่างละเอียด

ข้อมูลตำแหน่งงาน:
- ชื่อตำแหน่ง: ${job.title}
- แผนก: ${job.department}
- คุณสมบัติที่ต้องการ: ${job.qualifications.join('; ')}
- ประสบการณ์ที่ต้องการ: ${job.experienceRequired}
- ช่วงเงินเดือน: ${job.salaryRange}

ข้อมูลผู้สมัคร:
- ชื่อ: ${applicant.fullName}
- ตำแหน่งปัจจุบัน: ${applicant.currentPosition || 'ไม่ได้ระบุ'}
- ประสบการณ์: ${applicant.experienceYears} ปี
- เงินเดือนที่คาดหวัง: ${applicant.expectedSalary.toLocaleString()} บาท
- การศึกษา: ${applicant.educationLevel} ${applicant.major ? `สาขา ${applicant.major}` : ''} ${applicant.university ? `(${applicant.university})` : ''} GPA: ${applicant.gpa || '-'}
- ทักษะ (Skills): ${applicant.skills.join(', ')}
- จดหมายแนะนำตัว / Portfolio: ${applicant.coverNote || '-'}

คำสั่ง:
1. ประเมิน overallScore (0-100) ตามความสอดคล้องของทักษะ ประสบการณ์ และการศึกษา
2. ระบุ recommendation (FAST_TRACK, QUALIFIED, REVIEW_REQUIRED, NOT_MATCHED)
3. ระบุ recommendationLabelTh (เช่น แนะนำเร่งด่วน (Fast-Track), คุณสมบัติดี เหมาะสม (Qualified), ต้องพิจารณาเพิ่มเติม (Review Required), ไม่ตรงตามเกณฑ์ขั้นต่ำ (Not Matched))
4. สรุป qualificationSummaryTh เป็นภาษาไทยกระชับและตรงจุด
5. ระบุ strengths (จุดแข็งเด่น 3 ข้อ)
6. ระบุ gapsOrAreasToProbe (จุดที่ควรซักถามเพิ่มเติมในรอบสัมภาษณ์ 2 ข้อ)
7. ระบุ suggestedInterviewQuestions (คำถามสัมภาษณ์เจาะลึก 3 ข้อ)`;

  try {
    const response = await gemini.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER, description: 'Overall match score 0-100' },
            recommendation: {
              type: Type.STRING,
              enum: ['FAST_TRACK', 'QUALIFIED', 'REVIEW_REQUIRED', 'NOT_MATCHED'],
            },
            recommendationLabelTh: { type: Type.STRING },
            qualificationSummaryTh: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            gapsOrAreasToProbe: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedInterviewQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            'overallScore',
            'recommendation',
            'recommendationLabelTh',
            'qualificationSummaryTh',
            'strengths',
            'gapsOrAreasToProbe',
            'suggestedInterviewQuestions',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      overallScore: Math.round(parsed.overallScore || 75),
      recommendation: parsed.recommendation || 'QUALIFIED',
      recommendationLabelTh: parsed.recommendationLabelTh || 'คุณสมบัติดี เหมาะสม',
      qualificationSummaryTh: parsed.qualificationSummaryTh || 'คุณสมบัติโดยรวมสอดคล้องกับตำแหน่งงาน',
      strengths: parsed.strengths || [],
      gapsOrAreasToProbe: parsed.gapsOrAreasToProbe || [],
      suggestedInterviewQuestions: parsed.suggestedInterviewQuestions || [],
      screenedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Gemini screening error, falling back to heuristic:', error);
    return fallbackAiScreening(job, applicant);
  }
}

// POST /api/applications/:id/ai-screen - trigger on-demand AI screening
app.post('/api/applications/:id/ai-screen', async (req, res) => {
  const application = applications.find((app) => app.id === req.params.id);
  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const job = jobs.find((j) => j.id === application.jobId) || {
    id: application.jobId,
    title: application.jobTitle,
    department: application.department,
    location: 'Bangkok',
    workType: 'Full-time' as const,
    salaryRange: 'Negotiable',
    experienceRequired: '2+ ปี',
    description: '',
    qualifications: ['มีประสบการณ์ตรงสายงาน', 'มีความรับผิดชอบ'],
    responsibilities: [],
    isOpen: true,
    postedDate: '2026-09-01',
  };

  try {
    const screening = await runAiScreening(job, application.applicant);
    application.aiScreening = screening;
    application.timeline.push({
      id: `TL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'AI_REVIEWED',
      titleTh: 'วิเคราะห์คุณสมบัติด้วย AI (Re-screened)',
      descriptionTh: `คะแนนความเหมาะสม ${screening.overallScore}% (${screening.recommendationLabelTh})`,
      author: 'AI_SCREENER',
    });

    res.json({ success: true, aiScreening: screening });
  } catch (err: any) {
    res.status(500).json({ error: 'AI Screening failed: ' + err.message });
  }
});

// PATCH /api/applications/:id/status - update status and trigger email notification
app.patch('/api/applications/:id/status', (req, res) => {
  const { status, note, interviewSchedule, sendEmail = true, customEmailSubject, customEmailBody } = req.body;
  const application = applications.find((app) => app.id === req.params.id);

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const prevStatus = application.status;
  application.status = status;
  application.statusUpdatedAt = new Date().toISOString();

  if (interviewSchedule) {
    application.interviewSchedule = interviewSchedule;
  }

  // Titles for timeline
  const statusTitles: Record<string, string> = {
    SCREENING: 'อยู่ระหว่างคัดกรองเบื้องต้น',
    INTERVIEW_SCHEDULED: 'นัดหมายสัมภาษณ์งาน',
    TECHNICAL_TEST: 'นัดหมายทดสอบทักษะ',
    OFFER_EXTENDED: 'ยื่นข้อเสนอรับเข้าทำงาน (Offer)',
    HIRED: 'รับเข้าทำงานเรียบร้อย (Hired)',
    REJECTED: 'ไม่ผ่านการคัดเลือก',
    WITHDRAWN: 'สละสิทธิ์ / ยกเลิกข้อมูล',
  };

  const titleTh = statusTitles[status] || `เปลี่ยนสถานะเป็น ${status}`;

  // Add timeline entry
  application.timeline.push({
    id: `TL-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status,
    titleTh,
    descriptionTh: note || `เปลี่ยนสถานะจาก ${prevStatus} เป็น ${status}`,
    author: 'HR_OFFICER',
    note,
  });

  // Automated Email Triggering
  let emailLog: EmailLog | null = null;
  if (sendEmail) {
    let emailType: EmailLog['type'] = 'STATUS_CHANGED';
    let defaultSubject = `[อัปเดตสถานะการสมัคร] ตำแหน่ง ${application.jobTitle}`;
    let defaultBody = `เรียนคุณ ${application.applicant.fullName},\n\nสถานะการสมัครงานตำแหน่ง ${application.jobTitle} ของคุณได้รับการอัปเดตเป็น: "${titleTh}"\n\nรายละเอียดเพิ่มเติม:\n${note || 'ทางทีมงานฝ่ายบุคคลกำลังดำเนินการตามขั้นตอนต่อไป'}\n\nคุณสามารถติดตามสถานะใบสมัครแบบเรียลไทม์ได้ที่เว็บไซต์ ด้วยรหัส: ${application.trackingCode}\n\nด้วยความเคารพ,\nฝ่ายทรัพยากรบุคคล`;

    if (status === 'INTERVIEW_SCHEDULED') {
      emailType = 'INTERVIEW_INVITE';
      defaultSubject = `[นัดสัมภาษณ์งาน] ขอเชิญสัมภาษณ์ตำแหน่ง ${application.jobTitle}`;
      defaultBody = `เรียนคุณ ${application.applicant.fullName},\n\nบริษัทมีความยินดีขอเชิญท่านเข้ารับการสัมภาษณ์งานในตำแหน่ง "${application.jobTitle}"\n\nรายละเอียดการนัดหมาย:\n- วันที่: ${interviewSchedule?.date || 'ตามที่ตกลง'}\n- เวลา: ${interviewSchedule?.time || '14:00 น.'}\n- รูปแบบ/สถานที่: ${interviewSchedule?.locationOrLink || 'Google Meet'}\n\n${note ? `หมายเหตุ: ${note}\n\n` : ''}กรุณายืนยันการเข้าร่วมสัมภาษณ์โดยการตอบกลับอีเมลนี้\n\nฝ่ายบุคคล`;
    } else if (status === 'OFFER_EXTENDED') {
      emailType = 'OFFER_LETTER';
      defaultSubject = `[ขอแสดงความยินดี] ยื่นข้อเสนอการจ้างงาน (Job Offer) ตำแหน่ง ${application.jobTitle}`;
      defaultBody = `เรียนคุณ ${application.applicant.fullName},\n\nขอแสดงความยินดีเป็นอย่างยิ่ง บริษัทขอเสนอตำแหน่งงาน "${application.jobTitle}" ให้แก่ท่าน\n\n${note || 'รายละเอียดสวัสดิการและอัตราผลตอบแทนได้แนบมาในระบบนี้แล้ว'}\n\nโปรดตรวจสอบและแจ้งผลการตอบรับผ่านระบบ\n\nฝ่ายทรัพยากรบุคคล`;
    } else if (status === 'REJECTED') {
      emailType = 'REJECTION_NOTICE';
      defaultSubject = `[แจ้งผลการสมัครงาน] ตำแหน่ง ${application.jobTitle}`;
      defaultBody = `เรียนคุณ ${application.applicant.fullName},\n\nขอขอบพระคุณเป็นอย่างยิ่งที่ท่านได้ให้ความสนใจสมัครงานในตำแหน่ง "${application.jobTitle}" กับบริษัทของเรา\n\nจากการพิจารณาคุณสมบัติอย่างละเอียด แม้ว่าประวัติของท่านจะน่าประทับใจ แต่ในขณะนี้ตำแหน่งดังกล่าวมีความจำเป็นต้องคัดเลือกผู้สมัครที่มีทักษะเฉพาะตรงกับโจทย์งานในปัจจุบัน\n\nทั้งนี้ บริษัทจะขออนุญาตเก็บประวัติของท่านไว้ตามมาตรฐาน PDPA เพื่อติดต่อในโอกาสงานตำแหน่งอื่นที่เหมาะสมในอนาคต\n\nขออวยพรให้ท่านประสบความสำเร็จในหน้าที่การงาน\n\nฝ่ายทรัพยากรบุคคล`;
    }

    emailLog = {
      id: `EM-${Date.now()}`,
      recipientEmail: application.applicant.email,
      recipientName: application.applicant.fullName,
      subject: customEmailSubject || defaultSubject,
      previewText: (customEmailBody || defaultBody).slice(0, 100) + '...',
      content: customEmailBody || defaultBody,
      type: emailType,
      sentAt: new Date().toISOString(),
      status: 'DELIVERED',
    };

    application.emailsSent.push(emailLog);
  }

  res.json({
    success: true,
    application,
    emailSent: emailLog,
  });
});

// POST /api/applications/:id/note - Add HR internal note
app.post('/api/applications/:id/note', (req, res) => {
  const { author, text, rating } = req.body;
  const application = applications.find((app) => app.id === req.params.id);

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const noteItem = {
    id: `NOTE-${Date.now()}`,
    author: author || 'เจ้าหน้าที่ HR',
    text,
    createdAt: new Date().toISOString(),
    rating: rating ? Number(rating) : undefined,
  };

  application.hrNotes.push(noteItem);
  res.json({ success: true, note: noteItem, application });
});

// POST /api/applications/:id/pdpa-action - PDPA compliance actions (Right to be Forgotten / Anonymize / Delete)
app.post('/api/applications/:id/pdpa-action', (req, res) => {
  const { action, reason } = req.body;
  const application = applications.find((app) => app.id === req.params.id);

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  if (action === 'ANONYMIZE' || action === 'RIGHT_TO_BE_FORGOTTEN') {
    // Mask sensitive personal identifiable information (PII) according to PDPA
    const originalName = application.applicant.fullName;
    application.applicant.fullName = 'ผู้สมัครงาน (ข้อมูลถูกลบ/ปกปิดตามคำขอ PDPA)';
    application.applicant.phone = '08X-XXX-XXXX';
    application.applicant.lineId = '-';
    application.applicant.coverNote = '[ข้อมูลถูกลบตามข้อกำหนด PDPA]';
    // Remove uploaded sensitive files (keep metadata showing deletion)
    application.documents = application.documents.map((doc) => ({
      ...doc,
      name: `[PDPA Purged] ${doc.docType}.pdf`,
      dataUrl: undefined,
    }));

    application.pdpaConsent.isAnonymized = true;
    application.pdpaConsent.anonymizedAt = new Date().toISOString();
    application.status = 'WITHDRAWN';
    application.statusUpdatedAt = new Date().toISOString();

    application.timeline.push({
      id: `TL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'WITHDRAWN',
      titleTh: 'ดำเนินการตามสิทธิ PDPA (Right to be Forgotten)',
      descriptionTh: `ข้อมูลส่วนบุคคล (PII) และเอกสารของผู้สมัครได้รับการทำลาย/ปกปิดเรียบร้อยแล้ว โดย ${reason || 'คำร้องขอของผู้สมัคร'}`,
      author: 'SYSTEM',
    });

    const pdpaEmail: EmailLog = {
      id: `EM-PDPA-${Date.now()}`,
      recipientEmail: application.applicant.email,
      recipientName: originalName,
      subject: `[ยืนยันสิทธิ PDPA] ลบและทำลายข้อมูลส่วนบุคคลเรียบร้อยแล้ว`,
      previewText: `ระบบได้ดำเนินการปกปิดและทำลายข้อมูลส่วนบุคคลตามสิทธิ PDPA...`,
      content: `เรียนคุณ ${originalName},\n\nระบบได้รับคำร้องขอใช้สิทธิของเจ้าของข้อมูลส่วนบุคคล (Data Subject Right) และได้ดำเนินการลบ ทำลาย และปกปิดข้อมูลส่วนบุคคล (Anonymization) จากฐานข้อมูลระบบรับสมัครงานเรียบร้อยแล้ว ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)\n\nรหัสอ้างอิง: ${application.trackingCode}\n\nเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)`,
      type: 'PDPA_NOTICE',
      sentAt: new Date().toISOString(),
      status: 'DELIVERED',
    };
    application.emailsSent.push(pdpaEmail);

    return res.json({
      success: true,
      message: 'ลบและปกปิดข้อมูลส่วนบุคคลตามมาตรฐาน PDPA เรียบร้อยแล้ว',
      application,
    });
  }

  res.status(400).json({ error: 'Unsupported PDPA action' });
});

// GET /api/analytics/monthly - recruitment metrics & overview
app.get('/api/analytics/monthly', (req, res) => {
  const totalApplications = applications.length;
  const screened = applications.filter((a) => a.status !== 'SUBMITTED').length;
  const interviewed = applications.filter((a) =>
    ['INTERVIEW_SCHEDULED', 'TECHNICAL_TEST', 'OFFER_EXTENDED', 'HIRED'].includes(a.status)
  ).length;
  const hired = applications.filter((a) => a.status === 'HIRED').length;
  const rejected = applications.filter((a) => a.status === 'REJECTED').length;
  const offers = applications.filter((a) => ['OFFER_EXTENDED', 'HIRED'].includes(a.status)).length;

  // Department counts
  const deptMap: Record<string, number> = {};
  applications.forEach((a) => {
    deptMap[a.department] = (deptMap[a.department] || 0) + 1;
  });
  const byDepartment = Object.entries(deptMap).map(([department, count]) => ({ department, count }));

  // Average AI Score
  const scores = applications.map((a) => a.aiScreening?.overallScore).filter(Boolean) as number[];
  const averageAiScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  res.json({
    currentMonth: 'กันยายน 2026',
    totalApplications,
    screened,
    interviewed,
    offers,
    hired,
    rejected,
    byDepartment,
    averageAiScore,
    avgTimeToHireDays: 14,
    pdpaComplianceRate: '100%',
    statusCounts: {
      SUBMITTED: applications.filter((a) => a.status === 'SUBMITTED').length,
      SCREENING: applications.filter((a) => a.status === 'SCREENING').length,
      AI_REVIEWED: applications.filter((a) => a.status === 'AI_REVIEWED').length,
      INTERVIEW_SCHEDULED: applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length,
      TECHNICAL_TEST: applications.filter((a) => a.status === 'TECHNICAL_TEST').length,
      OFFER_EXTENDED: applications.filter((a) => a.status === 'OFFER_EXTENDED').length,
      HIRED: applications.filter((a) => a.status === 'HIRED').length,
      REJECTED: applications.filter((a) => a.status === 'REJECTED').length,
    },
  });
});

// POST /api/notifications/resend - resend or send new custom notification
app.post('/api/notifications/resend', (req, res) => {
  const { applicationId, subject, content, type } = req.body;
  const application = applications.find((a) => a.id === applicationId);

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const emailLog: EmailLog = {
    id: `EM-CUSTOM-${Date.now()}`,
    recipientEmail: application.applicant.email,
    recipientName: application.applicant.fullName,
    subject,
    previewText: content.slice(0, 100) + '...',
    content,
    type: type || 'STATUS_CHANGED',
    sentAt: new Date().toISOString(),
    status: 'DELIVERED',
  };

  application.emailsSent.push(emailLog);
  res.json({ success: true, emailLog });
});

// ----------------------------------------------------
// VITE MIDDLEWARE / STATIC ASSETS SETUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
