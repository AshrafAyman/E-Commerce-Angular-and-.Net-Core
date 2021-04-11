import { Product } from './../admin-panel/admin-content/admin-product/Product';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartServiceService } from './cart-service.service';
import { TranslateService } from '@ngx-translate/core';
import { CartbadgeService } from '../_services/cartbadge.service';
import { CheckoutViewModel } from './CheckoutViewModel';
import { CheckoutDetailViewModel } from './CheckoutDetailViewModel';
import Swal from 'sweetalert2';
import { ShippingService } from '../admin-panel/admin-content/admin-shipping/shipping.service';
import { FormBuilder, Validators } from '@angular/forms';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {
  constructor(
    public translate: TranslateService,
    private cartService: CartServiceService,
    private sharedService: CartbadgeService,
    private route: Router,
    private shippingService: ShippingService,
    private fb: FormBuilder,
  ) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
  }
  anonymousRegisterUser = this.fb.group({
    phone: ['', [Validators.required]],
    userName: ['', [Validators.required]],
    address: ['', [Validators.required]],
  });
  get phone() {
    return this.anonymousRegisterUser.get('phone');
  }
  get userName() {
    return this.anonymousRegisterUser.get('userName');
  }
  get address() {
    return this.anonymousRegisterUser.get('address');
  }
  total: number;
  shippingValue: number;
  shippingValue2: number;
  products: [];
  ngOnInit(): void {
    $('.arabicFont').addClass('makeItRight4');

    this.shippingService.GetShipping().subscribe((res) => {
      this.shippingValue = parseFloat(res[0].name);
      this.shippingValue2 = parseFloat(res[0].name);
      this.reloadCart();
    });

    this.changeLang('ar');
  }
  imgSelect: string[];
  DeleteFromCart(id: Number) {
    var arrayFromStroage = JSON.parse(localStorage.getItem('allProducts'));
    if (arrayFromStroage == null) {
      return;
    }
    var productsArray = arrayFromStroage;
    productsArray = productsArray.filter(function (obj) {
      return obj.id !== id;
    });
    localStorage.setItem('allProducts', JSON.stringify(productsArray));
    var arrayFromStroage = JSON.parse(localStorage.getItem('allProducts'));
    var arrayLength = arrayFromStroage.length;
    $('.badgeSpan').text(arrayLength);
    this.reloadCart();
  }
  changeLang(value) {
    this.translate.use(value);
    if (value == 'en') {
      $('.arabicFont').remove('makeItRight4');
    } else {
      this.imgSelect = ['./assets/img/7ar.svg'];
      $('.arabicFont').addClass('makeItRight4');
    }
  }
  IncrementQuantity(id: Number) {
    let arrayFromStroage = JSON.parse(localStorage.getItem('allProducts'));
    let index = arrayFromStroage.findIndex((obj) => obj.id == id);
    arrayFromStroage[index].quantity = arrayFromStroage[index].quantity + 1;
    arrayFromStroage[index].total =
      arrayFromStroage[index].quantity * arrayFromStroage[index].productPrice;
    localStorage.setItem('allProducts', JSON.stringify(arrayFromStroage));
    this.reloadCart();
  }
  DecrementQuantity(id: Number) {
    let arrayFromStroage = JSON.parse(localStorage.getItem('allProducts'));
    let index = arrayFromStroage.findIndex((obj) => obj.id == id);
    arrayFromStroage[index].quantity = arrayFromStroage[index].quantity - 1;
    arrayFromStroage[index].total =
      arrayFromStroage[index].quantity * arrayFromStroage[index].productPrice;
    if (arrayFromStroage[index].quantity < 1) {
      arrayFromStroage[index].quantity = 1;
      arrayFromStroage[index].total =
        arrayFromStroage[index].quantity * arrayFromStroage[index].productPrice;
    }
    localStorage.setItem('allProducts', JSON.stringify(arrayFromStroage));
    this.reloadCart();
  }

  async CheckOut() {
    let userData = JSON.parse(localStorage.getItem('userData'));
    if (userData == null) {
      ///Swal.fire('Please Log In First', '', 'error');
      // alert("plz log in");
      $('#exampleModalCenter').modal('show');
      return;
    }

    let total = 0;
    let details = [];
    let count = 0;
    let arrayFromStroage = JSON.parse(localStorage.getItem('allProducts'));

    if (
      arrayFromStroage == null ||
      arrayFromStroage.length == 0 ||
      arrayFromStroage == undefined
    ) {
      return;
    }
    for (let index = 0; index < arrayFromStroage.length; index++) {
      const element = arrayFromStroage[index];
      total = total + element.total;
      count = count + element.quantity;

      let detail = new CheckoutDetailViewModel();
      detail.total = element.total;
      detail.qty = element.quantity;
      detail.price = element.productPrice;
      detail.productId = element.productId;
      detail.size=element.size;
      detail.orderId = 0;
      detail.orderDetailId = 0;
      details.push(detail);
    }

    let model = new CheckoutViewModel();
    model.customerId = JSON.parse(
      localStorage.getItem('userData')
    ).customer.userId;
    model.orderCount = count;
    model.orderDate = new Date();
    model.orderTotal = total;
    model.orderState = 1;
    model.orderTotalNet = total + this.shippingValue;
    model.orderNo = 0;
    model.orderDetails = details;
    model.isDelete = false;
    model.orderStateDate = new Date();

    localStorage.setItem('allProducts', JSON.stringify([]));
    $('.badgeSpan').text(0);
    Swal.fire('Order Done', '', 'success');
    this.reloadCart();
    await this.cartService.AddToCart(model);

  }

  async CheckOutWithoutLogin() {
    let total = 0;
    let details = [];
    let count = 0;
    let arrayFromStroage = JSON.parse(localStorage.getItem('allProducts'));

    if (
      arrayFromStroage == null ||
      arrayFromStroage == [] ||
      arrayFromStroage == undefined
    ) {
      return;
    }
    for (let index = 0; index < arrayFromStroage.length; index++) {
      const element = arrayFromStroage[index];
      total = total + element.total;
      count = count + element.quantity;

      let detail = new CheckoutDetailViewModel();
      detail.total = element.total;
      detail.qty = element.quantity;
      detail.price = element.productPrice;
      detail.productId = element.productId;
      detail.size=element.size;
      detail.orderId = 0;
      detail.orderDetailId = 0;
      details.push(detail);
    }

    let model = new CheckoutViewModel();
    // model.customerId = JSON.parse(
    //   localStorage.getItem('userData')
    // ).customer.userId;
    model.orderCount = count;
    model.orderDate = new Date();
    model.orderTotal = total;
    model.orderState = 1;
    model.orderTotalNet = total + this.shippingValue;
    model.orderNo = 0;
    model.orderDetails = details;
    model.isDelete = false;
    model.orderStateDate = new Date();
    model.address = $("#address").val();
    model.phone = $("#phone").val();
    model.customerName = $("#userName").val();

    localStorage.setItem('allProducts', JSON.stringify([]));
    $('.badgeSpan').text(0);
    Swal.fire('Order Done', '', 'success');
    this.reloadCart();
    await this.cartService.AddToCart(model);


  }
  reloadCart() {
    var arrayFromStroage = JSON.parse(localStorage.getItem('allProducts'));
    if (arrayFromStroage == null || arrayFromStroage.length == 0) {
      this.products = [];
      this.shippingValue = 0;
      this.total = 0;
      return;
    } else {
      this.shippingValue = this.shippingValue2;

    }
    this.products = arrayFromStroage;
    this.total = 0;
    for (let i = 0; i < arrayFromStroage.length; i++) {
      const element = arrayFromStroage[i];
      this.total = this.total + element.total;
    }
    this.total = this.total + this.shippingValue;

  }
}
