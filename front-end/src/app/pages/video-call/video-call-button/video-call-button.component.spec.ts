import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallButtonComponent } from './video-call-button.component';

describe('VideoCallButtonComponent', () => {
  let component: VideoCallButtonComponent;
  let fixture: ComponentFixture<VideoCallButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCallButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCallButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
