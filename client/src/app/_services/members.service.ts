import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrls.apiUrl;
  membersUrl = environment.apiUrls.membersUrl;

  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers() {
    if (this.members.length > 0)
      return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + this.membersUrl).pipe(
      map(members => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(username: string) {
    const member = this.members.find(m => m.username === username);

    if (member !== undefined)
      return of(member);

    return this.http.get<Member>(this.baseUrl + this.membersUrl + username);
  }

  updateMember(member: Member) {
    return this.http.put<Member>(this.baseUrl + this.membersUrl, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + this.membersUrl + 'set-main-photo/' + photoId, {}); // TODO Env var
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + this.membersUrl + 'delete-photo/' + photoId);
  }
}
