import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Coupon {
  _id: string,
  name: string,
	code: string,
	link: string,
	type: string,
	value: number,
	multiuse: boolean,
	uses: number,
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  url = 'api/admin/coupon.json';

  constructor(
    private http: HttpClient,
  ) { }

  getCsv(
    filter: string,
    pageIndex: number,
    pageSize: number,
    sortActive: string,
    sortDirection: string,
  ): Observable<string> {
    return this.http.get<string>(`${this.url}/csv`, {
      params: new HttpParams()
      .set('filter', filter)
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sortActive', sortActive)
      .set('sortDirection', sortDirection)
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  postCsv(data: string): Observable<Coupon[]> {
    return this.http.post<Coupon[]>(`${this.url}/csv`, {data})
    .pipe(
      catchError(this.handleError)
    );
  }

  getLength(filter: string): Observable<number> {
    return this.http.get<number>(`${this.url}/length`, {
      params: new HttpParams().set('filter', filter)
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  getCoupons(
    filter: string,
    pageIndex: number,
    pageSize: number,
    sortActive: string,
    sortDirection: string,
  ): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.url}`, {
      params: new HttpParams()
      .set('filter', filter)
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sortActive', sortActive)
      .set('sortDirection', sortDirection)
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  postCoupon(item: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.url}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }

  putCoupon(item: Coupon): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.url}/${item._id}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteCoupon(item: Coupon) {
    return this.http.delete(`${this.url}/${item._id}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteAll() {
    return this.http.delete(`${this.url}/all`)
    .pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

}
