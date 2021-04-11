import { ScrollService } from './../../_services/scroll.service';
import { AfterViewInit, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss'],
})
export class AdminMainComponent implements OnInit {
  userName;
  @ViewChild('accordionSidebar') accordionSidebar;
  check: boolean = false;
  selected: boolean = false;
  isVisible = true;
  constructor(private scrollService: ScrollService, private route: Router) {}

  ngOnInit(): void {
    var userData = JSON.parse(localStorage.getItem('userData'));
    this.userName = userData.customer.userName;
  }
  LogOut() {
    localStorage.removeItem('userData');
    var userData = JSON.parse(localStorage.getItem('userData'));
    if (userData == null || userData == undefined) {
      this.route.navigate(['/Home']);
      this.userName = '';
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
