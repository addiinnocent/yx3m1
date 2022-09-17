import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Customer, CustomerService } from '../../service/customer.service';

/**
 * Data source for the Customers view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CustomersDataSource extends DataSource<Customer> {
  length: number = 0;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter = new BehaviorSubject<string>('');
  private _data: Customer[] = [];
  private _dataStream = new BehaviorSubject<Customer[]>([]);

  constructor(
    private customerService: CustomerService,
  ) {
    super();
  }

  connect(): Observable<Customer[]> {
    if (this.paginator && this.sort) {
      this.sort.sortChange.subscribe(() => (this.paginator!.pageIndex = 0));
      this.filter.subscribe(() => {
        (this.paginator!.pageIndex = 0)
        this.setLength();
      });

      return merge(this.filter, this.paginator.page, this.sort.sortChange)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.customerService.getCustomers(
              this.filter.getValue(),
              this.paginator!.pageIndex,
              this.paginator!.pageSize,
              this.sort!.active,
              this.sort!.direction,
            ).subscribe((data) => {
              this._data = data;
              this._dataStream.next(this._data);
            });
            return this._dataStream;
          })
        )
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  disconnect(): void {}

  setLength(): void {
    this.customerService.getLength(this.filter.getValue())
    .subscribe(data => this.length = data);
  }

  addOne(customer: Customer): void {
    this._data.unshift(customer);
    this._dataStream.next(this._data);
    this.setLength();
  }

  changeOne(customer: Customer): void {
    let element = this._data.find((e) => e?._id == customer._id);
    Object.assign(element, customer);
    this._dataStream.next(this._data);
  }

  removeOne(customer: Customer): void {
    this._data.splice(this._data.findIndex((e) => e._id == customer._id), 1);
    this._dataStream.next(this._data);
    this.setLength();
  }

}
