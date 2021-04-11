import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Washing } from './wash';
@Injectable({
  providedIn: 'root',
})
export class WashService {
  baseUrl = '  https://www.emoji-store.com/api/Washing';
  constructor(private http: HttpClient) { }
  PostWashingType(wash: Washing): Observable<any> {
    return this.http.post<string[]>(this.baseUrl, wash);
  }
  GetWashingTypes(): Observable<any> {
    return this.http.get<string[]>(this.baseUrl);
  }
  GetWashingTypeById(id: Number): Observable<any> {
    return this.http.get<string[]>(this.baseUrl + '/' + id);
  }
  EditWashingType(id: Number, wash: Washing): Observable<any> {
    return this.http.put<string[]>(this.baseUrl + '/' + id, wash);
  }
  async DeleteWashingType(id: Number): Promise<any> {
    return await this.http
      .delete<string[]>(this.baseUrl + '/' + id)
      .toPromise();
  }
}
