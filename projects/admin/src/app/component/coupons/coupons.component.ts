import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CouponsDataSource } from './coupons-datasource';

import { Coupon, CouponService } from '../../service/coupon.service';
import { CouponsDialogComponent } from '../coupons-dialog/coupons-dialog.component';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Coupon>;
  dataSource: CouponsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'code', 'uses'];

  constructor(
    private dialog: MatDialog,
    private couponService: CouponService,
  ) {
    this.dataSource = new CouponsDataSource(couponService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter.next(filterValue.trim().toLowerCase());
  }

  openDialog(data: Coupon | {}) {
    const dialogRef = this.dialog.open(CouponsDialogComponent, {
      data: data as Coupon,
    });
    dialogRef.afterClosed()
    .subscribe((result) => {
      if (result) {
        if (result.method == 'add') this.dataSource.addOne(result.value);
        if (result.method == 'change') this.dataSource.changeOne(result.value);
        if (result.method == 'remove') this.dataSource.removeOne(result.value);
      }
    });
  }

  downloadCsv(): void {
    this.couponService.getCsv(
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
      a.download = 'coupons.csv';
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
      this.couponService.postCsv(data)
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }

  dumpCollection(): void {
    if (confirm('Are you sure?')) {
      this.couponService.deleteAll()
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }
}
