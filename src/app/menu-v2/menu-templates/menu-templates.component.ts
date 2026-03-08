import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-menu-templates',
  templateUrl: './menu-templates.component.html',
  styleUrls: ['./menu-templates.component.css']
})
export class MenuTemplatesComponent {
  @ViewChild('createMenuModal') createMenuModal: ModalDirective;


  openModal() {
    this.createMenuModal.show()
  }
  closeModal() {
    this.createMenuModal.hide();
  }
}
