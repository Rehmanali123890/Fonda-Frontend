import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[OnlyNumbers]'
})
export class OnlyNumbersDirective {
  regexStr = '^[0-9]*$';
  constructor(private el: ElementRef) {}

  @Input() OnlyNumber: boolean;

  // @HostListener('keydown', ['$event']) onKeyDown(event) {
  //   const e = <KeyboardEvent>event;
  //   if (this.OnlyNumber) {
  //     if (
  //       [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
  //       // Allow: Ctrl+A
  //       (e.keyCode == 65 && e.ctrlKey === true) ||
  //       // Allow: Ctrl+C
  //       (e.keyCode == 67 && e.ctrlKey === true) ||
  //       // Allow: Ctrl+V
  //       (e.keyCode == 86 && e.ctrlKey === true) ||
  //       // Allow: Ctrl+X
  //       (e.keyCode == 88 && e.ctrlKey === true) ||
  //       // Allow: home, end, left, right
  //       (e.keyCode >= 35 && e.keyCode <= 39)
  //     ) {
  //       // let it happen, don't do anything
  //       return;
  //     }
  //     const ch = String.fromCharCode(e.keyCode);
  //     const regEx = new RegExp(this.regexStr);
  //     if (regEx.test(ch)) {
  //       return;
  //     } else {
  //       e.preventDefault();
  //     }
  //   }
  // }
  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if ( initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
