import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'interview-options', loadComponent: () => import('./pages/interview-options/interview-options.component').then(m => m.InterviewOptionsComponent) },
  { path: 'interview', loadComponent: () => import('./pages/interview/interview.component').then(m => m.InterviewComponent) },
  { path: 'video-call/:conversationId', loadComponent: () => import('./pages/video-call/conversation/conversation.component').then(m => m.ConversationComponent)},
];