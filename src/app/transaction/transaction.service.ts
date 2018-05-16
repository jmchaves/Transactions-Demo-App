import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Transaction } from './transaction';


@Injectable()
export class TransactionService {

  /***************************************************
    - URL json file
  ************************************************** */
  private transactionsUrl = 'assets/data/transactions.json';

  constructor(private http: Http) {}

  /***************************************************
  - Gets transactions from json file
  ************************************************** */
  getTransactions(): Promise<Transaction[]> {
    return this.http.get(this.transactionsUrl)
               .toPromise()
               .then(response => response.json().data as Transaction[])
               .catch(this.handleError);
  }

  /***************************************************
  - Handle the http error and returns in the console
  ************************************************** */
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
