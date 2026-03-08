export class MessageEventDto {
  event: MessageTypeEnum;
  body: any
}
export enum MessageTypeEnum {
  'order.create' = 1
}

