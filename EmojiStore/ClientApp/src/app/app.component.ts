import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'clothes-e-commerce-app';
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

  changeLang(value) {
    this.translate.use(value);
    if (value == 'en') {
      $('.arabicFont').removeClass('makeItRight4');
    } else {
      $('.arabicFont').addClass('makeItRight4');
    }
  }
}
