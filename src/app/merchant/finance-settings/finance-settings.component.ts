import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { LazyModalDto } from 'src/app/Models/app.model';
import { MerchantListDto, MerchantStatusEnum } from 'src/app/Models/merchant.model';
import { UserRoleEnum } from 'src/app/Models/user.model';
import * as moment from "moment";
import * as descriptions from '../../../../src/app/tooltips-for-fields/tooltips';
import { ModalDirective } from 'angular-bootstrap-md';
import { ClonerService } from './../../core/DataServices/cloner.service';



@Component({
  selector: 'app-finance-settings',
  templateUrl: './finance-settings.component.html',
  styleUrls: ['./finance-settings.component.scss']
})
export class FinanceSettingsComponent implements OnInit {
  @Input() merchantDto = new MerchantListDto();
  @Input() gettingMerchantDetail: boolean;
  @Input() selectedTab: string;
  @Input() merchantId: string;
  merchantStatusEnum = MerchantStatusEnum;
  merchantStatusEnumList = this.filterDataService.getEnumAsList(MerchantStatusEnum);
  savingMerchant: boolean;
  savingMerchantComission: boolean;

  userRoleType: UserRoleEnum;

  // tooltips start
  businessTaxDescription = descriptions.businessTaxDescription;
  staffTipDescription = descriptions.staffTipDescription;
  ubereatsCommissionDescription = descriptions.ubereatsCommissionDescription;
  doordashCommissionDescription = descriptions.doordashCommissionDescription;
  grubhubCommissionDescription = descriptions.grubhubCommissionDescription;
  flipdishCommissionDescription = descriptions.flipdishCommissionDescription;
  processingfeeDescription = descriptions.processingfeeDescription;
  processingFeeFixedAmountDescription = descriptions.processingFeeFixedAmountDescription;
  marketPlaceDescription = descriptions.marketPlaceDescription;
  squareProcessingFeeDescription = descriptions.squareProcessingFeeDescription;
  minimumRevenueForSubscriptionDescription = descriptions.minimumRevenueForSubscriptionDescription;
  automaticRevenueProcessingFeeThresholdDescription = descriptions.automaticRevenueProcessingFeeThresholdDescription;
  revenueProcessingFeePercentageDescription = descriptions.revenueProcessingFeePercentageDescription
  downtimePercentageDescription = descriptions.downtimePercentageDescription
  previousState: any;
  checkboxes: any
  selectAll: boolean = false;

  fieldsToExtract = ['merchantTaxRate', 'staffTipsRate', 'ubereatsCommission', 'doordashCommission',
    'grubhubCommission', 'flipdishCommission', 'marketplaceTaxRate', 'DownTimeThreshold',
    'AutoWaivedStatus', 'squareCommission', 'RevenueProcessingFeePercent', 'RevenueProcessingThreshold', 'minimumLifetimeRevenue', 'MarketPlacePriceStatus'];


  checkboxes_enable: { label: string, checked: boolean }[] = [
    { label: 'Estimated Commission will be calculated using the values defined in the Fin components, and it will be updated to the Marketplace values during the reconciliation process.', checked: false },
    { label: 'After making the necessary adjustments click Save Button, changes will be applied automatically.', checked: false },
  ];

  checkboxes_disable: { label: string, checked: boolean }[] = [
    { label: 'Once disabled, item prices and commissions will no longer sync from the marketplace. You must manually manage pricing within our application.', checked: false },
    { label: ' If applicable, ensure that commission percentages are correctly configured in our system, as they will not be automatically restored.', checked: false },
    { label: 'After disabling click Save Button, changes will be applied automatically.', checked: false },
  ];

  constructor(private toaster: ToastrService, private securityService: SecurityService, private router: Router,
    private merchantservice: MerchantService, private filterDataService: FilterDataService, private appUi: AppUiService, private activatedRoute: ActivatedRoute, private cloner: ClonerService) { }

  @ViewChild('createOurPoints') createOurPoints: ModalDirective;

  ngOnInit(): void {
    this.userRoleType = this.securityService.securityObject.user.role;

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngOnChanges in finance setting")
    this.previousState = this.merchantDto.MarketPlacePriceStatus
  }


  isAllChecked = false;

  // Check if all checkboxes are checked
  checkAllChecked() {

    this.isAllChecked = this.checkboxes.every(checkbox => checkbox.checked);
  }

  toggleSelectAll() {
    this.checkboxes.forEach(checkbox => checkbox.checked = this.selectAll);
    this.isAllChecked = !this.isAllChecked;
  }
  resetObj() {
    this.merchantDto = new MerchantListDto();
  }

  merchantStatus() {
    this.merchantservice.marketStatusData(this.merchantId, {
      "marketStatus": this.merchantDto.marketStatus,
      "caller": "dashboard"
    }).subscribe({
      next: data => {
        this.toaster.success('Data saved successfully');
      }, error: err => {
        this.toaster.error(err.error.message);
      }
    })
  }

  saveMerchantComissionData() {
    this.savingMerchantComission = true;
    const newMerchantDto = this.extractFields()
    this.merchantservice.UpdateMerchantBusinessInfo(this.securityService.securityObject.token, this.merchantId, newMerchantDto).subscribe((data: MerchantListDto) => {
      this.toaster.success('Data saved successfully');
      this.merchantDto = data
      this.previousState = this.merchantDto.MarketPlacePriceStatus
      this.createOurPoints.hide();
      this.savingMerchantComission = false;
    }, (err) => {
      this.savingMerchantComission = false;
      this.toaster.error(err.error.message);
    })
  }
  preventNegativeInput(event: Event, propertyName?: string) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (parseFloat(inputValue) < 0 || Object.is(parseFloat(inputValue), -0)) {

      this.merchantDto[propertyName] = 0;
      inputElement.value = ''; // Clear the input value if it's negative
      event.preventDefault(); // Prevent the negative input
      event.stopPropagation();
    }
  }
  preventNegativeAndLessThanHunderedInput(event: Event, propertyName?: string) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (parseFloat(inputValue) < 0 || parseFloat(inputValue) > 100 || Object.is(parseFloat(inputValue), -0)) {
      this.merchantDto[propertyName] = 0;
      inputElement.value = ''; // Clear the input value if it's negative
      event.preventDefault(); // Prevent the negative input
    }
  }
  extractFields(): any {
    const result = {};
    this.fieldsToExtract.forEach(field => {
      if (this.merchantDto.hasOwnProperty(field)) {
        result[field] = this.merchantDto[field];
      }
    });
    return result;
  }


  openModalforConfirmation() {
    console.log("Previous State:", this.previousState);
    console.log("Current MarketPlacePriceStatus:", this.merchantDto.MarketPlacePriceStatus);

    // Convert both values to numbers or booleans to ensure proper comparison
    const prevState = Number(this.previousState);
    const currentState = Number(this.merchantDto.MarketPlacePriceStatus);

    if (currentState !== prevState) {
      this.checkboxes = currentState ? this.checkboxes_enable : this.checkboxes_disable;
      this.createOurPoints.show();
    }
  }
  closeModal() {
    this.createOurPoints.hide();
    this.merchantDto.MarketPlacePriceStatus = this.previousState
    this.resetCheckboxes()
  }

  savePopup() {
    this.saveMerchantComissionData()

    this.resetCheckboxes()

  }

  resetCheckboxes() {
    this.checkboxes.forEach(checkbox => checkbox.checked = false);
    this.isAllChecked = false;
    this.selectAll = false;
  }
}
