import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menus-side-nav',
  templateUrl: './menus-side-nav.component.html',
  styleUrls: ['./menus-side-nav.component.css']
})
export class MenusSideNavComponent {

  constructor(private router: Router) { }
  onSelect(event: any) {
    const path = event.target.value;
    this.router.navigate([path]);
  }
}
