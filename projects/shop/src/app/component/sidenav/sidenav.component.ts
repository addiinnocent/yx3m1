import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Category, CategoryService } from '../../service/category.service';
import { ShoppingcartItem, ShoppingcartService } from '../../service/shoppingcart.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  categories: Category[] | undefined;
  items: number = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private categoryService: CategoryService,
    private shoppingcartService: ShoppingcartService,
  ) {
    categoryService.getCategories('', 0, 20, 'order', 'asc')
    .subscribe(categories => this.categories = categories)

    shoppingcartService.getItemsLength()
    .subscribe(length => this.shoppingcartService.length.next(length));

    shoppingcartService.length
    .subscribe(value => this.items = value)

  }

}
