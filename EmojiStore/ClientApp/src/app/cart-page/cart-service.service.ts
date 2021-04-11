import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CheckoutViewModel } from './CheckoutViewModel';


@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  // baseUrl: string = '  https://www.emoji-store.com/api/Orders/PostOrder'
  baseUrl: string = '  https://www.emoji-store.com/api/Orders/PostCheckoutOrder'
  GetUserOrders: string = '  https://www.emoji-store.com/api/Orders/GetUserOrders'

  constructor(private http: HttpClient, private router: Router) { }

  async AddToCart(model: CheckoutViewModel): Promise<any> {
    return await this.http
      .post<CheckoutViewModel[]>(this.baseUrl, model)
      .toPromise();
  }
  async getOrdersById(id: string): Promise<any> {
    return await this.http.get(this.GetUserOrders + '?id=' + id).toPromise();
  }

}
