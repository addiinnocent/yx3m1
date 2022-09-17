import { AfterViewInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ItemsDataSource } from './item-datasource';
import { Observable } from 'rxjs';

import { Item, ItemService } from '../../service/item.service';
import { ShoppingcartService } from '../../service/shoppingcart.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: ItemsDataSource;
  items!: Observable<Item[]>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private itemService: ItemService,
    private shoppingcartService: ShoppingcartService,
  ) {
    this.dataSource = new ItemsDataSource(itemService);
  }

  ngAfterViewInit(): void {
    this.route.paramMap.subscribe(paramMap  =>  {
      this.dataSource.category = paramMap.get('category') || '';
      this.dataSource.paginator = this.paginator;
      this.items = this.dataSource.connect();
    });
    this.changeDetectorRef.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter.next(filterValue.trim().toLowerCase());
  }

  toShoppingcart(item: Item): void {
    this.shoppingcartService.postItem({
      _id: '',
      item: item,
      quantity: 1,
      options: {},
    })
    .subscribe(shoppingcart => {
      let length = this.shoppingcartService.length;
      length.next(length.value+1);
      console.log(item.name+' added to shoppingcart');
    })
  }
}
