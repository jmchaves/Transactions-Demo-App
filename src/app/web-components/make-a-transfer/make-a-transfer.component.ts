import { Component, OnInit, Output,  SimpleChanges, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { Transaction } from '../../transaction/transaction';
import { TransactionService } from '../../transaction/transaction.service';
import { TransactionPreviewComponent } from '../../web-components/transaction-preview/transaction-preview.component';

@Component({
  selector: 'app-make-a-transfer',
  templateUrl: './make-a-transfer.component.html',
  styleUrls: ['./make-a-transfer.component.css']
})
export class MakeATransferComponent implements OnInit {

  /***************************************************
  - Variables
  ************************************************** */
  @Output() newTransaction: EventEmitter<Transaction> = new EventEmitter<Transaction>();
  transaction: Transaction = new Transaction;
  allTransactions: Transaction[];
  showConfirmation = false;
  showNoFunds = false;
  disabledSubmit = false;
  availableBalance = 5824.76;
  makeATransferForm: FormGroup;
  makeATransferFormAccount: FormControl;
  makeATransferFormAmount: FormControl;
  filteredTransactions: Observable<Transaction[]>;

  constructor(private TransactionService: TransactionService,
              public dialog: MdDialog) {}

  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getTransactions();
  }

  /***************************************************
  - Avoids zero in the input
  ************************************************** */
  onKeyAmount(): void {
    if (String(this.transaction.amount)  === '0') {
        this.transaction.amount = '';
    }
  }

  /***************************************************
  - Valids the form and opens modal preview
  ************************************************** */
  submit(): void {
    if (this.availableBalance >= parseFloat(this.transaction.amount)) {
      if (this.makeATransferForm.valid) {
        this.openDialog();
      }
    } else {
      this.showNoFundsFn();
    }
  }

  /***************************************************
  - Generates a code for the new transaction (randomly)
  ************************************************** */
  generateCategoryCode(): string {
    const types =
    [
      '#12a580',
      '#d51271',
      '#c12020',
      '#c89616',
      '#e25a2c',
      '#1180aa',
      '#fbbb1b'
    ];
    const number = Math.floor((Math.random() * 7) + 0);
    return types[number];
  }

  /***************************************************
  - Generates a logo for the new transaction (randomly)
  ************************************************** */
  generateMerchantLogo(merchant): string {
    const number = Math.floor((Math.random() * 10) + 0);
    return this.allTransactions[number].merchantLogo;
  }

  /***************************************************
  - Generates a type for the new transaction (randomly)
  ************************************************** */
  generateTransactionType(): string {
    const types =
    [
      'Online Transfer',
      'Card Payment',
      'Transaction'
    ];
    const number = Math.floor((Math.random() * 3) + 0);
    return types[number];
  }

  /***************************************************
  - Shows the transaction confirmation
  ************************************************** */
  showConfirmationFn(): void {
    this.showConfirmation = true;
    setTimeout(() => {
      this.showConfirmation = false;
    }, 3000);
  }

  /***************************************************
  - Shows a no funds error
  ************************************************** */
  showNoFundsFn(): void {
    this.showNoFunds = true;
    setTimeout(() => {
      this.showNoFunds = false;
    }, 3000);
  }

  /***************************************************
  - Creates the transaction form
  ************************************************** */
  createForm(): void {
    this.makeATransferForm = new FormGroup({
      merchant: this.makeATransferFormAccount,
      amount: this.makeATransferFormAmount
    });
  }

  /***************************************************
  - Creates the controls for the form
  ************************************************** */
  createFormControls(): void {
    this.makeATransferFormAccount = new FormControl('', [
      Validators.required
    ]);

    this.makeATransferFormAmount = new FormControl('', [
      Validators.required,
      Validators.max(500)
    ]);
  }

  /***************************************************
  - Manages a custom validation (Account)
  ************************************************** */
  myErrorMatcherAccount(control) {
    return this.makeATransferFormAccount.invalid && this.makeATransferFormAccount.dirty.valueOf();
  }

  /***************************************************
  - Manages a custom validation (Amount)
  ************************************************** */
  myErrorMatcherAmount(control) {
    return (this.makeATransferFormAmount.invalid &&
            this.makeATransferFormAmount.dirty.valueOf())
            || String(this.transaction.amount) === '0';
  }

  /***************************************************
  - Gets transactions for autocomplete input (Account)
  ************************************************** */
  getTransactions(): void {
    const self = this;
    self.TransactionService
    .getTransactions()
      .then(function(transactions){
        self.allTransactions = transactions;
        self.filteredTransactions = self.makeATransferFormAccount.valueChanges
        .startWith(null)
        .map(transaction => transaction ? self.filterTransactions(transaction) : self.allTransactions.slice());
    });
  }

  /***************************************************
  - Filter transactions by typing
  ************************************************** */
  filterTransactions(merchant: string) {
    return this.allTransactions.filter(transaction =>
      transaction.merchant.toLowerCase().indexOf(merchant.toLowerCase()) === 0);
  }

  /***************************************************
  - Sends and shows the preview transaction
  ************************************************** */
  openDialog(): void {
    this.disabledSubmit = true;
    const dialogRef = this.dialog.open(TransactionPreviewComponent, {
      width: '350px',
      disableClose : true,
      data: { transaction : this.transaction, availableBalance : this.availableBalance }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.disabledSubmit = false;
      if (result) {
        this.transaction.transactionDate = new Date();
        this.transaction.categoryCode = this.generateCategoryCode();
        this.transaction.merchantLogo = this.generateMerchantLogo(this.transaction.merchant);
        this.transaction.transactionType = this.generateTransactionType();
        this.newTransaction.emit(this.transaction);
        this.availableBalance -= parseFloat(this.transaction.amount);
        this.allTransactions.push(this.transaction);
        this.transaction = new Transaction;
        this.showConfirmationFn();
        this.makeATransferForm.reset();
      }
    });
  }
}
