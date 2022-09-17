import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Image {
  _id: string,
  name: string,
  src: string,
}

export interface Item {
  _id: string,
  name: string,
  category: any,
  images: Image[],
  description: string,
  optional: any,
  tags: string[],
  price: number,
  storage: number,
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  url = 'api/item.json';

  constructor(
    private http: HttpClient,
  ) { }

  getLength(filter: string, category: string): Observable<number> {
    return this.http.get<number>(`${this.url}/length/${category}`, {
      params: new HttpParams()
      .set('filter', filter)
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  getItems(
    category: string,
    filter: string,
    pageIndex: number,
    pageSize: number,
  ): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.url}/${category}`, {
      params: new HttpParams()
      .set('filter', filter)
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
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
      'Something bad happened; please try again later.');
  }

}
