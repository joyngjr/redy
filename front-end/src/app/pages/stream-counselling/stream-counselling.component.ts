import { Component } from '@angular/core';
import { ReusableConversationComponent } from '../reusable-conversation/reusable-conversation.component';
import { ConversationSetup } from '../../models/conversation-setup.model';

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
export class StreamCounsellingComponent {
counsellingConfig: ConversationSetup = {
    startMessage: `Hi there! I’m Clara, your career coach…`,
    prompt:       `You are a friendly career counsellor who guides…`,
    avatar:       'martha',
    backgroundImageUrl: 'https://drive.google.com/uc?export=view&id=1hn8lsR5eQdFoG5WblxRUeUtbnN37pQl3',
    voice:        'martha',
    temperature:  0.6,
    topP:         0.85,
  };
}
