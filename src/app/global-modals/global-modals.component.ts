import { AppUiService } from './../core/app-ui.service';
import { LazyModalDto, LazyModalDtoNew } from './../Models/app.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-global-modals',
  templateUrl: './global-modals.component.html',
  styleUrls: ['./global-modals.component.scss']
})
export class GlobalModalsComponent implements OnInit {
  modalObj = new LazyModalDto();
  modalObjNew = new LazyModalDtoNew();
  @ViewChild("lazyConfirmationModal") lazyConfirmationModal: ModalDirective;
  @ViewChild("lazyConfirmationModalNew") lazyConfirmationModalNew: ModalDirective;
  constructor(private appUi: AppUiService) {
    appUi.showConfirmationSubject.subscribe((res: LazyModalDto) => {
      this.modalObj = res;
      this.lazyConfirmationModal.show();
    });
    appUi.showConfirmationSubjectNew.subscribe((res: LazyModalDtoNew) => {
      this.modalObjNew = res;
      this.lazyConfirmationModalNew.show();
    });
  }

  ngOnInit() {}
  proceed() {
    this.lazyConfirmationModal.hide();
    const self = this;
    // this.modalObj.callBack(this.modalObj.data);
    const callFunc = this.modalObj.callBack.bind(this);
    const mydata = this.modalObj.data;
    callFunc(mydata);
  }
  reject() {
    this.lazyConfirmationModal.hide();
    if (this.modalObj.rejectCallBack) {
      const self = this;
      // this.modalObj.callBack(this.modalObj.data);
      const callFunc = this.modalObj.rejectCallBack.bind(this);
      const mydata = this.modalObj.data;
      callFunc(mydata);
    }
  }
 
 
  proceedNew() {
    this.lazyConfirmationModalNew.hide();
    const self = this;
    // this.modalObj.callBack(this.modalObj.data);
    const callFunc = this.modalObjNew.callBack.bind(this);
    const mydata = this.modalObjNew.data;
    callFunc(mydata);
  }
  rejectNew() {
    this.lazyConfirmationModalNew.hide();
    if (this.modalObjNew.rejectCallBack) {
      const self = this;
      // this.modalObj.callBack(this.modalObj.data);
      const callFunc = this.modalObjNew.rejectCallBack.bind(this);
      const mydata = this.modalObjNew.data;
      callFunc(mydata);
    }
  }
}

