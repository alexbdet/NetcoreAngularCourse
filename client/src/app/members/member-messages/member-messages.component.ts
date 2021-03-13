import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild("messageInput") message: ElementRef;
  @Input() username: string;

  messages: Message[];
  messageContent: string;

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.messageThread$.subscribe(res => {
      setTimeout(() => { // this will make the execution after the above boolean has changed
        this.message.nativeElement.focus();
        window.scrollTo(0, document.body.scrollHeight);
      }, 0);
    });
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageContent = "";
    });
  }

}
