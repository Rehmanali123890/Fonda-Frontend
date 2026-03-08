import { EmitEvent, EventBusService, EventTypes } from './../core/event-bus.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-global-snack-bar',
  templateUrl: './global-snack-bar.component.html',
  styleUrls: ['./global-snack-bar.component.scss']
})
export class GlobalSnackBarComponent implements OnInit {
  isSnackbarVisible: boolean = false;
  constructor(private eventBus: EventBusService, private router: Router) { }

  ngOnInit(): void {
    this.suscribeNewOrders();
  }

  suscribeNewOrders() {

    this.eventBus.on(EventTypes.NewOrderEvent).subscribe(data => {
  
      if (this.router.url.includes('/onBoarding/merchant-onBoarding')
        || this.router.url.includes('/order.mifonda.io')
        || this.router.url.includes('/devorder.mifonda.io')
        || this.router.url.includes('/testorder.mifonda.io')) {
      

      } else {
        this.isSnackbarVisible = true;

      }
      // setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    })
    this.eventBus.on(EventTypes.OrderStatusChangeEvent).subscribe(data => {
      this.RefreshOrderEmit();
    })
  }
  async NavigateToOrders() {

    if (this.router.url.includes('/onBoarding/merchant-onBoarding')
      || this.router.url.includes('/order.mifonda.io')
      || this.router.url.includes('/devorder.mifonda.io')) {

    } else {
      if (this.router.url.includes('home/orders/ordersList')) {
        this.emitEvent(EventTypes.RefreshOrderEvent, '');
      } else {
        const compl = await this.router.navigateByUrl('/home/orders/ordersList');
        setTimeout(() => {
          this.emitEvent(EventTypes.RefreshOrderEvent, '');
        }, 1000);
      }

      this.isSnackbarVisible = false;
    }
  }
  closeSnackBar() {

    this.isSnackbarVisible = false;
  }

  async RefreshOrderEmit() {
    if (this.router.url.includes('home/orders/ordersList')) {
      this.emitEvent(EventTypes.RefreshOrderEvent, '');
    } else {
      // const compl = await this.router.navigateByUrl('/home/orders/ordersList');
      // setTimeout(() => {
      //   this.emitEvent(EventTypes.RefreshOrderEvent, '');
      // }, 1000);
    }

    this.isSnackbarVisible = false;
  }
  private emitEvent(type: EventTypes, data: any) {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = type;
    event.value = data;
    this.eventBus.emit(event);
  }
}
