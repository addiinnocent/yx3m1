import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Coupon, CouponService } from '../../service/coupon.service';

@Component({
  selector: 'app-coupon-dialog',
  templateUrl: './coupon-dialog.component.html',
  styleUrls: ['./coupon-dialog.component.scss']
})
export class CouponDialogComponent {
  error: any;
  coupon = new FormControl('', [Validators.required]);

  constructor(
    private dialogRef: MatDialogRef<CouponDialogComponent>,
    private couponService: CouponService,
  ) {}

  onSubmit(): void {
    this.couponService.postCoupon({
      code: this.coupon.value
    } as Coupon).subscribe((coupon) => {
      this.dialogRef.close(coupon)
    }, (err) => {
      this.error = err;
    })
  }
}
