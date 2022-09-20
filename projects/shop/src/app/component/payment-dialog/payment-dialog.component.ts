import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { StripeService } from 'ngx-stripe';

import { ShoppingcartService } from '../../service/shoppingcart.service';
import { ConfigService } from '../../service/config.service';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {
  error: any;
  payments: any;
  payPalConfig ? : IPayPalConfig;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    private stripeService: StripeService,
    private shoppingcartService: ShoppingcartService,
    private configService: ConfigService,
  ) {
    this.configService.getPayments()
    .subscribe(payments => {
      this.payments = payments
      stripeService.changeKey(payments.stripe_publickey)
    })
  }

  ngOnInit(): void {
    this.initPaypal();
  }

  checkout() {
    // Check the server.js tab to see an example implementation
    this.http.post('/api/stripe.json/create-checkout-session', {})
      .pipe(
        catchError(this.handleError),
        switchMap((session: any) => this.stripeService.redirectToCheckout({ sessionId: session.id }))
      ).subscribe(
        result => {},
        err => this.error = err,
      )

  }

  private initPaypal()  {
    this.payPalConfig = {
      clientId: 'sb',
      currency: 'EUR',
      // for creating orders (transactions) on server see
      // https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/
      createOrderOnServer: (data) => fetch('/api/paypal.json/create-paypal-transaction')
          .then((res) => res.json())
          .then((order) => order.id),
      onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
      },
      onClientAuthorization: (data) => {
          return this.http.post('/api/paypal.json/finish-paypal-transaction', data)
          .subscribe(data => {
            this.dialogRef.close();
            this.shoppingcartService.length.next(0);
            this.router.navigate(['/bill', { id: data }])
          })
      },
      onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
          //his.showCancel = true;

      },
      onError: err => {
          console.log('OnError', err);
          this.error = 'Der Mindestbestellwert liegt bei 0.50€';
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
          //this.resetStatus();
      },
    };
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Der Mindestbestellwert liegt bei 0.50€'
    );
  }
}
