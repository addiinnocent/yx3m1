import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Customer {
  _id: string,
  firstname: string,
	lastname: string,
	email: string,
	street: string,
	town: string,
	zip: string,
  country: string,
	newsletter: boolean,
	conditions: boolean,
	session: string,
	language: string,
	lastip: string,
	password: string,
	registered: boolean,
	validation: string
	validated: boolean,
	dateofbirth: Date,
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  url = 'api/admin/customer.json';

  constructor(
    private http: HttpClient,
  ) { }

  getGraph(
    startDate: string,
    endDate: string,
  ): Observable<any> {
    return this.http.get<any>(`${this.url}/graph`, {
      params: new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  getNewsletter(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/newsletter`)
    .pipe(
      catchError(this.handleError)
    );
  }

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

  postCsv(data: string): Observable<Customer[]> {
    return this.http.post<Customer[]>(`${this.url}/csv`, {data})
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

  getCustomers(
    filter: string,
    pageIndex: number,
    pageSize: number,
    sortActive: string,
    sortDirection: string,
  ): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.url}`, {
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

  postCustomer(item: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.url}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }

  putCustomer(item: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.url}/${item._id}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteCustomer(item: Customer) {
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
