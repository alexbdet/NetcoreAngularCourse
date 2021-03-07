import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrls.apiUrl;
  membersUrl = environment.apiUrls.membersUrl;

  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers(userParams: UserParams) {
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize)
      .append("minAge", userParams.minAge.toString())
      .append('maxAge', userParams.maxAge.toString())
      .append("gender", userParams.gender)
      .append("orderBy", userParams.orderBy);

    return this.getPaginatedResult<Member[]>(this.baseUrl + this.membersUrl, params);
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

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;

        if (response.headers.get("Pagination") !== null)
          paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));

        return paginatedResult;
      }));
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    return new HttpParams()
      .append('pageNumber', pageNumber.toString())
      .append('pageSize', pageSize.toString());
  }
}
