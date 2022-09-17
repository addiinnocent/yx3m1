import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailsDialogComponent } from './mails-dialog.component';

describe('MailsDialogComponent', () => {
  let component: MailsDialogComponent;
  let fixture: ComponentFixture<MailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
