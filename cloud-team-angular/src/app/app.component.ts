import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
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
