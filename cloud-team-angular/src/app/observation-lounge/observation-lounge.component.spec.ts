import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationLoungeComponent } from './observation-lounge.component';

describe('ObservationLoungeComponent', () => {
  let component: ObservationLoungeComponent;
  let fixture: ComponentFixture<ObservationLoungeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservationLoungeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservationLoungeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
