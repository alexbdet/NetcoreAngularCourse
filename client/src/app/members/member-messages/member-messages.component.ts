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
  @Input() messages: Message[];
  @Input() username: string;

  messageContent: string;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).subscribe(res => {
      this.messages.push(res);
      this.messageContent = "";

      setTimeout(() => { // this will make the execution after the above boolean has changed
        this.message.nativeElement.focus();
        window.scrollTo(0, document.body.scrollHeight);
      }, 0);
    });
  }

}
