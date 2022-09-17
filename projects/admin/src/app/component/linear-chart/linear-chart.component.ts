import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-linear-chart',
  templateUrl: './linear-chart.component.html',
  styleUrls: ['./linear-chart.component.scss']
})
export class LinearChartComponent {
  @Input() dataSource: any | undefined;
  data: any | undefined;

  // options
  legend: boolean = false;
  showLabels: boolean = false;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  xAxisTicks: Date[] = [];
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  timeline: boolean = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.xAxisTicks = this.getDays(
      this.dataSource.dateRange.value.startDate,
      this.dataSource.dateRange.value.endDate,
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.connect()
    .subscribe((data: any) => {
      if (data.length > 0) {
        Object.assign(this, { data });
        this.changeDetectorRef.detectChanges();
      }
    })
  }

  getDays(start: Date, end: Date): Date[] {
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
      arr.push(new Date(dt));
    }
    return arr;
  }

  onDateChange(dateRangeStart: any, dateRangeEnd: any): void {
    if (dateRangeStart.value && dateRangeEnd.value) {
      this.xAxisTicks = this.getDays(
        dateRangeStart.value,
        dateRangeEnd.value,
      );
      this.dataSource.dateRange.next({
        startDate: dateRangeStart.value,
        endDate: dateRangeEnd.value,
      });
    }
  }

  formatDate(e: number): string {
    return formatDate(e, 'mediumDate', 'de-DE');
  }

}
