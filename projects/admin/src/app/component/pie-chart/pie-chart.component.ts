import { Component, Inject, Input, ChangeDetectorRef, LOCALE_ID } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Observable } from 'rxjs';
import { PieChartDataSource } from './pie-chart-datasource';

import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { Category, CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {
  @Input() dataSource!: PieChartDataSource;

  data: any;
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  ngAfterViewInit(): void {
    this.data = this.dataSource.connect();
    this.data.subscribe((data: any) => {
      Object.assign(this, { data });
      this.changeDetectorRef.detectChanges();
    })

  }

}
