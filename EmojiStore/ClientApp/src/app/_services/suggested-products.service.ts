import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestedProductsService {

  constructor() { }
  public editDataDetails: any = [];

  public categoryId = new Subject<any>();
  currentId$ = this.categoryId.asObservable();

  SendId(message: string) {
    this.categoryId.next(message);
  }
}
