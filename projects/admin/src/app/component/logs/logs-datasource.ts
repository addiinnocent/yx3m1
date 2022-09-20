import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Log, LogService } from '../../service/log.service';

export class LogsDataSource extends DataSource<any> {
  selectFields = new BehaviorSubject<any>([]);
  private _data: any[] = [];
  private _dataStream = new BehaviorSubject<any>([]);

  constructor(
    private logService: LogService,
  ) {
    super();
  }

  connect(): Observable<any> {
    if (this.selectFields) {
      return merge(this.selectFields)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.logService.getLogs(
              this.selectFields.value.map((s: any) => s.name)
            ).subscribe((data: any) => {
              this._data = data;
              this._dataStream.next(this._data);
            });
            return this._dataStream;
          })
        )
    } else {
      throw Error('Please set a type');
    }
  }

  disconnect(): void {}

}
