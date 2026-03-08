import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-menu-template-details',
  templateUrl: './menu-template-details.component.html',
  styleUrls: ['./menu-template-details.component.css']
})
export class MenuTemplateDetailsComponent {
  @ViewChild('createMenuModal') createMenuModal: ModalDirective;



  selectedTab = 0;

  get underlineStyle() {
    return `translateX(${this.selectedTab * 100}%)`;
  }

  selectTab(index: number) {
    this.selectedTab = index;
  }

  openModal() {
    this.createMenuModal.show()
  }
  closeModal() {
    this.createMenuModal.hide();
  }
}
