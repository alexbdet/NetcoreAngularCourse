import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrls.apiUrl;
  membersUrl = environment.apiUrls.membersUrl;
  memberCache = new Map();

  members: Member[] = [];
  user: User;
  userParams: UserParams;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  getUserParams() { return this.userParams };
  setUserParams(params: UserParams) { this.userParams = params };
  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    var key = Object.values(userParams).join('-');
    var response = this.memberCache.get(key);

    if (response)
      return of(response);

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize)
      .append("minAge", userParams.minAge.toString())
      .append('maxAge', userParams.maxAge.toString())
      .append("gender", userParams.gender)
      .append("orderBy", userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + this.membersUrl, params, this.http)
      .pipe(map(res => {
        this.memberCache.set(key, res);
        return res;
      }));
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((m: Member) => m.username === username);

    if (member) return of(member);

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

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize)
      .append('predicate', predicate);

    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
  }

 
}
