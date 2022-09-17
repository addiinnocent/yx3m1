import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Log {
  _id: string,
  title: string,
  text: string,
  type: string,
  data: any,
  checked: boolean,
  createdAt: Date,
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  url = 'api/admin/log.json';

  constructor(
    private http: HttpClient,
  ) { }

  getLogs(
    filter: string[],
  ): Observable<Log[]> {
    return this.http.get<Log[]>(`${this.url}`, {
      params: new HttpParams()
      .set('filter', JSON.stringify(filter))
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  putLog(log: Log): Observable<Log> {
    return this.http.put<Log>(`${this.url}/${log._id}`, log)
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
