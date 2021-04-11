import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Shipping } from './shipping';
@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  baseUrl = 'https://www.emoji-store.com/api/Shipping';
  constructor(private http: HttpClient) {}
  PostShipping(shipping: Shipping): Observable<any> {
    return this.http.post<string[]>(this.baseUrl, shipping);
  }
  GetShipping(): Observable<any> {
    return this.http.get<string[]>(this.baseUrl);
  }
  GetShippingById(id: Number): Observable<any> {
    return this.http.get<string[]>(this.baseUrl + '/' + id);
  }
  EditShipping(id: Number, shipping: Shipping): Observable<any> {
    return this.http.put<string[]>(this.baseUrl + '/' + id, shipping);
  }
  async DeleteShipping(id: Number): Promise<any> {
    return await this.http
      .delete<string[]>(this.baseUrl + '/' + id)
      .toPromise();
  }
}
