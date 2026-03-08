import { MySocketService } from './../../core/my-socket.service';
import { AppStateService } from './../../core/app-state.service';
import { SecurityService } from './../../core/security.service';
import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { UserRoleEnum } from 'src/app/Models/user.model';
import { MerchantService } from 'src/app/core/merchant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilterDataService } from 'src/app/core/filter-data.service';
import { MerchantListDto } from 'src/app/Models/merchant.model';
import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { TranslocoService } from '@ngneat/transloco';
import { environment } from 'src/environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { LanguageService } from 'src/app/core/languageSetting.services';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  merchantDto = new MerchantListDto();
  userRoleType: UserRoleEnum;
  UserRoleEnum = UserRoleEnum;
  gettingMerchants: boolean;
  selectedMerchantId: string;
  showNotificationIcon: boolean = false;
  showErrorNotificationIcon: boolean = false;
  MerchantsList: MerchantListDto[];
  originalMerchantsList: MerchantListDto[] = [];

  CheckMerchantName: boolean = false
  isMuted: boolean = false;
  showheaderloader: boolean = false
  username = ''
  includesURL = ['/home/dashboard', '/home/products/productsList', '/platforms', '/home/merchants/StoreFrontSettingsComponent',
    '/home/merchants/StripeTreasuryAccountComponent', '/home/merchants/woflow', '/home/merchants/MerchantSubscriptionDetailsComponent', '/home/merchants/merchant-setting', '/home/customers/customer']
  showTransactiontab: boolean = true
  emailList: string[] = ['prem@paalam.co.uk', 'shanprem@paalam.co.uk', 'saimabdullah@paalam.co.uk', 'azam@theapptopus.com', 'ahmad@paalam.co.uk','nariman@mifonda.io','ayesha@mifonda.io','clarizarullan@mifonda.io','prem@mifonda.io'];
  constructor(public auth: AuthService, private toaster: ToastrService, private securityService: SecurityService, private router: Router, private mysocket: MySocketService,
    private merchantservice: MerchantService, private eventBus: EventBusService, private filterDataService: FilterDataService, private appState: AppStateService,
    private translocoService: TranslocoService, private route: ActivatedRoute, private languageService: LanguageService) { }

  Login(loginObj) {
    this.securityService.Login(loginObj).subscribe((data) => {
      this.router.navigateByUrl('/home/dashboard');
    })
  }
  ngOnInit(): void {
    if (this.route.snapshot.queryParams['email'] && this.route.snapshot.queryParams['password']) {
      // this.securityService.LogOut();
      let email = decodeURIComponent(this.route.snapshot.queryParams['email']);
      let password = decodeURIComponent(this.route.snapshot.queryParams['password']);
      this.Login({ email: email, password: password });
    }
    const currentPageUrl = window.location.href;
    if (this.includesURL.some(url => currentPageUrl.includes(url))) {
      this.CheckMerchantName = true
    }
    console.log("this.securityService.securityObject.user ", this.securityService.securityObject.user)
    if (environment.production == true) {
      if (!this.emailList.includes(this.securityService.securityObject.user.email)) {
        this.showTransactiontab = false
      }
    }
    this.userRoleType = this.securityService.securityObject.user.role;
    this.username = this.securityService.securityObject.user['username'];
    this.showheaderloader = true

    this.GetMerchantsList();
    this.eventBus.on(EventTypes.newActivityLog).subscribe(data => {
      this.showNotificationIcon = true
      //
    })
    this.eventBus.on(EventTypes.errorLog).subscribe(data => {
      this.showErrorNotificationIcon = true
      //
    })
    this.isSmallScreen = window.innerWidth <= 767;
    this.isSideNavActive = window.innerWidth >= 1468; // Show by default on large screens
    this.containerStyles = this.getContainerStyles();
    const savedSoundState = localStorage.getItem('isMuted');

    if (savedSoundState) {
      if (savedSoundState == 'true') {
        this.isMuted = true
      }
      else {
        this.isMuted = false
      }
    }
    else {
      this.isMuted = false
    }

    // Get the language from the service (which prefers localStorage)
    this.currentLang = this.languageService.getCurrentLanguage();

  }
  // language change
  currentLang: string = 'en';
  isDropdownOpen: boolean = false;

  changeLanguage(lang: string) {
    this.languageService.setLanguage(lang);
    this.currentLang = lang;
  }

  toggleDropdownLanguage() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  containerStyles: { [key: string]: string };
  isSideNavActive = true;
  isSmallScreen = window.innerWidth <= 767;
  isSecSmallScreen = window.innerWidth >= 767;

  // for selected merchant in the user dropdown
  selectedMerchant: string = '';

  onMerchantChange(event: any) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    this.selectedMerchant = selectedOption.text;

    this.MerchantChanged();
  }

  isOpen: string | null = null;

  ngAfterViewInit(): void {
    this.initializeDropdown();
  }

  initializeDropdown() {
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown')) {
        this.isOpen = null; // Close dropdowns if clicking outside
      }
    });
  }

  toggleDropdown(dropdown: string): void {
    this.isOpen = this.isOpen === dropdown ? null : dropdown;
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }



  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Update isSmallScreen on window resize
    this.isSmallScreen = window.innerWidth <= 767;

    // Always show the side navigation on large screens
    this.isSideNavActive = window.innerWidth >= 1468;

    // Update container styles based on isSideNavActive
    this.containerStyles = this.getContainerStyles();
  }
  getContainerStyles(): { [key: string]: string } {
    let marginTopValue = '5em'; // Default margin value
    if (this.merchantDto.merchantStatus === 0 && this.CheckMerchantName === true) {
      marginTopValue = '9em';
    }
    if (this.isSideNavActive) {
      return {
        'transition': '0.4s',
        'width': '87%',
        'margin': 'auto',
        'margin-top': marginTopValue // Add margin-top conditionally based on merchant status
      };
    } else {
      return {
        'transition': '0.4s',
        'width': '87%',
        'margin': 'auto',
        'margin-top': marginTopValue // Add margin-top conditionally based on merchant status
      };
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('isMuted', this.isMuted.toString());
  }

  navigateToMerchantSetting(merchant: MerchantListDto) {
    this.router.navigateByUrl(`/home/merchants/merchant-setting/${merchant.id}`);
  }
  getMainStyles(): { [key: string]: string } {
    if (this.isSideNavActive && window.innerWidth >= 1468) {
      return {
        'width': '85%',
        'margin-left': 'auto',
        'margin-right': '-1em',
      };
    }
    return {}; // Return an empty object if isSideNavActive is false
  }

  getbarsMargin() {
    return this.isSideNavActive ? '10.3em' : '0px';
  }
  getheadingMargin() {
    return this.isSideNavActive ? '1em' : '1.5em';
  }
  getRedBannerMargin() {
    return this.isSideNavActive ? '14.3em' : '0px';
  }
  parentFunction(merchantid: string) {
    this.selectedMerchantId = merchantid
    this.MerchantChanged()

  }
  shouldDisplayElement(name: boolean) {
    this.CheckMerchantName = name

    // const currentPageUrl = this.router.url;
    // if(includesURL.some(url => currentPageUrl.includes(url))){

    // }else{

    // }
    // Check if CheckMerchantName is 'true' and if the current page URL matches the desired pattern
    // return this.CheckMerchantName === 'true' && currentPageUrl.includes('/desired-pattern');
  }
  toggleSideNav() {
    this.isSideNavActive = !this.isSideNavActive;
  }
  changelang(lang) {

    // this.translocoService.setActiveLang(lang);
    localStorage.setItem('lang', lang);
  }
  async NavigateToLogs() {
    if (this.router.url.includes('/home/logs/activity-log')) {
      //this.emitEvent(EventTypes.newActivityLog, null);
    } else {
      const compl = await this.router.navigateByUrl('/home/logs/logs');
      this.showNotificationIcon = false
      // setTimeout(() => {
      //   this.emitEvent(EventTypes.RefreshOrderEvent, '');
      // }, 1000);
    }
  }



  async NavigateToErrorLogs() {
    if (this.router.url.includes('/home/logs/error-log')) {
      //this.emitEvent(EventTypes.newActivityLog, null);
    } else {
      const compl = await this.router.navigateByUrl('/home/logs/error-log');
      this.showErrorNotificationIcon = false
      // setTimeout(() => {
      //   this.emitEvent(EventTypes.RefreshOrderEvent, '');
      // }, 1000);
    }
  }
  private emitEvent(type: EventTypes, data: any) {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = type;
    event.value = data;
    this.eventBus.emit(event);
  }
  GetMerchantsList() {
    this.gettingMerchants = true;
    this.merchantservice.GetMerchants(this.securityService.securityObject.token).subscribe((data: MerchantListDto[]) => {
      this.MerchantsList = data;
      this.originalMerchantsList = [...data];
      if (!this.appState.currentMerchant && this.MerchantsList && this.MerchantsList.length) {
        this.selectedMerchantId = this.MerchantsList[0].id;
        this.MerchantChanged();
      } else if (this.appState.currentMerchant && this.MerchantsList && this.MerchantsList.length) {
        const find = this.MerchantsList.find(x => x.id === this.appState.currentMerchant);
        if (find) {
          this.selectedMerchantId = this.appState.currentMerchant;
          this.GetMerchantDetail()
        }
      }
      this.gettingMerchants = false;
    }, (err) => {
      this.gettingMerchants = false;
      this.toaster.error(err.error.message);
    })
  }
  searchTerm: string = '';
  filterMerchants(term: string): void {
    if (term) {
      // If there is a search term, filter the merchants list
      this.MerchantsList = this.originalMerchantsList.filter(item =>
        item.merchantName.toLowerCase().includes(term.toLowerCase())

      );
      this.searchTerm = ''
    } else {
      // If the search term is empty, reset the merchants list to the original list
      this.MerchantsList = [...this.originalMerchantsList];
    }

  }
  MerchantChanged() {
    this.showheaderloader = true
    this.appState.currentMerchant = this.selectedMerchantId;
    this.GetMerchantDetail()
    const currentUrl = window.location.href;
    if (currentUrl.includes('unlocked_only=2'))
      this.router.navigate(['/home/dashboard']);
  }

  Logout() {


    if (this.securityService.securityObject.user.withSSO == 1) {
      this.auth.logout();
      this.securityService.LogOut(true);
      this.mysocket.close();

    } else {
      this.securityService.LogOut(false);
      this.mysocket.close();
    }

  }
  GetMerchantDetail() {

    this.merchantservice.GetMerchantById(this.securityService.securityObject.token, this.selectedMerchantId).subscribe((data: MerchantListDto) => {
      this.merchantDto = data;
      this.selectedMerchant = data.merchantName;
      this.showheaderloader = false
      // Check if the language is already set from localStorage
      if (localStorage.getItem('lang')) {
        return; // Ignore API language
      }
      this.translocoService.setActiveLang(this.merchantDto.language);


    }, (err) => {
      this.toaster.error(err.message);
    })
  }
}
