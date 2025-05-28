import { Component, OnInit } from '@angular/core';
import { ReusableConversationComponent } from '../reusable-conversation/reusable-conversation.component';
import { ConversationSetup } from '../../models/conversation-setup.model';
import { ResumeService } from '../../services/resume.service';
import { PromptService } from '../../services/prompt.service';

@Component({
  standalone: true,
  selector: 'app-stream-counselling',
  imports: [ReusableConversationComponent],
  template: `
    <app-reusable-conversation
      [config]="counsellingConfig">
    </app-reusable-conversation>
  `
})
export class StreamCounsellingComponent implements OnInit {
  counsellingConfig: ConversationSetup = {
    startMessage: `Hi there! I’m Clara, your career coach. Feel free to ask me anything about your career choices, job search, or professional development. I’m here to help you find the right path!`,
    prompt:       `You are a friendly career counsellor who guides users through their career choices and helps them find the right path. You are empathetic, supportive, and knowledgeable about various career options.`,
    avatar:       'martha',
    backgroundImageUrl: 'https://…/counselling.jpg',
    voice:        'martha',
    temperature:  0.6,
    topP:         0.85,
  };

  constructor(
    private resumeService: ResumeService,
    private promptService: PromptService
  ) {}

  ngOnInit() {
    this.resumeService.retrieveResume().subscribe({
      next: resumeData => {
        const prompt = this.promptService.buildCareerCounsellorPrompt(resumeData);
        this.counsellingConfig = {
          startMessage: `Hi there! I’m Clara, your career coach. Feel free to ask me anything about your career choices, job search, or professional development. I’m here to help you find the right path!`,
          prompt,
          avatar: 'martha',
          backgroundImageUrl: 'https://…/counselling.jpg',
          voice: 'martha',
          temperature: 0.6,
          topP: 0.85,
        };

        console.log(prompt)
      },
      error: () => {
        // handle errors: maybe fall back to a default prompt without resume
        console.error('Could not load resume; using generic prompt.');
      }
    });
  }
}
