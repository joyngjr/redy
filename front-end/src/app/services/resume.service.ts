import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private baseUrl = 'http://127.0.0.1:8000'; // localhost URL backend is hosted on

  constructor(private http: HttpClient) {}

  uploadResume(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('resume', file);
    return this.http.post(`${this.baseUrl}/upload_resume/`, formData);
  }

  retrieveResume(): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve_resume/`);
  }

  retrieveJob(): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve_job/`);
  }
}