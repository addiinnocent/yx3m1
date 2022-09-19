import { Component, AfterViewInit, Inject, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.range.valueChanges.subscribe((value)=> {
      if (value.start && value.end) {
        this.dataSource.dateRange.next({
          startDate: value.start,
          endDate: value.end,
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.data = this.dataSource.connect();
    this.data.subscribe((data: any) => {
      Object.assign(this, { data });
      this.changeDetectorRef.detectChanges();
    })
  }

  public formatNumber(e: number): string {
    return formatCurrency(e, 'de-DE', '€');
  }


}
