import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamCounsellingComponent } from './stream-counselling.component';

describe('StreamCounsellingComponent', () => {
  let component: StreamCounsellingComponent;
  let fixture: ComponentFixture<StreamCounsellingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamCounsellingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamCounsellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
