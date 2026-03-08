import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-google-analytics',
  templateUrl: './google-analytics.component.html',
  styleUrls: ['./google-analytics.component.scss']
})
export class GoogleAnalyticsComponent implements OnInit {
  quicksightUrl: string = environment.quicksightUrl
  constructor(private el: ElementRef) { }

  ngOnInit(): void {

  }
  ngAfterViewInit() {

    const iframeElement: HTMLIFrameElement = this.el.nativeElement.querySelector('#quicksightIframe');
    iframeElement.src = this.quicksightUrl;
  }

}
