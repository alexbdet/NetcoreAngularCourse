import { Component, OnInit } from '@angular/core';
import { faEnvelope, faEnvelopeOpen, faPaperPlane, faPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  pagination: Pagination;
  container = "Unread";
  pageNumber = 1;
  pageSize = 5;

  faEnvelope = faEnvelope;
  faEnvelopeOpen = faEnvelopeOpen;
  faEnvelopePlane = faPaperPlane;
  faTrash = faTrash;

  loaded = true;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(resetPagination = false) {
    this.loaded = false;

    if (resetPagination) this.pageNumber = 1;

    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;

      this.loaded = true;
    });
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  } 
}
