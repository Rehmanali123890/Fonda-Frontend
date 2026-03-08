import { ConnectedPlatformObj, MerchantListDto } from './../../Models/merchant.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SecurityService } from '../../core/security.service';
import { AppStateService } from '../../core/app-state.service';
import {
  FlipDishDetails,
  MerchantPlatformsEnum,
} from '../../Models/merchant.model';

import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { MerchantService } from '../../core/merchant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from 'src/environments/environment';
import { stream } from 'xlsx';
import { TranslocoService } from '@ngneat/transloco';
@UntilDestroy()
@Component({
  selector: 'app-merchant-platforms',
  templateUrl: './merchant-platforms.component.html',
  styleUrls: ['./merchant-platforms.component.scss'],
})
export class MerchantPlatformsComponent implements OnInit {
  @Input() virtualMerchantId: string = null;
  merchantId: string;
  flipDishDetailsObj = new FlipDishDetails();
  isFlipDishConnected: boolean = false;
  flipDishAutoSync: string = "0";
  streamAutoSync: string = "0";
  isProcessing: boolean = false;
  isstreamProcessing: boolean = false;
  syncingFlipDish: boolean = false;
  isstreamEnable: boolean
  isstreamConnected: boolean
  activeTab: number = 1;
  doordashstream: boolean
  grubhubstream: boolean
  isAccepted: boolean = false;
  streamplatformstatus: boolean
  isstreamPlatfromProcessing: boolean = false
  isstreamuploadmenuProcessing: boolean = false
  streamplatformname: string
  isAllChecked = false;
  impNote = ''

  ConnectStreamcheckboxes = [
    { label: "ConnectStreamcheckboxes1", checked: false },
    { label: "ConnectStreamcheckboxes2", checked: false },
    { label: "ConnectStreamcheckboxes3", checked: false }
  ];
  DisConnectStreamcheckboxes = [
    { label: "DisConnectStreamcheckboxes1", checked: false },
    { label: "DisConnectStreamcheckboxes2", checked: false }
  ];
  uploadFondaMenu = [
    { label: "uploadFondaMenumsg1", checked: false },
    { label: "uploadFondaMenumsg2", checked: false },
    { label: "uploadFondaMenumsg3", checked: false }
  ];
  DisconnectStreamPlatformcheckboxes = [
  ];
  ConnectStreamPlatformcheckboxes = [
  ];
  impForConnectStream = 'You must enable the Doordash Stream Connectivity or Grubhub Stream Connectivity in order to connect to Stream.'
  impForConnectDisconnectStream = 'After disconnecting, orders will no longer be sent to Fonda from Stream. To switch back to Email Parseur, the email protocol must be enabled after connecting with DoorDash and Grubhub support.'
  impUploadStreamMenu = 'It will take 2 to 3 minutes for the menu changes to reflect on the platforms.'
  popupcheckboxes = []
  @ViewChild('flipdishModal') public flipdishModal: ModalDirective;
  @ViewChild('streamModal') public streamModal: ModalDirective;
  @ViewChild('streamplatformModal') public streamplatformModal: ModalDirective;
  @ViewChild('streamuploadmenuModal') public streamuploadmenuModal: ModalDirective;
  ConnectedPlatforms: ConnectedPlatformObj[] = [];

