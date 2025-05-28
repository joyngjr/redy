import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'interview-options', loadComponent: () => import('./pages/interview-options/interview-options.component').then(m => m.InterviewOptionsComponent) },
  {
    path: 'interview',
    loadComponent: () =>
      import('./pages/video-call/video-call-button/video-call-button.component')
        .then(m => m.VideoCallButtonComponent),
    data: { target: 'interview' }
  },

  // waiting room for career counselling
  {
    path: 'counselling',
    loadComponent: () =>
      import('./pages/video-call/video-call-button/video-call-button.component')
        .then(m => m.VideoCallButtonComponent),
    data: { target: 'counselling' }
  },
  // { path: 'video-call2/:conversationId', loadComponent: () => import('./pages/video-call/conversation/conversation.component').then(m => m.ConversationComponent)},
  { path: 'interview/:conversationId', loadComponent: () => import('./pages/stream-interview/stream-interview.component').then(m => m.StreamInterviewComponent) },
  { path: 'counselling/:conversationId', loadComponent: () => import('./pages/stream-counselling/stream-counselling.component').then(m => m.StreamCounsellingComponent) },
];