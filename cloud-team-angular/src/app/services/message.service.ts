import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messagesSubject = new BehaviorSubject<string[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor() {}

  addMessage(message: string) {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  clearMessages() {
    this.messagesSubject.next([]);
  }
}