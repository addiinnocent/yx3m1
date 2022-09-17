import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Category {
  _id: string,
  name: string,
  description: string,
  image: any,
  order: number,
  selected: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = 'api/admin/category.json';

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

  postCsv(data: string): Observable<Category[]> {
    return this.http.post<Category[]>(`${this.url}/csv`, {data})
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

  getCategories(
    filter: string,
    pageIndex: number,
    pageSize: number,
    sortActive: string,
    sortDirection: string,
  ): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.url}`, {
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

  postCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.url}`, category)
    .pipe(
      catchError(this.handleError)
    );
  }

  putCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.url}/${category._id}`, category)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(category: Category) {
    return this.http.delete(`${this.url}/${category._id}`)
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
