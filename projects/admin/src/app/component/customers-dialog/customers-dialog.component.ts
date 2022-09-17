import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { Customer, CustomerService } from '../../service/customer.service';

@Component({
  selector: 'app-customers-dialog',
  templateUrl: './customers-dialog.component.html',
  styleUrls: ['./customers-dialog.component.scss']
})
export class CustomersDialogComponent implements OnInit {
  error: string | undefined;
  images: string[] = [];
  form: FormGroup = new FormGroup({
    _id: new FormControl({value: '', disabled: true}),
    firstname: new FormControl('', Validators.required),
  	lastname: new FormControl('', Validators.required),
  	email: new FormControl('', Validators.required),
  	street: new FormControl('', Validators.required),
  	town: new FormControl('', Validators.required),
  	zip: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
  	newsletter: new FormControl(false, Validators.required),
  	validated: new FormControl(false, Validators.required),
  });

  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
    private dialogRef: MatDialogRef<CustomersDialogComponent>,
    private customerService: CustomerService,
  ) {
    this.form.patchValue(data);
  }

  ngOnInit(): void {
  }

  openOrders(): void {
    this.router.navigate(['/orders', { fullname: this.data.firstname+' '+this.data.lastname }])
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.customerService.putCustomer(this.form.getRawValue())
      .subscribe((customer: Customer) => {
        this.dialogRef.close({
          value: customer,
          method: 'change'
        })
      }, (e) => {
        if (e) this.error = e;
      })
    }
  }

}
