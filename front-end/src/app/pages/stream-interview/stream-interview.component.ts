// src/app/pages/stream-interview/stream-interview.component.ts
import { Component, OnInit } from '@angular/core';
import { ReusableConversationComponent } from '../reusable-conversation/reusable-conversation.component';
import { ConversationSetup } from '../../models/conversation-setup.model';
import { ResumeService } from '../../services/resume.service';
import { PromptService } from '../../services/prompt.service';

@Component({
  standalone: true,
  selector: 'app-stream-interview',
  imports: [ReusableConversationComponent],
  template: `
    <app-reusable-conversation
      [config]="interviewConfig">
    </app-reusable-conversation>
  `
})
export class StreamInterviewComponent implements OnInit {
  interviewConfig: ConversationSetup = {
    startMessage: `Hello, I’m Henry, your interviewer. I’ll walk you through a mock interview to help you prepare for common questions and give feedback on your answers. First up, tell me about yourself.`,
    prompt:       `You are an interviewer for a job candidate. Ask open-ended questions about their background, skills, and motivations, then provide constructive feedback on each answer.`,
    avatar:       'henry',
    backgroundImageUrl: 'https://drive.google.com/uc?export=view&id=1q0ltRHC0pn2JhwUIa3-jHs6DNW_sgwEp',
    voice:        'henry',
    temperature:  0.7,
    topP:         0.9,
  };

  constructor(
    private resumeService: ResumeService,
    private promptService: PromptService,
  ) {}

  ngOnInit() {
    this.resumeService.retrieveResume().subscribe({
      next: resumeData => {
        console.log('🎯 Got resume for interview prep:', resumeData);

        // build the interview-style prompt with the full resume object
        const richPrompt = this.promptService.buildInterviewPrompt(resumeData);

        // patch only the prompt field, leaving all other settings intact
        this.interviewConfig = {
          ...this.interviewConfig,
          prompt: richPrompt
        };
      },
      error: err => {
        console.error('🚨 Could not load resume; using generic interview prompt.', err);
        // interviewConfig stays with its default `prompt`
      }
    });
  }
}
