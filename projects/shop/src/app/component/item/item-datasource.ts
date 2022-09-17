import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Item, ItemService } from '../../service/item.service';

/**
 * Data source for the Items view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ItemsDataSource extends DataSource<Item> {
  length: number = 0;
  category: string = '';
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter = new BehaviorSubject<string>('');
  private _data: Item[] = [];
  private _dataStream = new BehaviorSubject<Item[]>([]);

  constructor(
    private itemService: ItemService,
  ) {
    super();
  }

  connect(): Observable<Item[]> {
    if (this.paginator) {
      this.filter.subscribe(() => {
        (this.paginator!.pageIndex = 0)
        this.setLength();
      });

      return merge(this.filter, this.paginator.page)
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          startWith({}),
          switchMap(() => {
            this.itemService.getItems(
              this.category,
              this.filter.getValue(),
              this.paginator!.pageIndex,
              this.paginator!.pageSize,
            )
            .subscribe(data => {
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
    this.itemService.getLength(this.filter.getValue(), this.category)
    .subscribe(data => this.length = data);
  }
}
