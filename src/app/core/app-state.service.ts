import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private _currentMerchant: string;
  merchantChangedSubject = new Subject<string>();

  constructor() { }

  public get currentMerchant(): string {
    console.log("appstate service " , this._currentMerchant)
    return this._currentMerchant;
  }
  public set currentMerchant(value: string) {
    localStorage.setItem('currentMerchant', value);
    this._currentMerchant = value;
    this.merchantChangedSubject.next(this.currentMerchant);
    console.log("appstate service " , value)
  }
}
