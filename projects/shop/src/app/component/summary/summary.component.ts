import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { Shoppingcart, ShoppingcartService } from '../../service/shoppingcart.service';
import { Customer, CustomerService } from '../../service/customer.service';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  shoppingcart: Observable<Shoppingcart>;
  customer!: Observable<Customer>;

  constructor(
    private dialog: MatDialog,
    private shoppingcartService: ShoppingcartService,
    private customerService: CustomerService,
  ) {
    this.shoppingcart = shoppingcartService.getShoppingcart();
    this.customer = customerService.getCustomer();
  }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      data: this.shoppingcart,
    });
    dialogRef.afterClosed()
    .subscribe((result) => {

    });
  }

}
