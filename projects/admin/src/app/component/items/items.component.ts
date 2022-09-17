import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ItemsDataSource } from './items-datasource';

import { Item, ItemService } from '../../service/item.service';
import { ItemsDialogComponent } from '../items-dialog/items-dialog.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Item>;
  dataSource: ItemsDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'category', 'price', 'storage'];

  constructor(
    private dialog: MatDialog,
    private itemService: ItemService,
  ) {
    this.dataSource = new ItemsDataSource(itemService);
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

  openDialog(data: Item | {}) {
    const dialogRef = this.dialog.open(ItemsDialogComponent, {
      data: data as Item,
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
    this.itemService.getCsv(
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
      a.download = 'items.csv';
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
      this.itemService.postCsv(data)
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }

  dumpCollection(): void {
    if (confirm('Are you sure?')) {
      this.itemService.deleteAll()
      .subscribe(() => {
        this.dataSource.filter.next('');
      })
    }
  }
}
