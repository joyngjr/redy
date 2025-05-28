import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableConversationComponent } from './reusable-conversation.component';

describe('ReusableConversationComponent', () => {
  let component: ReusableConversationComponent;
  let fixture: ComponentFixture<ReusableConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableConversationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
