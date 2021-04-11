import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('userData'));
    if (userData.customer.role == "NormalUser") {
      this.route.navigate(['/Home']);
    }
  }

}
