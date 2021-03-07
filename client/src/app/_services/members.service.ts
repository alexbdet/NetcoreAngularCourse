import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrls.apiUrl;
  membersUrl = environment.apiUrls.membersUrl;
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers(page?: number, itemsPerPage?: number) {
    let params = new HttpParams();

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString()).append('pageSize', itemsPerPage.toString());
    }

    return this.http.get<Member[]>(this.baseUrl + this.membersUrl, { observe: 'response', params }).pipe(
      map(response => {
        this.paginatedResult.result = response.body;

        if (response.headers.get("Pagination") !== null)
          this.paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));

        return this.paginatedResult;
      }));
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
