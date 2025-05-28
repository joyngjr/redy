import { Injectable, OnDestroy } from '@angular/core';
import { CAREER_COUNSELLOR_TEMPLATE, INTERVIEW_PREP_TEMPLATE } from './../prompts/prompt-template';
import { SettingsService } from './settings.service';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PromptService implements OnDestroy {
  private latestSettings: any;
  private settingsSub: Subscription | undefined;

  constructor(private settingsService: SettingsService) {
    // Subscribe to always keep the latest settings
    this.settingsSub = this.settingsService.settings$.subscribe(settings => {
      this.latestSettings = settings;
    });
  }

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

    const promptWithResume = INTERVIEW_PREP_TEMPLATE.replace('{{resume}}', resumeSection);
    const settings = this.latestSettings || this.settingsService.getSettings();
    const result = promptWithResume
      .replace('{{jobTitle}}', settings.jobTitle || 'the job')
      .replace('{{questionType}}', settings.questionType || 'the selected type');
    console.log('[PromptService] Generated interview prompt:', result);
    return result;
  }

  ngOnDestroy() {
    this.settingsSub?.unsubscribe();
  }
}
