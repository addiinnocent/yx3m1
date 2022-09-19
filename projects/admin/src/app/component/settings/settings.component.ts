import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';


import { Config, ConfigService } from '../../service/config.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  api: FormGroup = new FormGroup({
    api_key: new FormControl(''),
    api_version: new FormControl({value: 0, disabled: true}),
  });

  admin: FormGroup = new FormGroup({
    maintenance: new FormControl(false),
    useragent_protect: new FormControl(''),
    admin_user: new FormControl(''),
    admin_pass: new FormControl(''),
  });

  stripe: FormGroup = new FormGroup({
    currency: new FormControl(''),
    stripe_active: new FormControl(false),
    stripe_methods: new FormControl([]),
    stripe_publickey: new FormControl(''),
    stripe_secretkey: new FormControl(''),
  });

  paypal: FormGroup = new FormGroup({
    paypal_active: new FormControl(false),
    paypal_client: new FormControl(''),
    paypal_secret: new FormControl(''),
  });

  mail: FormGroup = new FormGroup({
    sendmail: new FormControl(false),
    mail_from: new FormControl(''),
    mail_host: new FormControl(''),
    mail_port: new FormControl(0),
    mail_user: new FormControl(''),
    mail_pass: new FormControl(''),
  });

  schedules: FormGroup = new FormGroup({
    schedule_email: new FormControl(''),
    schedule_daily: new FormControl(false),
    schedule_weekly: new FormControl(false),
    schedule_monthly: new FormControl(false),
  });

  countries: FormControl = new FormControl([]);

  form: FormGroup = new FormGroup({
    api: this.api,
    admin: this.admin,
    stripe: this.stripe,
    paypal: this.paypal,
    mail: this.mail,
    schedules: this.schedules,
    countries: this.countries,
  });

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private snackBar: MatSnackBar,
    private configService: ConfigService,
  ) {
    configService.getConfig()
    .subscribe((data: Config) => this.form.patchValue(data))
  }

  ngOnInit(): void {
  }

  addCountry(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const countries = this.countries.value;
    if (value) {
      countries.push(value);
    }
    event.chipInput!.clear();
  }

  removeCountry(country: string): void {
    const countries = this.countries.value;
    const index = countries.indexOf(country);

    if (index >= 0) {
      countries.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (!this.form.pristine && this.form.valid) {
      this.configService.putConfig(this.form.value)
      .subscribe(() => {
        this.snackBar.open('Saved successfully!', 'Close');
      })
    }
  }

}
