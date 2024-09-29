import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GameState {
  score: number;
  timeRemaining: number;
  isGameActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private initialState: GameState = {
    score: 0,
    timeRemaining: 60,
    isGameActive: false
  };

  private gameStateSubject = new BehaviorSubject<GameState>(this.initialState);
  gameState$ = this.gameStateSubject.asObservable();

  constructor() { }

  startGame() {
    this.gameStateSubject.next({
      ...this.initialState,
      isGameActive: true
    });
  }

  updateScore(points: number) {
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      score: currentState.score + points
    });
  }

  updateTime(remainingTime: number) {
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      timeRemaining: remainingTime
    });
  }

  endGame() {
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      isGameActive: false
    });
  }
}
