import { CategoryServiceService } from './../admin-category/category-service.service';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Product } from './Product';
import { Category } from '../admin-category/Category';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { SizesService } from '../admin-size/sizes.service';
import { Sizes } from '../admin-size/size';
import * as jquery from 'jquery';
import { Washing } from '../admin-washing/wash';
import { WashService } from '../admin-washing/wash.service';
import { Shipping } from '../admin-shipping/shipping';
import { ShippingService } from '../admin-shipping/shipping.service';

declare var $: any;
declare var jQuery: any;
(function () {
  'use strict';
  window.addEventListener(
    'load',
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust()
  );
})();

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss'],
})
export class AdminProductComponent implements OnInit, OnDestroy {
  imageSource;
  urls = [];
  washTitle;
  washDesc;

 @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  uploadForm: FormGroup;
  file: string;
  myFile: string[] = [];
  data: Array<Object> = [
    { id: 0, name: 'name1' },
    { id: 1, name: 'name2' },
  ];
  productId: number;
  productName: string;
  productPrice: number;
  qty: number;
  description: string;
  rate: number | null;
  categoryId: number | null;
  products: Product[];
  image: string[] = [];
  selectedValue: number = 0;
  categories: Category[];
  categorySelected: number;
  modifiedValue: number;
  public message: string;
  public progress: number;
  filesToUpload: File[];
  filesToConvert: any[];
  formData = new FormData();
  imageName;
  fileType;
  fileToUpload: File = null;
  imageUrl: string;
  imageBase64;
  imageId;
  imageType: string;
  base64;
  sizeImageName;
  imagesTypes: any[] = [];
  imagesName: string[] = [];
  imagesExtension: string[] = [];
  sizes: Sizes[];
  washing: Washing[];
  washingId;
  sizeImageType;
  shipping:Shipping[]
  @Output() public onUploadFinished = new EventEmitter();

  constructor(
    private productSerivce: ProductService,
    private http: HttpClient,
    private CategoryService: CategoryServiceService,
    private sanitizer: DomSanitizer,
    private sizeService: SizesService,
    private washingService: WashService,
    private shippingService:ShippingService
  ) { }
  productForm = new FormGroup({
    productFormName: new FormControl('', Validators.required),
    productFormPrice: new FormControl('', Validators.required),
    productFormQuantity: new FormControl('', Validators.required),
    productFormCategory: new FormControl('', Validators.required),
    productFormWashing: new FormControl('', Validators.required),
    productFormShipping: new FormControl('', Validators.required),
    productFormDesc: new FormControl('', Validators.required),
  });
  get productFormName() {
    return this.productForm.get('productFormName');
  }
  get productFormPrice() {
    return this.productForm.get('productFormPrice');
  }
  get productFormQuantity() {
    return this.productForm.get('productFormQuantity');
  }
  get productFormCategory() {
    return this.productForm.get('productFormCategory');
  }
  get productFormWashing() {
    return this.productForm.get('productFormWashing');
  }
  get productFormShipping() {
    return this.productForm.get('productFormShipping');
  }

  get productFormDesc() {
    return this.productForm.get('productFormDesc');
  }

  async ngOnInit(): Promise<any> {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   //pageLength: 10,
    //   paging: true,
    //   lengthChange: false,
    //   //ordering: false
      
    // };
    this.dtOptions = {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: true,
    };
   
    // this.products = await this.productSerivce.getProduct();
    // this.dtTrigger.next();
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //     dtInstance.destroy();
    //     this.dtTrigger.next();
    //   });
    this.getProduct()

    this.categories = await this.CategoryService.getCategories();

    this.washingService.GetWashingTypes().subscribe((e) => {
      this.washing = e;
    });
    this.sizeService.GetSizes().subscribe((e) => {
      this.sizes = e;
    });
    this.shippingService.GetShipping().subscribe(e=>{this.shipping = e})
    $('.js-example-basic-multiple').select2({
      placeholder: 'Select product sizes',
      minimumResultsForSearch: Infinity,
      tags: false,
      width: '100%',
      theme: 'classic',
    });
    
  }

