import { MerchantListDto } from 'src/app/Models/merchant.model';
import { HttpClient } from '@angular/common/http';
import { MerchantProductOverViewDto, MerchantReportDto, RevenusByPlatform, TimeReport, revenueTimeReport, revenueReportDto } from './../../Models/analytics.model';
import { AppStateService } from 'src/app/core/app-state.service';
import { AnalyticsService } from './../../core/analytics.service';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantService } from 'src/app/core/merchant.service';
import { SecurityService } from 'src/app/core/security.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from "moment";
import { UserRoleEnum } from 'src/app/Models/user.model';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { LoginDto } from 'src/app/Models/security.model';
import { environment } from 'src/environments/environment';
import { TranslocoService } from '@ngneat/transloco';
import * as XLSX from 'xlsx';
import { th } from 'intl-tel-input/i18n';
import * as Plotly from 'plotly.js-dist-min';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  popupheadeing: string
  @Input() merchantDto = new MerchantListDto();
  tagsEmailDistributionArray: string[] = []
  userRoleType: UserRoleEnum;
  financepayoutcalculationObj = [];
  selectedMerchantId: string;
  gettingMerchantReportData: boolean;
  payoutType: number = 2;
  merchantReportData = new MerchantReportDto();
  revenueReportData = new revenueReportDto();
  orderReportData = new RevenusByPlatform();
  productPreviewData = new MerchantProductOverViewDto();
  startDate: string | Date;
  endDate: string | Date;
  ApplystartDate: string | Date;
  ApplyendDate: string | Date;
  time: any
  loaltyPoints: any
  isOrdersTab = false;
  isRevenueTab = true;
  showRevenueModal = false;
  exportingChart = false;
  modalChartOptions: any;
  RevenueDeatilsPlatformData: boolean = false
  ShowtotalMarketPlaceUbereats: boolean = true
  gettingProductPreviewData: boolean;
  reportChartLabels: any[] = [];
  analyticsOfVRList: any[] = [];
  public reportsChartData;
  revenueChartData: any[];
  revenueChartLabels: string[];
  public chartType: string = 'line';
  public chartColors = [];
  fonda_revenue: number
  displayTable: boolean = false
  isDtInitialized: boolean = false
  showmainloader: boolean = true
  cardloader: boolean = false;
  orderloader: boolean = false;
  chartloader: boolean = false;
  showGMV: boolean = true;
  showNetEarning: boolean = false;
  gettingHistoryReport: boolean = false;
  exporting: any;
  layout: any;
  config: any;

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild('basicModal') basicModal: ModalDirective;

  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @ViewChild('chartContainer2', { static: false }) chartContainer2!: ElementRef;
  // Predefine layout and config


  public chartOptions: any = {
    responsive: true,
    plugins: {
      background: {
        color: 'white'
      },
      datalabels: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0
      }
    },
    tooltips: {
      callbacks: {
        label: (t, d) => {
          var icon = '';
          if (!this.isOrdersTab) {
            icon = '$ '
          }
          return ` ${icon}${t.yLabel}`;
        }
      }
    }
  };
  rvenueCHartColors: { backgroundColor: string; borderColor: string; borderWidth: number; }[];
  gettingMerchants: boolean;
  MerchantsList: MerchantListDto[];
  selectedMerchant = new MerchantListDto();
  filterType = 2;

  revenuByPlatformData: RevenusByPlatform[]

  constructor(public http: HttpClient, public auth: AuthService, private toaster: ToastrService, private securityService: SecurityService, private filterData: FilterDataService, private router: Router,
    private appState: AppStateService, private anaLytics: AnalyticsService, private merchantService: MerchantService, private appUi: AppUiService, private route: ActivatedRoute, private translocoService: TranslocoService) { }

  @ViewChild('createOurPoints') createOurPoints: ModalDirective;

  Login(loginObj) {
    this.securityService.Login(loginObj).subscribe((data) => {
      this.router.navigateByUrl('/home/dashboard');
      if (data) {
        window.location.reload();
      }
      this.route.queryParams.subscribe(params => {
        console.log("params are ", params)
        this.startDate = params['startDate'];
        this.endDate = params['endDate'];
        this.filterType = 5
      });

      if (!this.startDate && !this.endDate) {
        this.startDate = moment().format('YYYY-MM-DD');
        this.endDate = moment().format('YYYY-MM-DD');
        this.filterType = 2
      }
      this.subscribeAppState();

      this.GetMerchantsList();
      // this.getMerchantProductsOverview();
      //this.getRevenueByPlatformData()
      this.downTime()
      this.FinancialAnalyticsOfVR()
      this.allLoaltyPoints();
      this.loaltyPoints = []
      this.changeDateAccordinglyAndSearch()
      this.setdatatable()
      this.getMerchantReport();
    }, (err) => {
      this.toaster.error(err?.error?.error || 'username or password is incorrect');
    })
  }
  login_google() {
    this.auth.loginWithRedirect();
  }
  logout_google(): void {
    this.auth.logout();
  }
  dtOptions: DataTables.Settings = {};
  checkUserStatus(token: string, userId: string): void {
    const managementApiUrl = `https://${environment.SSODomain}/api/v2/users/${userId}`;

    this.http.get(managementApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (userData: any) => {
        if (userData.blocked) {
          console.warn('User is blocked in Auth0.');
          this.auth.logout();  // Perform logout
          this.securityService.LogOut(true);  // Handle your own security logic for logout
        } else {
          console.log('User is active in Auth0.');
        }
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          console.error('Token expired or invalid:', err);
          this.auth.logout();  // Perform logout when token is expired or invalid
          this.securityService.LogOut(true);  // Handle your own security logic for logout
        } else if (err.status === 404) {
          console.error('User not found in Auth0 (might be removed).');
          this.auth.logout();  // Perform logout when user is not found
          this.securityService.LogOut(true);  // Handle your own security logic for logout
        } else {
          console.error('Error retrieving user status from Auth0:', err);
        }
      }
    });
  }

  printCallbackValues(): void {

    this.auth.user$.subscribe((user) => {
      console.log('User Profile: ', user);

      if (user) {
        var token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRrSVdGeE90TnJQSDgxc1dvR1Z2QSJ9.eyJpc3MiOiJodHRwczovL2Rldi16YWU3cWd2bjMyeG15dTNnLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJzYW1scHxzYW1sfEthbSIsImF1ZCI6WyJodHRwczovL2Rldi16YWU3cWd2bjMyeG15dTNnLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9kZXYtemFlN3Fndm4zMnhteXUzZy51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzI4Mzk0Njg0LCJleHAiOjE3Mjg0ODEwODQsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgcmVhZDpjdXJyZW50X3VzZXIiLCJhenAiOiJPdTVIeW9ueTNtbVdQWTRHQ0xuM1Z4WThtTEg5SDFqQSJ9.IcWlHh95YgEIKSDRKXQB1CU-6G4Onk9_qhpcJLviBtUsxcNJSP1zBdNyOm722F1Di_n99bKF0Rc7DNWSia0nUH0ZIncU77pDSpq5wGGqG8lr4EVP2Z9Pz5iyvmoUUpv0euuEy71WRk8Cmxxe5yTjy7Ms6d-E6FD9RLXIOeam9RxiJ_sLiA6tQesndPJd00MIqK4TKoRFd_F8iMP1I1zst7nhMGjVHbLZkcVNJNKik_kWLASJ21mz_FtinVFfCJQWqJGyTqkg6cvaWxLlR2c8i8X4O-ZZAyTf2sSceS3CGCu4FfyNaOKNhSjjiZBOHvVRmMkPiJbE9CYUx8GkBtZb1g'
        this.checkUserStatus(token, user.sub); // Call the function to check user status

      }
    });


  }
  iniatlize_plotly_graph(tempTraces) {
    const allYValues = tempTraces.flatMap(t => t.y).filter((v: number) => Number.isFinite(v));
    const maxY = Math.max(...allYValues);
    const minY = Math.min(...allYValues);

    // Handle flat or 1-point data
    let span = maxY - minY;
    if (!isFinite(span) || span <= 0) {
      span = Math.max(1, Math.abs(maxY || 0)) * 0.2; // 20% of value or 1
    }

    // Propose dtick, cap to 500, snap to nice steps
    const idealTicks = 6;
    let rawDtick = Math.ceil((span / idealTicks) / 100) * 100; // to hundreds
    let dtick = 0
    if (rawDtick < 1000) {
      const choices = [100, 200, 300, 400, 500];
      dtick = choices.find(c => c >= rawDtick) ?? 500;
    }

    // Padding (10% of span), at least one dtick
    const padding = Math.max(span * 0.1, dtick);

    // Preliminary range
    let lower = minY - padding;
    let upper = maxY + padding;

    // Snap range to dtick multiples
    const snapDown = (v: number, step: number) => Math.floor(v / step) * step;
    const snapUp = (v: number, step: number) => Math.ceil(v / step) * step;
    lower = snapDown(lower, dtick);
    upper = snapUp(upper, dtick);
    lower = Math.max(0, lower);

    // ✅ Ensure we have at least one tick span
    if (upper <= lower) upper = lower + dtick;

    this.layout = {
      title: '',
      autosize: true,
      // << keep inside the card/container
      xaxis: {
        // title: { text: 'Weeks', font: { size: 14, color: '#1f2e4d' } },
        tickfont: { color: '#1f2e4d' },
        showgrid: false,
        showline: true,
      },
      yaxis: {
        // title: { text: 'Estimated Net Earnings*', font: { size: 14, color: '#1f2e4d' }, standoff: 20 },
        tickfont: { color: '#1f2e4d' },
        gridcolor: '#e6e6e6',
        tickformat: ',d',
        showline: true,
        dtick,
        range: [lower, upper]
      },
      legend: {
        orientation: 'h', // keep horizontal
        y: -0.2,           // move closer to X-axis
        x: 0.0,
        xanchor: 'left',
        yanchor: 'top'
      },
      margin: { l: 60, r: 20, t: 20, b: 60 },
      plot_bgcolor: 'white',
      paper_bgcolor: 'white'
    };

    this.config = {
      responsive: true
    };
  }


  ngOnInit(): void {

    // this.printCallbackValues();
    if (this.route.snapshot.queryParams['email'] && this.route.snapshot.queryParams['password']) {
      // this.securityService.LogOut();
      let email = decodeURIComponent(this.route.snapshot.queryParams['email']);
      let password = decodeURIComponent(this.route.snapshot.queryParams['password']);
      this.Login({ email: email, password: password });
    }


    this.route.queryParams.subscribe(params => {
      this.startDate = params['startDate'];
      this.endDate = params['endDate'];
      this.filterType = 5
    });

    if (!this.startDate && !this.endDate) {
      this.startDate = moment().format('YYYY-MM-DD');
      this.endDate = moment().format('YYYY-MM-DD');
      this.filterType = 2
    }
    this.subscribeAppState();

    this.GetMerchantsList();
    // this.getMerchantProductsOverview();
    //this.getRevenueByPlatformData()
    this.downTime()
    this.FinancialAnalyticsOfVR()
    this.allLoaltyPoints();
    this.loaltyPoints = []
    this.changeDateAccordinglyAndSearch()
    this.setdatatable()
    this.getMerchantReport();

  }
  ngAfterViewInit(): void {
    // this.dtTrigger.next(null);
  }

  noDataAvailableText: string = '';


  setdatatable(): void {
    this.dtOptions = {
      serverSide: false,  // Set the flag for server-side processing
      ajax: (dataTablesParameters: any, callback) => {
        console.log("ajax call");
        this.anaLytics.getMerchantProductsOverview(this.selectedMerchantId, this.startDate, this.endDate).subscribe((data: any) => {
          this.productPreviewData = data.data;
          const formattedData = [];
          console.log("this.productPreviewData.products", this.productPreviewData.products);

          // Iterate over each item in the responseData array
          for (const item of this.productPreviewData.products) {
            // Create a new object with required properties
            var formattedItem = {
              // Assuming productId is unique and can be used as ID
              "Product Name": item.productName, // Assuming productName corresponds to 'Product Name'
              "Product Price": `$${item.productPrice.toFixed(2)}`, // Assuming productPrice corresponds to 'Product Price', and formatting it as a string
              "Quantity Sold": item.quantitySold, // Assuming quantitySold corresponds to 'Quantity Sold'
              "Sales Revenue": `$${item.salesRevenue.toFixed(2)}` // Assuming salesRevenue corresponds to 'Sales Revenue', and formatting it as a string
            };
            formattedData.push(formattedItem);
          }

          this.gettingProductPreviewData = false;
          console.log("formattedItem", formattedData);

          // Call the callback function to update the table
          callback({
            recordsTotal: this.productPreviewData.products.length,
            recordsFiltered: this.productPreviewData.products.length,
            data: formattedData
          });

        }, (err) => {
          this.gettingProductPreviewData = false;
          this.toaster.error(err.error.message);
        });
      },
      columns: [
        { title: this.translocoService['Product Name'], data: 'Product Name' },
        { title: this.translocoService['Product Price'], data: 'Product Price' },
        { title: this.translocoService['Quantity Sold'], data: 'Quantity Sold' },
        { title: this.translocoService['Sales Revenue'], data: 'Sales Revenue' }
      ]
    };
  }

  // Open the revenue chart modal
  openRevenueChartModal() {
    console.log('Opening revenue chart modal...');


    console.log('Creating revenue report chart...');
    this.createRevenueReportChart(true);
    // Show the modal
    this.showRevenueModal = true;

    // Prevent body scrolling
    document.body.classList.add('modal-open');

    console.log('Modal opened:', this.showRevenueModal);
  }



  initializeModalChart() {
    this.modalChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: 'white',
      plugins: {
        background: {
          color: 'white'
        },
        datalabels: {
          display: false,
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          // Filter tooltips to exclude trend lines only
          filter: function (tooltipItem) {
            // Hide tooltip for datasets that contain 'Trend' in their label
            return !tooltipItem.dataset.label.includes('Trend');
          },
          callbacks: {
            label: function (tooltipItem) {
              const value = tooltipItem.parsed.y;
              return ` $${value.toLocaleString()}`;
            }
          }
        }
      },
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(0,0,0,0.1)'
          },
          ticks: {
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(0,0,0,0.1)'
          },
          ticks: {
            callback: function (value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      layout: {
        padding: 10
      },
      animation: {
        onComplete: function () {
          const chart = this;
          const ctx = chart.ctx;
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
      }
    };
  }


  // Close the revenue chart modal
  closeRevenueModal() {
    console.log('Closing revenue chart modal...');
    this.showRevenueModal = false;

    // Re-enable body scrolling
    document.body.classList.remove('modal-open');
  }

  onRevenueChartClick(event: any) {
    console.log('Chart clicked, isRevenueTab:', this.isRevenueTab);
    if (this.isRevenueTab) {
      this.openRevenueChartModal();
    } else {
      this.chartClicked(event);
    }
  }


  subscribeAppState() {
    this.selectedMerchantId = this.appState.currentMerchant;
    this.appState.merchantChangedSubject.pipe(untilDestroyed(this)).subscribe((merchntId) => {
      this.selectedMerchantId = merchntId;
      this.getMerchantReport();

      this.fillMerchant();
      this.getRevenueByPlatformData()
    })
  }

  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  getRevenueByPlatformData() {
    if (this.selectedMerchantId == undefined) {
      this.toaster.info("select the merchant from side bar")
      return
    }
    this.anaLytics.getMerchantRevenueByPlatfrom(this.selectedMerchantId, this.startDate, this.endDate).subscribe((data: any) => {
      this.revenuByPlatformData = data.data.sources
      this.fonda_revenue = data.data.channels_revenue.fonda_revenue
      console.log("log data", this.revenuByPlatformData)

    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }

  applyChartFilters() {
    if (!this.showGMV && !this.showNetEarning) {
      this.toaster.warning('Please select at least one option (GMV or Net Earning) to display the chart.');
      return;
    }

    this.chartloader = true;

    setTimeout(() => {
      console.log('Apply button clicked - GMV:', this.showGMV, 'Net Earning:', this.showNetEarning);
      this.createRevenueReportChart();
      this.chartloader = false;

    }, 300);
  }

  GetMerchantsList() {
    this.gettingMerchants = true;
    this.merchantService.GetMerchants(this.securityService.securityObject.token).subscribe((data: MerchantListDto[]) => {
      this.MerchantsList = data;
      this.fillMerchant();
      this.gettingMerchants = false;
      this.changeDateAccordinglyAndSearch();

    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.error.message);
    })
  }

  fillMerchant() {

    this.selectedMerchant = this.MerchantsList.find(x => x.id === this.selectedMerchantId) || new MerchantListDto();
    localStorage.setItem("currentMerchant", this.selectedMerchant.id)
  }


  getRevenueReport() {
    this.ApplystartDate = this.startDate
    this.ApplyendDate = this.endDate
    this.chartloader = true;
    this.anaLytics.getMerchantRevenueReport(this.selectedMerchantId, this.startDate, this.endDate).subscribe((data: any) => {
      this.revenueReportData = data.data;
      if (this.isRevenueTab) {
        this.createRevenueReportChart();
      }
      this.chartloader = false;

    }, (err) => {
      this.toaster.error(err.error.message);
      this.chartloader = false;
    })

  }

  getMerchantReport = () => {
    if (!this.selectedMerchantId) {
      return;
    }
    this.ApplystartDate = this.startDate
    this.ApplyendDate = this.endDate
    this.gettingMerchantReportData = true;
    this.orderloader = true;
    this.anaLytics.getMerchantReport(this.selectedMerchantId, this.startDate, this.endDate).subscribe((data: any) => {
      this.merchantReportData = data.data;


      this.createMerchantReportChart();
      this.getRevenueReport();
      this.createRevenueChart();
      this.calculateOrTransfer();
      this.gettingMerchantReportData = false;
      this.orderloader = false;


    }, (err) => {
      this.gettingMerchantReportData = false;
      this.orderloader = false;
      this.toaster.error(err.error.message);
    })
  };
  calculateOrTransfer() {
    const mData = {
      "startDate": this.startDate,
      "endDate": this.endDate,
      "createTransfer": 0,
      "orderSource": "",
      "payoutType": this.payoutType,
      "unlocked_only": 2
    };
    this.cardloader = true

    this.merchantService.getfinancepayout(this.selectedMerchantId, mData).subscribe((data: any) => {

      this.financepayoutcalculationObj = data.data
      this.showmainloader = false
      this.cardloader = false
      this.getMerchantProductsOverview();
    }, (err) => {
      this.cardloader = false
      this.getMerchantProductsOverview();
      this.toaster.error(err.error.message);
    })
  }

  downTime() {
    this.anaLytics.getDownTime(this.selectedMerchantId, this.startDate, this.endDate).subscribe((data: any) => {
      this.time = [data.data.pauseTimeFormatted];
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  allLoaltyPoints() {
    this.merchantService.getAllPoints(this.selectedMerchantId).subscribe((data: any) => {
      this.loaltyPoints = data.data;
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  FinancialAnalyticsOfVR() {
    if (!this.selectedMerchantId) {
      return;
    }
    this.anaLytics.getFinancialAnalyticsOfVR(this.selectedMerchantId, this.startDate, this.endDate).subscribe((data: any) => {
      this.analyticsOfVRList = data.data;
    }, (err) => {
      this.toaster.error(err.error.message);
    })
  }
  getMerchantProductsOverview() {

    if (!this.selectedMerchantId) {
      return;
    }
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy(); // Destroy the existing DataTable
        this.dtTrigger.next(null); // Reinitialize the DataTable
      });
    } else {
      this.dtTrigger.next(null); // Initialize the DataTable if it doesn't exist
    }

  }
  calculateTrend(data: number[]): number[] {
    const N = data.length;
    const x = Array.from({ length: N }, (_, i) => i + 1); // 1..N
    const y = data;

    const sum_x = x.reduce((acc, val) => acc + val, 0);
    const sum_y = y.reduce((acc, val) => acc + val, 0);
    const sum_x2 = x.reduce((acc, val) => acc + val ** 2, 0);
    const sum_xy = x.reduce((acc, val, i) => acc + val * y[i], 0);

    const denominator = (N * sum_x2 - sum_x ** 2);
    let a: number;

    if (denominator === 0) {
      a = 0;
    } else {
      a = (N * sum_xy - sum_x * sum_y) / denominator;
    }

    const b = (sum_y - a * sum_x) / N;

    const trend = x.map(xi => parseFloat((a * xi + b).toFixed(2)));
    return trend;
  }
  createRevenueReportChart(ismodal?: boolean) {
    console.log("createRevenueReportChart called");
    var revenueArr = [];
    var tempLabels = [];
    var netEarningsArr = [];
    var dayCountForMonth: number = 0;

    console.log("this.revenueReportData.timeReport", this.revenueReportData.timeReport);

    // For monthly view (filterType 4 or 5), we need to aggregate daily data into weekly chunks
    if ((+this.filterType === 4 || +this.filterType === 5) && this.revenueReportData.timeReport.length > 7) {
      // Monthly view - aggregate data weekly
      let weeklyRevenueData = [];
      let weeklyNetEarningsData = [];
      let weeklyLabels = [];

      let currentWeekRevenue = 0;
      let currentWeekNetEarnings = 0;
      let weekStartDate = null;

      this.revenueReportData.timeReport.forEach((element: revenueTimeReport, index: number) => {
        if (weekStartDate === null) {
          weekStartDate = element.date;
        }

        currentWeekRevenue += Number(element.revenue) || 0;
        currentWeekNetEarnings += Number(element.net_earning) || 0;
        dayCountForMonth++;

        // Every 7 days or last day, push the aggregated data
        if (dayCountForMonth % 7 === 0 || index === this.revenueReportData.timeReport.length - 1) {
          weeklyRevenueData.push(currentWeekRevenue);
          weeklyNetEarningsData.push(currentWeekNetEarnings);

          // Use the end date of the week for label
          const endDate = moment(element.date);
          const startDate = endDate.clone().subtract(6, 'days'); // Go back 6 days for full week
          const dateF = `${startDate.format('MM/DD')} - ${endDate.format('MM/DD')}`;
          weeklyLabels.push(dateF);

          // Reset for next week
          currentWeekRevenue = 0;
          currentWeekNetEarnings = 0;
          weekStartDate = null;
        }
      });

      revenueArr = weeklyRevenueData;
      netEarningsArr = weeklyNetEarningsData;
      tempLabels = weeklyLabels;

    } else {
      // Daily view or weekly data - use original logic
      this.revenueReportData.timeReport.forEach(
        (element: revenueTimeReport, index: number) => {
          const dateF = moment(element.date).format('MM/DD');
          tempLabels.push(dateF);
          revenueArr.push(Number(element.revenue) || 0);
          netEarningsArr.push(Number(element.net_earning) || 0);
        }
      );
    }

    // Use the processed data
    const finalRevenueData = revenueArr;
    const finalNetEarningsData = netEarningsArr;
    const finalLabels = tempLabels;

    // For trend data, we need to aggregate it similarly if it's monthly view
    let trendNetEarning = [];
    let trendRevenue = [];

    if ((+this.filterType === 4 || +this.filterType === 5) && this.revenueReportData.timeReport.length > 7) {
      // Aggregate trend data weekly
      if (this.revenueReportData.trendNetEarning) {
        let weeklyTrendNetEarnings = [];
        let currentWeekTrend = 0;

        this.revenueReportData.trendNetEarning.forEach((val, index) => {
          currentWeekTrend += Number(val) || 0;
          if ((index + 1) % 7 === 0 || index === this.revenueReportData.trendNetEarning.length - 1) {
            weeklyTrendNetEarnings.push(currentWeekTrend);
            currentWeekTrend = 0;
          }
        });
        trendNetEarning = weeklyTrendNetEarnings;
      }

      if (this.revenueReportData.trendRevenue) {
        let weeklyTrendRevenue = [];
        let currentWeekTrend = 0;

        this.revenueReportData.trendRevenue.forEach((val, index) => {
          currentWeekTrend += Number(val) || 0;
          if ((index + 1) % 7 === 0 || index === this.revenueReportData.trendRevenue.length - 1) {
            weeklyTrendRevenue.push(currentWeekTrend);
            currentWeekTrend = 0;
          }
        });
        trendRevenue = weeklyTrendRevenue;
      }
    } else {
      // Use original trend data for daily view
      trendNetEarning = this.revenueReportData.trendNetEarning ?
        this.revenueReportData.trendNetEarning.map(val => Number(val) || 0) : [];
      trendRevenue = this.revenueReportData.trendRevenue ?
        this.revenueReportData.trendRevenue.map(val => Number(val) || 0) : [];
    }

    const tempTraces: any[] = [];
    // Add GMV datasets if selected
    if (this.showGMV) {
      if (finalRevenueData.length > 0) {
        tempTraces.push({
          x: finalLabels,
          y: finalRevenueData,
          mode: 'lines+markers',
          name: 'GMV',
          type: 'scatter',
          line: { color: 'rgba(16, 83, 128, 1)', width: 2 },
          marker: { size: 6 },
          hovertemplate: 'GMV : $%{y:,.2f}<extra></extra>'
        });
      }
      if (trendRevenue.length > 0 && trendRevenue.some(val => val > 0)) {
        tempTraces.push({
          x: finalLabels,
          y: this.calculateTrend(finalRevenueData),
          mode: 'lines+markers',
          name: 'GMV Trend',
          type: 'scatter',
          line: { color: 'rgb(85,100,174)', width: 2, dash: 'dash' },
          marker: { size: 6 },
          hovertemplate: 'GMV Trend : %{y:,.2f}<extra></extra>'
        });
      }
    }

    // Add Net Earning datasets if selected
    if (this.showNetEarning) {
      if (finalNetEarningsData.length > 0) {
        tempTraces.push({
          x: finalLabels,
          y: finalNetEarningsData,
          mode: 'lines+markers',
          name: 'Estimated Net Earnings*',
          type: 'scatter',
          line: { color: 'green', width: 2 },
          marker: { size: 6 },
          hovertemplate: 'Net Earning : $%{y:,.2f}<extra></extra>'
        });
      }
      if (trendNetEarning.length > 0 && trendNetEarning.some(val => val > 0)) {
        tempTraces.push({
          x: finalLabels,
          y: this.calculateTrend(finalNetEarningsData),
          mode: 'lines+markers',
          name: 'Net Earnings Trend',
          type: 'scatter',
          line: { color: 'limegreen', width: 2, dash: 'dash' },
          marker: { size: 6 },
          hovertemplate: 'Net Earning Trend : %{y:,.2f}<extra></extra>'
        });
      }
    }
    console.log("tempTraces", tempTraces);
    console.log("tempLabels", tempLabels);
    console.log("Plotly chart rendering now...");
    this.iniatlize_plotly_graph(tempTraces)
    const plotAndFilterButtons = (container: any) => {
      Plotly.newPlot(container, tempTraces, this.layout, { responsive: true });
      setTimeout(() => {
        const sel =
          '.modebar-btn[data-title="Box Select"],' +
          '.modebar-btn[data-title="Lasso Select"],' +
          '.modebar-btn[data-title="Autoscale"],' +
          '.modebar .modebar-btn--logo';
        document.querySelectorAll(sel).forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
      }, 50);
    };
    if (ismodal) {
      setTimeout(() => plotAndFilterButtons(this.chartContainer2.nativeElement), 100);
    } else {
      setTimeout(() => plotAndFilterButtons(this.chartContainer.nativeElement), 100);
    }
  }

  createMerchantReportChart() {
    var tempLabels = [];
    var ordersArr = [];
    var dayCountForMonth: number = 0;
    this.cardloader = true;
    this.merchantReportData.timeReport.forEach(
      (element: TimeReport, index: number) => {
        var dateF = moment(element.date).format('D MMM');

        if ((+this.filterType !== 4 && +this.filterType !== 5) || this.merchantReportData.timeReport.length === 7) {
          dateF = moment(element.date).format('D MMM');
          tempLabels.push(dateF);
          ordersArr.push(element.orders);
        } else if (+this.filterType === 4 || +this.filterType === 5) {

          dateF = moment(element.date).format('D MMM');
          ordersArr.push(element.orders);
          if ((dayCountForMonth + 1) % 7 === 0) {
            dateF = moment(this.merchantReportData.timeReport[dayCountForMonth].date).format('D MMM');
            tempLabels.push(dateF);
          }
          if (dayCountForMonth === 0 || ((dayCountForMonth + 1) === this.merchantReportData.timeReport.length && JSON.stringify(tempLabels.filter(date => date === dateF)) === '[]')) {
            dateF = moment(element.date).format('D MMM');
            tempLabels.push(dateF);
          }
        }
        // const dateF = element.date = moment(element.date).format('D MMM YY,\\ h:mm a');

        dayCountForMonth++
      }
    );

    const tempArr = new Array<any>();
    if (this.isOrdersTab) {
      tempArr.push({ data: ordersArr, label: 'Orders', fill: true }); // ,tension: 0.1
      this.chartColors = [
        {
          backgroundColor: 'rgba(105, 0, 132, .2)',
          borderColor: 'rgba(105, 0, 132, .2)',
          // borderColor: 'rgba(200, 99, 132, .7)',
          borderWidth: 2,
        }
      ];
    }
    this.reportsChartData = tempArr;
    this.reportChartLabels = tempLabels;
    this.cardloader = false;
  }
  changeDateAccordinglyAndSearch(custom?) {
    // if (+this.filterType === 1) {
    //   this.startDate = moment().format('YYYY-MM-DD');
    //   this.endDate = moment().format('YYYY-MM-DD');
    // }

    console.log("Revnue Tab---->", this.isRevenueTab)
    if (+this.filterType === 2) {
      this.startDate = moment().subtract(6, 'days').format("YYYY-MM-DD");
      this.endDate = moment().format('YYYY-MM-DD');
    }
    if (+this.filterType === 3) {
      this.startDate = moment().startOf('week').subtract(1, 'days').startOf('week').add(1, 'day').format("YYYY-MM-DD");
      this.endDate = moment().startOf('week').format('YYYY-MM-DD');
    }
    if (+this.filterType === 4) {
      this.startDate = moment().startOf('month').subtract(1, 'days').startOf('month').format("YYYY-MM-DD");
      this.endDate = moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD');
    }

    const sTime = moment(this.startDate);
    const eTime = moment(this.endDate);
    const res = sTime.isAfter(eTime);
    if (res) {
      this.toaster.warning('Start Date should not be greater than End Date');
      return;
    }

    if (+this.filterType === 5) {
      const maxEndDate = moment(this.startDate).clone().add(6, 'months');

      if (moment(this.endDate).isAfter(maxEndDate)) {
        this.toaster.warning('Date range cannot exceed 6 months');
        return;
      }
    }
    // }

    if (custom) {
      this.getMerchantReport();

      this.getRevenueByPlatformData();
      this.downTime();
      this.FinancialAnalyticsOfVR()
    }
    else {
      console.log("Revnue Tab (2)---->", this.isRevenueTab)
      if (+this.filterType !== 5) {
        this.getMerchantReport();

        this.getRevenueByPlatformData();
        this.downTime();
        this.FinancialAnalyticsOfVR()
      }
      console.log("Revnue Tab (3)---->", this.isRevenueTab)


    }

  }
  createRevenueChart() {
    var tempLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var revenueArr = [];

    this.merchantReportData.timeReport.forEach(x => {
      x['dayIndex'] = moment(x.date).format('d');
    })
    if (this.merchantReportData.revenueByDay != null) {
      var SunRev = (this.merchantReportData.revenueByDay.sunday.toFixed(2));
      var MonRev = (this.merchantReportData.revenueByDay.monday.toFixed(2));
      var TueRev = (this.merchantReportData.revenueByDay.tuesday.toFixed(2));
      var WedRev = (this.merchantReportData.revenueByDay.wednesday.toFixed(2));
      var ThuRev = (this.merchantReportData.revenueByDay.thursday.toFixed(2));
      var FriRev = (this.merchantReportData.revenueByDay.friday.toFixed(2));
      var SatRev = (this.merchantReportData.revenueByDay.saturday.toFixed(2));
      revenueArr = [MonRev, TueRev, WedRev, ThuRev, FriRev, SatRev, SunRev];
    }
    else {
      revenueArr = [0, 0, 0, 0, 0, 0, 0];
    }
    const tempArr = new Array<any>();
    tempArr.push({ data: revenueArr, label: 'Revenue', fill: false }); // ,tension: 0.1
    this.rvenueCHartColors = [
      {
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 2,
      }
    ];
    this.revenueChartData = tempArr;
    this.revenueChartLabels = tempLabels;
  }
  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  onCardClick(item: any) {
    // Event handling logic here

    this.ShowtotalMarketPlaceUbereats = true


    this.orderReportData.totalOrderSubtotal = item.totalOrderSubtotal
    this.orderReportData.totalTax = item.totalTax
    this.orderReportData.totalStaffTips = item.totalStaffTips
    this.orderReportData.totalComission = item.totalComission
    this.orderReportData.totalSquareFee = item.totalSquareFee
    this.orderReportData.totalProcessingFee = item.totalProcessingFee
    this.orderReportData.totalErrorCharges = item.totalErrorCharges
    this.orderReportData.totalOrderAdjustments = item.totalOrderAdjustments
    this.orderReportData.totalMarketPlaceUbereats = item.totalMarketPlaceUbereats
    this.orderReportData.totalPromo = item.totalPromo

    if (item.hasOwnProperty('source')) {
      this.RevenueDeatilsPlatformData = true
      this.orderReportData.source = item.source
      if (this.orderReportData.source == "uber eats") {
        this.ShowtotalMarketPlaceUbereats = true
      }
      else {
        this.ShowtotalMarketPlaceUbereats = false
      }
      if (item.revenue > 0) {
        this.basicModal.show()
      }
    }
    else {
      this.RevenueDeatilsPlatformData = false
    }
    // Perform any other actions you want
  }

  //transaction summary report

  // TAG INPUT CHIPS !!!
  removeTag(tag) {
    let index = this.tagsEmailDistributionArray.indexOf(tag);
    this.tagsEmailDistributionArray = this.tagsEmailDistributionArray.filter((email, idx) => email !== tag)
  }

  grabInputDataChip() {
    const input: any = document.querySelector("input.tagChipInputField");

    if (!input) {
      return;
    }

    const createTag = () => {
      this.tagsEmailDistributionArray.push();
    };
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
    };

    input.addEventListener("keyup", addTag);
    /* Remove All Button */
    // const removeBtn: any = document.querySelector(".tagChipDetails>button");
    // removeBtn.addEventListener("click", () =>{
    //     tags.length = 0;
    //     ul.querySelectorAll("li").forEach(li => li.remove());
    // });
  }


  inputText: string = '';
  onEnterKeyPressed(e): void {
    let tag = this.inputText.replace(/\s+/g, ' ');
    if (tag.length > 1 && !this.tagsEmailDistributionArray.includes(tag)) {
      tag.split(',').forEach(tag => {
        this.tagsEmailDistributionArray.push(tag);
      });
    }
    this.inputText = "";
  }

  GetMerchantDetail() {

    this.merchantService.GetMerchantById(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;

      if (this.merchantDto.emailDistributionList != null) {
        this.tagsEmailDistributionArray = [...this.tagsEmailDistributionArray, ...this.merchantDto.emailDistributionList.split(";")]
      }
      else {
        this.tagsEmailDistributionArray = [...this.tagsEmailDistributionArray]
      }
      console.log("this.emaildistrubuiton list is ", this.tagsEmailDistributionArray)
    }, (err) => {
      this.toaster.error(err.message);
    })
  }

  openModalforCreatePoints(popupheadingText: string) {
    this.translocoService.selectTranslate(popupheadingText).subscribe(translation => {
      this.popupheadeing = translation;
    });
    this.tagsEmailDistributionArray = []
    this.GetMerchantDetail()
    this.createOurPoints.show()
  }
  closeModal() {
    this.createOurPoints.hide();
  }

  gettingSummaryReportNew: boolean = false
  financeReportSummaryNewFormat() {


    this.gettingSummaryReportNew = true
    if (this.tagsEmailDistributionArray[0] == '') {
      this.tagsEmailDistributionArray.shift();
    }
    this.merchantService.sendSummaryEmailFinancepayout(this.selectedMerchantId, {
      'startDate': this.startDate,
      'endDate': this.endDate,
      "payoutType": this.payoutType,
      // 'email': "saimabdullah1234@gmail.com;saimabdullah@paalam.co.uk;fondaabc@gmail.com",
      'email': this.tagsEmailDistributionArray
      // 'email': JSON.parse(localStorage.getItem('securityData')).user.email,
    }).subscribe({
      next: result => {
        this.toaster.success('You will receive the transaction summary report on your email shortly!')
        this.gettingSummaryReportNew = false
        this.closeModal()
      }, error: err => {
        this.toaster.error(err.error.message)
        this.gettingSummaryReportNew = false
      }
    })
  }


  //transaction report

  downloadTransactionReport(format: string) {
    const startDate = new Date(this.startDate).toISOString().split('T')[0];
    const endDate = new Date(this.endDate).toISOString().split('T')[0];
    const platform = "";  // Use the platform you're interested in

    this.exporting = true;

    const selectedFormat = format;  // This could be a variable like 'excel' or 'csv' set by the user

    this.merchantService.getTransactionSummaryReport(this.selectedMerchantId, startDate, endDate, platform).subscribe(
      (response: Blob) => {
        let filename = `Transaction Summary Report - ${this.merchantDto.merchantName} (from ${startDate} to ${endDate})`;  // Default filename

        // Check the selected format
        if (selectedFormat === 'excel') {
          // If the user selects Excel, download the file as is
          const url = window.URL.createObjectURL(response);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = filename + '.xlsx';  // Set the default Excel file extension
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          window.URL.revokeObjectURL(url);  // Clean up the Blob URL

        } else if (selectedFormat === 'csv') {
          // If the user selects CSV, convert the Excel to CSV on the frontend and download
          const reader = new FileReader();
          reader.onload = () => {
            // Read the file as an Excel workbook
            const data = new Uint8Array(reader.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            // Convert the first sheet to CSV
            const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);

            // Create a Blob for CSV and trigger download
            const csvBlob = new Blob([csvData], { type: 'text/csv' });
            const csvUrl = window.URL.createObjectURL(csvBlob);

            const anchor = document.createElement('a');
            anchor.href = csvUrl;
            anchor.download = filename.replace('.xlsx', '.csv');  // Change extension to .csv
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(csvUrl);  // Clean up the Blob URL
          };
          reader.readAsArrayBuffer(response);  // Read the response as ArrayBuffer
        }

        this.exporting = false;
      },
      (err) => {
        this.toaster.error(err.error.message);
        this.exporting = false;
      }
    );
  }

}
