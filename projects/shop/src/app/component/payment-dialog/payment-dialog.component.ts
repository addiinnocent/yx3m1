import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';

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
        switchMap((session: any) => this.stripeService.redirectToCheckout({ sessionId: session.id }))
      ).subscribe(result => {
        // If `redirectToCheckout` fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using `error.message`.
        if (result.error) {
          alert(result.error.message);
        }
      })

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
        //  this.showError = true;
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
          //this.resetStatus();
      },
    };
  }
}
