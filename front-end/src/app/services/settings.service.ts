import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuestionType } from '../pages/interview-options/interview-options.component';

export interface InterviewSettings {
  name: string;
  jobTitle: string;
  questionType: QuestionType;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private settingsSubject = new BehaviorSubject<InterviewSettings>({
    name: '',
    jobTitle: '',
    questionType: 'Behavioural',
  });

  settings$ = this.settingsSubject.asObservable();

  getSettings(): InterviewSettings {
    return this.settingsSubject.value;
  }

  updateSettings(newSettings: InterviewSettings) {
    this.settingsSubject.next(newSettings);
  }
}
