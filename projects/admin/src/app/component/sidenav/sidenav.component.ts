import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

import { LoginService, Admin } from '../../service/login.service';

interface MenuNode {
  name: string;
  path?: string,
  children?: MenuNode[];
}

const TREE_DATA: MenuNode[] = [
  {
    name: $localize `Dashboard`,
    path: 'dashboard',
  }, {
    name: $localize `Items`,
    path: 'items',
    children: [
      {
        name: $localize `Categories`,
        path: 'categories',
      }, {
        name: $localize `Shippings`,
        path: 'shippings',
      }, {
        name: $localize `Gallery`,
        path: 'gallery',
      }
    ],
  }, {
    name: $localize `Orders`,
    path: 'orders',
    children: [
      {
        name: $localize `Sales`,
        path: 'sales',
      }, {
        name: $localize `Payments`,
        path: 'payments',
      }
    ],
  }, {
    name: $localize `Customers`,
    path: 'customers',
  }, {
    name: $localize `Mails`,
    path: 'mails',
  }, {
    name: $localize `Coupons`,
    path: 'coupons',
  },
];

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  treeControl = new NestedTreeControl<MenuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<MenuNode>();
  hasChild = (_: number, node: MenuNode) => !!node.children && node.children.length > 0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private loginService: LoginService,
  ) {
    this.dataSource.data = TREE_DATA;
  }

  logOut(): void {
    this.loginService.getLogout()
    .subscribe(() => {
      this.router.navigate(['/login'])
    })
  }

}
