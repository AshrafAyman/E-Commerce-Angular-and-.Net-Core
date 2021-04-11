import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Sizes } from './size';

@Injectable({
  providedIn: 'root',
})
export class SizesService {
  baseUrl;
  constructor(private http: HttpClient, private router: Router) {
    this.baseUrl = '  https://www.emoji-store.com/api/Sizes';
  }
  PostSize(size: Sizes): Observable<any> {
    return this.http.post<string[]>(this.baseUrl, size);
  }
  GetSizes(): Observable<any> {
    return this.http.get<string[]>(this.baseUrl);
  }
  GetSizesById(id: Number): Observable<any> {
    return this.http.get<string[]>(this.baseUrl + '/' + id);
  }
  EditSize(id: Number, size: Sizes): Observable<any> {
    return this.http.put<string[]>(this.baseUrl + '/' + id, size);
  }
  async DeleteSize(id: Number): Promise<any> {
    return await this.http
      .delete<string[]>(this.baseUrl + '/' + id)
      .toPromise();
  }
}
