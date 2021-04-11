import { OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OrderModel } from './order';
import { OrderDetailViewModel } from './orderDetails';
import { OrdersService } from './orders.service';
import { RejectionViewModel } from './Rejection';
import Swal from 'sweetalert2';
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
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
})
export class AdminOrdersComponent implements OnInit,OnDestroy {
  waitingOrders: OrderModel[];
  acceptedOrders: OrderModel[];
  rejectedOrders: OrderModel[];

  
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  // dtElement: DataTableDirective;
  dtOptions: any = {};
  dtOptions2: any = {};
  dtOptions3: any = {};
  dtInstance: DataTables.Api;
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  dtTrigger3: Subject<any> = new Subject();


  constructor(private ordersServices: OrdersService) {}

  ngOnInit(): void {
    this.dtOptions = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: true,
      searching:false,
      ordering: false
    };
    this.dtOptions2 = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: true,
      searching:false,
      ordering: false
    };
    this.dtOptions3 = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: true,
      searching:false,
      ordering: false
    };
    this.Reload().then(e=>{
      this.dtTrigger.next();
      this.dtTrigger2.next();
      this.dtTrigger3.next();
    })
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  async GetWaitingOrders() : Promise<any>{
    this.waitingOrders = await this.ordersServices.GetWaitingOrders();
    console.log(this.waitingOrders)
  }

  async GetAcceptedOrders(): Promise<any> {
    this.acceptedOrders = await this.ordersServices.GetAcceptedOrders();
  }

  async GetRejectedOrders(): Promise<any> {
    this.rejectedOrders = await this.ordersServices.GetRejectedOrders();
  }
  async AcceptOrder(id: Number) {
    await this.ordersServices.AcceptOrders(id).then((e) => {
      this.Reload();
    });
    Swal.fire('Order Accepted', '', 'success');
  }
  async RejectOrder(id: Number) {
    let model = new RejectionViewModel();
    model.id = id;
    model.reason = $('#rejectReason').val();
    let result = await this.ordersServices.RejectOrders(model).then((e) => {
      this.Reload();
    });
    Swal.fire('Order Rejected', '', 'success');
  }
  async Reload() {
    $('#rejectReason').val('');
    await this.GetWaitingOrders().then(async (e)=>{
      await this.GetAcceptedOrders().then(async (e)=>{
        await this.GetRejectedOrders().then((e)=>{
          // $(".table").DataTable().destroy();
          // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   dtInstance.destroy();
          //   this.dtTrigger.next();
          //   this.dtTrigger2.next();
          //   this.dtTrigger3.next();
          // });
      });
    });
  });
   
    
    // this.dtTrigger.next();
    
  }
}
