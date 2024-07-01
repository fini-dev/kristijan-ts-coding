import {Component, Injectable, Input, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Injectable()
class MessageService {
  messages: Message[] = [];

  async all() {
      const res = await fetch('http://127.0.0.1:3000/messages')
      const data = await res.json();

      this.messages = data.messages.map((message: any) => new Message(message.text, message.status));
  }

  async add(message: Message) {
    this.messages.push(message);
  }
}

class Message {
  text;
  status: string;
  constructor(message: string, status: string) {
    this.text = message;
    this.status = status;
  }

  empty() {
    return this.text === '';
  }
}

@Component({
  selector: 'app-massage',
  standalone: true,
  template: `
    <div style="background-color: #fff;">
      <span class="bg-slate-400" class="block bg-slate-200 text-slate-500">#{{no}} - {{ message.status }}</span>
      <div class="p-2" [ngClass]="{'text-slate-500': message.status === 'draft'}">
        {{message.text}}
      </div>
    </div>
  `,
  imports: [
    NgClass
  ]
})
class MessageComponent {
  @Input({ required: true }) message: any;
  @Input() no: any;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  providers: [MessageService],
  imports: [
    NgForOf,
    MessageComponent
  ],
  template: `
    <div>
      <div *ngFor="let message of messages; index as i;">
        <app-massage [message]="message" [no]="i"></app-massage>
      </div>
    </div>
  `,
})
class ChatComponent implements OnInit {
  messages: Message[] = [];
    constructor(
        private messageService: MessageService
    ) {

    }

    async ngOnInit() {
      // @ts-ignore
      await this.messageService.all();
      this.messages = this.messageService.messages;
    }
}

@Component({
  selector: 'app-create-message',
  standalone: true,
  providers: [MessageService],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MessageComponent,
    NgIf,
    NgClass,
  ],
  template: `
    <div *ngIf="! message.empty()">
      <app-massage [message]="message" no="preview"></app-massage>
    </div>
    <form (ngSubmit)="onSubmit()">
      <label class="mt-4">
        <div>Write Message</div>
        <textarea class="block w-full" required name="text" [(ngModel)]="message.text"></textarea>
      </label>

      <button type="submit"
          [disabled]="message.status === 'pending'"
          class="pointer bg-blue-400 py-2 px-4 mt-2 w-full"
          [ngClass]="{'bg-gray-400': message.status === 'pending'}"
      >Send</button>
    </form>
  `,
  styles: ``
})
class CreateMessageComponent {
  message: Message = new Message('', 'draft');
  private messageService: MessageService;

  constructor(messageService: MessageService) {
    this.messageService = messageService;
  }

  async onSubmit() {
      this.message.status = 'pending';
      const res = await fetch('http://127.0.0.1:3000/messages/send', {
        method: 'GET',
        body: JSON.stringify({text: this.message.text}),
      });
      res.status === 204 ? this.message.status = 'sent' : this.message.status = 'failed';
      await this.messageService.add(this.message);
      this.message = new Message('', 'draft');
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
      ChatComponent,
      CreateMessageComponent
  ],
  template: `
    <div class="max-w-md mx-auto">
      <h1 class="text-2xl my-8">{{ title }}</h1>
      <app-chat></app-chat>
      <app-create-message></app-create-message>
    </div>
  `,
})
export class AppComponent {
  title = 'Chat';
}
