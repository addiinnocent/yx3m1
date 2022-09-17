import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SidenavComponent } from './component/sidenav/sidenav.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { CategoriesComponent } from './component/categories/categories.component';
import { ItemsComponent } from './component/items/items.component';
import { CustomersComponent } from './component/customers/customers.component';
import { MailsComponent } from './component/mails/mails.component';
import { CouponsComponent } from './component/coupons/coupons.component';
import { GalleryComponent } from './component/gallery/gallery.component';
import { OrdersComponent } from './component/orders/orders.component';
import { SalesComponent } from './component/sales/sales.component';
import { PaymentsComponent } from './component/payments/payments.component';
import { ShippingsComponent } from './component/shippings/shippings.component';
import { SettingsComponent } from './component/settings/settings.component';
import { LoginComponent } from './component/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: SidenavComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'gallery', component: GalleryComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'shippings', component: ShippingsComponent },
      { path: 'mails', component: MailsComponent },
      { path: 'coupons', component: CouponsComponent },

      { path: 'settings', component: SettingsComponent },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
