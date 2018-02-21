import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import {MatPaginator, MatSort, MatSortable, MatButtonToggleGroup} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { TransactionService } from '../../transaction/transaction.service';
import { Transaction } from '../../transaction/transaction';
import { TransactionDataSource } from '../../transaction/transactions-data-source';

@Component({
  selector: 'app-recent-transactions',
  templateUrl: './recent-transactions.component.html',
  styleUrls: ['./recent-transactions.component.css']
})
export class RecentTransactionsComponent implements OnInit, OnChanges {

  /***************************************************
  - Variables
  ************************************************** */
  @Input() addTransaction: Transaction;
  displayedColumns = ['transactionDate', 'merchantLogo', 'merchant', 'amount'];
  transactionsList: Transaction[] = [];
  transactionDataSource: TransactionDataSource | null;
  matSortable: MatSortable = {disableClear : true, id : 'transactionDate', start : 'asc'};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatButtonToggleGroup) toggleGroupSort: MatButtonToggleGroup;

  constructor(
    private TransactionService: TransactionService
  ) {}

  ngOnInit() {
    this.getTransactions();
  }

  /***************************************************
  - Gets transactions from json file
  ************************************************** */
  getTransactions(): void {
    const self = this;
    self.TransactionService
    .getTransactions()
      .then(function(transactions){
        self.initDataSource(transactions);
    });
  }

  /***************************************************
  - Init the data source to show the data
  ************************************************** */
  initDataSource(transactions): void {
    const self = this;
    self.sort.direction = 'asc';
    self.sort.active = 'transactionDate';
    self.transactionsList = transactions;
    self.transactionDataSource = new TransactionDataSource(self.transactionsList, self.paginator, self.sort);
    self.filterEvent();
    self.changeSortBy({value : 'transactionDate'}, 'asc');
  }

  /***************************************************
  - Creates the event keyup to filter transactions
  ************************************************** */
  filterEvent(): void {
    const self = this;
    Observable.fromEvent(self.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!self.transactionDataSource) { return; }
      self.transactionDataSource.filter = self.filter.nativeElement.value;
    });
  }

  /***************************************************
  - Changes the order of the transactions
  ************************************************** */
  changeSortBy(selected, startSort): void {
    setTimeout(() => {
      this.matSortable.id = selected.value;
      this.matSortable.start = startSort;
      this.sort.sort(this.matSortable);
    }, 100);
  }

  /********************************************************
  - Adds the new transaction with a trigger from its parent
  ****************************************************** */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['addTransaction'] && !changes['addTransaction'].firstChange) {
      this.transactionsList.push(this.addTransaction);
      if (this.sort.direction === 'asc' || this.sort.active !== 'transactionDate') {
        this.changeSortBy({value : 'transactionDate'}, 'desc');
        this.toggleGroupSort.value = 'transactionDate';
      }
      this.transactionDataSource.filter = '';
      this.filter.nativeElement.value = '';
    }
  }

  /********************************************************
  - Reset the filter input
  ****************************************************** */
  clearFilter(changes: SimpleChanges) {
    this.transactionDataSource.filter = '';
    this.filter.nativeElement.value = '';
  }
}
