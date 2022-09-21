import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { SidenavComponent } from './component/sidenav/sidenav.component';
import { PieChartComponent } from './component/pie-chart/pie-chart.component';
import { AdvancedPieChartComponent } from './component/advanced-pie-chart/advanced-pie-chart.component';
import { VerticalBarChartComponent } from './component/vertical-bar-chart/vertical-bar-chart.component';
import { HorizontalBarChartComponent } from './component/horizontal-bar-chart/horizontal-bar-chart.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ItemsComponent } from './component/items/items.component';
import { ItemsDialogComponent } from './component/items-dialog/items-dialog.component';
import { CustomersComponent } from './component/customers/customers.component';
import { MailsComponent } from './component/mails/mails.component';
import { SettingsComponent } from './component/settings/settings.component';
import { CategoriesComponent } from './component/categories/categories.component';
import { CategoriesDialogComponent } from './component/categories-dialog/categories-dialog.component';
import { GalleryComponent } from './component/gallery/gallery.component';
import { CouponsComponent } from './component/coupons/coupons.component';
import { CouponsDialogComponent } from './component/coupons-dialog/coupons-dialog.component';
import { OrdersComponent } from './component/orders/orders.component';
import { OrdersDialogComponent } from './component/orders-dialog/orders-dialog.component';
import { SalesComponent } from './component/sales/sales.component';
import { PaymentsComponent } from './component/payments/payments.component';
import { ShippingsComponent } from './component/shippings/shippings.component';
import { ShippingsDialogComponent } from './component/shippings-dialog/shippings-dialog.component';
import { CustomersDialogComponent } from './component/customers-dialog/customers-dialog.component';
import { MailsDialogComponent } from './component/mails-dialog/mails-dialog.component';
import { LogsComponent } from './component/logs/logs.component';
import { LoginComponent} from './component/login/login.component';
import { LoginDialogComponent } from './component/login-dialog/login-dialog.component';
import { LinearChartComponent } from './component/linear-chart/linear-chart.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    PieChartComponent,
    AdvancedPieChartComponent,
    VerticalBarChartComponent,
    HorizontalBarChartComponent,
    DashboardComponent,
    ItemsComponent,
    ItemsDialogComponent,
    CustomersComponent,
    CustomersDialogComponent,
    MailsComponent,
    SettingsComponent,
    CategoriesComponent,
    CategoriesDialogComponent,
    GalleryComponent,
    CouponsComponent,
    CouponsDialogComponent,
    OrdersComponent,
    OrdersDialogComponent,
    SalesComponent,
    PaymentsComponent,
    ShippingsComponent,
    ShippingsDialogComponent,
    MailsDialogComponent,
    LogsComponent,
    LoginComponent,
    LoginDialogComponent,
    LinearChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    NgxChartsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MatTreeModule,
    MatSnackBarModule
  ],
  providers: [
    CurrencyPipe,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }, {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'EUR'
    }, {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {duration: 5000}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
