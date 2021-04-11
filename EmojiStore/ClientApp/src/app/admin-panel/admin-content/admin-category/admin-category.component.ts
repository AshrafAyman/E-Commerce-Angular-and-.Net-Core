import { CategoryServiceService } from './category-service.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Category } from './Category';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { promise } from 'protractor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss'],
})
export class AdminCategoryComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  CategoryName: string;
  CategoryId = 0;
  categories: Category[];
  fileToUpload: File = null;
  imageUrl;
  imageName;
  imageBase64;
  imageId;
  imageType;
  base64;

  categoryForm = new FormGroup({
    categoryName: new FormControl('', Validators.required),
  });
  constructor(
    private categorySerivce: CategoryServiceService,
    private http: HttpClient
  ) {}
  get categoryName() {
    return this.categoryForm.get('categoryName');
  }

  async ngOnInit(): Promise<any> {
    this.dtOptions = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: true,
    };
    //this.categories = await this.categorySerivce.getCategories();
    this.getCategories()
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  async handleFileInput(file: FileList) {
    $('#image').removeAttr('src');
    this.fileToUpload = file.item(0);
    this.imageName = file.item(0).name;
    let result = await this.getBase64(this.fileToUpload);
    this.imageBase64 = result;
    this.imageUrl = this.modifiyBase64(result);
    this.imageType = this.fileToUpload.type;
    $('#imageContainer').show();
  }

  //  async handleFileInput(file: FileList) {
  //     $('#image').removeAttr('src');​
  //     this.fileToUpload = file.item(0);
  //     this.imageName = file.item(0).name;

  //     // //Show image preview
  //    var reader = new FileReader();
  //    reader.onload = (event: any) => {
  //      this.imageUrl = event.target.result;
  //    };
  //    reader.readAsDataURL(this.fileToUpload);
  //     $('#imageContainer').show();
  //    let result= await this.getBase64(this.fileToUpload);
  //    this.imageUrl=result;
  //    document.getElementById('image').setAttribute('src',this.imageUrl);
  //}

  getBase64(file): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  modifiyBase64(str: any): any {
    let modifiedStr;
    if (str.includes('data:image/png;base64,')) {
      modifiedStr = str.replace('data:image/png;base64,', '');
      return modifiedStr;
    }
    if (str.includes('data:image/jpg;base64,')) {
      modifiedStr = str.replace('data:image/jpg;base64,', '');
      return modifiedStr;
    }
    if (str.includes('data:image/jpeg;base64,')) {
      modifiedStr = str.replace('data:image/jpeg;base64,', '');
      return modifiedStr;
    }
  }

  GetFileExtension(base64String: any): any {
    var data = base64String.substring(0, 5);
    switch (data.toUpperCase()) {
      case 'IVBOR':
        return '.png';
      case '/9J/4':
        return '.jpg';
      case 'AAAAF':
        return '.mp4';
      case 'JVBER':
        return '.pdf';
      case 'AAABA':
        return '.ico';
      case 'UMFYI':
        return '.rar';
      case 'E1XYD':
        return '.rtf';
      case 'U1PKC':
        return '.txt';
      case 'MQOWM':
      case '77U/M':
        return '.srt';
      default:
        return '';
    }
  }

  public checkMandtoryInputs(): boolean {
    if (
      this.imageUrl != '' &&
      this.imageUrl != null &&
      this.imageUrl != undefined
    ) {
      return true;
    }
    return false;
  }
  CheckResult() {
    Swal.fire('Category Saved Successfully', '', 'success');
    this.resetControls();
    $('#imageContainer').hide();
  }
  async saveCategory(): Promise<void> {
    if (this.checkMandtoryInputs()) {
      this.imageUrl = await this.getBase64(this.fileToUpload);
      let newCategory = new Category();
      newCategory.categoryName = $('#categoryName').val();
      newCategory.imageBase64 = String(this.imageUrl);
      this.categorySerivce.saveCategory(newCategory).then((e) => {
        this.reload();
      });
      this.CheckResult();
      // if (resualt == true) {
      //   Swal.fire('Category Saved Successfully', '', 'success');
      //   this.resetControls();
      //   this.reload();
      //   $('#imageContainer').hide();
      // } else {
      //   Swal.fire('Failed to Save Category', '', 'error');
      // }
    } else {
      Swal.fire('Failed to Save Category plz check mandtory data', '', 'error');
      $('#imageValidation').show();
    }
  }

  async editCategory(category: Category): Promise<void> {
    this.categoryForm.setValue({
      categoryName: category.categoryName,
    });
    this.CategoryId = category.categoryId;
    this.imageUrl = category.image;
    this.imageType = category.type;
    $('#imageContainer').show();
    $('#save').hide();
    $('#edit').show();
  }

  async saveAfterEditCategory(): Promise<void> {
    let editedCategory = new Category();
    editedCategory.categoryName = $('#categoryName').val();
    editedCategory.categoryId = this.CategoryId;
    editedCategory.imageBase64 = this.imageBase64;
    if (this.checkMandtoryInputs()) {
      this.categorySerivce
        .editCategory(editedCategory, editedCategory.categoryId)
        .then((e) => {
          this.reload();
        });
      this.CheckResult();
      // if (resualt == true) {
      //   Swal.fire('Category Saved Successfully', '', 'success');
      //   $('#edit').hide();
      //   $('#save').show();
      //   this.resetControls();
      //   this.reload();
      //   $('#imageContainer').hide();
      // } else {
      //   Swal.fire('Failed to Save Category', '', 'error');
      // }
    } else {
      Swal.fire('Failed to Save Category plz check mandtory data', '', 'error');
      $('#imageValidation').show();
    }
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
      await this.categorySerivce.deleteCategory(id).then((e) => {
        this.reload();
      });
    });
  }

  async getCategories(): Promise<any> {
    let resualt = await this.categorySerivce.getCategories();
    this.categories=resualt;
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
    $('#categoryName').val('');
    this.imageUrl = '';
    this.CategoryId = 0;
  }

  async reload(): Promise<void> {
    this.getCategories()
    //this.categories = await this.categorySerivce.getCategories();
  }
}
