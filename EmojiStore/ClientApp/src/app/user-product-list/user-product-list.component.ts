import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CategoryServiceService } from '../admin-panel/admin-content/admin-category/category-service.service';
import { Product } from '../admin-panel/admin-content/admin-product/Product';
import { ProductService } from '../admin-panel/admin-content/admin-product/product.service';
import { GetProductViewModel } from '../admin-panel/admin-content/admin-product/GetProductViewModel';
import { SearchService } from '../_services/search.service';
import { SuggestedProductsService } from '../_services/suggested-products.service';
declare var $: any;
declare var jQuery: any;
$(document).ready(function () {
  function getVals() {
    // Get slider values
    var parent = this.parentNode;
    var slides = parent.getElementsByTagName('input');
    var slide1 = parseFloat(slides[0].value);
    var slide2 = parseFloat(slides[1].value);
    // Neither slider will clip the other, so make sure we determine which is larger
    if (slide1 > slide2) {
      var tmp = slide2;
      slide2 = slide1;
      slide1 = tmp;
    }

    var displayElement = parent.getElementsByClassName('rangeValues')[0];
    displayElement.innerHTML = '$ ' + slide1 + ' - $' + slide2;
  }

  window.onload = function () {
    // Initialize Sliders
    var sliderSections = document.getElementsByClassName('range-slider');
    for (var x = 0; x < sliderSections.length; x++) {
      var sliders = sliderSections[x].getElementsByTagName('input');
      for (var y = 0; y < sliders.length; y++) {
        if (sliders[y].type === 'range') {
          sliders[y].oninput = getVals;
          // Manually trigger event first time to display values
          sliders[y].oninput(event);
        }
      }
    }
  };
});
@Component({
  selector: 'app-user-product-list',
  templateUrl: './user-product-list.component.html',
  styleUrls: ['./user-product-list.component.scss'],
})
export class UserProductListComponent implements OnInit {
  products: Product[];
  categoryName: string;
  categoryId: number;
  pageNumber: number = 1;
  imgSelect: string[];
  count: number;
  isSearch: boolean;
  filterNumber: number;
  constructor(
    public translate: TranslateService,
    private categroySrvice: CategoryServiceService,
    private productService: ProductService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private suggestedProduct: SuggestedProductsService
  ) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
  }

  async ngOnInit(): Promise<void> {
    this.filterNumber = 1;
    var model = new GetProductViewModel();
    model.Page = this.pageNumber;
    model.Filter = this.filterNumber;
    this.route.params.subscribe(async (params: Params) => {

      if (params['id'] == "search") {
        model.SearchText = $("#searchText").val();
        this.LoadProducts(model);
        this.categoryName = " نتائج البحث عن " + $("#searchText").val();
        this.isSearch = true;
        this.categoryId = null;
      } else {

        this.categoryId = parseInt(params['id']);
        model.CategoryId = this.categoryId;
        this.LoadProducts(model);
        this.isSearch = false;
        await this.categroySrvice.getCategory(this.categoryId).then((e) => {
          this.categoryName = e.categoryName;
        });
      }
    });

    this.searchService.currentMessage$.subscribe(channel => {
      var model = new GetProductViewModel();
      model.Page = this.pageNumber;
      model.Filter = this.filterNumber;
      model.SearchText = $("#searchText").val();
      this.LoadProducts(model);
      this.categoryName = " نتائج البحث عن " + $("#searchText").val();
      this.isSearch = true;
      this.categoryId = null;
    });


    this.changeLang('ar');
    {
      $('.toArabic').addClass('makeItRight');
    }
  }


  async LoadProducts(model: GetProductViewModel) {
    await this.productService.getProductByCategoryId(model).then((e) => {
      this.products = e.productList;
      this.count = e.count;
    });
  }

  changeLang(value) {
    this.translate.use(value);
    if (value == 'en') {
      this.imgSelect = ['./assets/img/8en.svg'];
      $('.toArabic').removeClass('makeItRight');
    } else {
      this.imgSelect = ['./assets/img/7ar.svg'];
      $('.toArabic').addClass('makeItRight');
    }
  }

  changePage(page) {
    window.scrollTo(0, 0);
    this.pageNumber = page;
    let model = new GetProductViewModel();
    model.Page = this.pageNumber;
    model.Filter = this.filterNumber;
    if (this.isSearch) {
      model.SearchText = $("#searchText").val();
      this.LoadProducts(model);
      this.categoryName = " نتائج البحث عن " + $("#searchText").val();
    } else {
      model.CategoryId = this.categoryId
      this.LoadProducts(model);
    }
  }

  changeFilter(filterNumber: number) {
    this.filterNumber = filterNumber;
    let model = new GetProductViewModel();
    model.Page = this.pageNumber;
    model.Filter = filterNumber;
    if (this.isSearch) {
      model.SearchText = $("#searchText").val();
      this.LoadProducts(model);
      this.categoryName = " نتائج البحث عن " + $("#searchText").val();
    } else {
      model.CategoryId = this.categoryId;
      this.LoadProducts(model);
    }
  }
}
