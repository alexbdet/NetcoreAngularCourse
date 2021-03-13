import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrls.apiUrl;
  accountUrl = environment.apiUrls.accountUrl;

  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presenceService: PresenceService) { }

  login(model: any) {
    return this.http
      .post(this.baseUrl + this.accountUrl + 'login', model)
      .pipe(map((response: User) => this.setUserToStorage(response, true)));
  }

  register(model: any) {
    return this.http
      .post(this.baseUrl + this.accountUrl + 'register', model)
      .pipe(map((response: User) => this.setUserToStorage(response, true)));
  }

  setCurrentUser(user: User) {
    this.setUserToStorage(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  private setUserToStorage(user: User, setPresence = false) {
    if (user) {
      user.roles = [];
      const roles = this.getDecodedToken(user.token).role;
      Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);

      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSource.next(user);
      
      if (setPresence)
        this.presenceService.createHubConnection(user);
    }

    return user;
  }

  // Retrieves the payload from a JWT token
  getDecodedToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
