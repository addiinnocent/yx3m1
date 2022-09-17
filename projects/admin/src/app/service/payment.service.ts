import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Payment {
  _id: string,
  id: string,
  status: string,
  type: string,
  amount: number,
  customer: any,
  shoppingcart: any,
}


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  url = 'api/admin/payment.json';

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

  postCsv(data: string): Observable<Payment[]> {
    return this.http.post<Payment[]>(`${this.url}/csv`, {data})
    .pipe(
      catchError(this.handleError)
    );
  }

  getGraph(
    startDate: string,
    endDate: string,
  ): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.url}/graph`, {
      params: new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
    })
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

  getPayments(
    filter: string,
    pageIndex: number,
    pageSize: number,
    sortActive: string,
    sortDirection: string,
  ): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.url}`, {
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

  putPayment(payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.url}/${payment._id}`, payment)
    .pipe(
      catchError(this.handleError)
    );
  }

  deletePayment(payment: Payment) {
    return this.http.delete(`${this.url}/${payment._id}`)
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
