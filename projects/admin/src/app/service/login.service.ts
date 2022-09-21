import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Admin {
  _id: string,
  name: string,
  password: string,
  mfa: string,
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'api/admin/login.json';
  logout = 'api/admin/logout.json';

  constructor(
    private http: HttpClient,
  ) { }

  getLogout(): Observable<boolean> {
    return this.http.get<boolean>(`${this.logout}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  postLogin(admin: Admin): Observable<boolean> {
    return this.http.post<boolean>(`${this.url}`, admin)
    .pipe(
      catchError(this.handleError)
    );
  }

  postCode(code: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.url}/2fa`, {
      code: code
    })
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
      'Bad login credentials.');
  }
}
