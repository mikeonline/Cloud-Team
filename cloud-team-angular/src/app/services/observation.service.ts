import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservationService {
  private observerCountSubject = new BehaviorSubject<number>(0);
  observerCount$ = this.observerCountSubject.asObservable();

  constructor() {}

  joinObservation() {
    const currentCount = this.observerCountSubject.value;
    this.observerCountSubject.next(currentCount + 1);
    console.log('Observer joined. Total observers:', currentCount + 1);
  }

  leaveObservation() {
    const currentCount = this.observerCountSubject.value;
    if (currentCount > 0) {
      this.observerCountSubject.next(currentCount - 1);
      console.log('Observer left. Total observers:', currentCount - 1);
    }
  }

  getObserverCount() {
    return this.observerCountSubject.value;
  }
}