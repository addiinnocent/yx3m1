import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, lastValueFrom } from 'rxjs'

import { Log, LogService } from '../../service/log.service';
import { OrdersDialogComponent } from '../orders-dialog/orders-dialog.component';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  @Input() filter: any | undefined;
  logs: Observable<Log[]> | undefined;
  selected!: string[];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private logService: LogService,
  ) {

  }

  ngOnInit(): void {
    this.selected = this.filter.selectedOptions.selected;
    this.filter.selectionChange.subscribe(() => {
      this.logs = this.logService.getLogs(this.selected.map((o:any) => o.value))
    })
  }

  ngAfterViewInit(): void {
    this.logs = this.logService.getLogs(this.selected.map((o:any) => o.value))
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
    .subscribe(() => this.logs = this.logService.getLogs(this.selected.map((o:any) => o.value)))
  }

}
