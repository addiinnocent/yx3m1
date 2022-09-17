import { Component, AfterViewInit, Inject, Input, ChangeDetectorRef } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { Observable } from 'rxjs';
import { AdvancedPieChartDataSource } from './advanced-pie-chart-datasource';

import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-advanced-pie-chart',
  templateUrl: './advanced-pie-chart.component.html',
  styleUrls: ['./advanced-pie-chart.component.scss']
})
export class AdvancedPieChartComponent implements AfterViewInit {
  @Input() dataSource!: AdvancedPieChartDataSource;

  data: any;
  gradient: boolean = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.data = this.dataSource.connect();
    this.data.subscribe((data: any) => {
      Object.assign(this, { data });
      this.changeDetectorRef.detectChanges();
    })
  }

  onDateChange(dateRangeStart: any, dateRangeEnd: any): void {
    if (dateRangeStart.value && dateRangeEnd.value) {
      this.dataSource.dateRange.next({
        startDate: dateRangeStart.value,
        endDate: dateRangeEnd.value,
      });
    }
  }

  public formatNumber(e: number): string {
    return formatCurrency(e, 'de-DE', '€');
  }


}
