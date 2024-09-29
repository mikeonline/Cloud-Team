import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScoreService } from '../services/score.service';

@Component({
  selector: 'app-score-panel',
  template: `
    <div class="score-panel">
      <span class="font-bold text-xl">Score: {{ score }}</span>
    </div>
  `,
  styles: [`
    .score-panel {
      /* Add any specific styles for the score panel */
    }
  `]
})
export class ScorePanelComponent implements OnInit, OnDestroy {
  score: number = 0;
  private scoreSubscription: Subscription;

  constructor(private scoreService: ScoreService) {}

  ngOnInit() {
    this.scoreSubscription = this.scoreService.score$.subscribe(
      score => this.score = score
    );
  }

  ngOnDestroy() {
    if (this.scoreSubscription) {
      this.scoreSubscription.unsubscribe();
    }
  }
}
