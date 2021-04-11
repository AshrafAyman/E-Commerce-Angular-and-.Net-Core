import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
  }

  ngOnInit(): void {
    this.changeLang('ar');
    {
      $('.arabicFont').addClass('makeItRight4');
    }
  }
  imgSelect: string[];

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
