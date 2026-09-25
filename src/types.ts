export type ApplicantStatus =
  | 'SUBMITTED'
  | 'SCREENING'
  | 'AI_REVIEWED'
  | 'INTERVIEW_SCHEDULED'
  | 'TECHNICAL_TEST'
  | 'OFFER_EXTENDED'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  workType: 'Full-time' | 'Part-time' | 'Hybrid' | 'Remote';
  salaryRange: string;
  experienceRequired: string;
  description: string;
  qualifications: string[];
  responsibilities: string[];
  urgent?: boolean;
  isOpen: boolean;
  postedDate: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  docType: 'RESUME' | 'TRANSCRIPT' | 'PORTFOLIO' | 'CERTIFICATE' | 'OTHER';
  size: number;
  dataUrl?: string;
  mimeType: string;
  uploadedAt: string;
}

export interface PdpaConsent {
  consented: boolean;
  consentTimestamp: string;
  policyVersion: string;
  retentionExpiresAt: string;
  purposesAccepted: string[];
  isAnonymized?: boolean;
  anonymizedAt?: string;
}

export interface AiScreeningResult {
  overallScore: number; // 0 - 100
  recommendation: 'FAST_TRACK' | 'QUALIFIED' | 'REVIEW_REQUIRED' | 'NOT_MATCHED';
  recommendationLabelTh: string;
  qualificationSummaryTh: string;
  strengths: string[];
  gapsOrAreasToProbe: string[];
  suggestedInterviewQuestions: string[];
  screenedAt: string;
}

export interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  previewText: string;
  content: string;
  type: 'APPLICATION_RECEIVED' | 'STATUS_CHANGED' | 'INTERVIEW_INVITE' | 'OFFER_LETTER' | 'REJECTION_NOTICE' | 'PDPA_NOTICE';
  sentAt: string;
  status: 'DELIVERED' | 'SENT';
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  status: ApplicantStatus;
  titleTh: string;
  descriptionTh: string;
  author: 'SYSTEM' | 'AI_SCREENER' | 'HR_OFFICER';
  note?: string;
}

export interface HrNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  rating?: number;
}

export interface JobApplication {
  id: string;
  trackingCode: string; // e.g. APP-2026-4821
  jobId: string;
  jobTitle: string;
  department: string;
  applicant: {
    fullName: string;
    email: string;
    phone: string;
    lineId?: string;
    currentPosition?: string;
    experienceYears: number;
    expectedSalary: number;
    educationLevel: string;
    university?: string;
    major?: string;
    gpa?: string;
    skills: string[];
    portfolioUrl?: string;
    coverNote?: string;
  };
  documents: UploadedDoc[];
  status: ApplicantStatus;
  statusUpdatedAt: string;
  submittedAt: string;
  pdpaConsent: PdpaConsent;
  aiScreening?: AiScreeningResult;
  hrNotes: HrNote[];
  interviewSchedule?: {
    date: string;
    time: string;
    locationOrLink: string;
    interviewers: string[];
    type: 'ONLINE' | 'ONSITE';
  };
  timeline: TimelineEvent[];
  emailsSent: EmailLog[];
}

export interface MonthlyAnalytics {
  monthName: string;
  totalApplications: number;
  screened: number;
  interviewed: number;
  hired: number;
  rejected: number;
  byDepartment: { department: string; count: number }[];
  averageAiScore: number;
  avgTimeToHireDays: number;
}

export interface MonthlyReportData {
  month: string;
  totalApplications: number;
  totalInterviewed: number;
  totalHired: number;
  avgTimeToHireDays: number;
  byDepartment: { department: string; count: number }[];
  trends: { month: string; applications: number; hired: number }[];
}
