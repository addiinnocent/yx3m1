import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Customer, CustomerService } from '../../service/customer.service';
import { Shoppingcart, ShoppingcartService } from '../../service/shoppingcart.service';
import { ConfigService } from '../../service/config.service';

@Component({
  selector: 'app-adress',
  templateUrl: './adress.component.html',
  styleUrls: ['./adress.component.scss']
})
export class AdressComponent implements OnInit {
  shoppingcart!: Observable<Shoppingcart>;
  countries: Observable<string[]>;
  form = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    street: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
    town: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
  })

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private shoppingcartService: ShoppingcartService,
    private configService: ConfigService,
  ) {
    this.shoppingcart = shoppingcartService.getShoppingcart();
    this.countries = configService.getCountries();

    customerService.getCustomer()
    .subscribe(customer => this.form.patchValue(customer))
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.customerService.putCustomer(this.form.value as Customer)
      .subscribe(() => this.router.navigate(['/summary']))
    }
  }

}
