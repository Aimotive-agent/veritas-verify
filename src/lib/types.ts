export interface Project {
  id: string;
  name: string;
  agency: string;
  description: string;
  status: "draft" | "in_progress" | "completed" | "rejected";
  documentCount: number;
  verifiedCount: number;
  rejectedCount: number;
  createdAt: string;
  updatedAt: string;
  documentCategories: DocumentCategory[];
}

export interface DocumentCategory {
  code: string;
  label: string;
  required: boolean;
  count: number;
  verified: number;
}

export interface UploadedDocument {
  id: string;
  projectId: string;
  category: string;
  name: string;
  type: "scan" | "pdf" | "image" | "text";
  status: "pending" | "ocr_processing" | "ocr_done" | "ai_verifying" | "verified" | "flagged" | "rejected";
  size: number;
  uploadedAt: string;
  ocrText?: string;
  verificationResult?: VerificationResult;
}

export interface VerificationResult {
  score: number;
  passed: boolean;
  issues: VerificationIssue[];
  checkedFields: CheckedField[];
  knowledgeBaseMatches: KnowledgeMatch[];
}

export interface VerificationIssue {
  severity: "high" | "medium" | "low";
  field: string;
  message: string;
  suggestion: string;
  regulationRef?: string;
}

export interface CheckedField {
  field: string;
  extractedValue: string;
  expectedPattern: string;
  match: boolean;
}

export interface KnowledgeMatch {
  source: string;
  excerpt: string;
  relevance: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  agency: string;
  category: string;
  content: string;
  regulations: string[];
}

export interface PipelineStep {
  id: string;
  label: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  progress?: number;
}

export interface User {
  id: string;
  name: string;
  role: "admin" | "officer" | "reviewer" | "viewer";
  agency: string;
  lineId?: string;
  lastActive: string;
}
