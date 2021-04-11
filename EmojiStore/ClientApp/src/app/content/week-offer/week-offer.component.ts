import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-week-offer',
  templateUrl: './week-offer.component.html',
  styleUrls: ['./week-offer.component.scss'],
})
export class WeekOfferComponent implements OnInit {
  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
  }

  ngOnInit(): void {
    this.changeLang('ar');
    {
      $('.toArabic').addClass('makeItRight');
    }
  }
  imgSelect: string[];

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
