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
  form: FormGroup = new FormGroup({
    api_key: new FormControl(''),
    api_version: new FormControl({value: 0, disabled: true}),

    maintenance: new FormControl(false),
    twofactor: new FormControl(false),
    admin_user: new FormControl(''),
    admin_pass: new FormControl(''),
    admin_secret: new FormControl({value: '', disabled: true}),
    useragent_protect: new FormControl(''),

    currency: new FormControl(''),
    stripe_active: new FormControl(false),
    stripe_methods: new FormControl([]),
    stripe_publickey: new FormControl(''),
    stripe_secretkey: new FormControl(''),
    paypal_active: new FormControl(false),
    paypal_client: new FormControl(''),
    paypal_secret: new FormControl(''),

    sendmail: new FormControl(false),
    mail_from: new FormControl(''),
    mail_host: new FormControl(''),
    mail_port: new FormControl(0),
    mail_user: new FormControl(''),
    mail_pass: new FormControl(''),

    schedule_email: new FormControl(''),
    schedule_daily: new FormControl(false),
    schedule_weekly: new FormControl(false),
    schedule_monthly: new FormControl(false),

    countries: new FormControl([]),
  });

  qr: string | undefined;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private snackBar: MatSnackBar,
    private configService: ConfigService,
  ) {
    configService.getConfig()
    .subscribe((config: Config) => {
      this.qr = config.admin_qr;
      this.form.patchValue(config)
    })
  }

  ngOnInit(): void {
  }

  addCountry(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const countries = this.form.value.countries;
    if (value) {
      countries.push(value);
    }
    event.chipInput!.clear();
  }

  removeCountry(country: string): void {
    const countries = this.form.value.countries;
    const index = countries.indexOf(country);

    if (index >= 0) {
      countries.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (!this.form.pristine && this.form.valid) {
      this.configService.putConfig(this.form.value)
      .subscribe((config) => {
        this.qr = config.admin_qr;
        this.form.patchValue(config);
        this.snackBar.open('Saved successfully!', 'Close');
      })
    }
  }

}
