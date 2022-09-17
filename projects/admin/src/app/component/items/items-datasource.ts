import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Item, ItemService } from '../../service/item.service';

/**
 * Data source for the Items view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ItemsDataSource extends DataSource<Item> {
  length: number = 0;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter = new BehaviorSubject<string>('');
  data: Item[] = [];
  private _dataStream = new BehaviorSubject<Item[]>([]);

  constructor(
    private itemService: ItemService,
  ) {
    super();
  }

  connect(): Observable<Item[]> {
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
            this.itemService.getItems(
              this.filter.getValue(),
              this.paginator!.pageIndex,
              this.paginator!.pageSize,
              this.sort!.active,
              this.sort!.direction,
            ).subscribe((data) => {
              this.data = data;
              this._dataStream.next(this.data);
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
    this.itemService.getLength(this.filter.getValue())
    .subscribe(data => this.length = data);
  }

  addOne(item: Item): void {
    this.data.unshift(item);
    this._dataStream.next(this.data);
    this.setLength();
  }

  changeOne(item: Item): void {
    let element = this.data.find((e) => e?._id == item._id);
    Object.assign(element, item);
    this._dataStream.next(this.data);
  }

  removeOne(item: Item): void {
    this.data.splice(this.data.findIndex((e) => e._id == item._id), 1);
    this._dataStream.next(this.data);
    this.setLength();
  }

}
