import { CategoryServiceService } from './../admin-category/category-service.service';
import { ProductService } from './../admin-product/product.service';
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Product } from './../admin-product/Product';
import { Category } from '../admin-category/Category';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { Offer } from './offer';
declare var $: any;
declare var jQuery: any;
(function () {
  'use strict';
  window.addEventListener(
    'load',
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust()
  );
});
@Component({
  selector: 'app-admin-offer',
  templateUrl: './admin-offer.component.html',
  styleUrls: ['./admin-offer.component.scss'],
})
export class AdminOfferComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  productId: number;
  products: Product[];

  @Output() public onUploadFinished = new EventEmitter();

  constructor(
    private productSerivce: ProductService,
    private CategoryService: CategoryServiceService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}
  offerForm = new FormGroup({
    offerPrice: new FormControl('', Validators.required),
  });
  get offerPrice() {
    return this.offerForm.get('offerPrice');
  }
  async ngOnInit(): Promise<any> {
    this.dtOptions = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: true,
    };
    //this.products = await this.productSerivce.getProduct();
    this.getProduct()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  setOffer(product: Product): void {
    $('#productName').val(product.productName);
    this.productId = product.productId;
    $('#productPrice').val(product.productPrice);
    this.offerForm.setValue({
      offerPrice: product.offerPrice,
    });
  }
  async saveAfterEditProduct(): Promise<void> {
    let offer = new Offer();
    offer.productId = this.productId;
    offer.offerPrice = Number($('#offerPrice').val());
    this.productSerivce.setOffers(offer).then((e) => {
      this.reload();
    });
    this.CheckResult();
  }
  CheckResult() {
    Swal.fire('Offer Saved Successfully', '', 'success');
    this.productId = 0;
    this.resetControls();
  }
  async deleteProduct(id: Number): Promise<void> {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't to delete this offer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your offer has been deleted.', 'success');
      }
      await this.productSerivce.deleteOffers(id).then((e) => {
        this.reload();
      });
    });
  }
  async getProduct(): Promise<any> {
    let resualt = await this.productSerivce.getProduct();
    // resualt.subscribe(
    //   (data) => { },
    //   (error1) => { }
    // );
    this.products=resualt;
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
  }
  resetControls(): void {
    $('#productName').val('');
    this.productId = 0;
    $('#productPrice').val('');
    $('#offerPrice').val('');
  }
  async reload(): Promise<void> {
   // this.products = await this.productSerivce.getProduct();
   this.getProduct();
  }
}
