import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

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
  showSettings: boolean = false;
  showUploadModal: boolean = false;
  selectedFile: File | null = null;
  lastUploadedTime: Date | null = null;
  showUploadSuccess: boolean = false;
  settings = {
    name: '',
    jobTitle: '',
    // timeLimit: 10, //minutes
    // questionCount: 5,
    questionType: 'Behavioural' as QuestionType, 
    others: '',
  };

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        this.isResumeUploaded = true;
        this.lastUploadedTime = new Date();
        this.showUploadModal = false;
        this.showUploadSuccess = true;
        setTimeout(() => {
          this.showUploadSuccess = false;
        }, 10000); // Hide after 10 seconds
        // this.uploadResume(); // to be linked to backend
      } else {
        alert('Please upload a PDF file.');
      }
    }
  }
}