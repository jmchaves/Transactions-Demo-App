import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Transaction } from '../../transaction/transaction';

@Component({
  selector: 'app-transaction-preview',
  templateUrl: './transaction-preview.component.html',
  styleUrls: ['./transaction-preview.component.css']
})
export class TransactionPreviewComponent {

  constructor(public dialogRef: MatDialogRef<TransactionPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /***************************************************
  - Variables
  ************************************************** */
  buttonText = 'Transfer';
  showLoading = false;

  /***************************************************
   - Sends confirmation and closes the modal
  ************************************************** */
  transfer(): void {
    // HTTP REQUEST SIMULATION
    this.showLoading = true;
    this.buttonText = 'Transfering...';
    setTimeout(() => {
      this.showLoading = false;
      this.dialogRef.close(true);
    }, 3000);
  }
}
