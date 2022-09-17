import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { OrdersDataSource } from './orders-datasource';

import { Order, OrderService } from '../../service/order.service';
import { OrdersDialogComponent } from '../orders-dialog/orders-dialog.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Order>;
  dataSource: OrdersDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['customer', 'items', 'total', 'createdAt'];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private orderService: OrderService,
  ) {
    this.dataSource = new OrdersDataSource(orderService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    if (this.route.snapshot.paramMap.get('fullname')) {
      this.dataSource.filter.next(this.route.snapshot.paramMap.get('fullname') as string);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter.next(filterValue.trim().toLowerCase());
  }

  getQuantity(items: any): number {
    if (!items) return 0;
    return items.reduce((a: any,b: any) => a+b.quantity, 0)
  }

  openDialog(data: Order | {}): void {
    const dialogRef = this.dialog.open(OrdersDialogComponent, {
      data: data as Order,
    });
    dialogRef.afterClosed()
    .subscribe((result) => {
      if (result) {
        this.dataSource.changeOne(result.value);
      }
    });
  }

  downloadCsv(): void {
    this.orderService.getCsv(
      this.dataSource.filter.getValue(),
      this.dataSource.paginator!.pageIndex,
      this.dataSource.paginator!.pageSize,
      this.dataSource.sort!.active,
      this.dataSource.sort!.direction,
    ).subscribe(data => {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = 'orders.csv';
      document.body.appendChild(a);
      a.click();
    });
  }

  uploadCsv(input: any): void {
    const file: File = input.files[0];
    let reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      let data: string = reader.result as string;
      this.orderService.postCsv(data)
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }

  dumpCollection(): void {
    if (confirm('Are you sure?')) {
      this.orderService.deleteAll()
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }
}
