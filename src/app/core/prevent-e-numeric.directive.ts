import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventE]'
})
export class PreventEDirective {

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    // Check if the key pressed is 'e' or 'E'
    if (event.key === 'e') {
      event.preventDefault();
    }
  }
}
