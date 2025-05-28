import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideoCallButtonComponent } from '../video-call/video-call-button/video-call-button.component';

@Component({
  standalone: true,
  selector: 'app-counselling',
  imports: [
    CommonModule,
    RouterLink,
    VideoCallButtonComponent
  ],
  templateUrl: './counselling.component.html',
  styleUrl: './counselling.component.scss'
})
export class CounsellingComponent {

}
