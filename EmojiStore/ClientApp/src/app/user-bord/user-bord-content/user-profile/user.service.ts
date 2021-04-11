import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeUserData } from './UserModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = "https://www.emoji-store.com/api/Auth/EditUser";
  constructor(private http: HttpClient) { }

  async EditUserData(user: ChangeUserData): Promise<any> {
    return await this.http.post(this.baseUrl, user).toPromise();
  }
}
