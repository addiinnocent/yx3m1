import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LoginService, Admin } from '../../service/login.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error: string | undefined;
  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit():void {
    this.loginService.postLogin(this.form.value)
    .subscribe((twofactor: boolean) => {
      console.log(twofactor);
      if (twofactor) {
        this.dialog.open(LoginDialogComponent);
      } else {
        this.router.navigate(['dashboard']);
      }
    }, (err) => this.error = err);
  }

}
