import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ResumeService } from '../../services/resume.service'; 
import { SettingsService, InterviewSettings } from '../../services/settings.service';

export type QuestionType = 'Behavioural' | 'Resume Based' | 'Skills';

@Component({
  selector: 'app-interview-options',
  imports: [RouterLink, NgClass, NgIf, FormsModule, DatePipe],
  templateUrl: './interview-options.component.html',
  styleUrls: ['./interview-options.component.scss'],
  standalone: true,
})
export class InterviewOptionsComponent {
  isResumeUploaded: boolean = false;
  isSettingsChanged: boolean = false;
  showSettings: boolean = false;
  showUploadModal: boolean = false;
  selectedFile: File | null = null;
  lastUploadedTime: Date | null = null;
  showUploadSuccess: boolean = false;
  isUploading: boolean = false;
  settings: InterviewSettings = {
    name: '',
    jobTitle: '',
    questionType: 'Behavioural',
  };

  constructor(private resumeService: ResumeService, private settingsService: SettingsService) {
    // subscribe to keep local settings in sync if needed
    this.settingsService.settings$.subscribe((s) => {
      this.settings = { ...s };
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.isUploading = true;
        this.selectedFile = file;
        this.uploadResume(); // sends request to backend
      } else {
        alert('Please upload a PDF file.');
      }
    }
  }

  uploadResume() {
    if (this.selectedFile) {
      this.resumeService.uploadResume(this.selectedFile).subscribe({
        next: (response) => {
          console.log('Upload successful:', response);
          this.isResumeUploaded = true;
          this.isUploading = false;
          this.lastUploadedTime = new Date();
          this.showUploadModal = false;
          this.showUploadSuccess = true;

          setTimeout(() => {
            this.showUploadSuccess = false;
          }, 10000); // Hide success message after 10 seconds
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.showUploadSuccess = false;
          this.isUploading = false;
          alert('Failed to upload resume. Please try again.');
        }
      });
    }   
  }

  onSettingsOpened() {
    this.isSettingsChanged = true;
    this.settingsService.updateSettings(this.settings);
  }

  // Helper to update settings with a new object reference
  updateSetting<K extends keyof InterviewSettings>(key: K, value: InterviewSettings[K]) {
    const updated = { ...this.settings, [key]: value };
    this.settings = updated;
    this.settingsService.updateSettings(updated);
  }
}