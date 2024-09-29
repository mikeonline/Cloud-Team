import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayerService, Player } from '../services/player.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-registration',
  template: `
    <div class="registration-container p-4 max-w-md mx-auto">
      <h2 class="text-2xl font-bold mb-4">Player Registration</h2>
      <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label for="name" class="block mb-1">Name:</label>
          <input type="text" id="name" formControlName="name" class="w-full p-2 border rounded">
          <div *ngIf="registrationForm.get('name')?.invalid && (registrationForm.get('name')?.dirty || registrationForm.get('name')?.touched)" class="text-red-500 mt-1">
            Name is required
          </div>
        </div>
        <div>
          <label for="email" class="block mb-1">Email:</label>
          <input type="email" id="email" formControlName="email" class="w-full p-2 border rounded">
          <div *ngIf="registrationForm.get('email')?.invalid && (registrationForm.get('email')?.dirty || registrationForm.get('email')?.touched)" class="text-red-500 mt-1">
            Valid email is required
          </div>
        </div>
        <button type="submit" [disabled]="registrationForm.invalid" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
          Register
        </button>
      </form>
    </div>
  `,
  styles: []
})
export class PlayerRegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    // Check if a player is already registered
    const currentPlayer = this.playerService.getPlayer();
    if (currentPlayer) {
      this.registrationForm.patchValue(currentPlayer);
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const player: Player = this.registrationForm.value;
      this.playerService.registerPlayer(player);
      this.router.navigate(['/game']);
    }
  }
}
