import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrls.apiUrl;
  membersUrl = environment.apiUrls.membersUrl;

  constructor(private http: HttpClient) { }

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + this.membersUrl);
  }

  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + this.membersUrl + username);
  }

  updateMember(member: Member){
    return this.http.put<Member>(this.baseUrl + this.membersUrl, member);
  }
}
