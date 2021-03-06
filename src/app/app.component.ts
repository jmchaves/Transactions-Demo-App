import { Component } from '@angular/core';
import { Transaction } from './transaction/transaction';
import {MatDialog, MatDialogRef} from '@angular/material';
import {LoadingComponent} from './web-components/loading/loading.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /***************************************************
  - Variables
  ************************************************** */
  transaction: Transaction;
  dialogRef: MatDialogRef<LoadingComponent>;

  constructor(public dialog: MatDialog) {
    this.openDialog();
  }

  /***************************************************
  - It passes the new transaction to the table
  ************************************************** */
  addNewTransaction(event) {
    this.transaction = event;
  }

  /************************************************************
  - Opens the loading modal (simulates that the app is loading)
  ********************************************************** */
  openDialog() {
    this.dialogRef = this.dialog.open((LoadingComponent), {
      disableClose : true
    });

    // Loading simulation
    setTimeout(() => {
      this.dialogRef.close();
    }, 4000);
  }
}
