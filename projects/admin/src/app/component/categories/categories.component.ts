import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesDataSource } from './categories-datasource';

import { Category, CategoryService } from '../../service/category.service';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Category>;
  dataSource: CategoriesDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['order', 'name', 'active'];

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
  ) {
    this.dataSource = new CategoriesDataSource(categoryService);
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

  openDialog(data: Category | {}) {
    const dialogRef = this.dialog.open(CategoriesDialogComponent, {
      data: data as Category,
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
    this.categoryService.getCsv(
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
      a.download = 'categories.csv';
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
      this.categoryService.postCsv(data)
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }
}
