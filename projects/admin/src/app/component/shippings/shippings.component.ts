import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ShippingsDataSource } from './shippings-datasource';

import { Shipping, ShippingService } from '../../service/shipping.service';
import { ShippingsDialogComponent } from '../shippings-dialog/shippings-dialog.component';

@Component({
  selector: 'app-shippings',
  templateUrl: './shippings.component.html',
  styleUrls: ['./shippings.component.scss']
})
export class ShippingsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Shipping>;
  dataSource: ShippingsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'price', 'weight', 'size'];

  constructor(
    private dialog: MatDialog,
    private shippingService: ShippingService,
  ) {
    this.dataSource = new ShippingsDataSource(shippingService);
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

  openDialog(data: Shipping | {}) {
    const dialogRef = this.dialog.open(ShippingsDialogComponent, {
      data: data as Shipping,
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
    this.shippingService.getCsv(
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
      a.download = 'shippings.csv';
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
      this.shippingService.postCsv(data)
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }
}
