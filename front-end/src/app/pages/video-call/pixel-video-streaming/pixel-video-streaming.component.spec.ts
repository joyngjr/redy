import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixelVideoStreamingComponent } from './pixel-video-streaming.component';

describe('PixelVideoStreamingComponent', () => {
  let component: PixelVideoStreamingComponent;
  let fixture: ComponentFixture<PixelVideoStreamingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixelVideoStreamingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixelVideoStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
