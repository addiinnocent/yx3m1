import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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

}
