import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { Shipping, ShippingService } from '../../service/shipping.service';

@Component({
  selector: 'app-shippings-dialog',
  templateUrl: './shippings-dialog.component.html',
  styleUrls: ['./shippings-dialog.component.scss']
})
export class ShippingsDialogComponent {
  error: string | undefined;
  form: FormGroup = new FormGroup({
    _id: new FormControl({value: '', disabled: true}),
    name: new FormControl(''),
    price: new FormControl(0),
    weight: new FormControl(0),
    width: new FormControl(0),
    height: new FormControl(0),
    length: new FormControl(0),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Shipping,
    private dialogRef: MatDialogRef<ShippingsDialogComponent>,
    private shippingService: ShippingService,
  ) {
  }

  ngOnInit(): void {
    this.form.patchValue(this.data);
  }

  deleteShipping(): void {
    this.shippingService.deleteShipping(this.form.getRawValue())
    .subscribe(() => {
      this.dialogRef.close({
        value: this.form.getRawValue(),
        method: 'remove'
      })
    });

  }

  onSubmit(): void {
    if (this.form.valid) {
      if (!this.data._id) {
        this.shippingService.postShipping(this.form.value)
        .subscribe((shipping: Shipping) => {
          this.dialogRef.close({
            value: shipping,
            method: 'add'
          })
        }, (e) => {
          if (e) this.error = e;
        })
      } else {
        this.shippingService.putShipping(this.form.getRawValue())
        .subscribe((shipping: Shipping) => {
          this.dialogRef.close({
            value: shipping,
            method: 'change'
          })
        }, (e) => {
          if (e) this.error = e;
        })
      }
    }
  }

}
