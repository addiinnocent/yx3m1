import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Image {
  _id: string,
  title: string,
  src: string,
  date: Date,
}

export interface Item {
  _id: string,
  name: string,
	description: string,
	category: any
	images: any[],
	tags: string[],
	price: number,
	storage: number,
	options: any,
	shipping: any,
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  url = 'api/admin/item.json';

  constructor(
    private http: HttpClient,
  ) { }

  getGraph(
    categories: string[],
  ): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.url}/graph`, {
      params: new HttpParams()
      .set('categories', JSON.stringify(categories))
    })
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

  postCsv(data: string): Observable<Item[]> {
    return this.http.post<Item[]>(`${this.url}/csv`, {data})
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

  getItems(
    filter: string,
    pageIndex: number,
    pageSize: number,
    sortActive: string,
    sortDirection: string,
  ): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.url}`, {
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

  postItem(item: Item): Observable<Item> {
    return this.http.post<Item>(`${this.url}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }

  putItem(item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.url}/${item._id}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteItem(item: Item) {
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
