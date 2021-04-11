import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Washing } from './wash';
import { WashService } from './wash.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-admin-washing',
  templateUrl: './admin-washing.component.html',
  styleUrls: ['./admin-washing.component.scss'],
})
export class AdminWashingComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  washingTypes: [];
  washingTypeId;
  washingTypeTitle;
  washingTypeDesc;

  constructor(private washingService: WashService, private http: HttpClient) {}
  washingForm = new FormGroup({
    washingTitle: new FormControl('', Validators.required),
    washingDesc: new FormControl('', Validators.required),
  });
  get washingTitle() {
    return this.washingForm.get('washingTitle');
  }
  get washingDesc() {
    return this.washingForm.get('washingDesc');
  }
  ngOnInit(): void {
    this.dtOptions = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: true,
    };
    // this.washingService.GetWashingTypes().subscribe((e) => {
    //   this.washingTypes = e;
    // });
    this.getCategories()
  }
  saveCategory() {
    let model = new Washing();
    model.title = String($('#washingTitle').val());
    model.description = String($('#washingTips').val());
    this.washingService.PostWashingType(model).subscribe((e) => {
      this.reload();
    });
    this.CheckResult();
  }
  CheckResult() {
    Swal.fire('Washing Saved Successfully', '', 'success');
    this.resetControls();
  }
  editCategory(washing: Washing) {
    this.washingTypeId = washing.id;
    this.washingForm.setValue({
      washingTitle: washing.title,
      washingDesc: washing.description,
    });
    $('#save').hide();
    $('#edit').show();
  }

  async saveAfterEditCategory(): Promise<void> {
    let model = new Washing();
    model.id = this.washingTypeId;
    model.title = String($('#washingTitle').val());
    model.description = String($('#washingTips').val());

    this.washingService
      .EditWashingType(this.washingTypeId, model)
      .subscribe((e) => {
        this.reload();
      });
    this.CheckResult();
    $('#save').show();
    $('#edit').hide();
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
      await this.washingService.DeleteWashingType(id).then((e) => {
        this.reload();
      });
    });
  }
  async getCategories(): Promise<any> {
    this.washingService.GetWashingTypes().subscribe((e) => {
      this.washingTypes = e;
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
    this.washingTypeId = 0;
    $('#washingTitle').val('');
    $('#washingTips').val('');
  }
  async reload(): Promise<void> {
    await this.getCategories();
  }
}
