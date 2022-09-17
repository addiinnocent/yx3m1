import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CustomersDataSource } from './customers-datasource';

import { Customer, CustomerService } from '../../service/customer.service';
import { CustomersDialogComponent } from '../customers-dialog/customers-dialog.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Customer>;
  dataSource: CustomersDataSource;

  displayedColumns = ['name', 'email', 'adress'];

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
  ) {
    this.dataSource = new CustomersDataSource(customerService);
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

  openDialog(data: Customer | {}) {
    const dialogRef = this.dialog.open(CustomersDialogComponent, {
      data: data as Customer,
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
    this.customerService.getCsv(
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
      a.download = 'customers.csv';
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
      this.customerService.postCsv(data)
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }

  dumpCollection(): void {
    if (confirm('Are you sure?')) {
      this.customerService.deleteAll()
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }
}
