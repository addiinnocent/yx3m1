import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Order, OrderService } from '../../service/order.service';

/**
 * Data source for the Orders view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class OrdersDataSource extends DataSource<Order> {
  length: number = 0;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter = new BehaviorSubject<string>('');
  private _data: Order[] = [];
  private _dataStream = new BehaviorSubject<Order[]>([]);

  constructor(
    private orderService: OrderService,
  ) {
    super();
  }

  connect(): Observable<Order[]> {
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
            this.orderService.getOrders(
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
    this.orderService.getLength(this.filter.getValue())
    .subscribe(data => this.length = data);
  }

  changeOne(order: Order): void {
    let element = this._data.find((e) => e?._id == order._id);
    Object.assign(element, order);
    this._dataStream.next(this._data);
  }

}
