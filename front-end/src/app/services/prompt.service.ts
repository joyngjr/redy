import { Injectable } from '@angular/core';
import { CAREER_COUNSELLOR_TEMPLATE, INTERVIEW_PREP_TEMPLATE } from './../prompts/prompt-template';

@Injectable({ providedIn: 'root' })
export class PromptService {
  /**
   * Inserts the resume text into the career counsellor prompt template.
   */
  buildCareerCounsellorPrompt(resumeData?: string | object): string {
    // Serialize object to pretty-printed JSON, or use string directly
    let rawText: string;
    if (resumeData === undefined || resumeData === null) {
      rawText = '';
    } else if (typeof resumeData === 'string') {
      rawText = resumeData;
    } else {
      rawText = JSON.stringify(resumeData, null, 2);
    }

    const safeResume = rawText.trim();
    const resumeSection = safeResume.length > 0
      ? safeResume
      : 'No resume information available.';

    return CAREER_COUNSELLOR_TEMPLATE.replace('{{resume}}', resumeSection);
  }

  buildInterviewPrompt(resumeData?: string | object): string {
    let rawText: string;
    if (resumeData === undefined || resumeData === null) {
      rawText = '';
    } else if (typeof resumeData === 'string') {
      rawText = resumeData;
    } else {
      rawText = JSON.stringify(resumeData, null, 2);
    }

    const safeResume = rawText.trim();
    const resumeSection = safeResume.length > 0
      ? safeResume
      : 'No resume information available.';

    return INTERVIEW_PREP_TEMPLATE.replace('{{resume}}', resumeSection);
  }
}
