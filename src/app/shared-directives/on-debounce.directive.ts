import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Directive({
  selector: '[appOnDebounce]',
})
export class OnDebounceDirective implements OnInit, OnDestroy {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() public onDebounce = new EventEmitter<any>();

  @Input() public debounceTime: number;

  private isFirstChange = true;
  private subscription: Subscription;

  constructor(public model: NgControl) {}

  ngOnInit() {
    if (!this.debounceTime) {
      this.debounceTime = 3000;
    }
    this.subscription = this.model.valueChanges.pipe( debounceTime(this.debounceTime), distinctUntilChanged() )
      .subscribe((modelValue) => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
        } else {
          this.onDebounce.emit(modelValue);
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
