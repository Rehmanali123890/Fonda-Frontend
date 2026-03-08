import { environment } from './../../environments/environment';
import { EmitEvent, EventTypes, EventBusService } from './event-bus.service';
import { MessageEventDto, MessageTypeEnum } from './../Models/socket.model';
import { SecurityService } from './security.service';
import { Injectable } from '@angular/core';
import { AppUiService } from './app-ui.service';

@Injectable({
  providedIn: 'root'
})
export class MySocketService {
  socketUrl = environment.socketurl;
  socket: WebSocket;
  orderNotifyAudio = new Audio();
  constructor(private securityService: SecurityService, private appUi: AppUiService, private eventBus: EventBusService) { }
  startConnection() {
    this.orderNotifyAudio.src = "../../../assets/sounds/magic.MP3";
    this.orderNotifyAudio.load();
    this.orderNotifyAudio.muted = true;

    const url = `${this.socketUrl}?token=${this.securityService.securityObject.token}&eventName=order`;
    this.socket = new WebSocket(url);
    this.socket.onmessage = this.eventCallBack;
    this.socket.onopen = (ev) => {
    }
    this.socket.onclose = (e) => {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(() => {
        if (this.securityService.securityObject.token) {
          this.startConnection();
        }
      }, 2000);
    };

    this.socket.onerror = (err) => {
      console.error('Socket encountered error: ', err['message'], 'Closing socket');
      this.socket.close();
    };
  }
  close() {
    this.socket.close();
  }
  private eventCallBack = (event: MessageEvent) => {
    const eData = JSON.parse(event.data) as MessageEventDto;

    if (eData.event.toString() === 'order.create') {
      if (eData.body.order && eData.body.order.id && this.appUi.recentOrderId && eData.body.order.id === this.appUi.recentOrderId) {
        return;
      }
      this.emitEvent(EventTypes.NewOrderEvent, eData.body.order);
      const savedSoundState = localStorage.getItem('isMuted');
      if (savedSoundState) {
        if (savedSoundState == 'true') {
          this.orderNotifyAudio.muted = true
        }
        else {
          this.orderNotifyAudio.muted = false
        }
      }
      else {
        this.orderNotifyAudio.muted = false
      }
      this.orderNotifyAudio.play();
    }
    if (eData.event.toString() === 'order.status') {
      this.emitEvent(EventTypes.OrderStatusChangeEvent, eData.body.order);
    }
    if (eData.event.toString() === 'activity_logs.entry') {

      this.emitEvent(EventTypes.newActivityLog, null);
    }
    if (eData.event.toString() === 'error_logs.entry') {

      this.emitEvent(EventTypes.errorLog, null);
    }
  }
  private emitEvent(type: EventTypes, data: any) {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = type;
    event.value = data;
    this.eventBus.emit(event);
  }
}
