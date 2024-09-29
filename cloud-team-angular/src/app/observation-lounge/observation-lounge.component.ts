import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ObservationService } from '../services/observation.service';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-observation-lounge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="observation-lounge bg-gray-100 p-4 rounded mt-4">
      <h2 class="text-xl font-bold mb-2">Observation Lounge</h2>
      <div *ngIf="gameState.isGameActive; else noActiveGame">
        <p>Current Game State:</p>
        <ul>
          <li>Score: {{ gameState.score }}</li>
          <li>Time Remaining: {{ gameState.timeRemaining }} seconds</li>
        </ul>
        <p>Observers: {{ observerCount }}</p>
      </div>
      <ng-template #noActiveGame>
        <p>No active game to observe.</p>
      </ng-template>
      <button (click)="toggleObservation()" class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {{ isObserving ? 'Leave Observation' : 'Join Observation' }}
      </button>
    </div>
  `,
  styles: [`
    .observation-lounge {
      max-width: 400px;
      margin: 0 auto;
    }
  `]
})
export class ObservationLoungeComponent implements OnInit, OnDestroy {
  gameState: { score: number, timeRemaining: number, isGameActive: boolean } = {
    score: 0,
    timeRemaining: 0,
    isGameActive: false
  };
  observerCount: number = 0;
  isObserving: boolean = false;

  private gameStateSubscription: Subscription;
  private observerCountSubscription: Subscription;

  constructor(
    private observationService: ObservationService,
    private gameStateService: GameStateService
  ) {
    this.gameStateSubscription = new Subscription();
    this.observerCountSubscription = new Subscription();
  }

  ngOnInit() {
    this.gameStateSubscription = this.gameStateService.gameState$.subscribe(
      state => this.gameState = state
    );

    this.observerCountSubscription = this.observationService.observerCount$.subscribe(
      count => this.observerCount = count
    );
  }

  ngOnDestroy() {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
    if (this.observerCountSubscription) {
      this.observerCountSubscription.unsubscribe();
    }
  }

  toggleObservation() {
    if (this.isObserving) {
      this.observationService.leaveObservation();
    } else {
      this.observationService.joinObservation();
    }
    this.isObserving = !this.isObserving;
  }
}
