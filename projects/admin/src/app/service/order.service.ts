import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Order {
  _id: string,
  finished: boolean,
  paid: boolean,
  total: number,
  items: any[],
  additional: string,
  date: Date,
  customer: any
  shipping: any,
  coupon: any,
}


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = 'api/admin/order.json';

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

  postCsv(data: string): Observable<Order[]> {
    return this.http.post<Order[]>(`${this.url}/csv`, {data})
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

  getOrders(
    filter: string,
    pageIndex: number,
    pageSize: number,
    sortActive: string,
    sortDirection: string,
  ): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}`, {
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

  putOrder(sale: Order): Observable<Order> {
    return this.http.put<Order>(`${this.url}/${sale._id}`, sale)
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