  async handleFileInput(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      let result = await this.getBase64(files[i]);
      let modifiyBase64 = this.modifiyBase64(result);
      this.image.push(modifiyBase64);
      let extension = this.GetFileExtension(modifiyBase64);
      this.imagesExtension.push(extension);
      this.fileType = files[i].type;
      this.imagesTypes.push(this.fileType);
    }
  }

  async handleFileInputSizeImage(file: FileList) {
    this.fileToUpload = file.item(0);
    this.sizeImageName = file.item(0).name;
    let result = await this.getBase64(this.fileToUpload);
    this.imageBase64 = result;
    this.imageUrl = this.modifiyBase64(result);
    this.sizeImageType = this.GetFileExtension(this.imageUrl);
    this.imageType = this.fileToUpload.type;

    $('#sizeChartImageContainer').show();
  }
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

  onCategorySelect(event) {
    this.customFunction(event.target.value);
  }
  customFunction(val: any) {
    this.categoryId = val;
  }

  onFileSelect(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.file = event.target.files[i];
      this.myFile.push(event.target.files[i]);
    }
  }
  deleteImage(indexElement): void {
    this.image.splice(indexElement, 1);
    this.imagesTypes.splice(indexElement, 1);
  }
  deleteImageInEdit(indexElement): void {
    this.image.splice(indexElement, 1);
    this.imagesTypes.splice(indexElement, 1);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
    let sizesId = $('#size-dropdown').val();
    let convertToInt = sizesId.map((i) => Number(i)) as [];
    if (convertToInt.length > 0 && this.image.length > 0) {
      return true;
    }
    return false;
  }
  CheckResult() {
    Swal.fire('Product Saved Successfully', '', 'success');
    this.productId = 0;
    this.resetControls();
  }
  async saveProduct(): Promise<void> {
    let sizesId = $('#size-dropdown').val();
    let convertToInt = sizesId.map((i) => Number(i));

    let newProduct = new Product();
    newProduct.productName = $('#productName').val();
    newProduct.productPrice = Number($('#productPrice').val());
    newProduct.qty = Number($('#productQuantity').val());
    newProduct.description = $('#productDesc').val();
    newProduct.sizeImage = this.imageUrl;
    newProduct.type = this.sizeImageType;
    newProduct.categoryId = Number($('#productCategory').val());
    newProduct.images = this.image;
    newProduct.types = this.imagesExtension;
    newProduct.sizeIdList = convertToInt;
    newProduct.washingId = Number($('#wash-dropdown').val());
    newProduct.shippingId = Number($('#ship-dropdown').val());
    if (this.checkMandtoryInputs()) {
      this.productSerivce.saveProduct(newProduct).then((e) => {
        this.getProduct();
      });
      this.CheckResult();
      // if (resualt == true) {
      // } else {
      //   Swal.fire('Failed to Save Product', '', 'error');
      // }
    } else {
      Swal.fire('Failed to Save Product plz check mandtory data', '', 'error');
      $('#productImageValidation').show();
      $('#sizeValidation').show();
      return;
    }
  }
  async getProductbyid(product: Product) {
    let resualt = await this.productSerivce.getProductById(product.productId);
    this.productName = product.productName;
    this.productId = product.productId;
    this.productPrice = product.productPrice;
    this.qty = product.qty;
    this.description = product.description;
    this.categoryId = product.categoryId;
    this.filesToConvert = resualt.images;
    $('#save').hide();
    $('#edit').show();
  }
  editProduct(product: Product): void {
    this.imagesTypes = [];
    $('#productName').val(product.productName);
    this.productId = product.productId;
    $('#productPrice').val(product.productPrice);
    $('#productQuantity').val(product.qty);
    $('#productDesc').val(product.description);
    $('#productCategory').val(product.categoryId);
    this.image = product.productImageList;
    this.imagesTypes = product.types;
    if (product.sizeChartImage == null && product.type == null) {
      this.imageUrl = '';
      this.imageType = '';
    } else {
      this.imageUrl = product.sizeChartImage;
      this.imageType = product.type;
      $('#sizeChartImageContainer').show();
    }
    $('#wash-dropdown').val(product.washingId);
    $('#ship-dropdown').val(product.shippingId);
    $('#size-dropdown').val(product.sizeIdList);
    $('#size-dropdown').trigger('change');
    $('#save').hide();
    $('#edit').show();
  }

  async saveAfterEditProduct(): Promise<void> {
    let image = this.image;
    let fileType = this.fileType;
    this.imagesExtension = [];
    for (let i = 0; i < this.image.length; i++) {
      this.imagesExtension.push(this.GetFileExtension(image[i]));
    }
    let editedProduct = new Product();
    editedProduct.productId = this.productId;
    editedProduct.productName = $('#productName').val();
    editedProduct.productPrice = Number($('#productPrice').val());
    editedProduct.qty = Number($('#productQuantity').val());
    editedProduct.description = $('#productDesc').val();
    editedProduct.sizeImage = this.imageUrl;
    editedProduct.type = this.GetFileExtension(this.imageUrl);
    editedProduct.categoryId = Number($('#productCategory').val());
    editedProduct.images = this.image;
    editedProduct.types = this.imagesExtension;
    let sizesId = $('#size-dropdown').val();
    let convertToInt = sizesId.map((i) => Number(i));
    editedProduct.sizeIdList = convertToInt;
    editedProduct.washingId = Number($('#wash-dropdown').val());
    editedProduct.shippingId = Number($('#ship-dropdown').val());
    if (this.checkMandtoryInputs()) {
      this.productSerivce
        .editProduct(editedProduct, editedProduct.productId)
        .then((e) => {
          this.getProduct();
        });
      this.CheckResult();
      // if (resualt == true) {
      //   Swal.fire('Product Saved Successfully', '', 'success');
      //   this.productId = 0;
      //   $('#edit').hide();
      //   $('#save').show();
      //   this.resetControls();

      // } else {
      //   Swal.fire('Failed to Save Product', '', 'error');
      // }
    } else {
      Swal.fire('Failed to Save Product plz check mandtory data', '', 'error');
      $('#productImageValidation').show();
      $('#sizeValidation').show();
      return;
    }
  }
  async deleteProduct(id: Number): Promise<void> {
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
      this.productSerivce.deleteProduct(id).then((e) => {
        this.reload();
      });
    });
  }
  async getProduct(): Promise<any> {
    let resualt = await this.productSerivce.getProduct();
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
    //$("#datatable example").DataTable().destroy()
    // this.dtTrigger.next();
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.destroy();
    //   this.dtTrigger.next();
    // });
  }
  resetControls(): void {
    $('#productName').val('');
    $('#productPrice').val('');
    $('#productQuantity').val('');
    $('#productCategory').val('');
    $('#wash-dropdown').val('');
    $('#ship-dropdown').val('');
    $('#productDesc').val('');
    $('#productImageValidation').hide();
    $('#sizeValidation').hide();
    $('#size-dropdown').val([]);
    $('#size-dropdown').trigger('change');
    this.categoryId = null;
    this.image = [];
    this.imagesTypes = [];
    this.imageUrl = '';
    this.imageType = '';
    this.sizeImageName = '';
    $('#sizeChartImageContainer').hide();
  }
  async reload(): Promise<void> {
    this.getProduct()
    //this.products = await this.productSerivce.getProduct();
   
  }
}
