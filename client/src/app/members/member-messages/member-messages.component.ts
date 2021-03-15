import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild("messageInput") message: ElementRef;
  @Input() username: string;

  messages: Message[];
  messageContent: string;
  loading = false;

  constructor(public messageService: MessageService) { }

  ngOnInit(): void { }

  sendMessage() {
    this.loading = true;
    this.messageService.sendMessage(this.username, this.messageContent)
      .then(() => {
        this.messageContent = "";
      })
      .finally(() => this.loading = false);
  }
}
