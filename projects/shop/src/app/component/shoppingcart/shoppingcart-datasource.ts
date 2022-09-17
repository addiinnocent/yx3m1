import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
import { Shoppingcart, ShoppingcartItem, ShoppingcartService } from '../../service/shoppingcart.service';

/**
 * Data source for the Shoppingcart view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ShoppingcartDataSource extends DataSource<ShoppingcartItem> {
  shoppingcart: Observable<Shoppingcart>;
  data = new BehaviorSubject<ShoppingcartItem[]>([]);
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(
    private shoppingcartService: ShoppingcartService,
  ) {
    super();
    this.shoppingcart = shoppingcartService.getShoppingcart();
    this.shoppingcart.subscribe(shoppingcart => {
      this.data.next(shoppingcart.items);
    })
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ShoppingcartItem[]> {
    if (this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(this.data, this.sort.sortChange)
        .pipe(map(() => {
          return this.getSortedData([...this.data.value]);
        }));
    } else {
      throw Error('Please set sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  removeData(item: ShoppingcartItem) {
    let items = this.data.value;
    items.splice(items.findIndex((e) => e._id == item._id), 1);
    this.data.next(items);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ShoppingcartItem[]): ShoppingcartItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.item.name, b.item.name, isAsc);
        case 'price': return compare(+a.item.price, +b.item.price, isAsc);
        case 'quantity': return compare(+a.quantity, +b.quantity, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
