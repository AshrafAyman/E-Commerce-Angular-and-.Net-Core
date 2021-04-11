import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartbadgeService {
  constructor() {}

  public editDataDetails: any = [];
  public messageSource = new Subject<any>();
  currentMessage$ = this.messageSource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
  
}
