import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MessageService } from '../../core/services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  messages: Message[] = [];
  message: Message = new Message('', 'draft');

  constructor(private router: Router, private messageService: MessageService){}

  async ngOnInit() {
    // Get All Messages
    this.getMessages();
  }

  getMessages() {
    this.messageService.getMessages().subscribe(res => {
      this.messages = res;
      for (let i = 0; i < this.messages.length; i++) {
        this.messages[i].status = 'sent';
      }      
    }, error => {
      console.error('Login failed', error);
      // Handle login error
    });
  }

  async onSubmit() {
    this.message.status = 'pending';
    this.messageService.createMessage({ 
      message: this.message.message
    }).subscribe(res => {
      res._id ? this.message.status = 'sent' : this.message.status = 'failed';
      this.messages.push(this.message);

      this.message = new Message('', 'draft');
    }, error => {
      console.error('Login failed', error);
      // Handle login error
    });
  }

}


export class Message {
  message;
  status: string;
  constructor(message: string, status: string) {
    this.message = message;
    this.status = status;
  }

  empty() {
    return this.message === '';
  }
}