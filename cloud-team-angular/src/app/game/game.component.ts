import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameStateService, GameState } from '../services/game-state.service';
import { TimerService } from '../services/timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  template: `
    <div class="game-container p-4">
      <h1 class="text-2xl font-bold mb-4">Cloud Team Game</h1>
      <div class="flex justify-between mb-4">
        <app-timer></app-timer>
        <app-score-panel></app-score-panel>
      </div>
      
      <div *ngIf="!gameState.isGameActive" class="text-center">
        <button (click)="startGame()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Start Game
        </button>
      </div>

      <app-control-panel *ngIf="gameState.isGameActive"></app-control-panel>
      
      <div class="mt-4">
        <app-message-panel></app-message-panel>
      </div>

      <div *ngIf="gameState.isGameActive" class="mt-4 text-center">
        <button (click)="endGame()" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          End Game
        </button>
      </div>
    </div>
  `,
  styles: [`
    .game-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #f0f0f0;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class GameComponent implements OnInit, OnDestroy {
  gameState: GameState;
  private gameStateSubscription: Subscription;

  constructor(
    private gameStateService: GameStateService,
    private timerService: TimerService
  ) {}

  ngOnInit() {
    this.gameStateSubscription = this.gameStateService.gameState$.subscribe(
      state => {
        this.gameState = state;
        if (state.isGameActive && state.timeRemaining === 0) {
          this.endGame();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
  }

  startGame() {
    this.gameStateService.startGame();
    this.timerService.startTimer();
  }

  endGame() {
    this.gameStateService.endGame();
    this.timerService.stopTimer();
    // Here you can add logic to show the final score or navigate to a results page
  }
}
