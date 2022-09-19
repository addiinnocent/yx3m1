import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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

  formatDate(e: number): string {
    return formatDate(e, 'mediumDate', 'de-DE');
  }

}
