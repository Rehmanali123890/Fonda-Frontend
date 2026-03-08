import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { MerchantService } from 'src/app/core/merchant.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-menu-template',
    templateUrl: './menu-template.component.html',
    styleUrls: ['./menu-template.component.scss']
})
export class MenuTemplateComponent implements OnInit {
    @Input() merchantId: string;
    @Input() menuId: string;
    @Input() PlatformsListOriginal: Array<any>
    @Output() triggerChangeParent = new EventEmitter<any>();
    loading: boolean = false;
    selectedPlatformWhileAdding: Array<string> = [];
    fileToUpload: File | null = null;
    @ViewChild('AssignPlatformModal') AssignPlatformModal: ModalDirective;
    @ViewChild('takeInput', { static: false }) InputVar: ElementRef;
    constructor(private toaster: ToastrService, private merchantservice: MerchantService,) { }

    ngOnInit(): void {
        this.PlatformsListOriginal = this.PlatformsListOriginal.filter(x => x.type == 'platform')
    }
    downloadTemplate() {
        this.loading = true;
        this.merchantservice.getMenuTemplateURL(this.merchantId).subscribe((data: any) => {
        
            Object.assign(document.createElement('a'), {
                target: '_blank',
                href: data.data.download_url,
            }).click();
            this.loading = false
        }, (err) => {
            this.loading = false;
            this.toaster.error(err.error.message);
        })
    }

    handleFileInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const files: FileList | null = inputElement.files;
    
        if (files && files.length > 0) {
            this.fileToUpload = files.item(0);
            // Perform further actions with the file if needed
            this.AssignPlatformModal.show();
        }
    }
    fillPlatformSelection() {
        this.selectedPlatformWhileAdding = [];
    }

    updateFileToServer(modal: ModalDirective) {
        this.loading = true;
        this.merchantservice.uploadItemsCSV(this.merchantId, this.fileToUpload, this.selectedPlatformWhileAdding.join(',')).subscribe((data: any) => {
            this.toaster.success("File uploaded successfully.")
            this.clearSelection()
            this.AssignPlatformModal.hide()
            this.loading = false;
            this.triggerChangeParent.emit();
        }, (err) => {
            this.loading = false;
            this.toaster.error(err.error.message);
        })
    }
    clearSelection() {

        this.fileToUpload = null;
        this.InputVar.nativeElement.value = "";

    }
}
