import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject = new Subject<any>();

  constructor() { }

  on(event: EventTypes): Observable<any> {
    return this.subject
      .pipe(
        filter((e: EmitEvent) => {
          return e.name === event;
        }),
        map((e: EmitEvent) => {
          return e.value;
        })
      );
  }

  emit(event: EmitEvent) {
    this.subject.next(event);
  }
}

export class EmitEvent {
  name: any;
  value: any;
}

export enum EventTypes {
  NewOrderEvent = 1,
  OrderStatusChangeEvent = 3,
  RefreshOrderEvent = 2,
  newActivityLog = 4,
  errorLog = 5

}
