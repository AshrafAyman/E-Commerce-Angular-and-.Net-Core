import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderModel } from './order';
import { RejectionViewModel } from './Rejection';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl = "  https://www.emoji-store.com/api/Orders"
  acceptOrders = "  https://www.emoji-store.com/api/Orders/AcceptOrders"
  rejectOrders = "  https://www.emoji-store.com/api/Orders/RejectOrders"
  constructor(private http: HttpClient) { }

  async GetWaitingOrders(): Promise<any> {
    return await this.http.get<OrderModel[]>(this.baseUrl + "/" + "GetWaitingOrders").toPromise();
  }
  async GetAcceptedOrders(): Promise<any> {
    return await this.http.get<OrderModel[]>(this.baseUrl + "/" + "GetAcceptedOrders").toPromise();
  }
  async GetRejectedOrders(): Promise<any> {
    return await this.http.get<OrderModel[]>(this.baseUrl + "/" + "GetRejectedOrders").toPromise();
  }
  async AcceptOrders(id: Number): Promise<any> {
    return await this.http.get<OrderModel[]>(this.acceptOrders + "/" + id).toPromise();
  }
  async RejectOrders(model: RejectionViewModel): Promise<any> {
    return await this.http.post<OrderModel[]>(this.rejectOrders, model).toPromise();
  }
}
