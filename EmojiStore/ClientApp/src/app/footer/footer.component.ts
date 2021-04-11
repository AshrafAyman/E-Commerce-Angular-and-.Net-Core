import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Category } from 'src/app/admin-panel/admin-content/admin-category/Category';
import { CategoryServiceService } from 'src/app/admin-panel/admin-content/admin-category/category-service.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  email: string;
  categoriesWith3: Category[];
  categoriesWithTheReset: Category[];
  allCategoris: Category[];
  constructor(
    public translate: TranslateService,
    private categoryService: CategoryServiceService
  ) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
  }

  async ngOnInit(): Promise<void> {
    this.changeLang('ar');
    {
      $('.toArabic').addClass('makeItRight');
      $('.toArabic2').addClass('makeItRight2');
    }
    this.allCategoris = (await this.categoryService.getCategoriesHeaders()) as [];
    this.categoriesWith3 = this.allCategoris.slice(0, 3).map((i) => {
      return i;
    });
    this.categoriesWithTheReset = this.allCategoris.slice(3);
  }
  imgSelect: string[];

  changeLang(value) {
    this.translate.use(value);
    if (value == 'en') {
      this.imgSelect = ['./assets/img/8en.svg'];
      $('.toArabic2').removeClass('makeItRight2');
      $('.toArabic').removeClass('makeItRight');
      $('.toArabic3').addClass('makeItRight3');
    } else {
      this.imgSelect = ['./assets/img/7ar.svg'];
      $('.toArabic').addClass('makeItRight');
      $('.toArabic2').addClass('makeItRight2');
    }
  }
  sendMail(): void {
    var email = 'Emojistore18@gmail.com';
    var link = 'mailto:' + email;
    $('#youGotMail').attr('href', link);
    $('#youGotMail').trigger('click');
  }
}
