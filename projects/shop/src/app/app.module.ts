import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxStripeModule } from 'ngx-stripe';
import { NgxPayPalModule } from 'ngx-paypal';

import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SidenavComponent } from './component/sidenav/sidenav.component';
import { ItemComponent } from './component/item/item.component';
import { ShoppingcartComponent } from './component/shoppingcart/shoppingcart.component';
import { AdressComponent } from './component/adress/adress.component';
import { SummaryComponent } from './component/summary/summary.component';
import { AdressSmallComponent } from './component/adress-small/adress-small.component';
import { ShoppingcartSmallComponent } from './component/shoppingcart-small/shoppingcart-small.component';
import { PaymentDialogComponent } from './component/payment-dialog/payment-dialog.component';
import { BillComponent } from './component/bill/bill.component';
import { CouponDialogComponent } from './component/coupon-dialog/coupon-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    ItemComponent,
    ShoppingcartComponent,
    AdressComponent,
    SummaryComponent,
    AdressSmallComponent,
    ShoppingcartSmallComponent,
    PaymentDialogComponent,
    BillComponent,
    CouponDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPayPalModule,
    NgxStripeModule.forRoot('pk_test_51H1xlaJnYuv8nFzxMoYtaUmKRoaDyFiXtT9yCTvpz7hsq3CrGURSbFxATOLL5hcZFWDUmqB6TAbv8uNwuFVcv0Ug00IlQUzzus'),
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatBadgeModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
