import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-video-call-button',
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './video-call-button.component.html',
  styleUrls: ['./video-call-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoCallButtonComponent {
  @Input() isAvailable = false;
}