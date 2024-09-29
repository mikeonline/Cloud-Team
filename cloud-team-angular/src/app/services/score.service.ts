import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private scoreSubject = new BehaviorSubject<number>(0);
  score$ = this.scoreSubject.asObservable();

  constructor(private gameStateService: GameStateService) {
    this.gameStateService.gameState$.subscribe(state => {
      if (!state.isGameActive) {
        this.resetScore();
      }
    });
  }

  updateScore(points: number) {
    const currentScore = this.scoreSubject.value;
    const newScore = currentScore + points;
    this.scoreSubject.next(newScore);
    this.gameStateService.updateScore(newScore);
  }

  resetScore() {
    this.scoreSubject.next(0);
  }
}
