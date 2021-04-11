import { ScrollService } from './../../_services/scroll.service';
import { AfterViewInit, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
declare var jQuery: any;
(function ($) {
  'use strict'; // Start of use strict
  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function () {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    }

    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$('.sidebar').hasClass('toggled')) {
      $('body').addClass('sidebar-toggled');
      $('.sidebar').addClass('toggled');
      $('.sidebar .collapse').collapse('hide');
    }
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on(
    'mousewheel DOMMouseScroll wheel',
    function (e) {
      if ($(window).width() > 768) {
        var e0 = e.originalEvent,
          delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
      }
    }
  );

  // Scroll to top button appear
  $(document).on('scroll', function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });
})(jQuery); // End of use strict
@Component({
  selector: 'app-user-bord-main',
  templateUrl: './user-bord-main.component.html',
  styleUrls: ['./user-bord-main.component.scss'],
})
export class UserBordMainComponent implements OnInit {
  userName;
  @ViewChild('accordionSidebar') accordionSidebar;
  check: boolean = false;
  selected: boolean = false;
  isVisible = true;
  constructor(
    private scrollService: ScrollService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
  }

  ngOnInit(): void {

    var userData = JSON.parse(localStorage.getItem('userData'));
    if (userData != null) {
      this.userName=userData.customer.firstName
    }
    this.changeLang('ar');
    {
      $('.arabicFont').addClass('makeItRight4');
      $('.toArabic').addClass('makeItRight');
    }
  }
  imgSelect: string[];

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
  scrollToElement(element: HTMLElement) {
    this.scrollService.scrollToElement(element);
  }
  sideBarToggle() {
    if (this.check == false) {
      this.check = true;
      this.selected = true;
    } else {
      this.check = false;
      this.selected = false;
    }
  }
}
