import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Player {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playerSubject = new BehaviorSubject<Player | null>(null);
  player$ = this.playerSubject.asObservable();

  constructor() {
    // Check if there's a player stored in localStorage
    const storedPlayer = localStorage.getItem('player');
    if (storedPlayer) {
      this.playerSubject.next(JSON.parse(storedPlayer));
    }
  }

  registerPlayer(player: Player) {
    this.playerSubject.next(player);
    // Store player in localStorage for persistence
    localStorage.setItem('player', JSON.stringify(player));
  }

  getPlayer(): Player | null {
    return this.playerSubject.value;
  }

  clearPlayer() {
    this.playerSubject.next(null);
    localStorage.removeItem('player');
  }
}