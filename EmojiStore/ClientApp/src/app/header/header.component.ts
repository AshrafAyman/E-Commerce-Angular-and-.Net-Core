import { Category } from 'src/app/admin-panel/admin-content/admin-category/Category';
import { CategoryServiceService } from 'src/app/admin-panel/admin-content/admin-category/category-service.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CartbadgeService } from '../_services/cartbadge.service';
import { Router } from '@angular/router';
import { SearchService } from '../_services/search.service';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  selectedMessage = 0;
  categoriesWith3: Category[];
  categoriesWithTheReset: Category[];
  allCategoris: Category[];
  searchText: string;
  constructor(
    public translate: TranslateService,
    private sharedService: CartbadgeService,
    private categoryService: CategoryServiceService,
    private router: Router,
    private searchService: SearchService
  ) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
  }
  public search() {
    this.router.navigate([`/Home/ProductList/search`]);
    this.searchService.changeMessage($('#searchText').val());
  }
  async ngOnChanges(changes: SimpleChanges): Promise<void> {}

  async ngOnInit() {
    this.checkstatus();
    var arrayFromStroage = JSON.parse(localStorage.getItem('allProducts'));
    if (arrayFromStroage == null) {
      arrayFromStroage = [];
    }
    var arrayLength = arrayFromStroage.length;
    this.selectedMessage = arrayLength;

    this.changeLang('ar');
    {
      $('.toArabic').addClass('makeItRight');
    }
    $(document).ready(function () {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
      });

      $('.sidebarCollapseX').on('click', function () {
        $('#sidebar').removeClass('active');
      });

      $('#sidebarCollapse').on('click', function () {
        if ($('#sidebar').hasClass('active')) {
          $('.overlay').addClass('visible');
        }
      });

      $('.sidebarCollapseX').on('click', function () {
        $('.overlay').removeClass('visible');
      });
      $('#cart').on('click', function () {
        $('.shopping-cart').fadeToggle('fast');
      });
    });

    this.allCategoris = (await this.categoryService.getCategoriesHeaders()) as [

    ];
    this.categoriesWith3 = this.allCategoris.slice(0, 3).map((i) => {
      return i;
    });
    this.categoriesWithTheReset = this.allCategoris.slice(3);
  }
  CloseTheSidePar() {
    $('.sidebarCollapseX').on('click', function () {
      $('#sidebar').removeClass('active');
    });
    $('.sidebarCollapseX').on('click', function () {
      $('.overlay').removeClass('visible');
    });
  }
  checkstatus() {
    var userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.customer?.role == 'Admin') {
      $('#logOut,#LogOutBig,#adminRollSmall,#adminRollBig').show();
      $('#shoppingSmall,#shoppingBig,#registeration,#registerationBig').hide();
    } else if (userData?.customer?.role == 'NormalUser') {
      $('#logOut,#LogOutBig,#shoppingSmall,#shoppingBig').show();
      $(
        '#adminRollSmall,#adminRollBig,#registeration,#registerationBig'
      ).hide();
    } else {
      $('#shoppingSmall,#shoppingBig').show();
      $(
        '#adminRollSmall,#adminRollBig,#logOut,#LogOutBig,#shoppingSmall,#shoppingBig'
      ).hide();
    }
  }
  imgSelect: string[];
  LogOut() {
    localStorage.removeItem('userData');
    var userData = JSON.parse(localStorage.getItem('userData'));
    if (userData == null) {
      $(
        '#logOut,#shoppingSmall,#LogOutBig,#shoppingBig,#adminRollSmall,#adminRollBig'
      ).hide();
      $('#registeration,#registerationBig').show();
    }
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
}
