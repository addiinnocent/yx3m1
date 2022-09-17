import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { Coupon, CouponService } from '../../service/coupon.service';

@Component({
  selector: 'app-coupons-dialog',
  templateUrl: './coupons-dialog.component.html',
  styleUrls: ['./coupons-dialog.component.scss']
})
export class CouponsDialogComponent {
  error: string | undefined;
  images: string[] = [];
  form: FormGroup = new FormGroup({
    _id: new FormControl({value: '', disabled: true}),
    link: new FormControl({value: '', disabled: true}),
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    value: new FormControl(0, Validators.required),
    multiuse: new FormControl(false),
    uses: new FormControl({value: 0, disabled: true}),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Coupon,
    private dialogRef: MatDialogRef<CouponsDialogComponent>,
    private couponService: CouponService,
  ) {
    this.form.patchValue(data);
    if (!data.code) this.form.patchValue({
      code: this.randomString(15),
    })

  }

  ngOnInit(): void {
  }

  deleteCoupon(): void {
    this.couponService.deleteCoupon(this.form.getRawValue())
    .subscribe(() => {
      this.dialogRef.close({
        value: this.form.getRawValue(),
        method: 'remove'
      })
    });
  }

  randomString(length: number): string {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (!this.data._id) {
        this.couponService.postCoupon(this.form.value)
        .subscribe((coupon: Coupon) => {
          this.dialogRef.close({
            value: coupon,
            method: 'add'
          })
        }, (e) => {
          if (e) this.error = e;
        })
      } else {
        this.couponService.putCoupon(this.form.getRawValue())
        .subscribe((coupon: Coupon) => {
          this.dialogRef.close({
            value: coupon,
            method: 'change'
          })
        }, (e) => {
          if (e) this.error = e;
        })
      }
    }
  }

}
