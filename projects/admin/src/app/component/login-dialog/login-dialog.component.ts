import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  error: string | undefined;

  form: FormGroup = new FormGroup({
    1: new FormControl('', Validators.required),
    2: new FormControl('', Validators.required),
    3: new FormControl('', Validators.required),
    4: new FormControl('', Validators.required),
    5: new FormControl('', Validators.required),
    6: new FormControl('', Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public qr: any,
    private router: Router,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private loginService: LoginService,
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.form.valid) {
      let code = Object.values(this.form.value).join('');
      console.log(code);
      this.loginService.postCode(code)
      .subscribe(() => {
        this.dialogRef.close();
        this.router.navigate(['dashboard'])
      }, (e) => {
        if (e) this.error = e;
      })
    }
  }

}
