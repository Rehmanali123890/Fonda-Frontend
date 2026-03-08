export class LazyModalDto {
  Title: string;
  Text: string;
  data: any;
  hideProceed?: boolean;
  callBack: Function;
  sBtnText?: string;
  rejectButtonText?: string;
  acceptButtonText?: string;
  rejectCallBack?: Function;
}

export class LazyModalDtoNew {
  Title: string;
  Text: string;
  Description: string;
  data: any;
  hideProceed?: boolean;
  callBack: Function;
  sBtnText?: string;
  rejectButtonText?: string;
  acceptButtonText?: string;
  rejectCallBack?: Function;
}
