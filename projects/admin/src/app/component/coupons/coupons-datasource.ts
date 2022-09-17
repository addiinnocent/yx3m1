import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Coupon, CouponService } from '../../service/coupon.service';

/**
 * Data source for the Coupons view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CouponsDataSource extends DataSource<Coupon> {
  length: number = 0;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter = new BehaviorSubject<string>('');
  private _data: Coupon[] = [];
  private _dataStream = new BehaviorSubject<Coupon[]>([]);

  constructor(
    private couponService: CouponService,
  ) {
    super();
  }

  connect(): Observable<Coupon[]> {
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
            this.couponService.getCoupons(
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
    this.couponService.getLength(this.filter.getValue())
    .subscribe(data => this.length = data);
  }

  addOne(coupon: Coupon): void {
    this._data.unshift(coupon);
    this._dataStream.next(this._data);
    this.setLength();
  }

  changeOne(coupon: Coupon): void {
    let element = this._data.find((e) => e?._id == coupon._id);
    Object.assign(element, coupon);
    this._dataStream.next(this._data);
  }

  removeOne(coupon: Coupon): void {
    this._data.splice(this._data.findIndex((e) => e._id == coupon._id), 1);
    this._dataStream.next(this._data);
    this.setLength();
  }

}
