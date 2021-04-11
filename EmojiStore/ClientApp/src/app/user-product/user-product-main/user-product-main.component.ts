import { Component, Input, OnInit } from '@angular/core';
import 'owl.carousel';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateService } from '@ngx-translate/core';
import { CategoryServiceService } from 'src/app/admin-panel/admin-content/admin-category/category-service.service';
import { ProductService } from 'src/app/admin-panel/admin-content/admin-product/product.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from 'src/app/admin-panel/admin-content/admin-product/Product';
import { Sizes } from 'src/app/admin-panel/admin-content/admin-size/size';
import { CartbadgeService } from 'src/app/_services/cartbadge.service';
import { SuggestedProductsService } from 'src/app/_services/suggested-products.service';
import { GetProductViewModel } from 'src/app/admin-panel/admin-content/admin-product/GetProductViewModel';
import { timeStamp } from 'console';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-user-product-main',
  templateUrl: './user-product-main.component.html',
  styleUrls: ['./user-product-main.component.scss'],
})
export class UserProductMainComponent implements OnInit {
  @Input() productId;
  product: Product;
  total: number;
  constructor(
    public translate: TranslateService,
    private categroySrvice: CategoryServiceService,
    private productService: ProductService,
    private sharedService: CartbadgeService,
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
    private suggestedProduct: SuggestedProductsService
  ) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
  }
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    dotsData: true,
    dotsEach: true,
    navSpeed: 4000,
    fluidSpeed: true,
    smartSpeed: 2000,
    // navText: ['Previous', 'Next'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      540: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
      1223: {
        items: 1,
      },
      2560: {
        items: 1,
      },
    },
    // nav: true
  };
  ngOnInit(): void {
    this.router.params.subscribe((params: Params) => {
      this.LoadProductDetails(params['id']);
      this.productId = params['id'];
    });
    this.changeLang('ar');
    {
      $('.toArabic').addClass('makeItRight');
      $('.arabicFont').addClass('makeItRight4');
    }
  }
  imgSelect: string[];
  productImages: string[];
  productImagesType: string[];
  sizeImage: string;
  sizeImageType: string;
  sizes: Sizes[];
  async LoadProductDetails(id: Number) {
    await this.productService.getProductById(id).then((e) => {
      console.log(e),
      (this.product = e),
        (this.productImages = e.productImageList),
        (this.productImagesType = e.types),
        (this.sizeImage = e.sizeChartImage),
        (this.sizeImageType = e.type),
        (this.sizes = e.productSizesList);
    });
  }

  AddToCart() {
    if (!$("input[name='rGroup']:checked").val()) {
      $('#sizeValidation').show();
    } else {
      $('#sizeValidation').hide();
      let price;
      if (this.product.offerPrice != null) {
        price = this.product.offerPrice;
      } else {
        price = this.product.productPrice;
      }
      let existingEntries = JSON.parse(localStorage.getItem('allProducts'));
      let maxId = 1;

      if (
        existingEntries == null ||
        existingEntries == [] ||
        existingEntries == undefined
      ) {
        existingEntries = [];
        maxId = 1;
      } else {
        maxId =
          Math.max.apply(
            Math,
            existingEntries.map(function (o) {
              return o.id;
            })
          ) + 1;
        if (maxId == null) maxId = 1;
      }

      let product = {
        id: maxId,
        productPhoto: this.productImages[0],
        productPhotoType: this.productImagesType[0],
        productId: Number($('#productId').text()),
        productName: $('#productName').text(),
        productPrice: price,
        size: $('.rGroup:checked').val(),
        quantity: 1,
        total: parseFloat(price) * 1,
      };

      existingEntries.push(product);
      localStorage.setItem('allProducts', JSON.stringify(existingEntries));
      var arrayFromStroage = JSON.parse(localStorage.getItem('allProducts'));
      var arrayLength = arrayFromStroage.length;
      $('.badgeSpan').text(arrayLength);
      // this.route.navigate(['/Home/ShoppingCart']);
      jQuery(function ($j) {
        $j('#alert').show(0).delay(500).hide(0);
      });
    }
  }
  changeLang(value) {
    this.translate.use(value);
    if (value == 'en') {
      this.imgSelect = ['./assets/img/8en.svg'];
      $('.toArabic').removeClass('makeItRight');
      $('.arabicFont').removeClass('makeItRight4');
    } else {
      this.imgSelect = ['./assets/img/7ar.svg'];
      $('.toArabic').addClass('makeItRight');
      $('.arabicFont').addClass('makeItRight4');
    }
  }
}
