import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { Mail, MailService } from '../../service/mail.service';
import { Customer, CustomerService } from '../../service/customer.service';

@Component({
  selector: 'app-mails-dialog',
  templateUrl: './mails-dialog.component.html',
  styleUrls: ['./mails-dialog.component.scss']
})
export class MailsDialogComponent {
  error: string | undefined;

  form: FormGroup = new FormGroup({
    _id: new FormControl({value: '', disabled: true}),
    title: new FormControl('', Validators.required),
    from: new FormControl({value: '', disabled: true}),
    to: new FormControl([]),
    text: new FormControl('', Validators.required),
  });

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Mail,
    private dialogRef: MatDialogRef<MailsDialogComponent>,
    private mailService: MailService,
    private customerService: CustomerService,
  ) {
  }

  ngOnInit(): void {
    this.form.patchValue(this.data);
  }

  addAll(): void {
    var receivers = this.form.value.to;
    this.customerService.getNewsletter()
    .subscribe((emails) => this.form.value.to = [...receivers, ...emails])
  }

  addTag(event: MatChipInputEvent): void {
    var value = (event.value || '').trim();
    var receivers = this.form.value.to;
    if (value) {
      receivers.push(value);
    }

    event.chipInput!.clear();
  }

  removeReceiver(receiver: string): void {
    const receivers = this.form.value.to;
    const index = receivers.indexOf(receiver);

    if (index >= 0) {
      receivers.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.form.valid && this.form.value.to.length > 0) {
      this.mailService.postMail(this.form.value)
      .subscribe((mail: Mail) => {
        this.dialogRef.close({
          value: mail,
          method: 'add'
        })
      }, (e) => {
        if (e) this.error = e;
      })
    } else {
      this.error = 'There is no one receiving your email';
    }
  }

}
