import { CategoryServiceService } from './../admin-category/category-service.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Category } from './../admin-category/Category';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { promise } from 'protractor';
import { ShippingService } from './shipping.service';
import { Shipping } from './shipping';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-admin-shipping',
  templateUrl: './admin-shipping.component.html',
  styleUrls: ['./admin-shipping.component.scss'],
})
export class AdminShippingComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  shippings:Shipping [];
  shippingId;
  shippingName;
  constructor(
    private shippingSerivce: ShippingService,
    private http: HttpClient
  ) {}

  shippingForm = new FormGroup({
    shipping: new FormControl('', Validators.required),
  });

  get shipping() {
    return this.shippingForm.get('shipping');
  }
  ngOnInit(): void {
    this.dtOptions = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: true,
    };
    this.getCategories()
    // this.shippingSerivce.GetShipping().subscribe((e) => {
    //   this.shippings = e;
    //   this.dtTrigger.next();
    //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //     dtInstance.destroy();
    //     this.dtTrigger.next();
    //   });
    // });
  }
  async saveCategory(): Promise<void> {
    let model = new Shipping();
    model.name = $('#shipping-input').val();

    this.shippingSerivce.PostShipping(model).subscribe((e) => {
      this.reload();
    });
    this.CheckResult();
    this.resetControls();
  }
  CheckResult() {
    Swal.fire('Shipping Saved Successfully', '', 'success');
  }
  editCategory(shipping: Shipping) {
    this.shippingId = shipping.id;
    this.shippingForm.setValue({
      shipping: shipping.name,
    });

    $('#save').hide();
    $('#edit').show();
  }
  async saveAfterEditCategory(): Promise<void> {
    let model = new Shipping();
    model.id = this.shippingId;
    model.name = $('#shipping-input').val();

    this.shippingSerivce.EditShipping(this.shippingId, model).subscribe((e) => {
      this.reload();
    });
    $('#save').show();
    $('#edit').hide();
    this.resetControls();
    this.CheckResult();
  }

  async deleteCategory(id: Number): Promise<void> {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
      await this.shippingSerivce.DeleteShipping(id).then((e) => {
        this.reload();
      });
    });
  }

  async getCategories(): Promise<any> {
    this.shippingSerivce.GetShipping().subscribe((e) => {
      this.shippings = e;
      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true;
        this.dtTrigger.next();
      }
    });
  }

  resetControls(): void {
    this.shippingId = 0;
    $('#shipping-input').val('');
  }

  async reload(): Promise<void> {
    await this.getCategories();
  }
}
