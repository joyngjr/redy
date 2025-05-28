/* interview.component.ts */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideoCallButtonComponent } from '../video-call/video-call-button/video-call-button.component';   // adjust path as needed

@Component({
  standalone: true,
  selector: 'app-interview',
  imports: [
    CommonModule,
    RouterLink,
    VideoCallButtonComponent
  ],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent {}

