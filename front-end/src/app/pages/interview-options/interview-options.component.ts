import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interview-options',
  imports: [RouterLink, NgClass, NgIf, FormsModule],
  templateUrl: './interview-options.component.html',
  styleUrls: ['./interview-options.component.scss'],
  standalone: true,
})
export class InterviewOptionsComponent {
  isResumeUploaded: boolean = true;
  showSettings: boolean = false;
  settings = {
    name: '',
    jobTitle: '',
    // timeLimit: 10, //minutes
    // questionCount: 5,
    questionType: 'Behavourial', // Behavioural, Technical, Skills
    others: '',
  }

}