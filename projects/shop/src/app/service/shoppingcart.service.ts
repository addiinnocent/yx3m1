import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface ShoppingcartItem {
  _id: string,
  item: any,
  quantity: number,
  options: any,
}

export interface Shoppingcart {
  total: number,
  items: ShoppingcartItem[],
  additional: string,
  date: Date,
  customer: any,
  payment: any,
  shipping: any,
  coupon: any,
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingcartService {
  url = '/api/shoppingcart.json';
  length = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
  ) { }

  getItemsLength(): Observable<number> {
    return this.http.get<number>(`${this.url}/length`)
    .pipe(
      catchError(this.handleError)
    );
  }

  getBill(id: string | null): Observable<Shoppingcart> {
    return this.http.get<Shoppingcart>(`${this.url}/${id}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  getShoppingcart(): Observable<Shoppingcart> {
    return this.http.get<Shoppingcart>(`${this.url}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  postItem(item: ShoppingcartItem): Observable<Shoppingcart> {
    return this.http.post<Shoppingcart>(`${this.url}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }

  putItem(item: ShoppingcartItem): Observable<ShoppingcartItem> {
    return this.http.put<ShoppingcartItem>(`${this.url}/${item._id}`, item)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteItem(item: ShoppingcartItem): Observable<Shoppingcart> {
    return this.http.delete<Shoppingcart>(`${this.url}/${item._id}`)
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
