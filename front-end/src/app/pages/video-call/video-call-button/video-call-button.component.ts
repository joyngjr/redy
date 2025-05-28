import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { timer, Subject, switchMap, tap, takeUntil, catchError, of } from 'rxjs';
import { environment } from '../../../../environment';   // adjust path if needed

interface VoiceCallAvailableResponse {
  voice_call_available: boolean;
}

@Component({
  standalone: true,
  selector: 'app-video-call-button',
  imports: [CommonModule, ButtonModule, HttpClientModule],
  templateUrl: './video-call-button.component.html',
  styleUrls: ['./video-call-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoCallButtonComponent implements OnInit, OnDestroy {
  @Input() isAvailable = false;
  @Output() clicked = new EventEmitter<void>();
  isChecking = true;
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    timer(0, 2000)
      .pipe(
        tap(() => (this.isChecking = true)),
        switchMap(() =>
          this.http.get<VoiceCallAvailableResponse>(
            `${environment.httpServerUrl}/api/conversation/available`,
            {
              headers: new HttpHeaders({
                'xi-api-key': environment.apiKey ?? ''
              })
            }
          )
        ),
        catchError(err => {
          console.error('Availability check failed', err);
          return of({ voice_call_available: false });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(res => {
        this.isAvailable = res.voice_call_available;
        this.isChecking = false;
        this.cdr.markForCheck(); 
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleClick(): void {
    if (this.isAvailable) {
      this.clicked.emit();
    }
  }
}
