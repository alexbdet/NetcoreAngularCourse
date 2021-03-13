import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;

  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  activeTab: TabDirective;
  messages: Message[];

  user: User;

  constructor(
    public presenceService: PresenceService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private accountService: AccountService) {
    accountService.currentUser$.pipe(take(1)).subscribe(u => this.user = u);
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
      this.galleryImages = this.getImages();
    });

    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    });

    this.galleryImages = this.getImages();
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
  }

  getImages(): NgxGalleryImage[] {
    return this.member.photos.map(photo => {
      return {
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      };
    });
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;

    if (this.activeTab.heading === "Messages" && !this.messages) {
      this.messageService.createHubConnection(this.user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  loadThread() {
    this.messageService.getMessageThread(this.member.username).subscribe(response => {
      this.messages = response;
    });
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }
}
