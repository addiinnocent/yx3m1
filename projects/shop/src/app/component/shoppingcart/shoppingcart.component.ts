import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ShoppingcartDataSource} from './shoppingcart-datasource';

import { Shoppingcart, ShoppingcartItem, ShoppingcartService } from '../../service/shoppingcart.service';
import { CouponDialogComponent } from '../coupon-dialog/coupon-dialog.component';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.scss']
})
export class ShoppingcartComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ShoppingcartItem>;
  dataSource: ShoppingcartDataSource;
  shoppingcart: Observable<Shoppingcart> | undefined;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['image', 'name', 'price', 'quantity', 'remove'];

  constructor(
    private dialog: MatDialog,
    private shoppingcartService: ShoppingcartService,
  ) {
    this.dataSource = new ShoppingcartDataSource(shoppingcartService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
    this.shoppingcart = this.dataSource.shoppingcart;
  }

  changeQuantity(item: ShoppingcartItem, event: Event): void {
    item.quantity = Number((event.target as HTMLInputElement).value);
    this.shoppingcartService.putItem(item)
    .subscribe(() => {
      this.shoppingcart = this.shoppingcartService.getShoppingcart();
    })
  }

  removeFromCart(item: ShoppingcartItem): void {
    this.shoppingcartService.deleteItem(item)
    .subscribe(status => {
      let length = this.shoppingcartService.length;
      length.next(length.value-1);
      this.shoppingcart = this.shoppingcartService.getShoppingcart();
      this.dataSource.removeData(item);
      this.table.renderRows();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CouponDialogComponent, {
      data: this.shoppingcart,
    });
    dialogRef.afterClosed()
    .subscribe((result) => {
      this.shoppingcart = this.shoppingcartService.getShoppingcart();
    });
  }
}
