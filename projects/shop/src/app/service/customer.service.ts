import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Customer {
  firstname: string,
	lastname: string,
	email: string,
	street: string,
	town: string,
	zip: string,
  country: string,
	newsletter: boolean,
	conditions: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  url = 'api/customer.json';

  constructor(
    private http: HttpClient,
  ) { }

  getCustomer(): Observable<Customer> {
    return this.http.get<Customer>(`${this.url}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  putCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.url}`, customer)
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
