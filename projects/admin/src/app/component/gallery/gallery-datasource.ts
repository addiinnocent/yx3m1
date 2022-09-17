import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, BehaviorSubject, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Image, ImageService } from '../../service/image.service';

/**
 * Data source for the Images view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ImagesDataSource extends DataSource<Image> {
  length: number = 0;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter = new BehaviorSubject<string>('');
  private _data: Image[] = [];
  private _dataStream = new BehaviorSubject<Image[]>([]);

  constructor(
    private imageService: ImageService,
  ) {
    super();
  }

  connect(): Observable<Image[]> {
    if (this.paginator) {
      this.filter.subscribe(() => {
        (this.paginator!.pageIndex = 0)
        this.setLength();
      });

      return merge(this.filter, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.imageService.getImages(
              this.filter.getValue(),
              this.paginator!.pageIndex,
              this.paginator!.pageSize,
            ).subscribe((data) => {
              this._data = data;
              this._dataStream.next(this._data);
            });
            return this._dataStream;
          })
        )
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  disconnect(): void {}

  setLength(): void {
    this.imageService.getLength(this.filter.getValue())
    .subscribe(data => this.length = data);
  }

  addOne(image: Image): void {
    this._data.unshift(image);
    this._dataStream.next(this._data);
    this.setLength();
  }

  changeOne(image: Image): void {
    let element = this._data.find((e) => e?._id == image._id);
    Object.assign(element, image);
    this._dataStream.next(this._data);
  }

  removeOne(image: Image): void {
    this._data.splice(this._data.findIndex((e) => e._id == image._id), 1);
    this._dataStream.next(this._data);
    this.setLength();
  }

}
