import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from "moment";
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
// import { MdProgressBarModule } from 'ng-uikit-pro-standard/lib/pro/progressbars/progress-bars-module';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { MerchantListDto, MerchantStatusEnum, PayoutCalculations, PayoutTypeDescription, SubscriptionDescription } from 'src/app/Models/merchant.model';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.scss']
})
export class PayoutComponent implements OnInit {
  startDate: string | Date;
  endDate: string | Date;
  payoutType: number = 1;
  payoutAdjustments: number;
  remarks: string = "";
  PayoutTypeDescription = PayoutTypeDescription;
  @Input() merchantDto = new MerchantListDto();
  @Input() gettingMerchantDetail: boolean;
  @Input() merchantId: string;
  @Input() selectedTab: string;
  gettingCalculations: boolean;
  showDetails: boolean = false
  gettingTransfers: boolean = false;
  disableTransferBtn: boolean = false;
  PayoutCalculationsObj: PayoutCalculations
  PayoutCalculationsListObj: PayoutCalculations[] = []
  SubscriptionDescription = SubscriptionDescription;
  gettingFinanceReport: boolean = false;
  gettingSummaryReport: boolean = false;
  gettingHistoryReport: boolean = false;
  localNetPayoutBackup: number = 0;
  tagsEmailDistributionArray: string[] = [...this.merchantDto.emailDistributionList];

  constructor(private toaster: ToastrService, private merchantService: MerchantService, private securityService: SecurityService,) { }
  @ViewChild('createOurPoints') createOurPoints: ModalDirective;

  ngOnInit(): void {

    this.GetMerchantDetail()
    // this.startDate = moment().format('YYYY-MM-DD');
    // this.endDate = moment().format('YYYY-MM-DD');
    this.startDate = moment().subtract(6, 'days').format("YYYY-MM-DD");
    this.endDate = moment().format('YYYY-MM-DD');
    this.getTransferList();
    this.grabInputDataChip();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedTab == "payouts") {
      this.startDate = moment().subtract(6, 'days').format("YYYY-MM-DD");
      this.endDate = moment().format('YYYY-MM-DD');
      this.showDetails = false
      this.PayoutCalculationsObj = new PayoutCalculations()
      this.getTransferList();
    }

  }

  reCalculatePayout() {
    this.PayoutCalculationsObj.netPayout = this.localNetPayoutBackup;
    if (this.payoutAdjustments !== undefined || this.payoutAdjustments != null) {
      this.PayoutCalculationsObj.netPayout = this.PayoutCalculationsObj.netPayout + this.payoutAdjustments
    }
  }
  // logic for mobile
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }
  getTransferList() {
    this.merchantId = localStorage.getItem("currentMerchant")

    this.gettingTransfers = true;
    this.merchantService.GetMerchantTransfers(this.merchantId).subscribe((data: any) => {
      this.PayoutCalculationsListObj = data.data
      // for mobile view
      this.expandtable = new Array(this.PayoutCalculationsListObj.length).fill({ expandtable: false, idx: 0 });
      this.expandtable = this.expandtable.map((item, idx) => {
        return {
          ...item,
          idx: idx
        }
      })
      this.gettingTransfers = false;
    }, (err) => {
      this.gettingTransfers = false;
      this.toaster.error(err.error.message);
    })
  }


  openModalforCreatePoints() {
    this.createOurPoints.show()
  }
  closeModal() {
    this.createOurPoints.hide();
  }

  // TAG INPUT CHIPS !!!
  removeTag(tag) {
    let index = this.tagsEmailDistributionArray.indexOf(tag);
    this.tagsEmailDistributionArray = this.tagsEmailDistributionArray.filter((email, idx) => email !== tag)
  }

  grabInputDataChip() {
    const input: any = document.querySelector("input.tagChipInputField");

    const createTag = () => {
      this.tagsEmailDistributionArray.push()
    }
    createTag();


    const addTag = (e) => {
      if (e.key == "Enter") {
        let tag = e.target.value.replace(/\s+/g, ' ');
        if (tag.length > 1 && !this.tagsEmailDistributionArray.includes(tag)) {
          tag.split(',').forEach(tag => {
            this.tagsEmailDistributionArray.push(tag);
            createTag();
          });
        }
        e.target.value = "";
      }
    }

    // input.addEventListener("keyup", addTag);
    /* Remove All Button */
    // const removeBtn: any = document.querySelector(".tagChipDetails>button");
    // removeBtn.addEventListener("click", () =>{
    //     tags.length = 0;
    //     ul.querySelectorAll("li").forEach(li => li.remove());
    // });
  }
  GetMerchantDetail() {
    // this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.merchantId).subscribe((data: MerchantListDto) => {
    //   this.merchantDto = data;

    //   if (this.merchantDto.emailDistributionList != null) {
    //     this.tagsEmailDistributionArray = [...this.tagsEmailDistributionArray, ...this.merchantDto.emailDistributionList.split(";")]
    //   }
    //   else {
    //     this.tagsEmailDistributionArray = [...this.tagsEmailDistributionArray]
    //   }

    // }, (err) => {
    //   this.toaster.error(err.message);
    // })
  }

  transferHistoryReport() {
    this.gettingHistoryReport = true;
    this.merchantService.historyReport(this.merchantId, {
      'startDate': this.startDate,
      'endDate': this.endDate,
      'emails': this.tagsEmailDistributionArray
      // 'email': JSON.parse(localStorage.getItem('securityData')).user.email,
    }).subscribe((data) => {
      this.gettingHistoryReport = false;
      this.toaster.success("You will receive the report on your email shortly.");
      this.closeModal()
    }, err => {
      this.gettingHistoryReport = false;
      this.toaster.error(err.error.message);
    })
  }

  transferringBank: boolean = false
  transferToBank(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed to payout!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.transferringBank = true;
        this.merchantService.transferToBank(id, this.merchantId).subscribe((data: any) => {
          this.toaster.success("Paid out! Refreshing data.")
          this.getTransferList()
          this.transferringBank = false;
        }, (err) => {
          this.transferringBank = false;
          this.toaster.error(err.error.message);
        })
      }
    })

  }

}
