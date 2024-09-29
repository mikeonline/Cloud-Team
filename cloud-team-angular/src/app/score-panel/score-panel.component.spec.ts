import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorePanelComponent } from './score-panel.component';

describe('ScorePanelComponent', () => {
  let component: ScorePanelComponent;
  let fixture: ComponentFixture<ScorePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScorePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
