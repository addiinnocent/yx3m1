import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, lastValueFrom } from 'rxjs'

import { LogsDataSource } from './logs-datasource';
import { Log, LogService } from '../../service/log.service';
import { OrdersDialogComponent } from '../orders-dialog/orders-dialog.component';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  @Input() dataSource!: LogsDataSource;
  logs!: Observable<Log[]>;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private logService: LogService,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.logs = this.dataSource.connect();
  }

  openDialog(log: Log): void {
    if (log.type == 'order') {
      const dialogRef = this.dialog.open(OrdersDialogComponent, {
        data: log.data,
      })
      dialogRef.afterClosed()
      .subscribe((result) => {
        if (result.method == 'change') {
          this.dismissLog(log)
        }
      });
    }
  }

  dismissLog(log: Log): void {
    log.checked = true;
    this.logService.putLog(log)
    .subscribe((data: any) => {
      console.log(data);
    })
  }

}
