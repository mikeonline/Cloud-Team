import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { TimerComponent } from './timer/timer.component';
import { ScorePanelComponent } from './score-panel/score-panel.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { MessagePanelComponent } from './message-panel/message-panel.component';
import { PlayerRegistrationComponent } from './player-registration/player-registration.component';
import { ObservationLoungeComponent } from './observation-lounge/observation-lounge.component';

// Services
import { GameStateService } from './services/game-state.service';
import { TimerService } from './services/timer.service';
import { ScoreService } from './services/score.service';
import { MessageService } from './services/message.service';
import { PlayerService } from './services/player.service';
import { ObservationService } from './services/observation.service';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    TimerComponent,
    ScorePanelComponent,
    ControlPanelComponent,
    MessagePanelComponent,
    PlayerRegistrationComponent,
    ObservationLoungeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    GameStateService,
    TimerService,
    ScoreService,
    MessageService,
    PlayerService,
    ObservationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }