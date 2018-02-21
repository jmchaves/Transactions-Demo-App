import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {Transaction} from '../transaction/transaction';
import {MatPaginator, MatSort} from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export class TransactionDataSource extends DataSource<Transaction> {

    /***************************************************
    - Variables
    ************************************************** */
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }
    filteredData: Transaction[] = [];
    renderedData: Transaction[] = [];

    constructor(private _transactionsList: Transaction[],
                private _paginator: MatPaginator,
                private _sort: MatSort) {
      super();
      this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /***************************************************
    - Connects data, filter, sort with the table
    ************************************************** */
    connect(): Observable<Transaction[]> {
      const displayDataChanges = [
        this._transactionsList,
        this._paginator.page,
        this._filterChange,
        this._sort.sortChange,
      ];

      return Observable.merge(...displayDataChanges).map(() => {
        // Filter data
        this.filteredData = this._transactionsList.slice().filter((item: Transaction) => {
            const searchStr = (item.merchant + item.amount + item.transactionType).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      });
    }

    disconnect() {}

    /***************************************************
    - Sorts data from transactions
    ************************************************** */
    sortData(data: Transaction[]): Transaction[] {
        if (!this._sort.active || this._sort.direction === '') {
            this._sort.active  = 'transactionDate';
            this._sort.direction = 'asc';
         }

        return data.sort((a, b) => {
        let propertyA: Date | number | string = '';
        let propertyB: Date | number | string = '';

        switch (this._sort.active) {
            case 'transactionDate': [propertyA, propertyB] = [a.transactionDate, b.transactionDate]; break;
            case 'merchant': [propertyA, propertyB] = [a.merchant, b.merchant]; break;
            case 'amount': [propertyA, propertyB] = [a.amount, b.amount]; break;
        }

        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
