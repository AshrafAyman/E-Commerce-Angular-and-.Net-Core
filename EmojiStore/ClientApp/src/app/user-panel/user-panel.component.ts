import { ScrollService } from './../_services/scroll.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {

  constructor(private scrollService: ScrollService) { }

  ngOnInit(): void {
  }
  scrollToId(id: string) {
    this.scrollService.scrollToElementById(id);
  }
}
