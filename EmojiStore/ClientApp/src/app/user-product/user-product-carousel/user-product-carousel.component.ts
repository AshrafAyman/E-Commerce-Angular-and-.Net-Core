import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'owl.carousel';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from 'src/app/admin-panel/admin-content/admin-product/product.service';
import { SuggestedProductsService } from 'src/app/_services/suggested-products.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from 'src/app/admin-panel/admin-content/admin-product/Product';
@Component({
  selector: 'app-user-product-carousel',
  templateUrl: './user-product-carousel.component.html',
  styleUrls: ['./user-product-carousel.component.scss'],
})
export class UserProductCarouselComponent implements OnInit {
  productId;
  products:Product[];
  constructor(
    public translate: TranslateService,
    private productService:ProductService,
    private suggestedProduct:SuggestedProductsService,
    private route: ActivatedRoute,


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
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
      1223: {
        items: 5,
      },
      2560: {
        items: 7,
      },
    },
    // nav: true
  };
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params: Params) => {
      this.productId=parseInt(params['id']);
    });
     this.LoadProducts(this.productId);
    this.changeLang('ar');
    {
      $('.arabicFont').addClass('makeItRight4');
    }
  }
  imgSelect: string[];
  async LoadProducts(id : Number) {
   this.products= await this.productService.getSuggestedProduct(id);
  }
  changeLang(value) {
    this.translate.use(value);
    if (value == 'en') {
      this.imgSelect = ['./assets/img/8en.svg'];
      $('.arabicFont').removeClass('makeItRight4');
    } else {
      this.imgSelect = ['./assets/img/7ar.svg'];
      $('.arabicFont').addClass('makeItRight4');
    }
  }
}
