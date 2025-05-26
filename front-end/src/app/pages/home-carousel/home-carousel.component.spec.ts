import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCarousellComponent } from './home-carousell.component';

describe('HomeCarousellComponent', () => {
  let component: HomeCarousellComponent;
  let fixture: ComponentFixture<HomeCarousellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCarousellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCarousellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
