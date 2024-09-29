import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timerSubject = new BehaviorSubject<number>(60);
  timer$ = this.timerSubject.asObservable();

  private timerSubscription: Subscription | null = null;

  constructor(private gameStateService: GameStateService) {}

  startTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubject.next(60);
    this.timerSubscription = interval(1000).subscribe(() => {
      const currentTime = this.timerSubject.value;
      if (currentTime > 0) {
        this.timerSubject.next(currentTime - 1);
        this.gameStateService.updateTime(currentTime - 1);
      } else {
        this.stopTimer();
      }
    });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  resetTimer() {
    this.timerSubject.next(60);
    this.gameStateService.updateTime(60);
  }
}
