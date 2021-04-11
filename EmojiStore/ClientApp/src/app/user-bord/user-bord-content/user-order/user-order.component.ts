import { CartServiceService } from './../../../cart-page/cart-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss']
})
export class UserOrderComponent implements OnInit {
  userId: string;
  orders: [];
  constructor(private cartService: CartServiceService) { }

  async ngOnInit(): Promise<void> {
    let userData = JSON.parse(localStorage.getItem('userData'));
    if (userData == null) {
      return;
    }
    this.userId = JSON.parse(localStorage.getItem('userData')).customer.userId;
    await this.cartService.getOrdersById(this.userId).then((orders) => {
      this.orders = orders;
    });
  }

}
