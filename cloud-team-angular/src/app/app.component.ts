import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PlayerRegistrationComponent } from './player-registration/player-registration.component';
import { GameComponent } from './game/game.component';
import { ObservationLoungeComponent } from './observation-lounge/observation-lounge.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PlayerRegistrationComponent,
    GameComponent,
    ObservationLoungeComponent
  ],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">Cloud Team</h1>
      
      <app-player-registration></app-player-registration>
      
      <div class="mt-8">
        <app-game></app-game>
      </div>
      
      <div class="mt-8">
        <app-observation-lounge></app-observation-lounge>
      </div>
    </div>

    <router-outlet></router-outlet>
  `,
  styles: [`
    /* You can add global styles here */
  `]
})
export class AppComponent {
  title = 'Cloud Team';
}
