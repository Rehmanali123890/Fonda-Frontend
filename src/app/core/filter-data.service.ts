import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterDataService {

  constructor() { }
  getEnumAsList<T>(model: T): Array<{name: string, value: number}> {
    const keys = Object.keys(model).filter(
      k => typeof model[k as any] === 'number'
    ); // ["A", "B"]
    const values = keys.map(key => ({
      name: key,
      value: model[key as any],
    })); // [0, 1]
    return values;
  }
}
