import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamInterviewComponent } from './stream-interview.component';

describe('StreamInterviewComponent', () => {
  let component: StreamInterviewComponent;
  let fixture: ComponentFixture<StreamInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamInterviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
