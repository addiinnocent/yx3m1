import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SidenavComponent } from './component/sidenav/sidenav.component';
import { ItemComponent } from './component/item/item.component';
import { ShoppingcartComponent } from './component/shoppingcart/shoppingcart.component';
import { AdressComponent } from './component/adress/adress.component';
import { SummaryComponent } from './component/summary/summary.component';
import { BillComponent } from './component/bill/bill.component';

const routes: Routes = [
  { path: '', redirectTo: '/items', pathMatch: 'full' },
  {
    path: '',
    component: SidenavComponent,
    children: [
      { path: 'items', component: ItemComponent },
      { path: 'items/:category', component: ItemComponent },
      { path: 'shoppingcart', component: ShoppingcartComponent },
      { path: 'adress', component: AdressComponent },
      { path: 'summary', component: SummaryComponent },
      { path: 'bill', component: BillComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
