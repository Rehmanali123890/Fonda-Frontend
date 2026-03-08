

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankReconciliationService } from '../core/bank-reconciliation.service'; // Import the combined service
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bank-reconciliation',
  templateUrl: './bank-reconciliation.component.html',
  styleUrls: ['./bank-reconciliation.component.css']
})
export class BankReconciliationComponent {
  FondaFile: File | null = null;
  doordashFile: File | null = null;
  grubhubFile: File | null = null;
  ubereatsFile: File | null = null;

  reconciliationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bankreconciliationservice:BankReconciliationService, // Inject the combined service
    private toaster: ToastrService

  ) {
    this.reconciliationForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
  }

  onFileChange(event: any, fileType: string): void {
    const file = event.target.files[0];
    
    switch(fileType) {
      case 'fonda':
        this.FondaFile = file;
        break;
      case 'doordash':
        this.doordashFile = file;
        break;
      case 'grubhub':
        this.grubhubFile = file;
        break;
      case 'ubereats':
        this.ubereatsFile = file;
        break;
    }
  }

  uploadFile(fileType: string): void {
    let file: File | null = null;
    
    switch(fileType) {
      case 'fonda':
        file = this.FondaFile;
        break;
      case 'doordash':
        file = this.doordashFile;
        break;
      case 'grubhub':
        file = this.grubhubFile;
        break;
      case 'ubereats':
        file = this.ubereatsFile;
        break;
    }
    


    if (file) {
      this.bankreconciliationservice.uploadFile(file, fileType).subscribe({
        next: (response) => {
          this.resetFile(fileType)
          console.log(`${fileType} file uploaded successfully`, response);
          
    
           this.toaster.success(response.status)
        },
        error: (err) => {
          console.error('Upload failed', err);
           this.toaster.error(err.error.message)
        }
      });
    }
  }


    // Helper method to reset the file property
  resetFile(fileType: string): void {
    switch(fileType) {
      case 'fonda':
        this.FondaFile = null;
        break;
      case 'doordash':
        this.doordashFile = null;
        break;
      case 'grubhub':
        this.grubhubFile = null;
        break;
      case 'ubereats':
        this.ubereatsFile = null;
        break;
    }
  }



  reconcile(): void {
    if (this.reconciliationForm.valid) {
      const { fromDate, toDate } = this.reconciliationForm.value;
      this.bankreconciliationservice.reconcile(fromDate, toDate).subscribe({
        next: (result) => {
 
          console.log('Reconciliation successful:', result);
          this.reconciliationForm.reset()
          this.toaster.success(result.status )
         
            
        },
        error: (err) => {
          console.error('Reconciliation failed:', err);
          this.reconciliationForm.reset()
          this.toaster.error(err)
          
        }
      });
    }
  }

  get canReconcile(): boolean {
    return this.reconciliationForm.valid;
  }
}
