import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog , MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Order, OrderService } from '../../service/order.service';
import { CustomersDialogComponent } from '../customers-dialog/customers-dialog.component';
import { ShippingsDialogComponent } from '../shippings-dialog/shippings-dialog.component';

@Component({
  selector: 'app-orders-dialog',
  templateUrl: './orders-dialog.component.html',
  styleUrls: ['./orders-dialog.component.scss']
})
export class OrdersDialogComponent implements OnInit {
  error: string | undefined;

  items: any[] | undefined;
  form: FormGroup = new FormGroup({
    _id: new FormControl({value: '', disabled: true}),
    paid: new FormControl({value: false, disabled: true}),
    finished: new FormControl({value: false, disabled: false}),
    total: new FormControl({value: 0, disabled: true}),
    customer: new FormGroup({
      _id: new FormControl({value: '', disabled: true}),
      firstname: new FormControl({value: '', disabled: true}),
      lastname: new FormControl({value: '', disabled: true}),
      email: new FormControl({value: '', disabled: true}),
      street: new FormControl({value: '', disabled: true}),
      zip: new FormControl({value: '', disabled: true}),
      town: new FormControl({value: '', disabled: true}),
      country: new FormControl({value: '', disabled: true}),
    }),
    payment: new FormGroup({
      _id: new FormControl({value: '', disabled: true}),
      status: new FormControl({value: '', disabled: true}),
      type: new FormControl({value: '', disabled: true}),
      amount: new FormControl({value: '', disabled: true}),
    }),
    shipping: new FormGroup({
      _id: new FormControl({value: '', disabled: true}),
      name: new FormControl({value: '', disabled: true}),
    	price: new FormControl({value: '', disabled: true}),
    }),
    coupon: new FormGroup({
      _id: new FormControl({value: '', disabled: true}),
      name: new FormControl({value: '', disabled: true}),
    	code: new FormControl({value: '', disabled: true}),
    	link: new FormControl({value: '', disabled: true}),
    	type: new FormControl({value: '', disabled: true}),
    	value: new FormControl({value: '', disabled: true}),
    }),
  });

  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: Order,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<OrdersDialogComponent>,
    private orderService: OrderService,
  ) {
    this.items = data.items;
    this.form.patchValue(data);


  }

  ngOnInit(): void {
  }

  openCustomerDialog(data: any): void {
    const dialogRef = this.dialog.open(CustomersDialogComponent, {
      data: data,
    });
  }

  openShippingDialog(data: any): void {
    const dialogRef = this.dialog.open(ShippingsDialogComponent, {
      data: data,
    });
  }

  onSubmit(): void {
    if (this.form.pristine) this.dialogRef.close();
    else if (this.form.valid) {
      this.orderService.putOrder(this.form.getRawValue())
      .subscribe((order: Order) => {
        this.dialogRef.close({
          value: order,
          method: 'change'
        })
      }, (e) => {
        if (e) this.error = e;
      })
    }
  }

}
