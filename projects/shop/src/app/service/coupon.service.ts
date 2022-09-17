import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Coupon {
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
  url = '/api/coupon.json';

  constructor(
    private http: HttpClient,
  ) { }

  postCoupon(coupon: Coupon): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.url}`, coupon)
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
      'Dein Coupon Code ist ungültig.');
  }


}
