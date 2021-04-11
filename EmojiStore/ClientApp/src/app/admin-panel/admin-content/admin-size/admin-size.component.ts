import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { promise } from 'protractor';
import { SizesService } from './sizes.service';
import { Sizes } from './size';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-admin-size',
  templateUrl: './admin-size.component.html',
  styleUrls: ['./admin-size.component.scss'],
})
export class AdminSizeComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  sizes: [];
  sizeId;
  sizeName;
  constructor(private sizeService: SizesService) { }
  sizingForm = new FormGroup({
    sizing: new FormControl('', Validators.required),
  });

  get sizing() {
    return this.sizingForm.get('sizing');
  }
  async ngOnInit(): Promise<any> {
    this.dtOptions = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: true,
    };
    this.getCategories()
  }

  saveCategory() {
    let size = new Sizes();
    size.name = $('#size-input').val();
    this.sizeService.PostSize(size).subscribe((e) => {
      this.reload();
    });
    this.CheckResult();
  }
  CheckResult() {
    Swal.fire('Size Saved Successfully', '', 'success');
    this.resetControls();
  }
  editCategory(size: Sizes) {
    this.sizeId = size.sizeId;

    this.sizingForm.setValue({
      sizing: size.name,
    });
    $('#save').hide();
    $('#edit').show();
  }
  saveAfterEditCategory() {
    let model = new Sizes();
    model.sizeId = this.sizeId;
    model.name = $('#size-input').val();
    this.sizeService.EditSize(this.sizeId, model).subscribe((e) => {
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
      await this.sizeService.DeleteSize(id).then((e) => {
        this.reload();
      });
    });
  }

  async getCategories() {
    this.sizeService.GetSizes().subscribe((e) => {
      this.sizes = e;
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
    this.sizeId = 0;
    $('#size-input').val('');
  }

  async reload(): Promise<void> {
    await this.getCategories();
  }
}
