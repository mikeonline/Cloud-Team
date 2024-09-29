import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimerService } from '../services/timer.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="timer-container">
      <span class="timer-label">Time Remaining:</span>
      <span class="timer-value">{{ timeRemaining | number: '2.0-0' }}</span>
    </div>
  `,
  styles: [`
    .timer-container {
      display: flex;
      align-items: center;
      font-size: 1.2rem;
      font-weight: bold;
    }
    .timer-label {
      margin-right: 0.5rem;
    }
    .timer-value {
      background-color: #333;
      color: #fff;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
  `]
})
export class TimerComponent implements OnInit, OnDestroy {
  timeRemaining: number = 60;
  private timerSubscription: Subscription | null = null;

  constructor(private timerService: TimerService) {}

  ngOnInit() {
    this.timerSubscription = this.timerService.timer$.subscribe(
      time => this.timeRemaining = time
    );
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
