import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { SalesDataSource } from './sales-datasource';

import { Sale, SaleService } from '../../service/sale.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Sale>;
  dataSource: SalesDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['customer', 'name', 'quantity', 'total', 'createdAt'];

  constructor(
    private route: ActivatedRoute,
    private saleService: SaleService,
  ) {
    this.dataSource = new SalesDataSource(saleService);
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

  openDialog(sale: Sale | {}): void {

  }

  downloadCsv(): void {
    this.saleService.getCsv(
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
      a.download = 'sales.csv';
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
      this.saleService.postCsv(data)
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }

  dumpCollection(): void {
    if (confirm('Are you sure?')) {
      this.saleService.deleteAll()
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }
}
