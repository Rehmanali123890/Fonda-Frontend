import { LazyModalDto,LazyModalDtoNew } from './../Models/app.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppUiService {
  recentOrderId = '';
  public showConfirmationSubject = new Subject<LazyModalDto>();
  public showConfirmationSubjectNew = new Subject<LazyModalDtoNew>();

  constructor() { }
  openLazyConfrimModal(modalDto: LazyModalDto) {
    this.showConfirmationSubject.next(modalDto);
  }
 
  openLazyConfrimModalNew(modalDto: LazyModalDtoNew) {
    this.showConfirmationSubjectNew.next(modalDto);
  }
}
