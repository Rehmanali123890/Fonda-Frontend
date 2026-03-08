import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading = new BehaviorSubject<boolean>(false);

  Loadershow() {
    this.isLoading.next(true);
  }

  Loaderhide() {
    this.isLoading.next(false);
  }
}
