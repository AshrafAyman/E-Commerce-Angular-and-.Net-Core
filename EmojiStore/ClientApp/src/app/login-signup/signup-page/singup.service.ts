import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterModel } from './singup';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginModel } from '../login-page/login-model';
@Injectable({
  providedIn: 'root'
})
export class SingupService {
  baseUrl: string = '  https://www.emoji-store.com/api/Auth/Register'
  loginUrl: string = '  https://www.emoji-store.com/api/Auth/Login'


  // baseUrl: string = '  https://www.emoji-store.com/api/Auth/Register'
  // loginUrl: string = '  https://www.emoji-store.com/api/Auth/Login'

  constructor(private http: HttpClient, private router: Router) { }

  async RegisterUser(user: RegisterModel): Promise<any> {
    // return this.http.post<string[]>(this.baseUrl, user)
    //   .pipe(
    //     tap(data => {

    //     }),
    //     catchError(this.handleError)
    //   );
    return await this.http.post<string[]>(this.baseUrl, user).toPromise();
  }

  async LoginUser(user: LoginModel): Promise<any> {
    // return this.http.post<string[]>(this.loginUrl, user)
    //   .pipe(
    //     tap(data => {
    //       if (data === null) {
    //         this.router.navigate(['ApiCallError']);
    //       }
    //     }),
    //     catchError(this.handleError)
    //   );
    return await this.http.post<RegisterModel>(this.loginUrl, user).toPromise();
  }

  private handleError(err: HttpErrorResponse) {
    // console and throw error
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
