import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from "moment";
import { ToastrService } from 'ngx-toastr';
// import { MdProgressBarModule } from 'ng-uikit-pro-standard/lib/pro/progressbars/progress-bars-module';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { sendgridemailobj } from 'src/app/Models/merchant.model';


@Component({
  selector: 'app-sendgrid-email-summary',
  templateUrl: './sendgrid-email-summary.component.html',
  styleUrls: ['./sendgrid-email-summary.component.scss']
})
export class SendgridEmailSummaryComponent implements OnInit {

  @Input() merchantId: string;
  @Input() selectedTab: string;
  SendGridEmailObj: sendgridemailobj[] = []
  SendGridEmailObjLength: number = 0
  uniqueEmails = []
  to_email: string = 'All Emails'
  constructor(private toaster: ToastrService, private merchantService: MerchantService, private securityService: SecurityService,) { }


  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {

    this.GetSendGridEmailSummaryDetail()
  }
  myFunction() {
    this.GetSendGridEmailSummaryDetail()
  }

  // logic for mobile
  expandtable: { expandtable: boolean, idx: number }[] = [];
  onChangeExpandtable(idx) {
    this.expandtable[idx].expandtable = !this.expandtable[idx].expandtable
  }


  GetSendGridEmailSummaryDetail() {
    this.uniqueEmails = []
    this.to_email = "All Emails"
    this.merchantService.GetSendGridEmailSummary(this.securityService.securityObject.token, this.merchantId).subscribe((data: sendgridemailobj) => {
      this.SendGridEmailObj = data['data'];
      // for mobile view
      // this.expandtable = new Array(this.SendGridEmailObj.length).fill({ expandtable: false, idx: 0 });
      this.expandtable = this.expandtable.map((item, idx) => {
        return {
          ...item,
          idx: idx
        }
      })

      this.SendGridEmailObjLength = 0


      if (this.SendGridEmailObj && Object.keys(this.SendGridEmailObj).length > 0) {
        const emailSet = new Set<string>();
        emailSet.add('All Emails')
        for (let i in this.SendGridEmailObj) {
          const item = this.SendGridEmailObj[i];
          emailSet.add(item.to_email);
        }
        this.uniqueEmails = Array.from(emailSet);
        this.SendGridEmailObjLength = 1
      }
    }, (err) => {
      this.toaster.error(err.message);
    })
  }



}
