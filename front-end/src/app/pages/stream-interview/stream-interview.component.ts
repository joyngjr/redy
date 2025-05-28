import { Component } from '@angular/core';
import { ReusableConversationComponent } from '../reusable-conversation/reusable-conversation.component';
import { ConversationSetup } from '../../models/conversation-setup.model';

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
export class StreamInterviewComponent {
  interviewConfig: ConversationSetup = {
    startMessage: `Hello, I’m Henry, your interviewer…`,
    prompt:       `You are an interviewer for a job…`,
    avatar:       'henry',
    backgroundImageUrl: 'https://drive.google.com/uc?export=view&id=1q0ltRHC0pn2JhwUIa3-jHs6DNW_sgwEp',
    voice:        'henry',
    temperature:  0.7,
    topP:         0.9,
  };
}
