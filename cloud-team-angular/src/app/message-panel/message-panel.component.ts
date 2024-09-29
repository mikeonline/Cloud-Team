import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-message-panel',
  template: `
    <div class="message-panel bg-gray-100 p-4 rounded">
      <h3 class="font-bold mb-2">Messages:</h3>
      <ul>
        <li *ngFor="let message of messages" class="mb-1">{{ message }}</li>
      </ul>
    </div>
  `,
  styles: [`
    .message-panel {
      max-height: 200px;
      overflow-y: auto;
    }
  `]
})
export class MessagePanelComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  private messageSubscription: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messageSubscription = this.messageService.messages$.subscribe(
      messages => this.messages = messages
    );
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
