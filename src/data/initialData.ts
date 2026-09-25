import { JobOpening, JobApplication } from '../types';

export const INITIAL_JOBS: JobOpening[] = [
  {
    id: 'JOB-DEV-01',
    title: 'Senior Full-Stack Developer (React / Node.js)',
    department: 'Engineering & Technology',
    location: 'Bangkok (Silom) / Hybrid',
    workType: 'Hybrid',
    salaryRange: '70,000 - 110,000 THB',
    experienceRequired: '3 - 6 ปี',
    description: 'พัฒนาและดูแลระบบ Web Applications ระดับ Enterprise ด้วย React, TypeScript, Express, และ Cloud Architecture พร้อมร่วมออกแบบระบบ AI Integration',
    qualifications: [
      'ปริญญาตรีขึ้นไป สาขาวิทยาการคอมพิวเตอร์ วิศวกรรมคอมพิวเตอร์ หรือสาขาที่เกี่ยวข้อง',
      'ประสบการณ์เขียน React, TypeScript, Node.js / Express อย่างน้อย 3 ปี',
      'เข้าใจ RESTful APIs, State Management, Cloud Services (GCP/AWS)',
      'มีความรู้เรื่อง Data Security และแนวปฏิบัติ PDPA ในการจัดการข้อมูลส่วนบุคคล'
    ],
    responsibilities: [
      'พัฒนา Feature ใหม่สำหรับแพลตฟอร์มตามความต้องการขององค์กร',
      'ออกแบบ Codebase ที่มี Clean Architecture และ Unit Tests',
      'ประสานงานกับทีม UI/UX และ Product Manager',
      'รีวิว Code และให้คำแนะนำทีม Developer ระดับจูเนียร์'
    ],
    urgent: true,
    isOpen: true,
    postedDate: '2026-08-15'
  },
  {
    id: 'JOB-HR-02',
    title: 'People & Culture Specialist (HR Specialist)',
    department: 'Human Resources',
    location: 'Bangkok (Sathorn)',
    workType: 'Full-time',
    salaryRange: '40,000 - 60,000 THB',
    experienceRequired: '2 - 4 ปี',
    description: 'ดูแลการสรรหาบุคลากร (Talent Acquisition), กระบวนการ Onboarding, สวัสดิการ และการบริหารจัดการข้อมูลพนักงานตามข้อกำหนด PDPA',
    qualifications: [
      'ปริญญาตรี สาขาการบริหารทรัพยากรบุคคล จิตวิทยาองค์กร หรือสาขาที่เกี่ยวข้อง',
      'มีประสบการณ์สรรหาบุคลากรสาย Tech หรือ Corporate อย่างน้อย 2 ปี',
      'เข้าใจกฎหมายแรงงานไทยและกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)',
      'มีทักษะการสื่อสารภาษาอังกฤษในระดับดี'
    ],
    responsibilities: [
      'วางแผนและดำเนินการสรรหาบุคลากรตามเป้าหมายของแต่ละแผนก',
      'คัดกรองใบสมัคร สัมภาษณ์เบื้องต้น และประสานงาน Hiring Managers',
      'จัดทำเอกสารสัญญาจ้างและจัดเก็บข้อมูลอย่างปลอดภัยตาม PDPA',
      'พัฒนาโครงการเสริมสร้าง Engagement ภายในองค์กร'
    ],
    urgent: false,
    isOpen: true,
    postedDate: '2026-08-20'
  },
  {
    id: 'JOB-MKT-03',
    title: 'Digital Marketing & Growth Strategist',
    department: 'Marketing & Brand',
    location: 'Bangkok (Asoke) / Hybrid',
    workType: 'Hybrid',
    salaryRange: '45,000 - 75,000 THB',
    experienceRequired: '2 - 5 ปี',
    description: 'วางแผนและบริหารแคมเปญโฆษณาออนไลน์ (Performance Marketing, SEO/SEM, Social Media Ads) พร้อมวิเคราะห์ Data สรุป Conversion',
    qualifications: [
      'ปริญญาตรี สาขาการตลาด การสื่อสารมวลชน หรือสาขาที่เกี่ยวข้อง',
      'เชี่ยวชาญ Google Ads, Meta Ads, TikTok Ads Manager และ Google Analytics 4',
      'มีความคิดสร้างสรรค์และทักษะ Data-driven mindset',
      'มีผลงานบริหาร Budget แคมเปญและเพิ่ม ROAS ได้ตามเป้าหมาย'
    ],
    responsibilities: [
      'วางกลยุทธ์และยิงแคมเปญโฆษณาในช่องทางดิจิทัลต่างๆ',
      'วิเคราะห์พฤติกรรมลูกค้า ปรับแต่ง Funnel เพื่อเพิ่ม Conversion Rate',
      'ทำงานร่วมกับทีม Graphic Designer และ Content Creator',
      'สรุป Dashboard รายสัปดาห์และรายเดือนเสนอผู้บริหาร'
    ],
    urgent: true,
    isOpen: true,
    postedDate: '2026-08-25'
  },
  {
    id: 'JOB-DATA-04',
    title: 'AI Data Analyst & Business Intelligence',
    department: 'Data & Analytics',
    location: 'Bangkok (Arom) / Remote 80%',
    workType: 'Remote',
    salaryRange: '55,000 - 85,000 THB',
    experienceRequired: '2 - 5 ปี',
    description: 'วิเคราะห์ข้อมูลเชิงลึก พัฒนา PowerBI / Looker Studio Dashboards และประยุกต์ใช้โมเดล AI ในการประมวลผลข้อมูลการตัดสินใจทางธุรกิจ',
    qualifications: [
      'ปริญญาตรี สาขาสถิติ, วิทยาศาสตร์ข้อมูล, เทคโนโลยีสารสนเทศ หรือสาขาที่เกี่ยวข้อง',
      'เชี่ยวชาญ SQL, Python (Pandas/NumPy) และ BI Tools (Tableau / Looker Studio / PowerBI)',
      'มีประสบการณ์ใช้งาน Generative AI APIs หรือ Machine Learning เบื้องต้น',
      'ทักษะ Data Storytelling และสรุป Insight ให้ทีมบริหารเข้าใจง่าย'
    ],
    responsibilities: [
      'ดึงและทำความสะอาดข้อมูลจากระบบ Database',
      'สร้าง Interactive Dashboards สำหรับติดตาม KPI แต่ละฝ่าย',
      'ร่วมพัฒนาระบบ AI Automation ช่วยงานวิเคราะห์',
      'ควบคุมการเข้าถึงข้อมูลตามมาตรฐาน PDPA'
    ],
    urgent: false,
    isOpen: true,
    postedDate: '2026-09-01'
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'APP-001',
    trackingCode: 'APP-2026-9102',
    jobId: 'JOB-DEV-01',
    jobTitle: 'Senior Full-Stack Developer (React / Node.js)',
    department: 'Engineering & Technology',
    applicant: {
      fullName: 'นาย กิตติศักดิ์ พัฒนวรกุล',
      email: 'kittisak.dev@gmail.com',
      phone: '081-456-7890',
      lineId: 'kittisak_code',
      currentPosition: 'Full-Stack Developer ที่ Tech Solutions Co.',
      experienceYears: 4,
      expectedSalary: 85000,
      educationLevel: 'ปริญญาตรี',
      university: 'จุฬาลงกรณ์มหาวิทยาลัย',
      major: 'วิศวกรรมคอมพิวเตอร์',
      gpa: '3.62',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'GCP'],
      portfolioUrl: 'https://github.com/kittisak-dev',
      coverNote: 'มีความสนใจอย่างยิ่งที่จะนำประสบการณ์พัฒนาระบบ Enterprise และทักษะ AI Integration มาร่วมสร้างผลงานกับทีม'
    },
    documents: [
      {
        id: 'DOC-01',
        name: 'Kittisak_Resume_2026.pdf',
        docType: 'RESUME',
        size: 1450000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-09-02T10:15:00Z'
      },
      {
        id: 'DOC-02',
        name: 'CU_Transcript_Official.pdf',
        docType: 'TRANSCRIPT',
        size: 980000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-09-02T10:15:00Z'
      }
    ],
    status: 'INTERVIEW_SCHEDULED',
    statusUpdatedAt: '2026-09-05T14:30:00Z',
    submittedAt: '2026-09-02T10:15:00Z',
    pdpaConsent: {
      consented: true,
      consentTimestamp: '2026-09-02T10:14:50Z',
      policyVersion: 'PDPA-REC-2026-V2.1',
      retentionExpiresAt: '2027-03-01T10:15:00Z',
      purposesAccepted: [
        'ใช้ข้อมูลเพื่อการคัดเลือกและติดต่อสื่อสารการสมัครงาน',
        'จัดเก็บประวัติเพื่อพิจารณาตำแหน่งงานอื่นที่เหมาะสมในอนาคต (180 วัน)',
        'ยินยอมให้ประมวลผลข้อมูลด้วยระบบ AI ช่วยคัดกรองเบื้องต้น'
      ]
    },
    aiScreening: {
      overallScore: 92,
      recommendation: 'FAST_TRACK',
      recommendationLabelTh: 'แนะนำเร่งด่วน (Fast-Track)',
      qualificationSummaryTh: 'ผู้สมัครมีคุณสมบัติตรงตามความต้องการของตำแหน่งมากกว่า 90% มีประสบการณ์ React, TypeScript และ Node.js ตรงสาย 4 ปี จบวิศวกรรมคอมพิวเตอร์จากมหาวิทยาลัยชั้นนำ เกียรตินิยม มีผลงาน Github ชัดเจน',
      strengths: [
        'ตรงตาม Technical Stack หลัก (React, TypeScript, Node.js, Cloud) ครบถ้วน',
        'ประสบการณ์ทำงาน 4 ปีในโปรเจกต์ระดับ Enterprise',
        'ผลการเรียนดีเด่น GPA 3.62 และมีทัศนคติที่ดีต่อการเรียนรู้เทคโนโลยีใหม่'
      ],
      gapsOrAreasToProbe: [
        'ควรทดสอบความลึกด้าน System Architecture และ Data Security (PDPA)',
        'ตรวจสอบประสบการณ์ด้าน AI API Integration ในงานจริง'
      ],
      suggestedInterviewQuestions: [
        'ช่วยเล่าถึงสถาปัตยกรรมระบบ Web Application ที่คุณเคยออกแบบ และวิธีจัดการ State หรือ Caching ประสิทธิภาพสูง',
        'หากต้องทำระบบรับข้อมูลตามมาตรฐาน PDPA คุณมีแนวทางป้องกัน Data Leak อย่างไรในการเขียน Code?',
        'เคยเจอปัญหาเรื่อง Production Deployment บน Cloud อย่างไร และแก้ไขอย่างไร?'
      ],
      screenedAt: '2026-09-02T10:20:00Z'
    },
    interviewSchedule: {
      date: '2026-09-15',
      time: '14:00 - 15:30 น.',
      locationOrLink: 'Google Meet: meet.google.com/xyz-tech-rec',
      interviewers: ['คุณธนพล (Lead Architect)', 'คุณนภัสสร (HR TA Manager)'],
      type: 'ONLINE'
    },
    hrNotes: [
      {
        id: 'NOTE-01',
        author: 'นภัสสร (HR Manager)',
        text: 'คะแนน AI สูงมาก (92%) ทบทวน Resume แล้วน่าสนใจมาก นัดสัมภาษณ์รอบ Technical เรียบร้อย',
        createdAt: '2026-09-05T14:28:00Z',
        rating: 5
      }
    ],
    timeline: [
      {
        id: 'TL-01',
        timestamp: '2026-09-02T10:15:00Z',
        status: 'SUBMITTED',
        titleTh: 'ส่งใบสมัครสำเร็จ',
        descriptionTh: 'ระบบบันทึกใบสมัครและเอกสาร พร้อมออกรหัสติดตาม APP-2026-9102',
        author: 'SYSTEM'
      },
      {
        id: 'TL-02',
        timestamp: '2026-09-02T10:20:00Z',
        status: 'AI_REVIEWED',
        titleTh: 'วิเคราะห์คุณสมบัติด้วย AI สำเร็จ',
        descriptionTh: 'AI คำนวณความเหมาะสมได้ 92% (แนะนำ Fast-Track)',
        author: 'AI_SCREENER'
      },
      {
        id: 'TL-03',
        timestamp: '2026-09-05T14:30:00Z',
        status: 'INTERVIEW_SCHEDULED',
        titleTh: 'นัดหมายสัมภาษณ์งาน',
        descriptionTh: 'นัดหมายสัมภาษณ์ผ่าน Google Meet วันที่ 15 ก.ย. 2026 เวลา 14:00 น.',
        author: 'HR_OFFICER',
        note: 'ส่งอีเมลแจ้งผู้สมัครเรียบร้อยแล้ว'
      }
    ],
    emailsSent: [
      {
        id: 'EM-001',
        recipientEmail: 'kittisak.dev@gmail.com',
        recipientName: 'นาย กิตติศักดิ์ พัฒนวรกุล',
        subject: '[ยืนยัน] ได้รับใบสมัครงานตำแหน่ง Senior Full-Stack Developer เรียบร้อยแล้ว',
        previewText: 'ขอบคุณที่สนใจร่วมงานกับเรา รหัสติดตามใบสมัครของคุณคือ APP-2026-9102...',
        content: 'เรียนคุณ กิตติศักดิ์ พัฒนวรกุล,\n\nฝ่ายทรัพยากรบุคคลได้รับใบสมัครงานของคุณในตำแหน่ง Senior Full-Stack Developer เรียบร้อยแล้ว\n\nรหัสติดตามสถานะของคุณคือ: APP-2026-9102\nท่านสามารถตรวจสอบความคืบหน้าได้ตลอดเวลาผ่านระบบออนไลน์\n\nด้วยความเคารพ,\nฝ่ายทรัพยากรบุคคล',
        type: 'APPLICATION_RECEIVED',
        sentAt: '2026-09-02T10:15:05Z',
        status: 'DELIVERED'
      },
      {
        id: 'EM-002',
        recipientEmail: 'kittisak.dev@gmail.com',
        recipientName: 'นาย กิตติศักดิ์ พัฒนวรกุล',
        subject: '[นัดสัมภาษณ์] ขอเชิญสัมภาษณ์งานตำแหน่ง Senior Full-Stack Developer',
        previewText: 'ฝ่ายบุคคลมีความยินดีเรียนเชิญท่านเข้ารับการสัมภาษณ์ในวันที่ 15 ก.ย. 2026 เวลา 14:00 น....',
        content: 'เรียนคุณ กิตติศักดิ์ พัฒนวรกุล,\n\nทางบริษัทขอเชิญท่านเข้ารับการสัมภาษณ์รอบแรก (Technical & Culture Fit)\nวัน-เวลา: 15 กันยายน 2026 เวลา 14:00 - 15:30 น.\nรูปแบบ: Online ผ่าน Google Meet (meet.google.com/xyz-tech-rec)\n\nกรุณายืนยันการเข้าร่วมสัมภาษณ์ตอบกลับอีเมลนี้\n\nฝ่ายบุคคล',
        type: 'INTERVIEW_INVITE',
        sentAt: '2026-09-05T14:30:10Z',
        status: 'DELIVERED'
      }
    ]
  },
  {
    id: 'APP-002',
    trackingCode: 'APP-2026-7731',
    jobId: 'JOB-HR-02',
    jobTitle: 'People & Culture Specialist (HR Specialist)',
    department: 'Human Resources',
    applicant: {
      fullName: 'นางสาว พัชราภา วงศ์สุวรรณ',
      email: 'patcharapa.hr@outlook.com',
      phone: '089-223-4567',
      lineId: 'patcha_hr',
      currentPosition: 'Talent Acquisition Officer ที่ Retail Group',
      experienceYears: 3,
      expectedSalary: 52000,
      educationLevel: 'ปริญญาตรี',
      university: 'มหาวิทยาลัยธรรมศาสตร์',
      major: 'รัฐศาสตร์ (สาขาบริหารรัฐกิจ/ทรัพยากรมนุษย์)',
      gpa: '3.45',
      skills: ['Talent Sourcing', 'Employer Branding', 'PDPA Compliance', 'Labor Law', 'English Proficient'],
      portfolioUrl: '',
      coverNote: 'มีความชำนาญด้านกระบวนการสรรหาบุคลากรยุคใหม่ และการบริหารฐานข้อมูลพนักงานตามหลักเกณฑ์ PDPA อย่างรัดกุม'
    },
    documents: [
      {
        id: 'DOC-03',
        name: 'Resume_Patcharapa_2026.pdf',
        docType: 'RESUME',
        size: 1120000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-09-04T09:30:00Z'
      }
    ],
    status: 'SCREENING',
    statusUpdatedAt: '2026-09-06T11:00:00Z',
    submittedAt: '2026-09-04T09:30:00Z',
    pdpaConsent: {
      consented: true,
      consentTimestamp: '2026-09-04T09:29:40Z',
      policyVersion: 'PDPA-REC-2026-V2.1',
      retentionExpiresAt: '2027-03-03T09:30:00Z',
      purposesAccepted: [
        'ใช้ข้อมูลเพื่อการคัดเลือกและติดต่อสื่อสารการสมัครงาน',
        'จัดเก็บประวัติเพื่อพิจารณาตำแหน่งงานอื่นที่เหมาะสมในอนาคต (180 วัน)',
        'ยินยอมให้ประมวลผลข้อมูลด้วยระบบ AI ช่วยคัดกรองเบื้องต้น'
      ]
    },
    aiScreening: {
      overallScore: 88,
      recommendation: 'QUALIFIED',
      recommendationLabelTh: 'คุณสมบัติดี เหมาะสม (Qualified)',
      qualificationSummaryTh: 'ประสบการณ์ตรงสาย 3 ปี มีความรู้เรื่องกฎหมายแรงงานและ PDPA ชัดเจน ทักษะภาษาดี จบจากมหาวิทยาลัยชั้นนำ',
      strengths: [
        'ประสบการณ์ Recruitment และ Talent Acquisition 3 ปีเต็ม',
        'มีใบประกาศนียบัตรและการอบรมด้าน PDPA Compliance',
        'บุคลิกภาพและการนำเสนอข้อมูลดี'
      ],
      gapsOrAreasToProbe: [
        'ทดสอบความคุ้นเคยกับระบบ ATS (Applicant Tracking System) สมัยใหม่',
        'สอบถามกลยุทธ์การสรรหาตำแหน่งสาย Tech เฉพาะทาง'
      ],
      suggestedInterviewQuestions: [
        'กรณีพบปัญหา Hiring Manager ต้องการรับคนด่วนแต่ยังไม่ได้เอกสาร PDPA ครบ คุณจะมีวิธีบริหารจัดการอย่างไร?',
        'เล่าเคสการปิดตำแหน่งงานที่หายากที่สุดที่คุณเคยทำมา'
      ],
      screenedAt: '2026-09-04T09:35:00Z'
    },
    hrNotes: [
      {
        id: 'NOTE-02',
        author: 'สมชาย (HR Director)',
        text: 'โปรไฟล์น่าสนใจ เข้าเกณฑ์ กำลังตรวจสอบคิวสัมภาษณ์กับทีม',
        createdAt: '2026-09-06T10:55:00Z',
        rating: 4
      }
    ],
    timeline: [
      {
        id: 'TL-04',
        timestamp: '2026-09-04T09:30:00Z',
        status: 'SUBMITTED',
        titleTh: 'ส่งใบสมัครสำเร็จ',
        descriptionTh: 'ระบบบันทึกใบสมัครและออกรหัสติดตาม APP-2026-7731',
        author: 'SYSTEM'
      },
      {
        id: 'TL-05',
        timestamp: '2026-09-04T09:35:00Z',
        status: 'AI_REVIEWED',
        titleTh: 'วิเคราะห์คุณสมบัติด้วย AI สำเร็จ',
        descriptionTh: 'AI ให้คะแนน 88% อยู่ในเกณฑ์ Qualified',
        author: 'AI_SCREENER'
      },
      {
        id: 'TL-06',
        timestamp: '2026-09-06T11:00:00Z',
        status: 'SCREENING',
        titleTh: 'กำลังคัดกรองประวัติโดยเจ้าหน้าที่ HR',
        descriptionTh: 'เจ้าหน้าที่ฝ่ายสรรหากำลังพิจารณาเอกสารเพิ่มเติม',
        author: 'HR_OFFICER'
      }
    ],
    emailsSent: [
      {
        id: 'EM-003',
        recipientEmail: 'patcharapa.hr@outlook.com',
        recipientName: 'นางสาว พัชราภา วงศ์สุวรรณ',
        subject: '[ยืนยัน] ได้รับใบสมัครงานตำแหน่ง People & Culture Specialist เรียบร้อยแล้ว',
        previewText: 'รหัสติดตามสถานะของคุณคือ APP-2026-7731 ขอบคุณที่สนใจร่วมงาน...',
        content: 'เรียนคุณ พัชราภา วงศ์สุวรรณ,\n\nเราได้รับใบสมัครของคุณเรียบร้อยแล้ว และกำลังอยู่ในขั้นตอนการคัดกรองเบื้องต้น\nรหัสติดตาม: APP-2026-7731\n\nขอแสดงความนับถือ,\nฝ่ายทรัพยากรบุคคล',
        type: 'APPLICATION_RECEIVED',
        sentAt: '2026-09-04T09:30:05Z',
        status: 'DELIVERED'
      }
    ]
  },
  {
    id: 'APP-003',
    trackingCode: 'APP-2026-5541',
    jobId: 'JOB-MKT-03',
    jobTitle: 'Digital Marketing & Growth Strategist',
    department: 'Marketing & Brand',
    applicant: {
      fullName: 'นาย ธนากร รัตนโชติ',
      email: 'thanakorn.growth@gmail.com',
      phone: '086-789-0123',
      lineId: 'thanakorn_mkt',
      currentPosition: 'Senior Performance Marketer',
      experienceYears: 5,
      expectedSalary: 70000,
      educationLevel: 'ปริญญาตรี',
      university: 'มหาวิทยาลัยเกษตรศาสตร์',
      major: 'การตลาด',
      gpa: '3.30',
      skills: ['Meta Ads', 'Google Ads', 'GA4', 'TikTok Ads', 'Growth Hacking', 'A/B Testing'],
      portfolioUrl: 'https://growth-case-study.notion.site/thanakorn',
      coverNote: 'มีสถิติการยิงแคมเปญ ROAS 5.2x และบริหารงบประมาณโฆษณามากกว่า 2 ล้านบาทต่อเดือน'
    },
    documents: [
      {
        id: 'DOC-04',
        name: 'Thanakorn_CV_2026.pdf',
        docType: 'RESUME',
        size: 1650000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-09-05T13:20:00Z'
      },
      {
        id: 'DOC-05',
        name: 'Growth_Marketing_Portfolio.pdf',
        docType: 'PORTFOLIO',
        size: 4200000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-09-05T13:20:00Z'
      }
    ],
    status: 'OFFER_EXTENDED',
    statusUpdatedAt: '2026-09-10T16:00:00Z',
    submittedAt: '2026-09-05T13:20:00Z',
    pdpaConsent: {
      consented: true,
      consentTimestamp: '2026-09-05T13:19:45Z',
      policyVersion: 'PDPA-REC-2026-V2.1',
      retentionExpiresAt: '2027-03-04T13:20:00Z',
      purposesAccepted: [
        'ใช้ข้อมูลเพื่อการคัดเลือกและติดต่อสื่อสารการสมัครงาน',
        'จัดเก็บประวัติเพื่อพิจารณาตำแหน่งงานอื่นที่เหมาะสมในอนาคต (180 วัน)',
        'ยินยอมให้ประมวลผลข้อมูลด้วยระบบ AI ช่วยคัดกรองเบื้องต้น'
      ]
    },
    aiScreening: {
      overallScore: 95,
      recommendation: 'FAST_TRACK',
      recommendationLabelTh: 'แนะนำเร่งด่วน (Fast-Track)',
      qualificationSummaryTh: 'ประสบการณ์ตรงและโดดเด่นมาก มีผลงานวัดผลได้ชัดเจน (ROAS 5.2x) มี Case Study ครบถ้วน ทักษะการวิเคราะห์ข้อมูลยอดเยี่ยม',
      strengths: [
        'ความเชี่ยวชาญเครื่องมือ Ads ทุกแพลตฟอร์มอย่างลึกซึ้ง',
        'มี Portfolio Case Studies ตัวเลขสถิติชัดเจน',
        'อัตราการเติบโตของผลลัพธ์ในอดีตสูงกว่าเป้าหมาย'
      ],
      gapsOrAreasToProbe: [
        'สอบถามมุมมองเรื่องการตลาดเชิงแบรนด์ในระยะยาว ควบคู่กับ Performance'
      ],
      suggestedInterviewQuestions: [
        'ในงบประมาณที่จำกัด คุณจะจัดสรรสัดส่วนช่องทางโฆษณาอย่างไรเพื่อให้ได้ CAC ต่ำที่สุด?',
        'เล่าการทดลอง A/B Testing ล่าสุดที่ล้มเหลว และได้เรียนรู้อะไรจากครั้งนั้น?'
      ],
      screenedAt: '2026-09-05T13:25:00Z'
    },
    hrNotes: [
      {
        id: 'NOTE-03',
        author: 'นภัสสร (HR Manager)',
        text: 'ผลสัมภาษณ์กับ CMO ผ่านฉลุย ผู้สมัครตอบคำถามได้ยอดเยี่ยม ทำการยื่น Offer เรียบร้อย',
        createdAt: '2026-09-10T15:45:00Z',
        rating: 5
      }
    ],
    timeline: [
      {
        id: 'TL-07',
        timestamp: '2026-09-05T13:20:00Z',
        status: 'SUBMITTED',
        titleTh: 'ส่งใบสมัครสำเร็จ',
        descriptionTh: 'รหัสติดตาม APP-2026-5541',
        author: 'SYSTEM'
      },
      {
        id: 'TL-08',
        timestamp: '2026-09-05T13:25:00Z',
        status: 'AI_REVIEWED',
        titleTh: 'AI วิเคราะห์ความเหมาะสม (95%)',
        descriptionTh: 'ระบบประเมินผลลัพธ์ Fast-Track',
        author: 'AI_SCREENER'
      },
      {
        id: 'TL-09',
        timestamp: '2026-09-08T10:00:00Z',
        status: 'INTERVIEW_SCHEDULED',
        titleTh: 'สัมภาษณ์กับผู้บริหารการตลาด',
        descriptionTh: 'สัมภาษณ์ Onsite เรียบร้อย',
        author: 'HR_OFFICER'
      },
      {
        id: 'TL-10',
        timestamp: '2026-09-10T16:00:00Z',
        status: 'OFFER_EXTENDED',
        titleTh: 'ยื่นข้อเสนอรับเข้าทำงาน (Job Offer)',
        descriptionTh: 'ส่งเอกสาร Offer Package ทางอีเมลเรียบร้อยแล้ว รอผู้สมัครยืนยัน',
        author: 'HR_OFFICER',
        note: 'Offer เงินเดือน 72,000 THB + Bonus ตามผลงาน'
      }
    ],
    emailsSent: [
      {
        id: 'EM-004',
        recipientEmail: 'thanakorn.growth@gmail.com',
        recipientName: 'นาย ธนากร รัตนโชติ',
        subject: '[ข้อเสนองาน] ขอแสดงความยินดีและยื่นข้อเสนอรับเข้าทำงานตำแหน่ง Digital Marketing & Growth Strategist',
        previewText: 'บริษัทมีความยินดีเป็นอย่างยิ่งที่จะยื่นข้อเสนอการจ้างงานให้กับท่าน...',
        content: 'เรียนคุณ ธนากร รัตนโชติ,\n\nบริษัทมีความยินดีเป็นอย่างยิ่งที่จะแจ้งว่าท่านผ่านการคัดเลือกในตำแหน่ง Digital Marketing & Growth Strategist\nรายละเอียดข้อเสนอ (Job Offer Letter) ได้แนบมาในระบบนี้แล้ว กรุณาพิจารณาและลงนามตอบรับภายใน 5 วันทำการ\n\nขอแสดงความยินดีเป็นอย่างยิ่ง,\nฝ่ายทรัพยากรบุคคล',
        type: 'OFFER_LETTER',
        sentAt: '2026-09-10T16:00:05Z',
        status: 'DELIVERED'
      }
    ]
  },
  {
    id: 'APP-004',
    trackingCode: 'APP-2026-3198',
    jobId: 'JOB-DATA-04',
    jobTitle: 'AI Data Analyst & Business Intelligence',
    department: 'Data & Analytics',
    applicant: {
      fullName: 'นางสาว รมิตา วารินทร์',
      email: 'ramita.data@gmail.com',
      phone: '085-112-9876',
      lineId: 'ramita_bi',
      currentPosition: 'Junior Data Analyst',
      experienceYears: 1.5,
      expectedSalary: 45000,
      educationLevel: 'ปริญญาตรี',
      university: 'มหาวิทยาลัยเชียงใหม่',
      major: 'สถิติประยุกต์',
      gpa: '3.75',
      skills: ['SQL', 'Power BI', 'Python', 'Excel Advanced', 'Data Cleaning'],
      portfolioUrl: 'https://ramita-bi.tableau.public',
      coverNote: 'มีความสนใจงาน Business Intelligence และการนำ GenAI มาประยุกต์ใช้เพื่อเพิ่มประสิทธิภาพการทำงาน'
    },
    documents: [
      {
        id: 'DOC-06',
        name: 'Ramita_Resume_Final.pdf',
        docType: 'RESUME',
        size: 920000,
        mimeType: 'application/pdf',
        uploadedAt: '2026-09-08T11:40:00Z'
      }
    ],
    status: 'TECHNICAL_TEST',
    statusUpdatedAt: '2026-09-10T14:00:00Z',
    submittedAt: '2026-09-08T11:40:00Z',
    pdpaConsent: {
      consented: true,
      consentTimestamp: '2026-09-08T11:39:15Z',
      policyVersion: 'PDPA-REC-2026-V2.1',
      retentionExpiresAt: '2027-03-07T11:40:00Z',
      purposesAccepted: [
        'ใช้ข้อมูลเพื่อการคัดเลือกและติดต่อสื่อสารการสมัครงาน',
        'จัดเก็บประวัติเพื่อพิจารณาตำแหน่งงานอื่นที่เหมาะสมในอนาคต (180 วัน)',
        'ยินยอมให้ประมวลผลข้อมูลด้วยระบบ AI ช่วยคัดกรองเบื้องต้น'
      ]
    },
    aiScreening: {
      overallScore: 84,
      recommendation: 'QUALIFIED',
      recommendationLabelTh: 'คุณสมบัติดี เหมาะสม (Qualified)',
      qualificationSummaryTh: 'พื้นฐานสถิติและ SQL แน่นมาก ผลการเรียนยอดเยี่ยม 3.75 แม้ประสบการณ์ 1.5 ปีจะน้อยกว่าเกณฑ์เล็กน้อย แต่มีผลงาน Dashboard ชัดเจนและเรียนรู้เร็ว',
      strengths: [
        'ทักษะ SQL และ Data Visualization (Power BI / Tableau) แข็งแกร่ง',
        'ผลการเรียนเกียรตินิยมอันดับ 1 (GPA 3.75)',
        'มีความกระตือรือร้นและทัศนคติการเรียนรู้เทคโนโลยี AI'
      ],
      gapsOrAreasToProbe: [
        'ประสบการณ์ใน Production Data Pipeline ยังอยู่ในระดับเริ่มต้น',
        'ทดสอบความเข้าใจ Business Metric ในธุรกิจจริง'
      ],
      suggestedInterviewQuestions: [
        'ให้ออกแบบ Query SQL เพื่อหา Customer Churn Rate รายเดือน',
        'ถ้าเจอ Data ที่ไม่สมบูรณ์หรือไม่ตรงกันระหว่างระบบ 2 แหล่ง คุณมีวิธีตรวจสอบอย่างไร?'
      ],
      screenedAt: '2026-09-08T11:45:00Z'
    },
    hrNotes: [
      {
        id: 'NOTE-04',
        author: 'พิชัย (Data Lead)',
        text: 'มอบหมายแบบทดสอบ SQL และ Data Modeling ให้ทำ กำหนดส่งภายใน 48 ชม.',
        createdAt: '2026-09-10T13:50:00Z',
        rating: 4
      }
    ],
    timeline: [
      {
        id: 'TL-11',
        timestamp: '2026-09-08T11:40:00Z',
        status: 'SUBMITTED',
        titleTh: 'ส่งใบสมัครสำเร็จ',
        descriptionTh: 'รหัสติดตาม APP-2026-3198',
        author: 'SYSTEM'
      },
      {
        id: 'TL-12',
        timestamp: '2026-09-08T11:45:00Z',
        status: 'AI_REVIEWED',
        titleTh: 'AI วิเคราะห์ความเหมาะสม (84%)',
        descriptionTh: 'ผลประเมิน Qualified พร้อมคำแนะนำแบบทดสอบ',
        author: 'AI_SCREENER'
      },
      {
        id: 'TL-13',
        timestamp: '2026-09-10T14:00:00Z',
        status: 'TECHNICAL_TEST',
        titleTh: 'ขั้นตอนทดสอบทักษะ (Skill Assessment)',
        descriptionTh: 'ส่งโจทย์ทดสอบ SQL และ PowerBI ให้ผู้สมัครทางอีเมล',
        author: 'HR_OFFICER'
      }
    ],
    emailsSent: [
      {
        id: 'EM-005',
        recipientEmail: 'ramita.data@gmail.com',
        recipientName: 'นางสาว รมิตา วารินทร์',
        subject: '[แบบทดสอบ] ขอเชิญทำแบบทดสอบทักษะสำหรับตำแหน่ง AI Data Analyst',
        previewText: 'ยินดีด้วยท่านผ่านการคัดกรองเบื้องต้น ขอเชิญทำแบบทดสอบ SQL & BI...',
        content: 'เรียนคุณ รมิตา วารินทร์,\n\nท่านผ่านการคัดกรองคุณสมบัติเบื้องต้น และทางทีมขอเชิญท่านทำแบบทดสอบทักษะทางเทคนิค (Technical Assessment)\nโปรดตรวจสอบไฟล์โจทย์และส่งผลงานภายในวันที่ 12 กันยายน 2026\n\nฝ่ายบุคคลและทีมข้อมูล',
        type: 'STATUS_CHANGED',
        sentAt: '2026-09-10T14:00:08Z',
        status: 'DELIVERED'
      }
    ]
  }
];

export const STATUS_CONFIG: Record<
  string,
  {
    labelTh: string;
    labelEn: string;
    color: string;
    bg: string;
    border: string;
    description: string;
  }
> = {
  SUBMITTED: {
    labelTh: 'ได้รับใบสมัครแล้ว',
    labelEn: 'Application Submitted',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    description: 'ระบบบันทึกใบสมัครและเอกสารครบถ้วนเรียบร้อยแล้ว'
  },
  SCREENING: {
    labelTh: 'อยู่ระหว่างคัดกรองเบื้องต้น',
    labelEn: 'In Screening',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    description: 'เจ้าหน้าที่ฝ่ายบุคคลกำลังพิจารณาคุณสมบัติและเอกสาร'
  },
  AI_REVIEWED: {
    labelTh: 'ผ่านการวิเคราะห์ AI แล้ว',
    labelEn: 'AI Screened',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    description: 'ระบบ AI วิเคราะห์ทักษะและคะแนนความเหมาะสมเสร็จสิ้น'
  },
  INTERVIEW_SCHEDULED: {
    labelTh: 'นัดหมายสัมภาษณ์งาน',
    labelEn: 'Interview Scheduled',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    description: 'ได้รับการนัดหมายวันเวลาสัมภาษณ์งานกับทีมงาน'
  },
  TECHNICAL_TEST: {
    labelTh: 'ทดสอบทักษะ / ทำแบบประเมิน',
    labelEn: 'Technical Assessment',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    description: 'อยู่ระหว่างการทดสอบทักษะเฉพาะตำแหน่งหรือแบบประเมิน'
  },
  OFFER_EXTENDED: {
    labelTh: 'ยื่นข้อเสนอรับเข้าทำงาน',
    labelEn: 'Offer Extended',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    description: 'บริษัทได้ส่งเอกสารข้อเสนอการจ้างงาน (Job Offer) แล้ว'
  },
  HIRED: {
    labelTh: 'รับเข้าทำงานเรียบร้อย',
    labelEn: 'Hired & Completed',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-300',
    description: 'ผู้สมัครตอบรับข้อเสนอและเสร็จสิ้นกระบวนการสรรหา'
  },
  REJECTED: {
    labelTh: 'ไม่ผ่านการคัดเลือก',
    labelEn: 'Not Selected',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    description: 'ขอขอบพระคุณที่ให้ความสนใจ บริษัทขอเก็บข้อมูลไว้พิจารณาโอกาสถัดไป'
  },
  WITHDRAWN: {
    labelTh: 'สละสิทธิ์ / ยกเลิกข้อมูล PDPA',
    labelEn: 'Withdrawn / PDPA Purged',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    description: 'ผู้สมัครขอยกเลิกใบสมัครหรือใช้สิทธิลบข้อมูลส่วนบุคคลตาม PDPA'
  }
};
