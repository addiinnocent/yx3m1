import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent {
  @Input() dataSource!: any;
  data!: any;

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Payment Method';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

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

}
