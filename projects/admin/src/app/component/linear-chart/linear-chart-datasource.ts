import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

export interface DateRange {
  startDate: Date,
  endDate: Date,
}

export class LinearChartDataSource extends DataSource<any> {
  dateRange = new BehaviorSubject<DateRange>({
    startDate: new Date(Date.now()-1209600000),
    endDate: new Date(Date.now()),
  });
  private _data: any[] = [];
  private _dataStream = new BehaviorSubject<any>([]);

  constructor(
    private dataService: any,
  ) {
    super();
  }

  connect(): Observable<any> {
    if (this.dateRange) {
      return merge(this.dateRange)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.dataService.getGraph(
              this.dateRange.value.startDate,
              this.dateRange.value.endDate,
            ).subscribe((data: any) => {
              this._data = data;
              this._dataStream.next(this._data);
            });
            return this._dataStream;
          })
        )
    } else {
      throw Error('Please set a date range');
    }
  }

  disconnect(): void {}

}
