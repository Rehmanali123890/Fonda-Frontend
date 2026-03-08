import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPreventNegative]'
})
export class PreventNegativeDirective {
  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    // Prevent the minus sign
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    if (input.value && Number(input.value) < 0) {
      input.value = '';
    }
  }
}
