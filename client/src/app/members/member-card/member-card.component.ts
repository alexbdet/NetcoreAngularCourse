import { Component, Input, OnInit } from '@angular/core';
import { faEnvelope, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() member: Member;

  faUser = faUser;
  faHeart = faHeart;
  faEnvelope = faEnvelope;

  constructor(private membersService: MembersService, private toastrService: ToastrService) { }

  ngOnInit(): void { }

  addLike(member: Member) {
    this.membersService.addLike(member.username)
      .subscribe(() => {
        this.toastrService.success("You have liked " + member.knownAs);
      });
  }

}