  constructor(
    private securityService: SecurityService,
    private appStateService: AppStateService,
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private merchantService: MerchantService,
    private appState: AppStateService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {

    if (this.virtualMerchantId == null) {
      this.merchantId = this.activatedRoute.snapshot.paramMap.get('id');
    } else {
      this.merchantId = this.virtualMerchantId
    }
    this.flipDishDetailsObj.platformType = MerchantPlatformsEnum['Flipdish'];
    this.subscribeAppState();
    this.GetConnectedPlatforms();
  }

  resetFlipDishModal() {
    this.flipDishDetailsObj = new FlipDishDetails()
  }
  subscribeAppState() {
    if (this.virtualMerchantId == null) {
      this.merchantId = this.appState.currentMerchant;
      this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
        this.merchantId = merchntId;


        this.GetConnectedPlatforms()

      })
    }
  }
  saveAutoSyncSettings(platformType: number) {
    let id = this.ConnectedPlatforms.filter(x => x.platformtype == platformType)[0].id
    console.log("id is ", id)
    let platfromToPass;
    if (platformType == 2) {
      platfromToPass = this.flipDishAutoSync
    }
    if (platformType == 8) {
      platfromToPass = this.streamAutoSync
    }
    this.merchantService.saveAutoSyncSettings(this.merchantId, id, platfromToPass).subscribe((data: any) => {
      this.toaster.info("Settings saved successfully")
    }, (err) => {
      this.toaster.error(err.error.message)
    })

  }
  triggerManualSync(platformType: number) {
    this.isstreamuploadmenuProcessing = true;
    this.merchantService.TriggerManualSync(this.merchantId, this.ConnectedPlatforms.filter(x => x.platformtype == platformType)[0].id).subscribe((data: any) => {
      this.toaster.info("Menu sync will be completed in 15 minutes.")
      this.isstreamuploadmenuProcessing = false;
      this.streamuploadmenuModal.hide()
      if (platformType === 2) {
        this.syncingFlipDish = true;
      }
    },
      (err) => {
        this.streamuploadmenuModal.hide()
        this.isstreamuploadmenuProcessing = false;
        this.toaster.error(err.error.message);
      }
    );
  }
  ConnectPlatform(modal: ModalDirective) {
    this.isProcessing = true;
    this.merchantService.ConnectPlatformApi(this.merchantId, this.flipDishDetailsObj).subscribe((data: any) => {
      modal.hide();
      if (typeof (data.data) != 'object') {
        this.toaster.info(data.data);
      }
      this.GetConnectedPlatforms()
    },
      (err) => {
        this.isProcessing = false;
        this.toaster.error(err.error);
      }
    );
  }
  merchantStreamStatusToogle(Status: boolean, platform: string) {
    this.streamplatformname = platform
    this.streamplatformstatus = Status

    this.DisconnectStreamPlatformcheckboxes = [
      { label: `Disabling this will stop order flow from Stream to Fonda for ${this.streamplatformname == 'doordashstream' ? 'DoorDash' : 'Grubhub'}.`, checked: false },
      { label: `To switch back to Email Protocol, you must contact ${this.streamplatformname == 'doordashstream' ? 'DoorDash' : 'Grubhub'} Support.`, checked: false },
      { label: `Additional steps are required in the Stream Portal to fully disconnect from ${this.streamplatformname == 'doordashstream' ? 'DoorDash' : 'Grubhub'}.`, checked: false }
    ];
    this.ConnectStreamPlatformcheckboxes = [
      { label: "Menu details (name, hours, prices, including platform-based prices) are correct.", checked: false },
      { label: "After Stream integration, Email Protocol will stop working.", checked: false },
      { label: `Additional steps are required in the Stream Portal to complete the ${this.streamplatformname == 'doordashstream' ? 'DoorDash' : 'Grubhub'} integration.`, checked: false }
    ];
    this.isAllChecked = false;
    this.popupcheckboxes = Status ? JSON.parse(JSON.stringify(this.ConnectStreamPlatformcheckboxes)) : this.DisconnectStreamPlatformcheckboxes
    this.streamplatformModal.show();
  }
  disconnectPlatform(platformType: number) {
    this.merchantService.DisonnectPlatform(this.merchantId, this.ConnectedPlatforms.filter(x => x.platformtype == platformType)[0].id).subscribe((data: any) => {
      this.toaster.info('Disconnected successfully')
      this.GetConnectedPlatforms();
    },
      (err) => {
        this.isProcessing = false;
        this.toaster.error(err.message);
      }
    );
  }
  getStoreinfo(platformType: number) {
    if (this.ConnectedPlatforms.length > 0) {
      let name = this.ConnectedPlatforms.filter(x => x.platformtype === platformType)[0].metadata.store.store.name;
      let address = this.ConnectedPlatforms.filter(x => x.platformtype === platformType)[0].metadata.store.store.location.address
      return [name, address]
    }
    return ['', '']
  }
  GetConnectedPlatforms() {
    this.isProcessing = true;
    this.isFlipDishConnected = false;
    this.isstreamEnable = false
    this.isstreamConnected = false
    this.syncingFlipDish = false;
    this.ConnectedPlatforms = [];
    this.merchantService.GetConnectedPlatforms(this.merchantId).subscribe((data: any) => {
      if (data.data && data.data.length) {
        this.ConnectedPlatforms = data.data;

        let flipdishObj = this.ConnectedPlatforms.filter(x => x.platformtype == 2)[0]
        if (flipdishObj != undefined && Object.keys(flipdishObj).length > 0) {
          this.isFlipDishConnected = true
          this.flipDishAutoSync = String(flipdishObj.synctype)
        }
        let StreamObj = this.ConnectedPlatforms.filter(x => x.platformtype == 8)[0]
        if (StreamObj != undefined && Object.keys(StreamObj).length > 0) {
          console.log("StreamObj is ", StreamObj)

          this.isstreamEnable = Boolean(StreamObj.syncstatus);
          this.doordashstream = Boolean(StreamObj.doordashstream)
          this.grubhubstream = Boolean(StreamObj.grubhubstream)
          this.streamAutoSync = String(StreamObj.synctype)
          if (StreamObj.id != '') {
            this.isstreamConnected = true
          }
        }

      } else {

      }
      this.isProcessing = false;
    },
      (err) => {
        // this.flipDishObj =;
        this.isProcessing = false;
        this.toaster.error(err.message);
      }
    );
  }
  onToggleChange() {
    console.log("status of stream is ", this.isstreamEnable)
    this.isAllChecked = false;
    this.popupcheckboxes = this.isstreamEnable ? JSON.parse(JSON.stringify(this.ConnectStreamcheckboxes)) : JSON.parse(JSON.stringify(this.DisConnectStreamcheckboxes))
    this.impNote = this.isstreamEnable ? this.impForConnectStream : this.impForConnectDisconnectStream
    this.streamModal.show();
  }
  connectStream() {

    this.isstreamProcessing = true;
    this.merchantService.ToggleStreamStatus(this.merchantId, this.isstreamEnable).subscribe((data: any) => {
      this.isAccepted = false;
      this.isstreamProcessing = false;
      this.toaster.info('Stream Status Change Successfully')
      this.streamModal.hide();
      this.GetConnectedPlatforms()
    },
      (err) => {
        this.isstreamProcessing = false;
        this.closeStreamModal();
        console.log('errrrrrrrr', err.error.message)
        this.toaster.error(err.error.message);
      }
    );
  }
  closeStreamModal() {
    this.isAccepted = false;
    this.isstreamEnable = !this.isstreamEnable
    this.streamModal.hide();
  }
  closeStreamPlatformModal() {
    this.isAccepted = false;
    if (this.streamplatformname == 'doordashstream') { this.doordashstream = !this.streamplatformstatus }
    else { this.grubhubstream = !this.streamplatformstatus }
    this.streamplatformModal.hide();
  }

  connectplatformStream(Status: boolean, platform: string) {
    this.isstreamPlatfromProcessing = true;
    this.merchantService.StreamPlatformStatusData(this.merchantId, {
      "Status": Status,
      "platform": platform
    }).subscribe({
      next: data => {
        this.isstreamPlatfromProcessing = false;
        this.streamplatformModal.hide();
        this.toaster.success('Data saved successfully');
      }, error: err => {
        if (platform == 'doordashstream') { this.doordashstream = !Status }
        else { this.grubhubstream = !Status }
        this.closeStreamPlatformModal()
        this.toaster.error(err.error.message);
      }
    })
  }
  checkAllSelected() {
    this.isAllChecked = this.popupcheckboxes.every(item => item.checked);
  }
  openPopupformenuupload() {
    this.isAllChecked = false;

    // Create a deep copy so changes in popupcheckboxes don’t affect uploadFondaMenu
    this.popupcheckboxes = JSON.parse(JSON.stringify(this.uploadFondaMenu));
    this.streamuploadmenuModal.show(); // Open modal
  }
  getMsgTranslation(msg): string {
    // Assuming you have translations for each enum value in your language files\
    if (msg != '') {
      this.translocoService.selectTranslate('streamMsgs.' + msg).subscribe(translation => {
        msg = translation;
      });
    }
    return msg
  }
  getMsgTranslationforstreamplatfrom(): string {
    let msg = `${this.streamplatformname == 'doordashstream' ? 'DoorDash' : 'Grubhub'} ${this.streamplatformstatus ? 'Activation' : 'Deactivation'}`
    return this.getMsgTranslation(msg)

  }
}
