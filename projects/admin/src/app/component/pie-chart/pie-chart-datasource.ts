import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

export class PieChartDataSource extends DataSource<any> {
  selectFields = new BehaviorSubject<any>([]);
  private _data: any[] = [];
  private _dataStream = new BehaviorSubject<any>([]);

  constructor(
    private dataService: any,
  ) {
    super();
  }

  connect(): Observable<any> {
    if (this.selectFields) {
      return merge(this.selectFields)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.dataService.getGraph(
              this.selectFields.value.map((s: any) => s._id)
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
